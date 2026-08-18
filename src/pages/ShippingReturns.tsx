import React from 'react';
import { SEO } from '../components/SEO';
import { Truck, RotateCcw, Globe } from 'lucide-react';

export function ShippingReturns() {
  return (
    <div className="min-h-screen bg-cream pt-24 pb-24">
      <SEO 
        title="Shipping & Returns" 
        description="Learn about The Jewel Studio's complimentary worldwide shipping, secure delivery, and our 30-day return policy."
      />
      
      <div className="bg-white py-16 border-b border-gray-200 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-playfair text-4xl md:text-5xl text-charcoal mb-4">
            Shipping & Returns
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto font-light">
            Secure delivery and peace of mind, anywhere in the world.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Shipping */}
          <div className="bg-white p-8 border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Truck className="w-6 h-6 text-gold" />
            </div>
            <h2 className="font-playfair text-2xl text-charcoal mb-4">Complimentary Shipping</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              We are pleased to offer complimentary express shipping on all orders. Each piece is carefully inspected, securely packaged in an unbranded exterior box to ensure security, and requires a signature upon delivery.
            </p>
            <ul className="text-sm text-gray-500 space-y-2 list-disc pl-5">
              <li>Domestic Delivery: 1-3 Business Days</li>
              <li>International Delivery: 3-7 Business Days</li>
              <li>Fully insured while in transit</li>
            </ul>
          </div>

          {/* Returns */}
          <div className="bg-white p-8 border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <RotateCcw className="w-6 h-6 text-gold" />
            </div>
            <h2 className="font-playfair text-2xl text-charcoal mb-4">30-Day Returns</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              Your satisfaction is our priority. If you are not completely delighted with your purchase, you may return it within 30 days of the delivery date for a full refund or exchange.
            </p>
            <ul className="text-sm text-gray-500 space-y-2 list-disc pl-5">
              <li>Items must be unworn and in original condition</li>
              <li>Original tags and certificates must be included</li>
              <li>Bespoke/custom orders are final sale</li>
            </ul>
          </div>
        </div>

        {/* International Info */}
        <div className="bg-royal-dark text-white p-8 md:p-12 text-center">
          <Globe className="w-10 h-10 text-gold mx-auto mb-6" />
          <h2 className="font-playfair text-2xl md:text-3xl mb-4">International Duties & Taxes</h2>
          <p className="text-white/80 font-light leading-relaxed max-w-2xl mx-auto">
            Please be aware that international shipments may be subject to customs duties and taxes levied by the destination country. These charges are the responsibility of the recipient. Our concierge team is happy to provide estimated duty costs upon request.
          </p>
        </div>
      </div>
    </div>
  );
}
