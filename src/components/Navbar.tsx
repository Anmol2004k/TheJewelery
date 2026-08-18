import React from 'react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { ShoppingBag, Heart, Menu, Search, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

export function Navbar() {
  const { totalItems: cartItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = React.useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out',
          isScrolled ? 'bg-cream/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6',
          isHidden ? '-translate-y-full' : 'translate-y-0'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-charcoal hover:text-gold transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center justify-center lg:justify-start">
              <span className="font-playfair text-2xl md:text-3xl font-bold tracking-wider text-royal">
                THE JEWEL STUDIO
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-sm tracking-widest uppercase text-charcoal hover:text-gold transition-colors font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4 sm:gap-6">
              <button className="text-charcoal hover:text-gold transition-colors hidden sm:block">
                <Search className="w-5 h-5" />
              </button>
              <Link to="/auth" className="text-charcoal hover:text-gold transition-colors">
                <User className="w-5 h-5" />
              </Link>
              <Link to="/wishlist" className="relative text-charcoal hover:text-gold transition-colors">
                <Heart className="w-5 h-5" />
                {wishlistItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {wishlistItems}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="relative text-charcoal hover:text-gold transition-colors">
                <ShoppingBag className="w-5 h-5" />
                {cartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-royal text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {cartItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-charcoal/40 z-50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-3/4 max-w-sm bg-cream z-50 p-6 flex flex-col shadow-2xl lg:hidden"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="font-playfair text-xl font-bold tracking-wider text-royal">
                  MENU
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-charcoal hover:text-gold"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-playfair text-charcoal hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
