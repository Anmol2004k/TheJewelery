import React from 'react';
import { SEO } from '../components/SEO';
import { Truck, RotateCcw, Globe } from 'lucide-react';

export function ShippingReturns() {
  return (
    <div className="min-h-screen bg-cream pt-24 pb-24">
      <SEO 
        title="Shipping & Returns" 
        description="Learn about The Jewel Studio's fast 5-day delivery and 7 to 10-day video-verified return policy for our artificial and imitation jewelry collections."
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
            <h2 className="font-playfair text-2xl text-charcoal mb-4">5-Day Fast Delivery</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              All orders are processed swiftly and dispatched with reliable express couriers. Delivery will take 5 days from the date of dispatch. Each imitation and artificial jewelry piece is carefully inspected and securely cushioned in a protective jewelry box.
            </p>
            <ul className="text-sm text-gray-500 space-y-2 list-disc pl-5">
              <li>Standard Doorstep Delivery: 5 Days</li>
              <li>Real-time tracking notifications provided</li>
              <li>Secure tamper-evident packaging</li>
            </ul>
          </div>

          {/* Returns */}
          <div className="bg-white p-8 border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <RotateCcw className="w-6 h-6 text-gold" />
            </div>
            <h2 className="font-playfair text-2xl text-charcoal mb-4">7 to 10-Day Video Returns</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              Your satisfaction is our priority. For our artificial and imitation jewelry pieces, returns or replacements are accepted if a clear unboxing video is submitted within 7 to 10 days of receipt.
            </p>
            <ul className="text-sm text-gray-500 space-y-2 list-disc pl-5">
              <li>Unboxing video must be submitted within 7 to 10 days of receipt</li>
              <li>Video must capture the unopened parcel and show item condition</li>
              <li>Pieces must be unworn and in original packaging</li>
              <li>Rapid resolution for any damaged or mismatched items</li>
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
