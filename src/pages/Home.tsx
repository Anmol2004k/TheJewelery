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

export function Home() {
  const featuredProducts = PRODUCTS.filter((p) => p.featured).slice(0, 4);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Subtle parallax for Hero Image
      gsap.to('.hero-bg', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

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
    <div className="w-full flex flex-col" ref={containerRef}>
      {/* Hero Section */}
      <section className="hero-section relative h-[90vh] w-full flex items-center justify-center overflow-hidden bg-cream pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src={IMAGES.hero}
            alt="Luxury Diamond Necklace"
            referrerPolicy="no-referrer"
            className="hero-bg w-full h-[120%] object-cover object-center opacity-90 -top-[10%]"
          />
          {/* Subtle gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-cream/80 via-cream/40 to-transparent sm:bg-none sm:bg-black/20" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full flex flex-col items-center sm:items-start text-center sm:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-xl bg-white/80 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none p-8 sm:p-0 rounded-lg sm:rounded-none"
          >
            <h2 className="text-sm md:text-base uppercase tracking-[0.3em] text-royal font-semibold mb-4">
              The New Collection
            </h2>
            <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl text-charcoal sm:text-white leading-tight mb-6 drop-shadow-md sm:drop-shadow-lg">
              Elegance in <br/><span className="text-gold italic">Every Detail</span>
            </h1>
            <p className="text-charcoal sm:text-white/90 text-sm md:text-base max-w-md mb-8 leading-relaxed font-light drop-shadow-sm">
              Discover our latest curation of masterfully crafted pieces, designed to celebrate life's most precious moments with timeless brilliance.
            </p>
            <Link to="/shop">
              <Button size="lg" className="w-full sm:w-auto bg-gold hover:bg-gold-light border-none text-charcoal font-semibold shadow-lg">
                Explore Collection
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl text-charcoal mb-4">Shop by Category</h2>
            <div className="w-16 h-[1px] bg-gold mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {['Rings', 'Necklaces', 'Earrings', 'Bracelets'].map((cat, index) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-[3/4] overflow-hidden bg-cream cursor-pointer"
              >
                <Link to={`/shop?category=${cat}`} className="block w-full h-full">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors z-10" />
                  <img
                    src={PRODUCTS.find(p => p.category === cat)?.image}
                    alt={cat}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <h3 className="font-playfair text-2xl text-white bg-black/30 px-6 py-3 backdrop-blur-sm border border-white/20">
                      {cat}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-beige">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="font-playfair text-3xl md:text-4xl text-charcoal mb-4">Featured Pieces</h2>
              <div className="w-16 h-[1px] bg-gold" />
            </div>
            <Link to="/shop" className="hidden md:inline-flex text-royal hover:text-gold uppercase tracking-widest text-sm font-semibold transition-colors mt-6 md:mt-0">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Link to="/shop">
              <Button variant="outline" className="w-full">View All Pieces</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story Promo */}
      <section className="py-24 bg-royal-dark text-center px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="border border-white/20 p-8 md:p-16 relative"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-royal-dark px-4">
              <div className="w-8 h-8 rounded-full border-2 border-gold flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-gold" />
              </div>
            </div>
            <h2 className="font-playfair text-3xl md:text-5xl text-gold mb-6">The Art of Fine Jewellery</h2>
            <p className="text-white/80 leading-relaxed font-light mb-8 max-w-xl mx-auto">
              For over two decades, The Jewel Studio has been synonymous with unparalleled craftsmanship and ethically sourced gemstones. Our master artisans blend traditional techniques with contemporary design to create pieces that transcend generations.
            </p>
            <Link to="/about">
              <span className="text-white uppercase tracking-widest text-sm font-semibold hover:text-gold transition-colors border-b border-white hover:border-gold pb-1">
                Discover Our Heritage
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="trust-section py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TRUST_ITEMS.map((item, index) => (
              <div
                key={index}
                className="trust-item flex flex-col items-center text-center px-4"
              >
                <item.icon className="w-8 h-8 text-gold mb-4" strokeWidth={1.5} />
                <h3 className="font-playfair font-semibold text-charcoal mb-2 text-lg">{item.title}</h3>
                <p className="text-sm text-gray-500 font-light leading-relaxed max-w-[200px]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl text-charcoal mb-4">Worn With Love</h2>
            <div className="w-16 h-[1px] bg-gold mx-auto mb-6" />
            <p className="text-gray-500 font-light max-w-xl mx-auto">
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
                className="flex flex-col bg-white border border-gray-100"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={testimonial.image}
                    alt={`${testimonial.name} wearing ${testimonial.productInfo}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] uppercase tracking-widest text-charcoal shadow-sm">
                    {testimonial.productInfo}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow text-center items-center">
                  <div className="flex gap-1 text-gold mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="font-playfair text-lg text-charcoal leading-relaxed mb-6 italic text-center flex-grow">
                    {testimonial.text}
                  </p>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-auto">
                    — {testimonial.name}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <InstagramSection />
    </div>
  );
}
