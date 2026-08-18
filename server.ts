import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Simple In-Memory Database for Orders Mock
interface Order {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: 'created' | 'paid' | 'failed';
  paymentId?: string;
  signature?: string;
}
const ordersDb = new Map<string, Order>();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'mock_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret',
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API ROUTES
  
  // 1. Create Order
  app.post('/api/razorpay/order', async (req, res) => {
    try {
      const { amount, receipt } = req.body;
      
      // In production, ALWAYS calculate the exact amount server-side based on the cart 
      // instead of trusting the client amount. For simplicity here, we trust the client.
      
      const options = {
        amount: amount * 100, // amount in the smallest currency unit (paise)
        currency: 'INR',
        receipt: receipt,
      };

      let order;
      // If we don't have real keys, mock it
      if (process.env.RAZORPAY_KEY_ID) {
        order = await razorpay.orders.create(options);
      } else {
        // Mock order for preview without real keys
        order = {
          id: `order_mock_${Date.now()}`,
          amount: options.amount,
          currency: 'INR',
          receipt,
          status: 'created'
        };
      }
      
      // Save order in DB
      ordersDb.set(order.id, {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: 'created'
      });

      res.json(order);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  });

  // 2. Verify Payment Signature
  app.post('/api/razorpay/verify', (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      const secret = process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret';

      // Creating HMAC object
      const hmac = crypto.createHmac('sha256', secret);

      // Passing the data to be hashed
      hmac.update(razorpay_order_id + '|' + razorpay_payment_id);

      // Generating the HMAC in hex format
      const generated_signature = hmac.digest('hex');

      if (generated_signature === razorpay_signature || !process.env.RAZORPAY_KEY_ID) {
        // Payment is successful
        const order = ordersDb.get(razorpay_order_id);
        if (order) {
          order.status = 'paid';
          order.paymentId = razorpay_payment_id;
          order.signature = razorpay_signature;
          ordersDb.set(razorpay_order_id, order);
        }

        res.json({ status: 'success', message: 'Payment verified successfully' });
      } else {
        // Payment failed
        res.status(400).json({ status: 'failure', message: 'Payment verification failed' });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ error: 'Failed to verify payment' });
    }
  });

  // 3. Webhook (Optional but recommended for robust status sync)
  app.post('/api/razorpay/webhook', (req, res) => {
    try {
      const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
      
      if (!secret) {
        console.warn('Webhook received but RAZORPAY_WEBHOOK_SECRET is not configured.');
        return res.status(200).send('OK');
      }

      const signature = req.headers['x-razorpay-signature'] as string;
      
      // Verify webhook signature
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (expectedSignature === signature) {
        const event = req.body.event;
        const payload = req.body.payload;

        if (event === 'payment.captured' || event === 'order.paid') {
          const payment = payload.payment.entity;
          const orderId = payment.order_id;
          
          const order = ordersDb.get(orderId);
          if (order) {
             order.status = 'paid';
             order.paymentId = payment.id;
             ordersDb.set(orderId, order);
          }
        }
      }
      
      res.status(200).send('OK');
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).send('Webhook Error');
    }
  });

  // Fetch Order details for confirmation page
  app.get('/api/orders/:id', (req, res) => {
    const order = ordersDb.get(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  });


  // VITE MIDDLEWARE SETUP
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
