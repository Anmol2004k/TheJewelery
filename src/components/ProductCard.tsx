import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useWishlist } from '../contexts/WishlistContext';
import { Heart, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { formatPrice } from '../utils/format';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative flex flex-col bg-white h-full rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-transparent hover:border-gray-100"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 rounded-t-xl sm:rounded-t-2xl">
        <Link to={`/product/${product.id}`} className="block w-full h-full overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
          />
        </Link>
        
        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95 z-10"
          aria-label="Add to wishlist"
        >
          <Heart
            className={cn(
              "w-4 h-4 sm:w-5 sm:h-5 transition-colors",
              isWishlisted ? "fill-gold text-gold" : "text-charcoal hover:text-gold"
            )}
            strokeWidth={isWishlisted ? 2 : 1.5}
          />
        </button>

        {/* Badges */}
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-royal text-white text-[10px] sm:text-xs px-2 py-1 rounded-full uppercase tracking-wider font-medium z-10 shadow-sm">
            New
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow bg-white rounded-b-xl sm:rounded-b-2xl border border-t-0 border-gray-100">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest">{product.category}</span>
          {product.rating && (
            <div className="flex items-center gap-1 text-gold text-[10px] sm:text-xs font-medium">
              <Star className="w-3 h-3 fill-current" />
              {product.rating}
            </div>
          )}
        </div>
        
        <Link to={`/product/${product.id}`} className="group-hover:text-gold transition-colors">
          <h3 className="font-playfair text-sm sm:text-base text-charcoal mb-1.5 font-medium line-clamp-1">{product.name}</h3>
        </Link>
        
        <p className="text-xs text-gray-500 font-light line-clamp-2 mb-3">
          {product.description}
        </p>

        {product.from && product.to && (
          <div className="mb-3 p-2 bg-cream/50 rounded border border-gold/20 text-[10px] sm:text-xs italic text-gray-600">
            <span className="font-medium">From:</span> {product.from} <br />
            <span className="font-medium">To:</span> {product.to}
          </div>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between border-t border-gray-50">
          <p className="font-semibold text-charcoal text-sm sm:text-base">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
