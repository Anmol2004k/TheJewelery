import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Package,
  Users,
  LogOut,
  TrendingUp,
  Search,
  Download,
  Plus,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  X,
  Eye,
  Trash2,
  Copy,
  RefreshCw,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  Activity,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { formatPrice } from '../utils/format';
import toast from 'react-hot-toast';

interface OrderItem {
  product: {
    id: string;
    name: string;
    price: number;
    category?: string;
    image?: string;
  };
  quantity: number;
}

interface Order {
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
  items: OrderItem[];
  status: 'paid' | 'processing' | 'shipped' | 'delivered' | 'failed' | 'cancelled';
  createdAt: string;
  paymentId?: string;
  paymentMethod?: string;
}

interface UserAccount {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
  lastLoginAt?: string;
  totalOrders?: number;
  totalSpend?: number;
}

interface ActivityItem {
  id: string;
  action: string;
  details: string;
  type: 'order' | 'user' | 'status' | 'system';
  timestamp: string;
}

export interface ContactInquiry {
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

interface OverviewData {
  totalRevenue: number;
  totalOrders: number;
  paidOrdersCount: number;
  averageOrderValue: number;
  totalUsers: number;
  statusCounts: Record<string, number>;
  topProducts: { name: string; count: number; revenue: number }[];
  recentOrders: Order[];
  recentUsers: UserAccount[];
  activities: ActivityItem[];
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'users' | 'messages' | 'activities'>('overview');
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [messages, setMessages] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filter state for Orders
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSortBy, setOrderSortBy] = useState('date_desc');

  // Search state for Users
  const [userSearch, setUserSearch] = useState('');

  // Search & Filter state for Messages
  const [messageSearch, setMessageSearch] = useState('');
  const [messageStatusFilter, setMessageStatusFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactInquiry | null>(null);

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // New order form state
  const [newOrderForm, setNewOrderForm] = useState({
    firstName: 'Meera',
    lastName: 'Singhania',
    email: 'meera.s@regalgems.com',
    phone: '+91 98334 11223',
    address: 'Flat 18B, Ocean Towers, Worli Sea Face',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400018',
    amount: 249,
    productName: 'Gold-Plated Heart Charm Bracelet',
    category: 'Bracelets',
    status: 'paid' as Order['status']
  });

  const navigate = useNavigate();
  const adminName = localStorage.getItem('adminUsername') || 'Admin';

  const fetchDashboardData = async (silent = false) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    if (!silent) setLoading(true);
    setRefreshing(true);

    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [overviewRes, ordersRes, usersRes, actRes, msgRes] = await Promise.all([
        fetch('/api/admin/overview', { headers }),
        fetch('/api/admin/orders', { headers }),
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/activities', { headers }),
        fetch('/api/admin/messages', { headers })
      ]);

      if ([overviewRes, ordersRes, usersRes, actRes, msgRes].some(r => r.status === 401)) {
        localStorage.removeItem('adminToken');
        toast.error('Session expired. Please log in again.');
        navigate('/admin/login');
        return;
      }

      if (overviewRes.ok) setOverview(await overviewRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (actRes.ok) setActivities(await actRes.json());
      if (msgRes.ok) setMessages(await msgRes.json());
    } catch (err) {
      console.error('Error fetching admin portal data:', err);
      toast.error('Failed to load live admin data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    toast.success('Signed out successfully');
    navigate('/admin/login');
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        const { order: updated } = await res.json();
        toast.success(`Order #${updated.orderId} marked as ${newStatus.toUpperCase()}`);

        // Update in local lists
        setOrders(prev => prev.map(o => (o.id === orderId || o.orderId === orderId ? updated : o)));
        if (selectedOrder && (selectedOrder.id === orderId || selectedOrder.orderId === orderId)) {
          setSelectedOrder(updated);
        }
        fetchDashboardData(true);
      } else {
        toast.error('Failed to update order status');
      }
    } catch (err) {
      toast.error('Network error while updating status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteOrder = async (orderId: string, displayId: string) => {
    if (!window.confirm(`Are you sure you want to remove Order #${displayId}?`)) return;

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success(`Order #${displayId} removed`);
        setOrders(prev => prev.filter(o => o.id !== orderId && o.orderId !== orderId));
        if (selectedOrder && (selectedOrder.id === orderId || selectedOrder.orderId === orderId)) {
          setSelectedOrder(null);
        }
        fetchDashboardData(true);
      } else {
        toast.error('Failed to delete order');
      }
    } catch (err) {
      toast.error('Network error while deleting order');
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const orderPayload = {
        firstName: newOrderForm.firstName,
        lastName: newOrderForm.lastName,
        email: newOrderForm.email,
        phone: newOrderForm.phone,
        address: newOrderForm.address,
        city: newOrderForm.city,
        state: newOrderForm.state,
        pincode: newOrderForm.pincode,
        amount: Number(newOrderForm.amount),
        currency: 'INR',
        status: newOrderForm.status,
        paymentMethod: 'Razorpay (Simulated)',
        items: [
          {
            product: {
              id: 'item_sim',
              name: newOrderForm.productName,
              price: Number(newOrderForm.amount),
              category: newOrderForm.category,
              image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop'
            },
            quantity: 1
          }
        ]
      };

      const res = await fetch('/api/admin/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`New order #${data.order.orderId} created successfully!`);
        setShowCreateModal(false);
        fetchDashboardData(true);
      } else {
        toast.error('Failed to create order');
      }
    } catch (err) {
      toast.error('Network error creating order');
    }
  };

