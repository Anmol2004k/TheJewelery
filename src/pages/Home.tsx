import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS, IMAGES, TESTIMONIALS } from '../data';
import { Star, Gem, ShieldCheck, Headphones, Award } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { InstagramSection } from '../components/InstagramSection';

gsap.registerPlugin(ScrollTrigger);

const TRUST_ITEMS = [
  {
    icon: Gem,
    title: 'Handmade Jewellery',
    description: 'Crafted with precision and care in our Geneva atelier.'
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    description: 'Your transactions are protected with enterprise-grade security.'
  },
  {
    icon: Headphones,
    title: 'Easy Support',
    description: 'Our concierge team is available to assist you 24/7.'
  },
  {
    icon: Award,
    title: 'Quality Craftsmanship',
    description: 'Backed by a lifetime warranty on all our pieces.'
  }
];

const CATEGORIES = [
  { name: 'Rings', image: PRODUCTS.find(p => p.category === 'Rings')?.image },
  { name: 'Necklaces', image: PRODUCTS.find(p => p.category === 'Necklaces')?.image },
  { name: 'Earrings', image: PRODUCTS.find(p => p.category === 'Earrings')?.image },
  { name: 'Bracelets', image: PRODUCTS.find(p => p.category === 'Bracelets')?.image },
  { name: 'Watches', image: PRODUCTS.find(p => p.category === 'Watches')?.image },
  { name: 'Gifts', image: PRODUCTS.find(p => p.category === 'Gifts')?.image },
];

export function Home() {
  const featuredProducts = PRODUCTS.filter((p) => p.featured).slice(0, 4);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger reveal for Trust Bar
      gsap.from('.trust-item', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.trust-section',
          start: 'top 85%',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full flex flex-col pt-36 pb-12" ref={containerRef}>
      
      {/* Circular Categories (Horizontally Scrollable) */}
      <section className="w-full bg-white pb-6 pt-2 overflow-x-auto scrollbar-hide">
        <div className="flex px-4 gap-4 md:justify-center min-w-max">
          {CATEGORIES.map((cat, index) => (
            <Link key={cat.name} to={`/shop?category=${cat.name}`} className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[2px] border border-gray-200 group-hover:border-gold transition-colors">
                <div className="w-full h-full rounded-full overflow-hidden bg-cream">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-charcoal">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Main Hero Banner */}
      <section className="px-4 pb-8 w-full max-w-7xl mx-auto">
        <div className="relative w-full h-[60vh] sm:h-[70vh] rounded-2xl overflow-hidden shadow-lg group">
          <img
            src={IMAGES.hero}
            alt="Luxury Diamond Necklace"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          <div className="absolute inset-0 p-6 sm:p-12 flex flex-col justify-end items-center sm:items-start text-center sm:text-left z-10">
            <h2 className="text-gold font-playfair text-xl sm:text-2xl mb-2 italic">This season,</h2>
            <h1 className="font-playfair text-3xl sm:text-5xl lg:text-6xl text-white font-bold leading-tight mb-6 drop-shadow-md">
              Gift Elegance <br className="hidden sm:block"/> to Your Loved Ones
            </h1>
            <Link to="/shop">
              <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-charcoal rounded-full px-8 py-3 font-semibold transition-all shadow-lg backdrop-blur-sm">
                SHOP NOW
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-playfair text-2xl md:text-3xl text-charcoal font-bold">Featured Pieces</h2>
            <Link to="/shop" className="text-royal hover:text-gold uppercase tracking-widest text-xs sm:text-sm font-semibold transition-colors">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Promo */}
      <section className="py-16 px-4 max-w-7xl mx-auto w-full">
        <div className="relative rounded-2xl overflow-hidden bg-royal-dark text-center shadow-xl">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
          <div className="relative z-10 p-8 sm:p-16 md:p-24 flex flex-col items-center">
            <h2 className="font-playfair text-3xl md:text-5xl text-gold mb-6 font-bold">The Art of Fine Jewellery</h2>
            <p className="text-white/90 leading-relaxed font-light mb-8 max-w-2xl mx-auto text-sm sm:text-base">
              For over two decades, The Jewel Studio has been synonymous with unparalleled craftsmanship and ethically sourced gemstones. Our master artisans blend traditional techniques with contemporary design.
            </p>
            <Link to="/about">
              <Button className="bg-gold hover:bg-gold-light text-charcoal rounded-full px-8 font-semibold border-none">
                Discover Our Heritage
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="trust-section py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {TRUST_ITEMS.map((item, index) => (
              <div key={index} className="trust-item flex flex-col items-center text-center px-2">
                <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-gold" strokeWidth={1.5} />
                </div>
                <h3 className="font-playfair font-semibold text-charcoal mb-2 text-sm sm:text-base">{item.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed max-w-[200px]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 sm:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl text-charcoal mb-4">Worn With Love</h2>
            <div className="w-16 h-[1px] bg-gold mx-auto mb-6" />
            <p className="text-gray-500 font-light max-w-xl mx-auto text-sm sm:text-base">
              Real moments from our clients, showcasing the elegance of our pieces in everyday luxury.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={testimonial.image}
                    alt={`${testimonial.name} wearing ${testimonial.productInfo}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 text-[10px] uppercase tracking-widest text-charcoal shadow-sm rounded-sm font-medium">
                    {testimonial.productInfo}
                  </div>
                </div>
                <div className="p-6 sm:p-8 flex flex-col flex-grow text-center items-center">
                  <div className="flex gap-1 text-gold mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="font-playfair text-base sm:text-lg text-charcoal leading-relaxed mb-6 italic text-center flex-grow">
                    "{testimonial.text}"
                  </p>
                  <div className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-widest mt-auto">
                    — {testimonial.name}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <div className="pt-12">
        <InstagramSection />
      </div>
    </div>
  );
}
