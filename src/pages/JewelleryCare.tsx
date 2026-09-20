import React from 'react';
import { SEO } from '../components/SEO';
import { Sparkles, Droplets, ShieldAlert } from 'lucide-react';

export function JewelleryCare() {
  return (
    <div className="min-h-screen bg-cream pt-24 pb-24">
      <SEO 
        title="Jewellery Care Guide" 
        description="Expert tips on how to clean, store, and maintain your artificial and imitation jewelry from The Jewel Studio."
      />
      
      <div className="bg-white py-16 border-b border-gray-200 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-playfair text-4xl md:text-5xl text-charcoal mb-4">
            Jewellery Care Guide
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto font-light">
            Keep your imitation and fashion jewellery shining brilliantly for years to come.
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
            <h3 className="font-playfair text-xl text-charcoal mb-4">Keep Away from Moisture</h3>
            <p className="text-gray-600 font-light text-sm leading-relaxed text-left">
              Imitation and gold-plated fashion jewellery should be the last thing you wear and the first thing you remove. Avoid exposure to water, sweat, perfume, hairsprays, body lotions, and harsh cleaning solutions to protect the anti-tarnish coating.
            </p>
          </div>

          {/* Cleaning */}
          <div className="bg-white p-8 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Droplets className="w-8 h-8 text-gold" />
            </div>
            <h3 className="font-playfair text-xl text-charcoal mb-4">Gentle Dry Wiping</h3>
            <p className="text-gray-600 font-light text-sm leading-relaxed text-left">
              After each wear, gently wipe your jewellery with a clean, soft micro-fiber cloth to remove oils, sweat, and dust. Avoid abrasive cloths, chemical jewelry cleaners, or dipping imitation pieces in water.
            </p>
          </div>

          {/* Storage */}
          <div className="bg-white p-8 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-gold" />
            </div>
            <h3 className="font-playfair text-xl text-charcoal mb-4">Airtight Storage</h3>
            <p className="text-gray-600 font-light text-sm leading-relaxed text-left">
              Store each piece separately in an individual airtight ziplock pouch or velvet compartment. Keeping pieces separate prevents scratches on crystal stones and shields the plating from atmospheric humidity and oxidation.
            </p>
          </div>
        </div>

        <div className="mt-16 bg-white p-8 md:p-12 border border-gray-200 text-center">
          <h2 className="font-playfair text-2xl text-charcoal mb-4">Questions About Jewellery Care?</h2>
          <p className="text-gray-600 font-light max-w-2xl mx-auto mb-6">
            Our concierge team is here to help you get the best wear and shine from your imitation and artificial jewellery collections.
          </p>
          <a href="/contact" className="inline-block border border-royal text-royal hover:bg-royal hover:text-white transition-colors uppercase tracking-widest text-sm font-semibold px-8 py-3">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
