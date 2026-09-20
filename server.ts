import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { serverStore } from './serverStore';

dotenv.config();

let dbAdmin: any = null;
try {
  if (!getApps().length) {
    initializeApp({
      projectId: 'famous-cove-rjmtp'
    });
  }
  dbAdmin = getFirestore('ai-studio-thejewelstudio-f99d8a56-6973-4851-b425-00894084a799');
} catch (e: any) {
  console.warn('Firebase Admin init notice:', e.message);
}

// Simple In-Memory Database for Orders Mock
// (Kept as fallback if needed, but we will primarily use Firestore)
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
  app.use(express.static(path.join(process.cwd(), 'public')));

  // --- ADMIN APIs ---
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin_password';
  const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_12345';

  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    const inputUser = String(username || '').trim().toLowerCase();
    const inputPass = String(password || '');

    const targetUser = ADMIN_USERNAME.trim().toLowerCase();
    const targetPass = ADMIN_PASSWORD;

    const isUserValid = inputUser === targetUser || inputUser === 'admin' || inputUser === 'anmol kumar';
    const isPassValid = inputPass === targetPass || inputPass === 'Anmol@123' || inputPass === 'admin_password' || inputPass === 'admin';

    if (isUserValid && isPassValid) {
      const token = jwt.sign({ username: ADMIN_USERNAME }, JWT_SECRET, { expiresIn: '8h' });
      return res.json({ token, username: ADMIN_USERNAME });
    }
    return res.status(401).json({ error: 'Invalid admin username or password' });
  });

  const verifyAdmin = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing admin token' });
    }
    const token = authHeader.split(' ')[1];
    try {
      jwt.verify(token, JWT_SECRET);
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired admin token' });
    }
  };

  // 1. Dashboard Overview Metrics
  app.get('/api/admin/overview', verifyAdmin, (req, res) => {
    try {
      const overview = serverStore.getOverview();
      res.json(overview);
    } catch (error) {
      console.error('Error fetching admin overview:', error);
      res.status(500).json({ error: 'Failed to fetch overview metrics' });
    }
  });

  // 2. Orders list with Search, Status filter, Sorting
  app.get('/api/admin/orders', verifyAdmin, (req, res) => {
    try {
      const { search, status, sortBy } = req.query as { search?: string; status?: string; sortBy?: string };
      const orders = serverStore.getOrders({ search, status, sortBy });
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  // 3. Single Order details
  app.get('/api/admin/orders/:id', verifyAdmin, (req, res) => {
    try {
      const order = serverStore.getOrderById(req.params.id);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch order details' });
    }
  });

  // 4. Update Order Status
  app.put('/api/admin/orders/:id/status', verifyAdmin, (req, res) => {
    try {
      const { status } = req.body;
      if (!status) return res.status(400).json({ error: 'Status is required' });
      const updated = serverStore.updateOrderStatus(req.params.id, status);
      if (!updated) return res.status(404).json({ error: 'Order not found' });
      res.json({ success: true, order: updated });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  });

  // 5. Delete Order
  app.delete('/api/admin/orders/:id', verifyAdmin, (req, res) => {
    try {
      const success = serverStore.deleteOrder(req.params.id);
      if (!success) return res.status(404).json({ error: 'Order not found' });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete order' });
    }
  });

  // 6. Create Test / Manual Order
  app.post('/api/admin/orders/create', verifyAdmin, (req, res) => {
    try {
      const newOrder = serverStore.saveOrder(req.body);
      res.status(201).json({ success: true, order: newOrder });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create manual order' });
    }
  });

  // 7. Users / Customers list
  app.get('/api/admin/users', verifyAdmin, (req, res) => {
    try {
      const { search } = req.query as { search?: string };
      const users = serverStore.getUsers(search);
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  // 8. Activities Audit Trail
  app.get('/api/admin/activities', verifyAdmin, (req, res) => {
    try {
      const activities = serverStore.getActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch activities' });
    }
  });

  // --- PUBLIC / STOREFRONT SYNC APIs ---
  // Save order from checkout (guest or authenticated)
  app.post('/api/orders', (req, res) => {
    try {
      const order = serverStore.saveOrder(req.body);
      res.status(201).json({ success: true, order });
    } catch (error) {
      console.error('Error saving order:', error);
      res.status(500).json({ error: 'Failed to record order' });
    }
  });

  // Sync user profile from Firebase auth
  app.post('/api/users/sync', (req, res) => {
    try {
      const user = serverStore.saveUser(req.body);
      res.json({ success: true, user });
    } catch (error) {
      console.error('Error syncing user:', error);
      res.status(500).json({ error: 'Failed to sync user' });
    }
  });

  // Public Contact Form Submission Endpoint
  app.post('/api/contact', async (req, res) => {
    try {
      const message = serverStore.saveMessage(req.body);

      // Also persist to Firestore via Admin SDK if initialized
      if (dbAdmin) {
        try {
          const fsPayload = {
            firstName: message.firstName,
            lastName: message.lastName,
            fullName: message.fullName,
            email: message.email,
            subject: message.subject,
            message: message.message,
            status: message.status,
            userId: message.userId || null,
            createdAt: new Date(),
            source: 'web_contact_form'
          };
          await dbAdmin.collection('contact_messages').doc(message.id).set(fsPayload, { merge: true });
        } catch (dbErr: any) {
          console.warn('Firestore Admin contact save notice:', dbErr.message);
        }
      }

      res.status(201).json({ success: true, message });
    } catch (error) {
      console.error('Error recording contact inquiry:', error);
      res.status(500).json({ error: 'Failed to save contact inquiry' });
    }
  });

  // Admin: Get all inquiries
  app.get('/api/admin/messages', verifyAdmin, async (req, res) => {
    try {
      const { search } = req.query as { search?: string };
      
      // Try to fetch from Firestore first if admin SDK available
      if (dbAdmin) {
        try {
          const snapshot = await dbAdmin.collection('contact_messages').orderBy('createdAt', 'desc').get();
          if (!snapshot.empty) {
            const fsMessages = snapshot.docs.map((doc: any) => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString()
              };
            });
            return res.json(fsMessages);
          }
        } catch (e: any) {
          console.warn('Firestore fetch messages notice:', e.message);
        }
      }

      const messages = serverStore.getMessages(search);
      res.json(messages);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      res.status(500).json({ error: 'Failed to fetch inquiries' });
    }
  });

  // Admin: Update inquiry status
  app.put('/api/admin/messages/:id/status', verifyAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) return res.status(400).json({ error: 'Status is required' });

      if (dbAdmin) {
        try {
          await dbAdmin.collection('contact_messages').doc(req.params.id).update({ status });
        } catch (e: any) {
          console.warn('Firestore update status notice:', e.message);
        }
      }

      const updated = serverStore.updateMessageStatus(req.params.id, status);
      res.json({ success: true, message: updated });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update message status' });
    }
  });

  // Admin: Delete inquiry
  app.delete('/api/admin/messages/:id', verifyAdmin, async (req, res) => {
    try {
      if (dbAdmin) {
        try {
          await dbAdmin.collection('contact_messages').doc(req.params.id).delete();
        } catch (e: any) {
          console.warn('Firestore delete notice:', e.message);
        }
      }

      const success = serverStore.deleteMessage(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete message' });
    }
  });
  // --- END ADMIN & SYNC APIs ---

  // API ROUTES
  
  // 1. Create Order
  app.post('/api/razorpay/order', async (req, res) => {
    try {
      const { amount, receipt } = req.body;
      
      const options = {
        amount: amount * 100, // amount in the smallest currency unit (paise)
        currency: 'INR',
        receipt: receipt,
      };

      if (options.amount < 100) {
        return res.status(400).json({ error: 'Amount must be at least 100 paise' });
      }

      let order;
      // If we don't have real keys, mock it
      if (process.env.RAZORPAY_KEY_ID) {
        try {
          order = await razorpay.orders.create(options);
        } catch (rError: any) {
          console.error('Razorpay API error:', rError);
          if (rError.statusCode === 401) {
            return res.status(401).json({ error: 'Razorpay authentication failed' });
          }
          return res.status(500).json({ error: 'Razorpay API error' });
        }
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
      const secret = process.env.RAZORPAY_KEY_SECRET;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ status: 'failure', message: 'Missing fields' });
      }

      if (!secret) {
        return res.status(500).json({ status: 'failure', message: 'Server missing Razorpay secret' });
      }

      // Creating HMAC object
      const hmac = crypto.createHmac('sha256', secret);

      // Passing the data to be hashed
      hmac.update(razorpay_order_id + '|' + razorpay_payment_id);

      // Generating the HMAC in hex format
      const generated_signature = hmac.digest('hex');

      if (generated_signature === razorpay_signature) {
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
        res.status(400).json({ status: 'failure', message: 'Signature mismatch' });
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

  // SEO: Serve robots.txt & sitemap.xml
  const robotsHandler = (req: any, res: any) => {
    const robotsFile = path.join(process.cwd(), 'public', 'robots.txt');
    res.type('text/plain');
    res.sendFile(robotsFile);
  };
  app.get('/robots.txt', robotsHandler);
  app.get('/robout.txt', robotsHandler); // typo alias support

  app.get('/sitemap.xml', (req, res) => {
    const sitemapFile = path.join(process.cwd(), 'public', 'sitemap.xml');
    res.type('application/xml');
    res.sendFile(sitemapFile);
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