  const handleExportCSV = () => {
    if (!orders.length) {
      toast.error('No orders to export');
      return;
    }

    const headers = ['Order ID', 'Date', 'Customer Name', 'Email', 'Phone', 'City', 'Pincode', 'Amount (INR)', 'Status', 'Items'];
    const rows = orders.map(o => [
      o.orderId,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.firstName} ${o.lastName}"`,
      o.email,
      o.phone,
      o.city,
      o.pincode,
      o.amount,
      o.status,
      `"${(o.items || []).map(i => `${i.product?.name || 'Piece'} (x${i.quantity || 1})`).join('; ')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `the_jewel_studio_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Orders CSV report downloaded');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  // Filtered & Sorted orders
  const filteredOrders = useMemo(() => {
    let list = [...orders];

    if (orderStatusFilter !== 'all') {
      list = list.filter(o => o.status?.toLowerCase() === orderStatusFilter.toLowerCase());
    }

    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase().trim();
      list = list.filter(o => {
        const fullCustomer = `${o.firstName} ${o.lastName}`.toLowerCase();
        return (
          o.orderId?.toLowerCase().includes(q) ||
          fullCustomer.includes(q) ||
          o.email?.toLowerCase().includes(q) ||
          o.phone?.includes(q) ||
          o.city?.toLowerCase().includes(q) ||
          o.pincode?.includes(q)
        );
      });
    }

    if (orderSortBy === 'amount_desc') {
      list.sort((a, b) => (b.amount || 0) - (a.amount || 0));
    } else if (orderSortBy === 'amount_asc') {
      list.sort((a, b) => (a.amount || 0) - (b.amount || 0));
    } else if (orderSortBy === 'date_asc') {
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [orders, orderStatusFilter, orderSearch, orderSortBy]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    let list = [...users];
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase().trim();
      list = list.filter(u =>
        u.displayName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.id?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [users, userSearch]);

  // Filtered messages
  const filteredMessages = useMemo(() => {
    let list = [...messages];
    if (messageStatusFilter !== 'all') {
      list = list.filter(m => m.status === messageStatusFilter);
    }
    if (messageSearch.trim()) {
      const q = messageSearch.toLowerCase().trim();
      list = list.filter(m =>
        m.fullName?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.subject?.toLowerCase().includes(q) ||
        m.message?.toLowerCase().includes(q) ||
        m.id?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [messages, messageStatusFilter, messageSearch]);

  const unreadMessagesCount = useMemo(() => {
    return messages.filter(m => m.status === 'unread').length;
  }, [messages]);

  const handleMessageStatusUpdate = async (id: string, newStatus: 'unread' | 'read' | 'replied') => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast.success(`Inquiry marked as ${newStatus}`);
        setMessages(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
        if (selectedMessage?.id === id) {
          setSelectedMessage(prev => prev ? { ...prev, status: newStatus } : null);
        }
      } else {
        toast.error('Failed to update status');
      }
    } catch (err) {
      toast.error('Network error updating status');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('Delete this customer inquiry permanently from the database?')) return;
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Inquiry deleted successfully');
        setMessages(prev => prev.filter(m => m.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
      } else {
        toast.error('Failed to delete inquiry');
      }
    } catch (err) {
      toast.error('Network error deleting inquiry');
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Truck className="w-3.5 h-3.5" /> Shipped
          </span>
        );
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
            <CheckCircle className="w-3.5 h-3.5" /> Paid
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Processing
          </span>
        );
      case 'cancelled':
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" /> {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-light/40 flex flex-col items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-royal border-t-gold rounded-full animate-spin mb-4" />
        <p className="text-sm font-playfair font-medium text-charcoal">Loading Executive Admin Portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col pt-24 pb-16">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/80 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-royal text-gold flex items-center justify-center shadow-md">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-playfair font-bold text-charcoal">The Jewel Studio</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gold/15 text-charcoal border border-gold/40 uppercase tracking-wider">
                  Admin Portal
                </span>
              </div>
              <p className="text-xs text-charcoal-light mt-0.5">
                Signed in as <span className="font-semibold text-charcoal">{adminName}</span> · Production E-commerce Dashboard
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => fetchDashboardData(false)}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-charcoal transition-colors shadow-sm"
              title="Refresh all metrics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-royal' : 'text-gray-500'}`} />
              <span>Refresh Data</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-charcoal transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-royal" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-royal hover:bg-royal-dark text-white transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-gold" />
              <span>Add Test Order</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Metric Cards Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Total Revenue */}
          <div className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm relative overflow-hidden group hover:border-gold/50 transition-all">
            <div className="flex items-center justify-between text-charcoal-light mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Total Gross Revenue</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-playfair font-bold text-charcoal">
              {formatPrice(overview?.totalRevenue || 0)}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-charcoal-light">
              <span className="text-emerald-600 font-medium">From {overview?.paidOrdersCount || 0} paid orders</span>
              <span className="text-gray-400">INR</span>
            </div>
          </div>

          {/* Card 2: Total Orders */}
          <div className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm relative overflow-hidden group hover:border-royal/50 transition-all">
            <div className="flex items-center justify-between text-charcoal-light mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Total Orders</span>
              <div className="w-8 h-8 rounded-lg bg-royal/10 text-royal flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-playfair font-bold text-charcoal">
              {overview?.totalOrders || 0}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-charcoal-light">
              <span className="text-emerald-600 font-semibold">{overview?.statusCounts?.delivered || 0} Delivered</span>
              <span>·</span>
              <span className="text-blue-600 font-semibold">{overview?.statusCounts?.shipped || 0} Shipped</span>
            </div>
          </div>

          {/* Card 3: Total Accounts */}
          <div className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm relative overflow-hidden group hover:border-amber/50 transition-all">
            <div className="flex items-center justify-between text-charcoal-light mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Registered Accounts</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-playfair font-bold text-charcoal">
              {overview?.totalUsers || 0}
            </div>
            <div className="mt-2 text-xs text-charcoal-light">
              <span>Verified customer accounts</span>
            </div>
          </div>

          {/* Card 4: Average Order Value */}
          <div className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm relative overflow-hidden group hover:border-gold/50 transition-all">
            <div className="flex items-center justify-between text-charcoal-light mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Average Order Value</span>
              <div className="w-8 h-8 rounded-lg bg-gold/15 text-gold-dark flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-royal" />
              </div>
            </div>
            <div className="text-2xl font-playfair font-bold text-charcoal">
              {formatPrice(overview?.averageOrderValue || 0)}
            </div>
            <div className="mt-2 text-xs text-charcoal-light">
              <span>Luxury jewellery basket size</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl p-1.5 border border-gray-200/80 shadow-sm mb-8 flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-lg font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-royal text-white shadow-sm font-semibold'
                : 'text-charcoal hover:bg-gray-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Overview & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-lg font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-royal text-white shadow-sm font-semibold'
                : 'text-charcoal hover:bg-gray-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders Management ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-lg font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === 'users'
                ? 'bg-royal text-white shadow-sm font-semibold'
                : 'text-charcoal hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customer Accounts ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-lg font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 relative ${
              activeTab === 'messages'
                ? 'bg-royal text-white shadow-sm font-semibold'
                : 'text-charcoal hover:bg-gray-100'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Contact Inquiries ({messages.length})</span>
            {unreadMessagesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-gold text-charcoal shadow-xs">
                {unreadMessagesCount} new
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('activities')}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-lg font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === 'activities'
                ? 'bg-royal text-white shadow-sm font-semibold'
                : 'text-charcoal hover:bg-gray-100'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Activity Audit Trail</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Status Breakdown Bar */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm">
              <h2 className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-royal" />
                <span>Order Fulfillment Pipeline</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="text-xs text-emerald-800 font-medium">Delivered</div>
                  <div className="text-xl font-bold text-emerald-900 mt-1">{overview?.statusCounts?.delivered || 0}</div>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="text-xs text-blue-800 font-medium">Shipped / Transit</div>
                  <div className="text-xl font-bold text-blue-900 mt-1">{overview?.statusCounts?.shipped || 0}</div>
                </div>
                <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                  <div className="text-xs text-green-800 font-medium">Paid / Confirmed</div>
                  <div className="text-xl font-bold text-green-900 mt-1">{overview?.statusCounts?.paid || 0}</div>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="text-xs text-amber-800 font-medium">Processing</div>
                  <div className="text-xl font-bold text-amber-900 mt-1">{overview?.statusCounts?.processing || 0}</div>
                </div>
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 col-span-2 sm:col-span-1">
                  <div className="text-xs text-rose-800 font-medium">Cancelled / Failed</div>
                  <div className="text-xl font-bold text-rose-900 mt-1">{overview?.statusCounts?.cancelled || 0}</div>
                </div>
              </div>
            </div>

            {/* 2-Column Section: Recent Orders & Top Jewellery Pieces */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Orders (2 Columns) */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-base font-bold text-charcoal font-playfair">Recent Customer Orders</h2>
                    <p className="text-xs text-charcoal-light">Latest purchases placed across India</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-royal hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="divide-y divide-gray-100">
                  {(overview?.recentOrders || []).map(order => (
                    <div
                      key={order.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/80 -mx-3 px-3 rounded-lg transition-colors cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center font-mono text-xs font-bold text-royal">
                          #{order.orderId.split('-').pop()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-charcoal">
                            {order.firstName} {order.lastName}
                          </div>
                          <div className="text-xs text-charcoal-light flex items-center gap-2">
                            <span>{order.city}</span>
                            <span>·</span>
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-right">
                          <div className="text-sm font-bold text-charcoal">{formatPrice(order.amount)}</div>
                          <div className="text-[11px] text-gray-500">{(order.items || []).length} jewellery piece(s)</div>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  ))}
                  {(overview?.recentOrders || []).length === 0 && (
                    <p className="text-center py-8 text-xs text-gray-500">No recent orders yet.</p>
                  )}
                </div>
              </div>

              {/* Top Products Breakdown (1 Column) */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <h2 className="text-base font-bold text-charcoal font-playfair mb-1">Top Jewellery Creations</h2>
                  <p className="text-xs text-charcoal-light mb-5">Ranked by revenue contribution</p>

                  <div className="space-y-4">
                    {(overview?.topProducts || []).map((item, idx) => (
                      <div key={item.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-gold/20 text-charcoal font-bold flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="font-semibold text-charcoal">{item.name}</div>
                            <div className="text-gray-400">{item.count} unit(s) ordered</div>
                          </div>
                        </div>
                        <div className="font-bold text-charcoal">{formatPrice(item.revenue)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setActiveTab('users')}
                    className="w-full py-2 text-xs font-semibold text-royal bg-royal/5 hover:bg-royal/10 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>View Customer Directory ({users.length})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Customer, Email, City, Pincode..."
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-royal focus:border-royal bg-gray-50/50"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                {['all', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                      orderStatusFilter === st
                        ? 'bg-royal text-white font-semibold'
                        : 'bg-gray-100 text-charcoal hover:bg-gray-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                <select
                  value={orderSortBy}
                  onChange={e => setOrderSortBy(e.target.value)}
                  className="py-1.5 px-2.5 text-xs rounded-lg border border-gray-200 bg-white text-charcoal focus:outline-none focus:ring-1 focus:ring-royal"
                >
                  <option value="date_desc">Newest First</option>
                  <option value="date_asc">Oldest First</option>
                  <option value="amount_desc">Amount: High to Low</option>
                  <option value="amount_asc">Amount: Low to High</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/80">
                    <tr>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Order Details
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Jewellery Items
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Fulfillment Status
                      </th>
                      <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                        {/* Order ID & Date */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-charcoal bg-gray-100 px-2 py-1 rounded border border-gray-200">
                              {order.orderId}
                            </span>
                            <button
                              onClick={() => copyToClipboard(order.orderId, 'Order ID')}
                              className="text-gray-400 hover:text-royal"
                              title="Copy ID"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>

                        {/* Customer Info */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="text-xs font-semibold text-charcoal">
                            {order.firstName} {order.lastName}
                          </div>
                          <div className="text-[11px] text-gray-500">{order.email}</div>
                          <div className="text-[11px] text-gray-400">{order.city}, {order.state}</div>
                        </td>

                        {/* Items Snapshot */}
                        <td className="px-5 py-4">
                          <div className="text-xs text-charcoal font-medium">
                            {(order.items && order.items[0]?.product?.name) || 'Fine Jewellery Piece'}
                            {order.items && order.items.length > 1 && (
                              <span className="ml-1 px-1.5 py-0.5 rounded bg-gray-100 text-[10px] text-charcoal font-bold">
                                +{order.items.length - 1} more
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-400">
                            Qty: {(order.items || []).reduce((acc, i) => acc + (i.quantity || 1), 0)} items
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-charcoal font-playfair">
                            {formatPrice(order.amount)}
                          </div>
                          <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                            {order.paymentMethod || 'Razorpay'}
                          </div>
                        </td>

                        {/* Status with Quick Change Selector */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(order.status)}
                            <select
                              value={order.status}
                              onChange={e => handleStatusUpdate(order.id, e.target.value as Order['status'])}
                              disabled={isUpdatingStatus}
                              className="text-[11px] py-0.5 px-1.5 rounded border border-gray-200 bg-white text-gray-700 hover:border-royal focus:outline-none cursor-pointer"
                              title="Quickly change order status"
                            >
                              <option value="paid">Mark Paid</option>
                              <option value="processing">Mark Processing</option>
                              <option value="shipped">Mark Shipped</option>
                              <option value="delivered">Mark Delivered</option>
                              <option value="cancelled">Mark Cancelled</option>
                            </select>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 whitespace-nowrap text-right text-xs font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-1.5 rounded-lg border border-gray-200 hover:bg-royal hover:text-white text-charcoal transition-colors"
                              title="Inspect Full Order"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order.id, order.orderId)}
                              className="p-1.5 rounded-lg border border-gray-200 hover:bg-rose-50 text-rose-500 transition-colors"
                              title="Delete Order"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredOrders.length === 0 && (
                <div className="text-center py-16">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-charcoal">No orders match your criteria</p>
                  <p className="text-xs text-gray-500 mt-1">Try changing your search query or status filter.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMER ACCOUNTS */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* User Search & Stats Header */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search accounts by name, email, or UID..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-royal bg-gray-50/50"
                />
              </div>

              <div className="text-xs text-charcoal-light font-medium flex items-center gap-4">
                <span>Total Registered: <strong className="text-charcoal">{users.length}</strong></span>
                <span>·</span>
                <span>Active Patrons: <strong className="text-emerald-700">{users.filter(u => (u.totalOrders || 0) > 0).length}</strong></span>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/80">
                    <tr>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Customer Profile
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Email Address
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Joined Date
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Total Orders
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Lifetime Spend
                      </th>
                      <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50/70 transition-colors">
                        {/* Profile & Avatar */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {user.photoURL ? (
                              <img className="h-10 w-10 rounded-full object-cover border border-gray-200" src={user.photoURL} alt="" />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-royal text-sand flex items-center justify-center font-bold text-sm">
                                {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                              </div>
                            )}
                            <div>
                              <div className="text-xs font-bold text-charcoal">{user.displayName || 'Anonymous Guest'}</div>
                              <div className="text-[10px] text-gray-400 font-mono">UID: {user.id.slice(0, 12)}...</div>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-charcoal">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span>{user.email}</span>
                          </div>
                        </td>

                        {/* Joined Date */}
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>

                        {/* Orders count */}
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-charcoal">
                          {user.totalOrders || 0} order(s)
                        </td>

                        {/* Lifetime Spend */}
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-charcoal font-playfair">
                          {formatPrice(user.totalSpend || 0)}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-16">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-charcoal">No customer accounts match your search</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CONTACT INQUIRIES */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-base font-bold text-charcoal font-playfair">Contact Us Inquiries ({filteredMessages.length})</h2>
                  <p className="text-xs text-charcoal-light">Customer inquiries, bespoke commission requests, and concierge messages stored in database</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {(['all', 'unread', 'read', 'replied'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setMessageStatusFilter(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                        messageStatusFilter === tab
                          ? 'bg-royal text-white font-semibold shadow-xs'
                          : 'bg-gray-100 text-charcoal hover:bg-gray-200'
                      }`}
                    >
                      {tab} {tab === 'unread' && unreadMessagesCount > 0 ? `(${unreadMessagesCount})` : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search inquiries by customer name, email, subject, or message content..."
                  value={messageSearch}
                  onChange={e => setMessageSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-royal focus:bg-white"
                />
              </div>

              {/* Messages Table */}
              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/80">
                    <tr>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Customer & Email
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Subject & Inquiry
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Received At
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredMessages.map(msg => (
                      <tr 
                        key={msg.id} 
                        className={`hover:bg-gray-50/80 transition-colors ${msg.status === 'unread' ? 'bg-amber-50/30' : ''}`}
                      >
                        {/* Customer */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                              msg.status === 'unread' ? 'bg-royal text-gold' : 'bg-gray-100 text-charcoal'
                            }`}>
                              {msg.fullName?.charAt(0) || 'C'}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                                <span>{msg.fullName}</span>
                                {msg.status === 'unread' && (
                                  <span className="w-2 h-2 rounded-full bg-gold inline-block"></span>
                                )}
                              </div>
                              <div className="text-[11px] text-gray-500">{msg.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Subject */}
                        <td className="px-6 py-4 max-w-xs">
                          <div className="text-xs font-semibold text-charcoal truncate">{msg.subject}</div>
                          <div className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{msg.message}</div>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                          {new Date(msg.createdAt).toLocaleDateString()} at {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${
                            msg.status === 'unread'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : msg.status === 'replied'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                          }`}>
                            {msg.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedMessage(msg);
                                if (msg.status === 'unread') {
                                  handleMessageStatusUpdate(msg.id, 'read');
                                }
                              }}
                              className="px-2.5 py-1 text-xs font-medium rounded-md bg-royal/10 text-royal hover:bg-royal hover:text-white transition-colors"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="p-1 text-gray-400 hover:text-rose-600 rounded transition-colors"
                              title="Delete inquiry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredMessages.length === 0 && (
                <div className="text-center py-16">
                  <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-charcoal">No customer inquiries found</p>
                  <p className="text-xs text-gray-400 mt-1">Submissions through the Contact Us form will appear here automatically.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: ACTIVITIES */}
        {activeTab === 'activities' && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm">
            <h2 className="text-base font-bold text-charcoal font-playfair mb-1">Administrative Audit Trail</h2>
            <p className="text-xs text-charcoal-light mb-6">Real-time chronology of orders, payments, and account activity</p>

            <div className="relative pl-6 border-l-2 border-gray-100 space-y-6">
              {activities.map(act => (
                <div key={act.id} className="relative group">
                  <div className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-royal border-2 border-white shadow-sm" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-bold text-charcoal">{act.action}</span>
                    <span className="text-[11px] text-gray-400">
                      {new Date(act.timestamp).toLocaleDateString()} at {new Date(act.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-light mt-1">{act.details}</p>
                </div>
              ))}
              {activities.length === 0 && (
                <p className="text-xs text-gray-500 py-4">No audit logs recorded yet.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold font-playfair text-charcoal">Order #{selectedOrder.orderId}</h2>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <p className="text-xs text-charcoal-light mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()} at {new Date(selectedOrder.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-charcoal hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status Update Control */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-charcoal">Fulfillment Status</div>
                  <div className="text-[11px] text-gray-500">Update the current order status</div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedOrder.status}
                    onChange={e => handleStatusUpdate(selectedOrder.id, e.target.value as Order['status'])}
                    disabled={isUpdatingStatus}
                    className="py-1.5 px-3 text-xs rounded-lg border border-gray-300 bg-white font-medium focus:outline-none focus:ring-1 focus:ring-royal"
                  >
                    <option value="paid">Paid & Confirmed</option>
                    <option value="processing">In Crafting / Processing</option>
                    <option value="shipped">Handed to Courier / Shipped</option>
                    <option value="delivered">Delivered to Client</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Customer & Shipping Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                    <Users className="w-3.5 h-3.5 text-royal" />
                    <span>Customer Contact</span>
                  </div>
                  <div className="text-xs space-y-1 text-charcoal">
                    <div className="font-semibold">{selectedOrder.firstName} {selectedOrder.lastName}</div>
                    <div className="text-gray-600 flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-gray-400" /> {selectedOrder.email}
                    </div>
                    <div className="text-gray-600 flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-gray-400" /> {selectedOrder.phone || 'Not provided'}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                    <MapPin className="w-3.5 h-3.5 text-royal" />
                    <span>Shipping Destination</span>
                  </div>
                  <div className="text-xs text-charcoal space-y-0.5">
                    <div>{selectedOrder.address}</div>
                    <div>{selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}</div>
                    <div className="text-gray-500">{selectedOrder.country || 'India'}</div>
                  </div>
                </div>
              </div>

              {/* Ordered Items List */}
              <div>
                <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3">
                  Purchased Jewellery Items ({(selectedOrder.items || []).length})
                </h3>
                <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between gap-4 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        {item.product?.image ? (
                          <img
                            src={item.product.image}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                            <Sparkles className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-bold text-charcoal">{item.product?.name || 'Jewellery Creation'}</div>
                          <div className="text-[11px] text-gray-500">
                            Category: {item.product?.category || 'Fine Jewellery'} · Qty: {item.quantity || 1}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-charcoal font-playfair">
                          {formatPrice((item.product?.price || 0) * (item.quantity || 1))}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {formatPrice(item.product?.price || 0)} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial & Payment Summary */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                <div className="flex justify-between text-xs text-charcoal">
                  <span>Subtotal</span>
                  <span>{formatPrice(selectedOrder.amount)}</span>
                </div>
                <div className="flex justify-between text-xs text-charcoal">
                  <span>Insured Luxury Delivery</span>
                  <span className="text-emerald-700 font-medium">Complimentary</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-bold text-charcoal font-playfair">
                  <span>Total Amount Paid</span>
                  <span>{formatPrice(selectedOrder.amount)}</span>
                </div>
                <div className="text-[11px] text-gray-500 pt-1 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                  <span>Payment Method: {selectedOrder.paymentMethod || 'Razorpay Online Gateway'}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <button
                onClick={() => handleDeleteOrder(selectedOrder.id, selectedOrder.orderId)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove Order
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-charcoal text-white hover:bg-black transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD TEST ORDER */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div>
                <h2 className="text-base font-bold font-playfair text-charcoal">Create Test Order</h2>
                <p className="text-xs text-charcoal-light">Simulate incoming customer orders for testing</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={newOrderForm.firstName}
                    onChange={e => setNewOrderForm({ ...newOrderForm, firstName: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newOrderForm.lastName}
                    onChange={e => setNewOrderForm({ ...newOrderForm, lastName: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newOrderForm.email}
                    onChange={e => setNewOrderForm({ ...newOrderForm, email: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Phone</label>
                  <input
                    type="text"
                    value={newOrderForm.phone}
                    onChange={e => setNewOrderForm({ ...newOrderForm, phone: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={newOrderForm.address}
                  onChange={e => setNewOrderForm({ ...newOrderForm, address: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-200"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-charcoal mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newOrderForm.city}
                    onChange={e => setNewOrderForm({ ...newOrderForm, city: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-charcoal mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={newOrderForm.state}
                    onChange={e => setNewOrderForm({ ...newOrderForm, state: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-charcoal mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={newOrderForm.pincode}
                    onChange={e => setNewOrderForm({ ...newOrderForm, pincode: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Jewellery Piece</label>
                  <input
                    type="text"
                    required
                    value={newOrderForm.productName}
                    onChange={e => setNewOrderForm({ ...newOrderForm, productName: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-charcoal mb-1">Amount (INR)</label>
                  <input
                    type="number"
                    required
                    value={newOrderForm.amount}
                    onChange={e => setNewOrderForm({ ...newOrderForm, amount: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Initial Status</label>
                <select
                  value={newOrderForm.status}
                  onChange={e => setNewOrderForm({ ...newOrderForm, status: e.target.value as Order['status'] })}
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-white"
                >
                  <option value="paid">Paid</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-royal hover:bg-royal-dark text-white rounded-lg shadow-sm"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: INQUIRY DETAILS MODAL */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold font-playfair text-charcoal">Customer Inquiry</h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${
                    selectedMessage.status === 'unread'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : selectedMessage.status === 'replied'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}>
                    {selectedMessage.status}
                  </span>
                </div>
                <p className="text-xs text-charcoal-light mt-0.5">
                  ID: #{selectedMessage.id} · Logged {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-charcoal hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sender details */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-400 block text-[11px]">From Customer</span>
                  <span className="font-bold text-charcoal">{selectedMessage.fullName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Email Address</span>
                  <a href={`mailto:${selectedMessage.email}`} className="text-royal font-medium hover:underline flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{selectedMessage.email}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Subject and Content */}
            <div className="space-y-4 mb-6">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Subject</span>
                <p className="text-sm font-semibold text-charcoal bg-white border border-gray-200 rounded-lg p-3">
                  {selectedMessage.subject}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Inquiry Message</span>
                <div className="text-xs text-charcoal leading-relaxed bg-white border border-gray-200 rounded-lg p-4 whitespace-pre-wrap min-h-[100px]">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            {/* Actions & Status Changer */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">Change Status:</span>
                <select
                  value={selectedMessage.status}
                  onChange={(e) => handleMessageStatusUpdate(selectedMessage.id, e.target.value as any)}
                  className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white font-medium text-charcoal focus:ring-1 focus:ring-royal"
                >
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
              </div>

              <div className="flex items-center gap-2 justify-end">
                <a
                  href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(`Re: ${selectedMessage.subject}`)}`}
                  className="px-3.5 py-2 text-xs font-medium rounded-lg bg-royal hover:bg-royal-dark text-white transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-3.5 py-2 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-100 text-charcoal transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
