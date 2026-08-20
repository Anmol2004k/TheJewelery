import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { ShoppingBag, Heart, Menu, Search, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Navbar() {
  const { totalItems: cartItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Left for future scroll logic if needed
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Our Craft', path: '/our-craft' },
    { name: 'Collections', path: '/shop?category=featured' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm transition-all duration-300">
        {/* Announcement Bar */}
        <div className="bg-royal text-white text-[10px] sm:text-xs font-medium py-2 px-4 flex justify-center sm:justify-between items-center tracking-wider uppercase">
          <span className="hidden sm:inline-block">Free Insured Shipping & Returns</span>
          <span className="text-gold">Complimentary gift wrapping on all orders ✨</span>
          <span className="hidden md:inline-block">24/7 Concierge Service</span>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Mobile menu button & "WOMEN" text */}
            <div className="flex items-center gap-2 flex-1">
              <button
                className="p-1 text-charcoal hover:text-gold transition-colors"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.5} />
              </button>
            </div>

            {/* Center: Logo */}
            <Link to="/" className="flex-1 flex justify-center">
              <span className="font-playfair text-2xl sm:text-3xl font-bold tracking-wider text-[#002366]">
                THE JEWEL STUDIO
              </span>
            </Link>

            {/* Right: Icons */}
            <div className="flex items-center justify-end gap-3 sm:gap-5 flex-1">
              <button className="text-charcoal hover:text-gold transition-colors hidden sm:block">
                <Search className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
              </button>
              <Link to="/wishlist" className="hidden sm:flex relative text-charcoal hover:text-gold transition-colors">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
                {wishlistItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-royal text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {wishlistItems}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="relative text-charcoal hover:text-gold transition-colors">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
                {cartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-royal text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {cartItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white z-[70] p-6 flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                <span className="font-playfair text-xl font-bold tracking-wider text-charcoal">
                  MENU
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-charcoal bg-gray-50 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-6 overflow-y-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-charcoal hover:text-gold transition-colors flex items-center justify-between group"
                  >
                    {link.name}
                    <span className="text-gray-300 group-hover:text-gold transition-colors">→</span>
                  </Link>
                ))}
              </nav>
              
              <div className="mt-auto pt-8 border-t border-gray-100 flex flex-col gap-4">
                <Link 
                  to="/wishlist" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-charcoal font-medium"
                >
                  <Heart className="w-5 h-5" /> Wishlist ({wishlistItems})
                </Link>
                <Link 
                  to="/auth" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-charcoal font-medium"
                >
                  <User className="w-5 h-5" /> My Account
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
