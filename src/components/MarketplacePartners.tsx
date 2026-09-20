import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ShieldCheck, CheckCircle2, Award } from 'lucide-react';

export interface MarketplaceItem {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  accentBorder: string;
  avif: string;
  webp: string;
  png: string;
  svg: string;
}

export const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: 'amazon',
    name: 'Amazon India',
    badge: 'Prime Delivery',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200/80',
    accentBorder: 'hover:border-[#FF9900]/50 hover:shadow-[#FF9900]/10',
    avif: '/platforms/amazon.avif',
    webp: '/platforms/amazon.webp',
    png: '/platforms/amazon.png',
    svg: '/platforms/amazon.svg',
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    badge: 'F-Assured Seller',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200/80',
    accentBorder: 'hover:border-[#2874F0]/50 hover:shadow-[#2874F0]/10',
    avif: '/platforms/flipkart.avif',
    webp: '/platforms/flipkart.webp',
    png: '/platforms/flipkart.png',
    svg: '/platforms/flipkart.svg',
  },
  {
    id: 'myntra',
    name: 'Myntra',
    badge: 'Verified Brand',
    badgeColor: 'bg-pink-50 text-pink-800 border-pink-200/80',
    accentBorder: 'hover:border-[#FF3F6C]/50 hover:shadow-[#FF3F6C]/10',
    avif: '/platforms/myntra.avif',
    webp: '/platforms/myntra.webp',
    png: '/platforms/myntra.png',
    svg: '/platforms/myntra.svg',
  },
  {
    id: 'meesho',
    name: 'Meesho',
    badge: 'Trusted Supplier',
    badgeColor: 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200/80',
    accentBorder: 'hover:border-[#9B166A]/50 hover:shadow-[#9B166A]/10',
    avif: '/platforms/meesho.avif',
    webp: '/platforms/meesho.webp',
    png: '/platforms/meesho.png',
    svg: '/platforms/meesho.svg',
  },
  {
    id: 'nykaa',
    name: 'Nykaa Fashion',
    badge: 'Fashion Partner',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200/80',
    accentBorder: 'hover:border-[#FC2779]/50 hover:shadow-[#FC2779]/10',
    avif: '/platforms/nykaa.avif',
    webp: '/platforms/nykaa.webp',
    png: '/platforms/nykaa.png',
    svg: '/platforms/nykaa.svg',
  },
  {
    id: 'ajio',
    name: 'AJIO',
    badge: 'Curated Trends',
    badgeColor: 'bg-neutral-100 text-neutral-800 border-neutral-300',
    accentBorder: 'hover:border-neutral-700/50 hover:shadow-neutral-900/10',
    avif: '/platforms/ajio.avif',
    webp: '/platforms/ajio.webp',
    png: '/platforms/ajio.png',
    svg: '/platforms/ajio.svg',
  },
  {
    id: 'tatacliq',
    name: 'Tata CLiQ Luxury',
    badge: 'Luxury Curated',
    badgeColor: 'bg-amber-50 text-amber-900 border-amber-300/80',
    accentBorder: 'hover:border-[#B81452]/50 hover:shadow-[#B81452]/10',
    avif: '/platforms/tatacliq.avif',
    webp: '/platforms/tatacliq.webp',
    png: '/platforms/tatacliq.png',
    svg: '/platforms/tatacliq.svg',
  },
  {
    id: 'jiomart',
    name: 'JioMart',
    badge: 'Verified Merchant',
    badgeColor: 'bg-sky-50 text-sky-800 border-sky-200/80',
    accentBorder: 'hover:border-[#0081C9]/50 hover:shadow-[#0081C9]/10',
    avif: '/platforms/jiomart.avif',
    webp: '/platforms/jiomart.webp',
    png: '/platforms/jiomart.png',
    svg: '/platforms/jiomart.svg',
  },
];

interface MarketplacePartnersProps {
  variant?: 'home' | 'about';
  className?: string;
}

