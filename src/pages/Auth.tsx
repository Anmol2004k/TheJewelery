import React, { useState } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    navigate('/');
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
      </div>
    </div>
  );
}
