import React, { useState } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, ShoppingBag } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // If user is already logged in, redirect them
  React.useEffect(() => {
    if (user) {
      navigate('/orders');
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.error('Email login is currently disabled. Please use Google Sign-in.');
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Successfully signed in!');
      navigate('/orders');
    } catch (error) {
      toast.error('Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream pt-32 pb-24 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 md:p-12 shadow-sm">
        <div className="text-center mb-10">
          <h1 className="font-playfair text-3xl text-charcoal mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-500 text-sm font-light">
            {isLogin
              ? 'Sign in to access your orders and wishlist.'
              : 'Join us to enjoy a personalized shopping experience.'}
          </p>
        </div>

        <Button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full h-12 bg-white border border-gray-300 hover:bg-gray-50 text-charcoal uppercase tracking-widest text-sm mb-6 flex items-center justify-center gap-3"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          {loading ? 'Connecting...' : 'Continue with Google'}
        </Button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 gap-4"
              >
                <Input label="First Name" required placeholder="Jane" />
                <Input label="Last Name" required placeholder="Doe" />
              </motion.div>
            )}
          </AnimatePresence>
          <Input label="Email Address" type="email" required placeholder="example@email.com" />
          
          <div className="space-y-2">
            <Input label="Password" type="password" required placeholder="••••••••" />
            {isLogin && (
              <div className="flex justify-end">
                <a href="#" className="text-xs text-gray-500 hover:text-gold transition-colors">
                  Forgot your password?
                </a>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-royal hover:bg-royal-dark text-white uppercase tracking-widest text-sm mt-4"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-gray-500 mr-2">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-gold uppercase tracking-widest font-semibold hover:text-royal transition-colors"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>

        {/* Home & Shop Redirect Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-3">
          <Link
            to="/"
            id="auth-home-btn"
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded border border-gray-200 hover:border-gold hover:text-royal text-charcoal text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-gold" />
            <span>Home</span>
          </Link>
          <Link
            to="/shop"
            id="auth-shop-btn"
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded bg-royal hover:bg-royal-dark text-white text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Shop</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
