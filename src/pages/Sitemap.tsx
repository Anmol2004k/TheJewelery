import React from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data';
import { Compass, FileText, ShoppingBag, Info, Shield, ExternalLink } from 'lucide-react';

export function Sitemap() {
  const categories = ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Watches', 'Gifts'];

  return (
    <div className="bg-[#FDFBF7] min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold block mb-3">
            Site Navigation Directory
          </span>
          <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mb-4">
            Website Sitemap
          </h1>
          <p className="text-gray-500 font-light text-sm sm:text-base leading-relaxed">
            Quickly discover and explore all pages, product categories, studio policies, and curated jewelry collections available at The Jewel Studio.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-charcoal/70">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-gold hover:text-gold transition-colors shadow-xs"
            >
              <span>View XML Sitemap</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-gold hover:text-gold transition-colors shadow-xs"
            >
              <span>View Robots.txt</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Main Pages */}
          <div className="bg-white p-8 rounded-xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                <Compass className="w-5 h-5" />
              </div>
              <h2 className="font-playfair text-xl font-bold text-charcoal">Main Pages</h2>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link to="/" className="hover:text-gold transition-colors flex items-center justify-between">
                  <span>Home</span>
                  <span className="text-xs text-gray-400 font-mono">/</span>
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-gold transition-colors flex items-center justify-between">
                  <span>Shop All Collections</span>
                  <span className="text-xs text-gray-400 font-mono">/shop</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold transition-colors flex items-center justify-between">
                  <span>About The Jewel Studio</span>
                  <span className="text-xs text-gray-400 font-mono">/about</span>
                </Link>
              </li>
              <li>
                <Link to="/our-craft" className="hover:text-gold transition-colors flex items-center justify-between">
                  <span>Our Artisanal Craft</span>
                  <span className="text-xs text-gray-400 font-mono">/our-craft</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold transition-colors flex items-center justify-between">
                  <span>Contact & Studio Location</span>
                  <span className="text-xs text-gray-400 font-mono">/contact</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="bg-white p-8 rounded-xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-royal/10 flex items-center justify-center text-royal">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h2 className="font-playfair text-xl font-bold text-charcoal">Jewelry Categories</h2>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/shop?category=${encodeURIComponent(cat)}`}
                    className="hover:text-gold transition-colors flex items-center justify-between"
                  >
                    <span>{cat}</span>
                    <span className="text-xs text-gray-400 font-mono">/shop?category={cat}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div className="bg-white p-8 rounded-xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="font-playfair text-xl font-bold text-charcoal">Customer Care</h2>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link to="/faq" className="hover:text-gold transition-colors flex items-center justify-between">
                  <span>Frequently Asked Questions</span>
                  <span className="text-xs text-gray-400 font-mono">/faq</span>
                </Link>
              </li>
              <li>
                <Link to="/shipping-returns" className="hover:text-gold transition-colors flex items-center justify-between">
                  <span>Shipping & Returns</span>
                  <span className="text-xs text-gray-400 font-mono">/shipping-returns</span>
                </Link>
              </li>
              <li>
                <Link to="/jewellery-care" className="hover:text-gold transition-colors flex items-center justify-between">
                  <span>Jewellery Care Guide</span>
                  <span className="text-xs text-gray-400 font-mono">/jewellery-care</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-gold transition-colors flex items-center justify-between">
                  <span>Privacy Policy</span>
                  <span className="text-xs text-gray-400 font-mono">/privacy</span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-gold transition-colors flex items-center justify-between">
                  <span>Terms of Service</span>
                  <span className="text-xs text-gray-400 font-mono">/terms</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Catalog of Products */}
        <div className="bg-white p-8 sm:p-10 rounded-xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-playfair text-xl font-bold text-charcoal">Full Product Index</h2>
                <p className="text-xs text-gray-500">All handcrafted and premium fashion jewelry pieces</p>
              </div>
            </div>
            <span className="text-xs font-mono bg-cream px-3 py-1.5 rounded-md text-charcoal/80 border border-gray-200">
              {PRODUCTS.length} Total Pieces
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {PRODUCTS.map((prod) => (
              <Link
                key={prod.id}
                to={`/product/${prod.id}`}
                className="p-3 rounded-lg border border-gray-100 hover:border-gold/50 hover:bg-gold/5 transition-all text-xs group flex flex-col justify-between"
              >
                <div className="font-medium text-charcoal group-hover:text-royal line-clamp-1 mb-1">
                  {prod.name}
                </div>
                <div className="flex items-center justify-between text-gray-500">
                  <span className="text-[11px] font-mono text-gray-400">{prod.category}</span>
                  <span className="font-semibold text-charcoal">₹{prod.price.toLocaleString('en-IN')}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
