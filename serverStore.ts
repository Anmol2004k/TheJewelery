import fs from 'fs';
import path from 'path';

export interface AdminOrderItem {
  product: {
    id: string;
    name: string;
    price: number;
    category?: string;
    image?: string;
  };
  quantity: number;
}

export interface AdminOrder {
  id: string;
  orderId: string;
  userId?: string;
  amount: number;
  currency: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  items: AdminOrderItem[];
  status: 'paid' | 'processing' | 'shipped' | 'delivered' | 'failed' | 'cancelled';
  createdAt: string;
  paymentId?: string;
  paymentMethod?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
  lastLoginAt?: string;
  totalOrders?: number;
  totalSpend?: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  type: 'order' | 'user' | 'status' | 'system';
  timestamp: string;
}

export interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  userId?: string;
  createdAt: string;
  source?: string;
}

interface StoreData {
  orders: AdminOrder[];
  users: AdminUser[];
  activities: ActivityLog[];
  messages?: ContactMessage[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'admin_store.json');

const INITIAL_SEEDS: StoreData = {
  users: [
    {
      id: 'usr_anmol',
      email: 'theadultanmol@gmail.com',
      displayName: 'Anmol Kumar (Admin)',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
      createdAt: '2026-09-10T09:15:00.000Z',
      lastLoginAt: '2026-09-18T08:00:00.000Z',
      totalOrders: 2,
      totalSpend: 620500
    },
    {
      id: 'usr_priya',
      email: 'priya.sharma@luxurygems.in',
      displayName: 'Priya Sharma',
      photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop',
      createdAt: '2026-09-12T14:30:00.000Z',
      lastLoginAt: '2026-09-17T18:22:00.000Z',
      totalOrders: 1,
      totalSpend: 382500
    },
    {
      id: 'usr_vikram',
      email: 'vikram.mehta@heritage.com',
      displayName: 'Vikram Mehta',
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
      createdAt: '2026-09-14T11:45:00.000Z',
      lastLoginAt: '2026-09-18T07:15:00.000Z',
      totalOrders: 1,
      totalSpend: 578000
    },
    {
      id: 'usr_aarav',
      email: 'aarav.singh@gmail.com',
      displayName: 'Aarav Singh',
      photoURL: '',
      createdAt: '2026-09-15T16:10:00.000Z',
      lastLoginAt: '2026-09-16T12:00:00.000Z',
      totalOrders: 1,
      totalSpend: 272000
    }
  ],
  orders: [
    {
      id: 'ord_tjs_1001',
      orderId: 'TJS-ORD-9841',
      userId: 'usr_priya',
      amount: 382500,
      currency: 'INR',
      email: 'priya.sharma@luxurygems.in',
      phone: '+91 98201 44521',
      firstName: 'Priya',
      lastName: 'Sharma',
      address: 'Penthouse 4B, Signature Crest, Altamount Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400026',
      country: 'India',
      status: 'delivered',
      createdAt: '2026-09-13T10:14:00.000Z',
      paymentId: 'pay_rzp_live_98124',
      paymentMethod: 'Razorpay (UPI / Card)',
      items: [
        {
          product: {
            id: '1',
            name: 'The Imperial Sapphire Ring',
            price: 382500,
            category: 'Rings',
            image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop'
          },
          quantity: 1
        }
      ]
    },
    {
      id: 'ord_tjs_1002',
      orderId: 'TJS-ORD-9842',
      userId: 'usr_vikram',
      amount: 578000,
      currency: 'INR',
      email: 'vikram.mehta@heritage.com',
      phone: '+91 98110 33912',
      firstName: 'Vikram',
      lastName: 'Mehta',
      address: 'B-14 Golf Links Boulevard',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110003',
      country: 'India',
      status: 'shipped',
      createdAt: '2026-09-15T15:20:00.000Z',
      paymentId: 'pay_rzp_live_98452',
      paymentMethod: 'Razorpay (NetBanking)',
      items: [
        {
          product: {
            id: '4',
            name: 'Lumina Tennis Bracelet',
            price: 578000,
            category: 'Bracelets',
            image: 'https://images.unsplash.com/photo-1611591475819-79b8b730ab09?q=80&w=600&auto=format&fit=crop'
          },
          quantity: 1
        }
      ]
    },
    {
      id: 'ord_tjs_1003',
      orderId: 'TJS-ORD-9843',
      userId: 'usr_anmol',
      amount: 348500,
      currency: 'INR',
      email: 'theadultanmol@gmail.com',
      phone: '+91 99887 76655',
      firstName: 'Anmol',
      lastName: 'Kumar',
      address: '42 Orchid Villa, Jubilee Hills Road 36',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
      country: 'India',
      status: 'paid',
      createdAt: '2026-09-16T18:45:00.000Z',
      paymentId: 'pay_rzp_live_98991',
      paymentMethod: 'Razorpay (Credit Card)',
      items: [
        {
          product: {
            id: '2',
            name: 'Aura Diamond Pendant',
            price: 238000,
            category: 'Necklaces',
            image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop'
          },
          quantity: 1
        },
        {
          product: {
            id: '7',
            name: 'Midnight Onyx Studs',
            price: 102000,
            category: 'Earrings',
            image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop'
          },
          quantity: 1
        }
      ]
    },
    {
      id: 'ord_tjs_1004',
      orderId: 'TJS-ORD-9844',
      userId: 'usr_aarav',
      amount: 272000,
      currency: 'INR',
      email: 'aarav.singh@gmail.com',
      phone: '+91 97123 45678',
      firstName: 'Aarav',
      lastName: 'Singh',
      address: 'Flat 1202, Palm Meadows, Whitefield',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560066',
      country: 'India',
      status: 'processing',
      createdAt: '2026-09-17T09:30:00.000Z',
      paymentId: 'pay_rzp_live_99214',
      paymentMethod: 'Razorpay (UPI)',
      items: [
        {
          product: {
            id: '3',
            name: 'Celestial Drop Earrings',
            price: 272000,
            category: 'Earrings',
            image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop'
          },
          quantity: 1
        }
      ]
    },
    {
      id: 'ord_tjs_1005',
      orderId: 'TJS-ORD-9845',
      userId: 'usr_anmol',
      amount: 272000,
      currency: 'INR',
      email: 'theadultanmol@gmail.com',
      phone: '+91 99887 76655',
      firstName: 'Anmol',
      lastName: 'Kumar',
      address: '42 Orchid Villa, Jubilee Hills Road 36',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
      country: 'India',
      status: 'paid',
      createdAt: '2026-09-18T05:22:00.000Z',
      paymentId: 'pay_rzp_live_99611',
      paymentMethod: 'Razorpay (Card)',
      items: [
        {
          product: {
            id: '3',
            name: 'Celestial Drop Earrings',
            price: 272000,
            category: 'Earrings',
            image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop'
          },
          quantity: 1
        }
      ]
    }
  ],
  activities: [
    {
      id: 'act_1',
      action: 'Order Delivered',
      details: 'Order #TJS-ORD-9841 marked as delivered to Priya Sharma (Mumbai).',
      type: 'order',
      timestamp: '2026-09-17T16:45:00.000Z'
    },
    {
      id: 'act_2',
      action: 'Order Dispatched',
      details: 'Order #TJS-ORD-9842 handed over to luxury courier for Vikram Mehta (New Delhi).',
      type: 'order',
      timestamp: '2026-09-17T11:20:00.000Z'
    },
    {
      id: 'act_3',
      action: 'Payment Verified',
      details: '₹2,72,000 received for Order #TJS-ORD-9845 via Razorpay.',
      type: 'order',
      timestamp: '2026-09-18T05:22:30.000Z'
    },
    {
      id: 'act_4',
      action: 'Customer Logged In',
      details: 'Administrator Anmol Kumar authenticated into management system.',
      type: 'user',
      timestamp: '2026-09-18T08:00:00.000Z'
    }
  ],
  messages: [
    {
      id: 'msg_seed_1',
      firstName: 'Ananya',
      lastName: 'Roy',
      fullName: 'Ananya Roy',
      email: 'ananya.roy@example.com',
      subject: 'Custom Bridal Choker Set Inquiry',
      message: 'Hello, I loved your Royal Kundan Heritage Choker Set. Is it possible to customize the bead accents to emerald green for my upcoming reception in December?',
      status: 'unread',
      createdAt: '2026-09-18T10:30:00.000Z',
      source: 'web_contact_form'
    },
    {
      id: 'msg_seed_2',
      firstName: 'Kavita',
      lastName: 'Kapoor',
      fullName: 'Kavita Kapoor',
      email: 'kavita.k@gmail.com',
      subject: 'Express Shipping to Mumbai',
      message: 'Hi team, I would like to place an order for the Celestial Drop Earrings. Can you guarantee delivery within 48 hours to Worli, Mumbai?',
      status: 'replied',
      createdAt: '2026-09-17T14:15:00.000Z',
      source: 'web_contact_form'
    }
  ]
};

function ensureStoreFile(): StoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(STORE_PATH)) {
      fs.writeFileSync(STORE_PATH, JSON.stringify(INITIAL_SEEDS, null, 2), 'utf-8');
      return INITIAL_SEEDS;
    }
    const content = fs.readFileSync(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed.orders) || !Array.isArray(parsed.users)) {
      fs.writeFileSync(STORE_PATH, JSON.stringify(INITIAL_SEEDS, null, 2), 'utf-8');
      return INITIAL_SEEDS;
    }
    return parsed;
  } catch (err) {
    console.error('Error reading store file, using fallback seeds:', err);
    return INITIAL_SEEDS;
  }
}

