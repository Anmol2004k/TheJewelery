import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../data';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { Button } from '../components/ui/Button';
import { Heart, Truck, Shield, ArrowLeft, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';
import { formatPrice } from '../utils/format';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = PRODUCTS.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState<'details' | 'shipping' | 'returns'>('details');

  useEffect(() => {
    setQuantity(1);
  }, [id]);

  if (!product) {
    return (
      <div className="pt-32 pb-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="font-playfair text-3xl mb-4">Product Not Found</h2>
        <Link to="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const relatedProducts = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Optional: Add toast notification here
  };

  return (
    <div className="bg-cream min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/shop" className="text-sm text-gray-500 hover:text-gold flex items-center gap-2 transition-colors uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back to Collection
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24 mb-24">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square bg-white cursor-crosshair overflow-hidden group"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                style={
                  isZoomed
                    ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` }
                    : undefined
                }
              />
              {product.isNew && (
                <div className="absolute top-4 left-4 bg-royal text-white text-xs px-3 py-1 uppercase tracking-wider z-10">
                  New Arrival
                </div>
              )}
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="text-sm text-gray-500 uppercase tracking-widest mb-4">
                {product.category}
              </div>
              <h1 className="font-playfair text-4xl md:text-5xl text-charcoal mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-medium text-charcoal">
                  {formatPrice(product.price)}
                </span>
                <div className="flex items-center text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="text-gray-500 text-sm ml-2">({product.rating || 5.0} / 5.0)</span>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed font-light mb-6">
                {product.description}
              </p>

              {product.from && product.to && (
                <div className="mb-8 p-4 bg-cream/50 rounded border border-gold/20 italic text-gray-600">
                  <span className="font-medium">From:</span> {product.from} <br />
                  <span className="font-medium">To:</span> {product.to}
                </div>
              )}
            </motion.div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 mb-8">
              <div className="flex items-center border border-gray-300 h-12 w-full sm:w-auto justify-center">
                <button
                  className="px-4 py-2 text-charcoal hover:text-gold transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="w-12 text-center text-charcoal">{quantity}</span>
                <button
                  className="px-4 py-2 text-charcoal hover:text-gold transition-colors"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto flex-grow">
                <Button
                  onClick={handleAddToCart}
                  className="flex-grow h-12 bg-royal hover:bg-royal-dark text-white uppercase tracking-widest text-sm"
                >
                  Add to Cart
                </Button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="h-12 w-12 shrink-0 flex items-center justify-center border border-gray-300 hover:border-gold transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isWishlisted ? 'fill-gold text-gold' : 'text-charcoal hover:text-gold'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-12 py-6 border-y border-gray-200">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-gold" />
                <span className="text-sm text-charcoal">Complimentary Shipping</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gold" />
                <span className="text-sm text-charcoal">Lifetime Warranty</span>
              </div>
            </div>

            {/* Accordion/Tabs */}
            <div>
              <div className="flex gap-8 border-b border-gray-200 mb-6">
                {(['details', 'shipping', 'returns'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm uppercase tracking-widest font-semibold transition-colors relative ${
                      activeTab === tab ? 'text-charcoal' : 'text-gray-400 hover:text-charcoal'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                      />
                    )}
                  </button>
                ))}
              </div>
              <div className="text-gray-600 text-sm font-light leading-relaxed min-h-[100px]">
                {activeTab === 'details' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Ethically sourced natural diamonds</li>
                      <li>18k Solid Gold / Platinum settings</li>
                      <li>Includes certificate of authenticity</li>
                      <li>Handcrafted in our Geneva atelier</li>
                    </ul>
                  </motion.div>
                )}
                {activeTab === 'shipping' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    Complimentary express shipping on all orders. Securely packaged in our signature unbranded box for security. Signature required upon delivery.
                  </motion.div>
                )}
                {activeTab === 'returns' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    We accept returns within 30 days of delivery. Pieces must be unworn and in their original condition with all tags attached.
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-gray-200">
            <h2 className="font-playfair text-3xl text-charcoal text-center mb-12">Complete The Look</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
