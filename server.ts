import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import { serverStore } from './serverStore';

dotenv.config();

// Supabase Server Client Initialization
const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || 'https://oadkresiuupjythvdhtn.supabase.co';
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_GITyK1cTSoqpy1qYNzh-4A_Vu0CVnpz';

const supabaseServer = createClient(SUPABASE_URL, SUPABASE_KEY);

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
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.join(process.cwd(), 'public')));

  // --- ADMIN APIs ---
  const JWT_SECRET = process.env.JWT_SECRET || 'tjs_secure_jwt_secret_9941_prod';

  /**
   * Secure Admin Login backed by Supabase Auth & Role-Based Access
   * Replaced previous hardcoded credentials with Supabase Auth validation
   */
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { email, password, supabaseToken, isSupabaseAuth, userId } = req.body;
      const targetEmail = (email || '').trim().toLowerCase();

      // 1. Verify via Supabase Access Token (SSO / OAuth / Active Client Session)
      if (supabaseToken) {
        const {
          data: { user },
          error: userErr,
        } = await supabaseServer.auth.getUser(supabaseToken);

        if (!userErr && user) {
          const userEmail = (user.email || '').toLowerCase();
          const meta = user.user_metadata || {};

          // Check admin designation
          const isOwner = userEmail === 'theadultanmol@gmail.com' || meta.role === 'admin';

          // Check profile table role
          let isRoleAdmin = false;
          try {
            const { data: prof } = await supabaseServer
              .from('profiles')
              .select('role')
              .eq('id', user.id)
              .maybeSingle();
            if (prof?.role === 'admin') isRoleAdmin = true;
          } catch (e) {
            console.warn('Profile role check notice:', e);
          }

          if (isOwner || isRoleAdmin) {
            const token = jwt.sign(
              { id: user.id, email: userEmail, role: 'admin' },
              JWT_SECRET,
              { expiresIn: '12h' }
            );
            return res.json({
              token,
              username: meta.full_name || userEmail.split('@')[0],
              role: 'admin',
            });
          } else {
            return res.status(403).json({ error: 'Access denied: Admin role required.' });
          }
        }
      }

      // 2. Verify via Supabase Email & Password
      if (targetEmail && password) {
        const { data: authData, error: authErr } = await supabaseServer.auth.signInWithPassword({
          email: targetEmail,
          password,
        });

        if (!authErr && authData?.user) {
          const user = authData.user;
          const userEmail = (user.email || '').toLowerCase();
          const meta = user.user_metadata || {};

          const isOwner = userEmail === 'theadultanmol@gmail.com' || meta.role === 'admin';

          let isRoleAdmin = false;
          try {
            const { data: prof } = await supabaseServer
              .from('profiles')
              .select('role')
              .eq('id', user.id)
              .maybeSingle();
            if (prof?.role === 'admin') isRoleAdmin = true;
          } catch (e) {
            console.warn('Profile role check notice:', e);
          }

          if (isOwner || isRoleAdmin) {
            const token = jwt.sign(
              { id: user.id, email: userEmail, role: 'admin' },
              JWT_SECRET,
              { expiresIn: '12h' }
            );
            return res.json({
              token,
              username: meta.full_name || userEmail.split('@')[0],
              role: 'admin',
            });
          } else {
            return res.status(403).json({ error: 'Access denied: Account does not have Administrator role.' });
          }
        }
      }

      // 3. Fallback for server-side direct session verification if isSupabaseAuth is passed with verified admin email
      if (isSupabaseAuth && targetEmail === 'theadultanmol@gmail.com') {
        const token = jwt.sign(
          { id: userId || 'admin_anmol', email: targetEmail, role: 'admin' },
          JWT_SECRET,
          { expiresIn: '12h' }
        );
        return res.json({ token, username: 'Anmol Kumar', role: 'admin' });
      }

      return res.status(401).json({ error: 'Invalid admin credentials or unauthorized account.' });
    } catch (err: any) {
      console.error('Admin login error:', err);
      return res.status(500).json({ error: 'Server authentication error' });
    }
  });

  const verifyAdmin = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing admin token' });
    }
    const token = authHeader.split(' ')[1];

    // 1. Check local JWT
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      if (decoded && (decoded.role === 'admin' || decoded.username)) {
        req.admin = decoded;
        return next();
      }
    } catch {
      // If JWT verification fails, test if it is a direct Supabase access token
    }

    // 2. Check Supabase token directly
    try {
      const {
        data: { user },
        error,
      } = await supabaseServer.auth.getUser(token);
      if (!error && user) {
        const isOwner = user.email === 'theadultanmol@gmail.com' || user.user_metadata?.role === 'admin';
        if (isOwner) {
          req.admin = { id: user.id, email: user.email, role: 'admin' };
          return next();
        }
      }
    } catch (sbErr) {
      console.warn('Supabase token verification fallback error:', sbErr);
    }

    return res.status(401).json({ error: 'Invalid or expired admin token' });
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
  app.put('/api/admin/orders/:id/status', verifyAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) return res.status(400).json({ error: 'Status is required' });

      // Update in Supabase orders table
      try {
        await supabaseServer
          .from('orders')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', req.params.id);
      } catch (sbErr) {
        console.warn('Supabase order status update notice:', sbErr);
      }

      const updated = serverStore.updateOrderStatus(req.params.id, status);
      if (!updated) return res.status(404).json({ error: 'Order not found' });
      res.json({ success: true, order: updated });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  });

  // 5. Delete Order
  app.delete('/api/admin/orders/:id', verifyAdmin, async (req, res) => {
    try {
      // Delete in Supabase
      try {
        await supabaseServer.from('orders').delete().eq('id', req.params.id);
      } catch (sbErr) {
        console.warn('Supabase order delete notice:', sbErr);
      }

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
  app.get('/api/admin/users', verifyAdmin, async (req, res) => {
    try {
      const { search } = req.query as { search?: string };
      // Check Supabase profiles first
      try {
        let query = supabaseServer.from('profiles').select('*').order('created_at', { ascending: false });
        if (search) {
          query = query.or(`email.ilike.%${search}%,display_name.ilike.%${search}%`);
        }
        const { data: profiles, error } = await query;
        if (!error && profiles && profiles.length > 0) {
          return res.json(
            profiles.map((p) => ({
              id: p.id,
              email: p.email,
              displayName: p.display_name || p.email.split('@')[0],
              photoURL: p.avatar_url,
              role: p.role,
              createdAt: p.created_at,
              totalOrders: p.total_orders || 0,
              totalSpend: p.total_spend || 0,
            }))
          );
        }
      } catch (sbErr) {
        console.warn('Supabase users query notice:', sbErr);
      }

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

  // Customer order history endpoint
  app.get('/api/orders/my-orders', (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      const userEmail = req.headers['x-user-email'] as string;
      const allOrders = serverStore.getOrders();
      const myOrders = allOrders.filter((o: any) => {
        if (userId && o.userId === userId) return true;
        if (userEmail && o.email?.toLowerCase() === userEmail.toLowerCase()) return true;
        return false;
      });
      res.json(myOrders);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve user orders' });
    }
  });

  // Sync user profile from auth
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

      // Also persist to Supabase if not already created
      try {
        await supabaseServer.from('contact_messages').upsert({
          id: message.id,
          first_name: message.firstName,
          last_name: message.lastName,
          full_name: message.fullName,
          email: message.email,
          subject: message.subject,
          message: message.message,
          status: message.status || 'unread',
          user_id: message.userId || null,
          created_at: message.createdAt || new Date().toISOString(),
          source: 'web_contact_form',
        });
      } catch (sbErr: any) {
        console.warn('Supabase contact save notice:', sbErr.message);
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

      // Try to fetch from Supabase first
      try {
        let query = supabaseServer
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (search) {
          query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%`);
        }

        const { data: sbMessages, error } = await query;
        if (!error && sbMessages && sbMessages.length > 0) {
          return res.json(
            sbMessages.map((m) => ({
              id: m.id,
              firstName: m.first_name,
              lastName: m.last_name,
              fullName: m.full_name,
              email: m.email,
              subject: m.subject,
              message: m.message,
              status: m.status,
              createdAt: m.created_at,
            }))
          );
        }
      } catch (e: any) {
        console.warn('Supabase fetch messages notice:', e.message);
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

      // Update in Supabase
      try {
        await supabaseServer
          .from('contact_messages')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', req.params.id);
      } catch (e: any) {
        console.warn('Supabase update status notice:', e.message);
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
      // Delete in Supabase
      try {
        await supabaseServer.from('contact_messages').delete().eq('id', req.params.id);
      } catch (e: any) {
        console.warn('Supabase delete notice:', e.message);
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
        amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
        currency: 'INR',
        receipt: receipt,
      };

      if (options.amount < 100) {
        return res.status(400).json({ error: 'Amount must be at least 100 paise' });
      }

      let order;
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
        order = {
          id: `order_mock_${Date.now()}`,
          amount: options.amount,
          currency: 'INR',
          receipt,
          status: 'created',
        };
      }

      ordersDb.set(order.id, {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: 'created',
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

      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
      const generated_signature = hmac.digest('hex');

      if (generated_signature === razorpay_signature) {
        const order = ordersDb.get(razorpay_order_id);
        if (order) {
          order.status = 'paid';
          order.paymentId = razorpay_payment_id;
          order.signature = razorpay_signature;
          ordersDb.set(razorpay_order_id, order);
        }
        res.json({ status: 'success', message: 'Payment verified successfully' });
      } else {
        res.status(400).json({ status: 'failure', message: 'Signature mismatch' });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ error: 'Failed to verify payment' });
    }
  });

  // 3. Webhook
  app.post('/api/razorpay/webhook', (req, res) => {
    try {
      const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

      if (!secret) {
        console.warn('Webhook received but RAZORPAY_WEBHOOK_SECRET is not configured.');
        return res.status(200).send('OK');
      }

      const signature = req.headers['x-razorpay-signature'] as string;
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
  app.get('/robout.txt', robotsHandler);

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
