import React, { useState, useEffect } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const navigate = useNavigate();
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();

  // If user is already logged in, redirect them to account/orders
  useEffect(() => {
    if (user) {
      navigate('/orders');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
        toast.success('Welcome back! Signed in successfully.');
        navigate('/orders');
      } else {
        await signUpWithEmail(email, password, { firstName, lastName });
        toast.success('Account created successfully! Welcome to The Jewel Studio.');
        navigate('/orders');
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      const msg = err.message || 'Authentication failed. Please check your credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle('/orders');
      // Supabase OAuth initiates browser redirection
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast.error(error?.message || 'Failed to initialize Google Sign-in');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream pt-32 pb-24 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 md:p-12 shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 text-gold-dark text-[11px] font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" />
            <span>Secure Supabase Auth</span>
          </div>
          <h1 className="font-playfair text-3xl text-charcoal mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-500 text-sm font-light">
            {isLogin
              ? 'Sign in to access your order history, delivery tracking, and saved pieces.'
              : 'Join us to enjoy a personalized luxury shopping experience.'}
          </p>
        </div>

        {/* Google OAuth Button */}
        <Button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full h-12 bg-white border border-gray-300 hover:bg-gray-50 text-charcoal uppercase tracking-widest text-xs font-semibold mb-6 flex items-center justify-center gap-3 transition-colors shadow-2xs cursor-pointer"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-label="Google logo">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{loading ? 'Connecting...' : 'Continue with Google'}</span>
        </Button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className="px-3 bg-white text-gray-400 font-medium">Or continue with email</span>
          </div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 gap-3"
              >
                <Input
                  label="First Name"
                  required
                  placeholder="Jane"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Input
            label="Email Address"
            type="email"
            required
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="space-y-2">
            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-royal hover:bg-royal-dark text-white uppercase tracking-widest text-xs font-semibold mt-4 shadow-sm cursor-pointer"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </span>
            ) : isLogin ? (
              'Sign In with Supabase'
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-gray-500 mr-2">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </span>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-gold uppercase tracking-widest font-semibold hover:text-royal transition-colors text-xs"
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
