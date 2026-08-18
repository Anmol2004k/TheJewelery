import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-royal-dark text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <div>
            <h3 className="font-playfair text-2xl font-bold tracking-wider mb-6 text-gold">
              THE JEWEL STUDIO
            </h3>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Crafting timeless elegance and modern luxury since 1995. Every piece tells a story of exceptional craftsmanship and unparalleled beauty.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/70 hover:text-gold transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-gold transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-gold transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair text-lg font-semibold tracking-wide mb-6">Explore</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/shop" className="text-white/70 hover:text-gold transition-colors text-sm">Shop All</Link>
              </li>
              <li>
                <Link to="/shop?category=Rings" className="text-white/70 hover:text-gold transition-colors text-sm">Rings</Link>
              </li>
              <li>
                <Link to="/shop?category=Necklaces" className="text-white/70 hover:text-gold transition-colors text-sm">Necklaces</Link>
              </li>
              <li>
                <Link to="/shop?category=Earrings" className="text-white/70 hover:text-gold transition-colors text-sm">Earrings</Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-playfair text-lg font-semibold tracking-wide mb-6">Customer Care</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/contact" className="text-white/70 hover:text-gold transition-colors text-sm">Contact Us</Link>
              </li>
              <li>
                <Link to="/shipping-returns" className="text-white/70 hover:text-gold transition-colors text-sm">Shipping & Returns</Link>
              </li>
              <li>
                <Link to="/jewellery-care" className="text-white/70 hover:text-gold transition-colors text-sm">Jewellery Care</Link>
              </li>
              <li>
                <Link to="/faq" className="text-white/70 hover:text-gold transition-colors text-sm">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-playfair text-lg font-semibold tracking-wide mb-6">Join Our World</h4>
            <p className="text-white/70 text-sm mb-4">
              Subscribe to receive updates on new arrivals, special offers, and exclusive events.
            </p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <div className="relative flex-grow">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-transparent border-b border-white/30 py-2 pl-8 pr-4 text-sm text-white placeholder-white/50 focus:outline-none focus:border-gold transition-colors"
                  required
                />
                <Mail className="w-4 h-4 absolute left-0 top-1/2 -translate-y-1/2 text-white/50" />
              </div>
              <button
                type="submit"
                className="ml-4 text-sm font-semibold text-gold hover:text-white transition-colors uppercase tracking-widest"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-xs">
            &copy; {new Date().getFullYear()} The Jewel Studio. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-white/50">
            <Link to="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
