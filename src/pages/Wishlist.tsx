import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/Button';
import { Heart } from 'lucide-react';

export function Wishlist() {
  const { items } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream pt-32 pb-24 flex flex-col items-center justify-center">
        <Heart className="w-16 h-16 text-gray-300 mb-6" />
        <h2 className="font-playfair text-3xl text-charcoal mb-4">Your Wishlist is Empty</h2>
        <p className="text-gray-500 mb-8 font-light">Save your favorite pieces here while you decide.</p>
        <Link to="/shop">
          <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white">
            Discover Collection
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-playfair text-4xl md:text-5xl text-charcoal mb-4">Your Wishlist</h1>
          <p className="text-gray-500 max-w-xl mx-auto font-light">
            A curated selection of your favorite pieces.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