function writeStoreFile(data: StoreData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing store file:', err);
  }
}

export const serverStore = {
  getOverview() {
    const data = ensureStoreFile();
    const orders = data.orders || [];
    const users = data.users || [];

    const totalOrders = orders.length;
    const paidOrders = orders.filter(o => ['paid', 'processing', 'shipped', 'delivered'].includes(o.status.toLowerCase()));
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
    const averageOrderValue = paidOrders.length ? Math.round(totalRevenue / paidOrders.length) : 0;
    const totalUsers = users.length;

    const statusCounts: Record<string, number> = {
      delivered: 0,
      shipped: 0,
      paid: 0,
      processing: 0,
      failed: 0,
      cancelled: 0
    };

    orders.forEach(o => {
      const st = o.status?.toLowerCase() || 'paid';
      statusCounts[st] = (statusCounts[st] || 0) + 1;
    });

    // Calculate product frequency
    const productFrequency: Record<string, { name: string; count: number; revenue: number }> = {};
    orders.forEach(o => {
      if (Array.isArray(o.items)) {
        o.items.forEach(item => {
          const pName = item.product?.name || 'Jewellery Piece';
          if (!productFrequency[pName]) {
            productFrequency[pName] = { name: pName, count: 0, revenue: 0 };
          }
          productFrequency[pName].count += (item.quantity || 1);
          productFrequency[pName].revenue += ((item.product?.price || 0) * (item.quantity || 1));
        });
      }
    });

    const topProducts = Object.values(productFrequency)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);

    const recentUsers = [...users]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);

    return {
      totalRevenue,
      totalOrders,
      paidOrdersCount: paidOrders.length,
      averageOrderValue,
      totalUsers,
      statusCounts,
      topProducts,
      recentOrders,
      recentUsers,
      activities: (data.activities || []).slice(0, 10)
    };
  },

  getOrders(filters?: { search?: string; status?: string; sortBy?: string }) {
    const data = ensureStoreFile();
    let orders = [...(data.orders || [])];

    if (filters?.status && filters.status !== 'all') {
      const targetStatus = filters.status.toLowerCase();
      orders = orders.filter(o => o.status?.toLowerCase() === targetStatus);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      orders = orders.filter(o => {
        const fullCustomer = `${o.firstName} ${o.lastName}`.toLowerCase();
        return (
          o.orderId?.toLowerCase().includes(q) ||
          o.id?.toLowerCase().includes(q) ||
          fullCustomer.includes(q) ||
          o.email?.toLowerCase().includes(q) ||
          o.phone?.includes(q) ||
          o.city?.toLowerCase().includes(q) ||
          o.pincode?.includes(q)
        );
      });
    }

    if (filters?.sortBy === 'amount_desc') {
      orders.sort((a, b) => (b.amount || 0) - (a.amount || 0));
    } else if (filters?.sortBy === 'amount_asc') {
      orders.sort((a, b) => (a.amount || 0) - (b.amount || 0));
    } else if (filters?.sortBy === 'date_asc') {
      orders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      // default: date_desc
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return orders;
  },

  getOrderById(id: string) {
    const data = ensureStoreFile();
    return data.orders.find(o => o.id === id || o.orderId === id);
  },

  saveOrder(orderPayload: Partial<AdminOrder>) {
    const data = ensureStoreFile();
    const id = orderPayload.id || orderPayload.orderId || `ord_${Date.now()}`;
    const orderId = orderPayload.orderId || `TJS-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: AdminOrder = {
      id,
      orderId,
      userId: orderPayload.userId || 'guest',
      amount: Number(orderPayload.amount) || 0,
      currency: orderPayload.currency || 'INR',
      email: orderPayload.email || '',
      phone: orderPayload.phone || '',
      firstName: orderPayload.firstName || 'Customer',
      lastName: orderPayload.lastName || '',
      address: orderPayload.address || '',
      city: orderPayload.city || '',
      state: orderPayload.state || '',
      pincode: orderPayload.pincode || '',
      country: orderPayload.country || 'India',
      items: Array.isArray(orderPayload.items) ? orderPayload.items : [],
      status: (orderPayload.status as any) || 'paid',
      createdAt: orderPayload.createdAt || new Date().toISOString(),
      paymentId: orderPayload.paymentId || `pay_${Date.now()}`,
      paymentMethod: orderPayload.paymentMethod || 'Razorpay'
    };

    const existingIndex = data.orders.findIndex(o => o.id === id || o.orderId === orderId);
    if (existingIndex >= 0) {
      data.orders[existingIndex] = { ...data.orders[existingIndex], ...newOrder };
    } else {
      data.orders.unshift(newOrder);
    }

    // Add activity
    data.activities.unshift({
      id: `act_${Date.now()}`,
      action: 'New Order Received',
      details: `Order #${newOrder.orderId} for ₹${newOrder.amount.toLocaleString()} placed by ${newOrder.firstName} ${newOrder.lastName} (${newOrder.city}).`,
      type: 'order',
      timestamp: new Date().toISOString()
    });

    writeStoreFile(data);
    return newOrder;
  },

  updateOrderStatus(orderId: string, status: AdminOrder['status']) {
    const data = ensureStoreFile();
    const order = data.orders.find(o => o.id === orderId || o.orderId === orderId);
    if (!order) return null;

    const prevStatus = order.status;
    order.status = status;

    data.activities.unshift({
      id: `act_${Date.now()}`,
      action: 'Order Status Updated',
      details: `Order #${order.orderId} status changed from "${prevStatus.toUpperCase()}" to "${status.toUpperCase()}".`,
      type: 'status',
      timestamp: new Date().toISOString()
    });

    writeStoreFile(data);
    return order;
  },

  deleteOrder(orderId: string) {
    const data = ensureStoreFile();
    const index = data.orders.findIndex(o => o.id === orderId || o.orderId === orderId);
    if (index >= 0) {
      const removed = data.orders.splice(index, 1)[0];
      data.activities.unshift({
        id: `act_${Date.now()}`,
        action: 'Order Removed',
        details: `Order #${removed.orderId} was removed by administrator.`,
        type: 'system',
        timestamp: new Date().toISOString()
      });
      writeStoreFile(data);
      return true;
    }
    return false;
  },

  getUsers(search?: string) {
    const data = ensureStoreFile();
    let users = [...(data.users || [])];

    // Compute live user stats from current orders
    users.forEach(u => {
      const userOrders = data.orders.filter(o => o.userId === u.id || o.email?.toLowerCase() === u.email?.toLowerCase());
      u.totalOrders = userOrders.length;
      u.totalSpend = userOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
    });

    if (search) {
      const q = search.toLowerCase().trim();
      users = users.filter(u => 
        u.displayName?.toLowerCase().includes(q) || 
        u.email?.toLowerCase().includes(q) ||
        u.id?.toLowerCase().includes(q)
      );
    }

    users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return users;
  },

  saveUser(userPayload: Partial<AdminUser>) {
    const data = ensureStoreFile();
    if (!userPayload.email && !userPayload.id) return null;

    const existingIndex = data.users.findIndex(
      u => (userPayload.id && u.id === userPayload.id) || (userPayload.email && u.email.toLowerCase() === userPayload.email.toLowerCase())
    );

    if (existingIndex >= 0) {
      data.users[existingIndex] = {
        ...data.users[existingIndex],
        ...userPayload,
        lastLoginAt: new Date().toISOString()
      };
      writeStoreFile(data);
      return data.users[existingIndex];
    } else {
      const newUser: AdminUser = {
        id: userPayload.id || `usr_${Date.now()}`,
        email: userPayload.email || '',
        displayName: userPayload.displayName || 'Customer',
        photoURL: userPayload.photoURL || '',
        createdAt: userPayload.createdAt || new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        totalOrders: 0,
        totalSpend: 0
      };
      data.users.unshift(newUser);

      data.activities.unshift({
        id: `act_${Date.now()}`,
        action: 'New Customer Registered',
        details: `${newUser.displayName} (${newUser.email}) registered an account.`,
        type: 'user',
        timestamp: new Date().toISOString()
      });

      writeStoreFile(data);
      return newUser;
    }
  },

  getActivities() {
    const data = ensureStoreFile();
    return (data.activities || []).slice(0, 50);
  },

  getMessages(search?: string) {
    const data = ensureStoreFile();
    let messages = (data.messages || []).slice();
    if (search) {
      const q = search.toLowerCase().trim();
      messages = messages.filter(m => 
        m.fullName?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.subject?.toLowerCase().includes(q) ||
        m.message?.toLowerCase().includes(q)
      );
    }
    return messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  saveMessage(payload: Partial<ContactMessage>) {
    const data = ensureStoreFile();
    if (!data.messages) data.messages = [];
    
    const newMsg: ContactMessage = {
      id: payload.id || `msg_${Date.now()}`,
      firstName: payload.firstName || '',
      lastName: payload.lastName || '',
      fullName: payload.fullName || `${payload.firstName || ''} ${payload.lastName || ''}`.trim() || 'Valued Customer',
      email: payload.email || '',
      subject: payload.subject || 'General Inquiry',
      message: payload.message || '',
      status: (payload.status as any) || 'unread',
      userId: payload.userId || undefined,
      createdAt: payload.createdAt || new Date().toISOString(),
      source: payload.source || 'web_contact_form'
    };

    data.messages.unshift(newMsg);

    data.activities.unshift({
      id: `act_${Date.now()}`,
      action: 'New Contact Inquiry Received',
      details: `Message from ${newMsg.fullName} (${newMsg.email}): "${newMsg.subject}"`,
      type: 'system',
      timestamp: new Date().toISOString()
    });

    writeStoreFile(data);
    return newMsg;
  },

  updateMessageStatus(id: string, status: 'unread' | 'read' | 'replied') {
    const data = ensureStoreFile();
    if (!data.messages) return null;
    const idx = data.messages.findIndex(m => m.id === id);
    if (idx < 0) return null;
    data.messages[idx].status = status;
    writeStoreFile(data);
    return data.messages[idx];
  },

  deleteMessage(id: string) {
    const data = ensureStoreFile();
    if (!data.messages) return false;
    const initialLen = data.messages.length;
    data.messages = data.messages.filter(m => m.id !== id);
    if (data.messages.length !== initialLen) {
      writeStoreFile(data);
      return true;
    }
    return false;
  }
};
