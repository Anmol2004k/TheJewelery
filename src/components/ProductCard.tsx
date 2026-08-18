import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useWishlist } from '../contexts/WishlistContext';
import { Heart } from 'lucide-react';
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
      className="group relative flex flex-col bg-white"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-cream">
        <Link to={`/product/${product.id}`} className="block w-full h-full overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
          />
        </Link>
        
        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out translate-y-2 group-hover:translate-y-0 hover:bg-white hover:scale-110"
          aria-label="Add to wishlist"
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-colors",
              isWishlisted ? "fill-gold text-gold" : "text-charcoal hover:text-gold"
            )}
          />
        </button>

        {/* Badges */}
        {product.isNew && (
          <div className="absolute top-4 left-4 bg-royal text-white text-xs px-2 py-1 uppercase tracking-wider">
            New
          </div>
        )}
      </div>

      {/* Details */}
      <div className="py-6 px-2 flex flex-col items-center text-center">
        <span className="text-xs text-gray-500 uppercase tracking-widest mb-2">{product.category}</span>
        <Link to={`/product/${product.id}`} className="group-hover:text-gold transition-colors">
          <h3 className="font-playfair text-lg text-charcoal mb-2">{product.name}</h3>
        </Link>
        <p className="font-medium text-charcoal">
          {formatPrice(product.price)}
        </p>
      </div>
    </motion.div>
  );
}
