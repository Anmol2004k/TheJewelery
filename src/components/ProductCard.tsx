import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { Heart, Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { formatPrice } from '../utils/format';
import { getCategoryFallback } from '../data';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  key?: React.Key;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const isWishlisted = isInWishlist(product.id);

  const [imgSrc, setImgSrc] = useState<string>(
    product.image || getCategoryFallback(product.category)
  );

  useEffect(() => {
    setImgSrc(product.image || getCategoryFallback(product.category));
  }, [product.image, product.category]);

  const handleImageError = () => {
    const fallback = getCategoryFallback(product.category);
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`Added ${product.name} to cart ✨`, {
      id: `cart-${product.id}`,
      duration: 2500,
    });
  };

  const handleCheckoutNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    navigate('/checkout');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative flex flex-col bg-white h-full rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 hover:border-gray-200 overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <Link to={`/product/${product.id}`} className="block w-full h-full overflow-hidden">
          <img
            src={imgSrc}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={handleImageError}
            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
          />
        </Link>
        
        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-3 right-3 p-2 bg-white/85 backdrop-blur-md rounded-full shadow-sm transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95 z-10"
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
          <div className="absolute top-3 left-3 bg-royal text-white text-[10px] sm:text-xs px-2.5 py-1 rounded-full uppercase tracking-wider font-medium z-10 shadow-sm">
            New
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow bg-white">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-medium">
            {product.category}
          </span>
          {product.rating && (
            <div className="flex items-center gap-1 text-gold text-[10px] sm:text-xs font-medium">
              <Star className="w-3 h-3 fill-current" />
              {product.rating}
            </div>
          )}
        </div>
        
        <Link to={`/product/${product.id}`} className="group-hover:text-gold transition-colors">
          <h3 className="font-playfair text-sm sm:text-base text-charcoal mb-1.5 font-medium line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-xs text-gray-500 font-light line-clamp-2 mb-3">
          {product.description}
        </p>

        {product.from && product.to && (
          <div className="mb-3 p-2 bg-cream/60 rounded-md border border-gold/20 text-[10px] sm:text-xs italic text-gray-600">
            <span className="font-medium">From:</span> {product.from} <br />
            <span className="font-medium">To:</span> {product.to}
          </div>
        )}

        {/* Purchase Actions Row */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-medium">Price</span>
              <p className="font-semibold text-charcoal text-base sm:text-lg tracking-tight">
                {formatPrice(product.price)}
              </p>
            </div>

            {/* "Add to Cart" Icon Button */}
            <button
              onClick={handleAddToCart}
              className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-gold/10 hover:border-gold text-charcoal hover:text-gold flex items-center justify-center transition-all duration-200 shadow-sm active:scale-90 shrink-0"
              title="Add to Cart"
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>

          {/* "Checkout Now" Button */}
          <button
            onClick={handleCheckoutNow}
            className="w-full py-2.5 px-3 bg-royal hover:bg-royal-dark text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] flex items-center justify-center gap-1.5 group/btn"
          >
            <span>Checkout Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
