import React from 'react';
import { SEO } from '../components/SEO';
import { Sparkles, Droplets, ShieldAlert } from 'lucide-react';

export function JewelleryCare() {
  return (
    <div className="min-h-screen bg-cream pt-24 pb-24">
      <SEO 
        title="Jewellery Care Guide" 
        description="Expert tips on how to clean, store, and maintain your fine jewellery, diamonds, and gold pieces from The Jewel Studio."
      />
      
      <div className="bg-white py-16 border-b border-gray-200 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-playfair text-4xl md:text-5xl text-charcoal mb-4">
            Jewellery Care Guide
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto font-light">
            Preserve the brilliance of your pieces for generations to come.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Daily Care */}
          <div className="bg-white p-8 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <ShieldAlert className="w-8 h-8 text-gold" />
            </div>
            <h3 className="font-playfair text-xl text-charcoal mb-4">Daily Wear</h3>
            <p className="text-gray-600 font-light text-sm leading-relaxed text-left">
              Fine jewellery should be the last thing you put on and the first thing you take off. Avoid exposing your pieces to harsh chemicals, including perfumes, hairsprays, and cleaning agents. We recommend removing rings and bracelets before heavy physical activity or swimming.
            </p>
          </div>

          {/* Cleaning */}
          <div className="bg-white p-8 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Droplets className="w-8 h-8 text-gold" />
            </div>
            <h3 className="font-playfair text-xl text-charcoal mb-4">Cleaning</h3>
            <p className="text-gray-600 font-light text-sm leading-relaxed text-left">
              To restore the sparkle of your diamonds and gold, soak them briefly in warm water with a few drops of mild dish soap. Gently brush around the settings with a very soft-bristled toothbrush. Rinse thoroughly with clean warm water and pat dry with a lint-free cloth.
            </p>
          </div>

          {/* Storage */}
          <div className="bg-white p-8 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-gold" />
            </div>
            <h3 className="font-playfair text-xl text-charcoal mb-4">Storage</h3>
            <p className="text-gray-600 font-light text-sm leading-relaxed text-left">
              Store your pieces separately to prevent them from scratching each other. Diamonds are the hardest natural substance and can easily scratch other gems and metals. Always store your jewellery in the original fabric-lined box or a soft pouch provided by The Jewel Studio.
            </p>
          </div>
        </div>

        <div className="mt-16 bg-white p-8 md:p-12 border border-gray-200 text-center">
          <h2 className="font-playfair text-2xl text-charcoal mb-4">Complimentary Maintenance</h2>
          <p className="text-gray-600 font-light max-w-2xl mx-auto mb-6">
            We offer complimentary professional cleaning and prong inspection for all The Jewel Studio pieces. We recommend bringing or sending your jewellery to us once a year to ensure the stones remain secure and the metal maintains its pristine finish.
          </p>
          <a href="/contact" className="inline-block border border-royal text-royal hover:bg-royal hover:text-white transition-colors uppercase tracking-widest text-sm font-semibold px-8 py-3">
            Book an Appointment
          </a>
        </div>
      </div>
    </div>
  );
}
