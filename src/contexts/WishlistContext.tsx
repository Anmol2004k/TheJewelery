import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Product } from '../types';
import toast from 'react-hot-toast';

interface WishlistContextType {
  items: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  const toggleWishlist = (product: Product) => {
    setItems((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        toast.success(`Removed ${product.name} from wishlist`, { icon: '🤍' });
        return prev.filter((p) => p.id !== product.id);
      }
      toast.success(`Added ${product.name} to wishlist`, { icon: '❤️' });
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return items.some((p) => p.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{ items, toggleWishlist, isInWishlist, totalItems: items.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