export function MarketplacePartners({ variant = 'home', className = '' }: MarketplacePartnersProps) {
  // Repeating the array 3 times creates a perfectly smooth continuous scroll with no visible gap
  const marqueeList = [...MARKETPLACE_ITEMS, ...MARKETPLACE_ITEMS, ...MARKETPLACE_ITEMS];

  return (
    <section
      id="marketplace-marquee-section"
      className={`relative py-12 sm:py-16 bg-gradient-to-b from-white via-cream/30 to-white border-y border-gray-100/90 overflow-hidden ${className}`}
    >
      {/* Container Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/25 text-gold-dark text-xs font-semibold uppercase tracking-wider mb-3"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>Multi-Platform Availability</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="font-playfair text-2xl sm:text-3xl lg:text-4xl text-charcoal font-medium tracking-tight mb-3"
        >
          Available Across India&apos;s Leading Marketplaces
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-gray-500 font-light text-xs sm:text-sm max-w-2xl mx-auto"
        >
          Discover authentic imitation jewelry by{' '}
          <span className="font-semibold text-charcoal">The Jewel Studio</span> on your preferred shopping platforms with buyer protection, express dispatch, and easy returns.
        </motion.p>
      </div>

      {/* Infinite Marquee Strip with Left/Right Vignette Masks */}
      <div className="relative w-full overflow-hidden py-2 select-none">
        {/* Left Gradient Edge Fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10"
        />

        {/* Right Gradient Edge Fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10"
        />

        {/* Infinite Scrolling Track */}
        <div
          id="marketplace-marquee-track"
          className="marquee-track flex items-center gap-4 sm:gap-6 px-4"
        >
          {marqueeList.map((platform, idx) => (
            <div
              key={`${platform.id}-${idx}`}
              className={`group flex items-center gap-3 sm:gap-4 px-5 py-3.5 sm:px-6 sm:py-4 bg-white rounded-xl border border-gray-200/90 shadow-xs hover:shadow-md transition-all duration-300 ${platform.accentBorder} shrink-0 cursor-default`}
            >
              {/* Modern Picture Element with AVIF, WebP, and fallback PNG formats */}
              <div className="h-8 sm:h-10 flex items-center justify-center min-w-[100px] sm:min-w-[125px]">
                <picture className="flex items-center justify-center">
                  <source type="image/avif" srcSet={platform.avif} />
                  <source type="image/webp" srcSet={platform.webp} />
                  <img
                    src={platform.png}
                    alt={`${platform.name} logo`}
                    loading="lazy"
                    decoding="async"
                    className="h-7 sm:h-8 w-auto max-w-[115px] sm:max-w-[135px] object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </picture>
              </div>

              {/* Status Badge */}
              <div className="flex flex-col items-start gap-1">
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${platform.badgeColor} whitespace-nowrap`}
                >
                  {platform.badge}
                </span>
                <span className="text-[11px] text-gray-500 font-medium hidden sm:inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verified Store
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust reassurance banner */}
      <div className="max-w-5xl mx-auto mt-8 px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-2 text-xs sm:text-sm text-gray-500 text-center font-light pt-4 border-t border-gray-100">
          <div className="inline-flex items-center gap-1.5 text-charcoal">
            <ShieldCheck className="w-4 h-4 text-gold" />
            <span className="font-medium">100% Quality Inspected</span>
          </div>
          <span className="text-gray-300 hidden sm:inline">•</span>
          <div className="inline-flex items-center gap-1.5 text-charcoal">
            <Award className="w-4 h-4 text-gold" />
            <span className="font-medium">Direct Boutique Best Price Guarantee</span>
          </div>
          <span className="text-gray-300 hidden sm:inline">•</span>
          <div className="inline-flex items-center gap-1.5 text-charcoal">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">Free Express 5-Day Delivery</span>
          </div>
        </div>
      </div>
    </section>
  );
}
