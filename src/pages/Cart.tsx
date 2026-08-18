import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/Button';
import { Trash2, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { formatPrice } from '../utils/format';

export function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream pt-32 pb-24 flex flex-col items-center justify-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-6" />
        <h2 className="font-playfair text-3xl text-charcoal mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 font-light">Discover our fine jewellery collections to find your next treasure.</p>
        <Link to="/shop">
          <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="font-playfair text-4xl text-charcoal mb-12 text-center">Your Shopping Bag</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white p-6 shadow-sm">
              <div className="hidden sm:grid grid-cols-12 text-sm uppercase tracking-widest text-gray-400 font-semibold mb-6 border-b border-gray-100 pb-4">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              
              <div className="flex flex-col gap-6">
                {items.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={item.product.id}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center py-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="col-span-1 sm:col-span-6 flex items-center gap-4">
                      <Link to={`/product/${item.product.id}`} className="shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-20 h-24 object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </Link>
                      <div>
                        <Link to={`/product/${item.product.id}`}>
                          <h3 className="font-playfair text-lg text-charcoal hover:text-gold transition-colors mb-1">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                          {item.product.category}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-xs text-red-400 flex items-center gap-1 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-span-1 sm:col-span-2 text-charcoal font-medium text-left sm:text-center">
                      <span className="sm:hidden text-gray-400 text-sm mr-2">Price:</span>
                      {formatPrice(item.product.price)}
                    </div>
                    
                    <div className="col-span-1 sm:col-span-2 flex justify-start sm:justify-center">
                      <div className="flex items-center border border-gray-300">
                        <button
                          className="px-2 py-1 text-gray-500 hover:text-charcoal"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          className="px-2 py-1 text-gray-500 hover:text-charcoal"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-span-1 sm:col-span-2 text-right font-medium text-charcoal">
                      <span className="sm:hidden text-gray-400 text-sm mr-2">Total:</span>
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 sm:p-8 shadow-sm sticky top-24">
              <h3 className="font-playfair text-2xl text-charcoal mb-6 border-b border-gray-100 pb-4">Order Summary</h3>
              
              <div className="flex flex-col gap-4 mb-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Complimentary</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center border-t border-gray-100 pt-6 mb-8">
                <span className="font-playfair text-xl font-bold text-charcoal">Total</span>
                <span className="text-2xl font-medium text-charcoal">{formatPrice(totalPrice)}</span>
              </div>
              
              <Link to="/checkout" className="block w-full">
                <Button className="w-full bg-royal hover:bg-royal-dark text-white uppercase tracking-widest text-sm h-12">
                  Proceed to Checkout
                </Button>
              </Link>
              
              <div className="mt-6 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                <span>Secure Checkout</span>
                <span>•</span>
                <span>Free Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
