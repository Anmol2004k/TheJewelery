import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, logOut } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { 
  Package, 
  Search, 
  Calendar, 
  MapPin, 
  Truck, 
  ChevronDown, 
  ChevronUp, 
  Home, 
  ShoppingBag, 
  User, 
  LogOut,
  Heart
} from 'lucide-react';
import { formatPrice } from '../utils/format';
import { motion, AnimatePresence } from 'motion/react';

export function OrderHistory() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Auto-fetch if logged in
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      fetchOrders(user.email || '', user.uid);
    }
  }, [user]);

  const fetchOrders = async (searchEmail: string, userId?: string) => {
    if (!searchEmail && !userId) return;
    setLoading(true);
    setHasSearched(true);
    
    try {
      const ordersRef = collection(db, 'orders');
      // If user is logged in, query by userId, else query by email
      const q = userId 
        ? query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'))
        : query(ordersRef, where('email', '==', searchEmail), orderBy('createdAt', 'desc'));
        
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(email);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-cream pt-28 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Account Header Navigation & Redirect Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 border border-gray-200 shadow-sm mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gold">My Account</div>
              <div className="text-sm font-medium text-charcoal truncate max-w-[220px] sm:max-w-xs">
                {user ? (user.displayName || user.email) : 'Guest Customer'}
              </div>
            </div>
          </div>

          {/* Home & Shop Redirect Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <Link 
              to="/" 
              id="account-redirect-home-btn"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 hover:border-gold hover:text-royal text-charcoal font-semibold text-xs uppercase tracking-wider transition-all duration-200 shadow-2xs"
            >
              <Home className="w-4 h-4 text-gold" />
              <span>Home Page</span>
            </Link>

            <Link 
              to="/shop" 
              id="account-redirect-shop-btn"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-royal hover:bg-royal-dark text-white font-semibold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop Page</span>
            </Link>

            {user && (
              <button
                onClick={() => logOut()}
                title="Sign Out"
                className="p-2.5 text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 rounded transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="font-playfair text-3xl md:text-4xl text-charcoal mb-3">Order History</h1>
          <p className="text-gray-500 font-light max-w-lg mx-auto text-sm">
            Track your order statuses, BlueDart courier updates, and review previous purchases.
          </p>
        </div>

        {!user && (
          <form onSubmit={handleSearch} className="flex gap-3 max-w-md mx-auto mb-12">
            <Input 
              type="email" 
              placeholder="Enter your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-grow"
            />
            <Button type="submit" disabled={loading} className="px-6 h-[46px] bg-royal hover:bg-royal-dark text-white uppercase tracking-widest text-xs shrink-0">
              {loading ? 'Searching...' : <Search className="w-4 h-4" />}
            </Button>
          </form>
        )}

        {hasSearched && !loading && orders.length === 0 && (
          <div className="text-center py-16 bg-white shadow-sm border border-gray-200 p-8">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-charcoal mb-2">No Orders Found</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              We couldn't find any orders placed under "{email}".
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-royal hover:bg-royal-dark text-white text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Shop</span>
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-2.5 border border-gray-300 hover:border-gold text-charcoal text-xs font-semibold uppercase tracking-wider transition-colors bg-white"
              >
                <Home className="w-4 h-4 text-gold" />
                <span>Go to Home</span>
              </Link>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={order.id} 
                className="bg-white shadow-sm border border-gray-100 overflow-hidden"
              >
                <div 
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Order ID</span>
                    <span className="font-mono text-sm text-charcoal">{order.order_id || order.id.slice(0, 8)}</span>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Date</span>
                    <span className="text-sm text-charcoal flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(order.createdAt?.seconds ? order.createdAt.toDate() : order.createdAt || order.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Total</span>
                    <span className="text-sm font-medium text-charcoal">
                      {formatPrice(order.amount)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 md:items-end">
                    <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Status</span>
                    <span className={`text-xs px-2.5 py-1 uppercase tracking-wider font-semibold border ${getStatusColor(order.status || 'paid')}`}>
                      {order.status || 'Processing'}
                    </span>
                  </div>
                  
                  <div className="hidden md:flex items-center text-gray-400">
                    {expandedOrder === order.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedOrder === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-100 bg-gray-50/50"
                    >
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-playfair text-lg text-charcoal mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-gold" /> 
                            Items Ordered
                          </h4>
                          <div className="space-y-4">
                            {order.items && Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-4">
                                <img src={item.product?.image} alt={item.product?.name} className="w-12 h-16 object-cover bg-gray-100" />
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-charcoal">{item.product?.name}</span>
                                  <span className="text-xs text-gray-500">Qty: {item.quantity} × {formatPrice(item.product?.price)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-playfair text-lg text-charcoal mb-3 flex items-center gap-2">
                              <MapPin className="w-5 h-5 text-gold" /> 
                              Shipping Address
                            </h4>
                            <address className="text-sm text-gray-600 not-italic leading-relaxed">
                              {order.first_name} {order.last_name}<br />
                              {order.address}<br />
                              {order.city}, {order.state} {order.pincode}<br />
                              {order.country}
                            </address>
                          </div>

                          <div>
                            <h4 className="font-playfair text-lg text-charcoal mb-3 flex items-center gap-2">
                              <Truck className="w-5 h-5 text-gold" /> 
                              Tracking Details
                            </h4>
                            <div className="bg-white p-4 border border-gray-200 shadow-sm text-sm">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-charcoal">Courier:</span>
                                <span className="text-gray-600">BlueDart Express</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-charcoal">Tracking ID:</span>
                                <span className="font-mono text-royal">TJS-{order.id.slice(0, 8).toUpperCase()}</span>
                              </div>
                              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                                {order.status === 'delivered' 
                                  ? 'Your package has been delivered.' 
                                  : 'Your package is currently being processed at our facility.'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        {/* Account Page Navigation Footer */}
        <div className="mt-16 bg-white p-8 border border-gray-200 text-center shadow-sm">
          <h3 className="font-playfair text-2xl text-charcoal mb-2">Continue Shopping</h3>
          <p className="text-gray-500 text-sm font-light max-w-md mx-auto mb-6">
            Looking for new jewelry pieces? Explore our exquisite 18k gold-plated artificial jewelry collection.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/shop"
              id="account-bottom-shop-btn"
              className="inline-flex items-center gap-2 px-6 py-3 bg-royal hover:bg-royal-dark text-white text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Shop</span>
            </Link>
            <Link
              to="/"
              id="account-bottom-home-btn"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 hover:border-gold hover:text-royal text-charcoal text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors bg-white shadow-2xs"
            >
              <Home className="w-4 h-4 text-gold" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
