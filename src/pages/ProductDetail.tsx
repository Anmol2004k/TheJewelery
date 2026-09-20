import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PRODUCTS, getCategoryFallback } from '../data';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { Button } from '../components/ui/Button';
import { Heart, Truck, RotateCcw, ShieldCheck, ArrowLeft, Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from '../components/icons/WhatsAppIcon';
import { trackWhatsAppClick, trackAddToCart as trackAddToCartGA } from '../lib/analytics';
import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';
import { formatPrice } from '../utils/format';
import toast from 'react-hot-toast';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
    trackAddToCartGA(product);
    toast.success(`Added ${quantity}x ${product.name} to cart ✨`, {
      id: `cart-detail-${product.id}`,
      duration: 2500,
    });
  };

  const handleCheckoutNow = () => {
    addToCart(product, quantity);
    trackAddToCartGA(product);
    navigate('/checkout');
  };

  const handleWhatsAppInquiry = () => {
    if (!product) return;
    trackWhatsAppClick(`product_${product.id}`, '+91 8477077001');
    const text = encodeURIComponent(
      `Hello The Jewel Studio, I would like to inquire about "${product.name}" (SKU: ${product.id}, Price: ₹${product.price.toLocaleString('en-IN')}). Could you please share more details or availability?`
    );
    window.open(`https://wa.me/918477077001?text=${text}`, '_blank');
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
                src={product.image || getCategoryFallback(product.category)}
                alt={product.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const fallback = getCategoryFallback(product.category);
                  if (e.currentTarget.src !== fallback) {
                    e.currentTarget.src = fallback;
                  }
                }}
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

            <div className="flex flex-col gap-4 mb-8">
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                {/* Quantity selector */}
                <div className="flex items-center border border-gray-300 h-12 w-32 justify-between px-2 bg-white rounded-md">
                  <button
                    className="w-8 h-8 flex items-center justify-center text-charcoal hover:text-gold transition-colors text-lg"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="font-medium text-charcoal">{quantity}</span>
                  <button
                    className="w-8 h-8 flex items-center justify-center text-charcoal hover:text-gold transition-colors text-lg"
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Wishlist button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className="h-12 px-4 border border-gray-300 hover:border-gold rounded-md transition-colors flex items-center gap-2 text-sm text-charcoal hover:text-gold bg-white shrink-0"
                  aria-label="Add to wishlist"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isWishlisted ? 'fill-gold text-gold' : 'text-charcoal hover:text-gold'
                    }`}
                  />
                  <span className="hidden sm:inline font-medium">
                    {isWishlisted ? 'Wishlisted' : 'Save'}
                  </span>
                </button>
              </div>

              {/* Action Buttons: Add to Cart & Checkout Now */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className="h-12 border-2 border-royal text-royal hover:bg-royal/5 uppercase tracking-wider text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 rounded-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </Button>
                <Button
                  onClick={handleCheckoutNow}
                  className="h-12 bg-royal hover:bg-royal-dark text-white uppercase tracking-wider text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 rounded-md shadow-sm"
                >
                  <span>Checkout Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Direct Official WhatsApp Inquiry */}
              <button
                type="button"
                onClick={handleWhatsAppInquiry}
                className="w-full mt-3 h-11 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] hover:text-[#075E54] border border-[#25D366]/40 rounded-md font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" color="#25D366" />
                <span>Inquire on WhatsApp (+91 8477077001)</span>
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12 py-5 border-y border-gray-200">
              <div className="flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-gold shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-charcoal">5-Day Delivery</p>
                  <p className="text-[11px] text-gray-400">Fast doorstep transit</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-5 h-5 text-gold shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-charcoal">7-10 Day Returns</p>
                  <p className="text-[11px] text-gray-400">With unboxing video</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <ShieldCheck className="w-5 h-5 text-gold shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-charcoal">Imitation Jewelry</p>
                  <p className="text-[11px] text-gray-400">Anti-tarnish finish</p>
                </div>
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
                      <li>Premium artificial & imitation fashion jewelry</li>
                      <li>High-grade 18k micron gold plating with anti-tarnish protective coating</li>
                      <li>Sparkling AAA+ cubic zirconia crystals and artisan faux gemstone accents</li>
                      <li>Hypoallergenic, skin-safe, lead-free and nickel-free alloy base</li>
                      <li>Quality inspected for everyday brilliance and durable wear</li>
                    </ul>
                  </motion.div>
                )}
                {activeTab === 'shipping' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p className="mb-2">
                      <strong>Delivery Timeline:</strong> Delivery will take <strong>5 days</strong> from the date of dispatch.
                    </p>
                    <p>
                      Each imitation piece is securely enclosed in protective cushioned jewelry boxes to ensure it reaches you safely and without transit damage. Tracking updates are sent immediately upon shipment.
                    </p>
                  </motion.div>
                )}
                {activeTab === 'returns' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p className="mb-2">
                      <strong>Return Policy:</strong> Returns are accepted if a clear <strong>unboxing video is submitted within 7 to 10 days of receipt</strong>.
                    </p>
                    <p className="mb-2">
                      Requirements for return or replacement:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-gray-600">
                      <li>A video showing the unopened package being unboxed must be submitted within 7 to 10 days of delivery.</li>
                      <li>The piece must be unworn and in its original condition with all packaging intact.</li>
                      <li>Contact our support team to verify the video and initiate return pickup or replacement.</li>
                    </ul>
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
