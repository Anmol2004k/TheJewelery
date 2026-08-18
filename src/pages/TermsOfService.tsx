import React from 'react';
import { SEO } from '../components/SEO';

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-cream pt-24 pb-24">
      <SEO 
        title="Terms of Service" 
        description="Terms and conditions for using The Jewel Studio website and purchasing our luxury jewellery."
      />
      
      <div className="bg-white py-16 border-b border-gray-200 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-playfair text-4xl md:text-5xl text-charcoal mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto font-light">
            The rules and guidelines for interacting with our brand.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 prose prose-slate">
        <div className="bg-white p-8 md:p-12 shadow-sm text-gray-600 font-light leading-relaxed">
          <h2 className="font-playfair text-2xl text-charcoal mb-4 mt-0">1. Agreement to Terms</h2>
          <p className="mb-6">
            By accessing or using The Jewel Studio website, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not access our website or use our services.
          </p>

          <h2 className="font-playfair text-2xl text-charcoal mb-4">2. Products and Pricing</h2>
          <p className="mb-6">
            All prices are subject to change without notice. We reserve the right to modify or discontinue any product. We have made every effort to display as accurately as possible the colors and images of our products, but we cannot guarantee your monitor's display of any color will be perfectly accurate.
          </p>

          <h2 className="font-playfair text-2xl text-charcoal mb-4">3. Intellectual Property</h2>
          <p className="mb-6">
            All content included on this site, such as text, graphics, logos, images, and audio clips, is the property of The Jewel Studio or its content suppliers and protected by international copyright laws.
          </p>

          <h2 className="font-playfair text-2xl text-charcoal mb-4">4. Limitation of Liability</h2>
          <p className="mb-6">
            The Jewel Studio shall not be liable for any direct, indirect, incidental, special, or consequential damages that result from the use of, or the inability to use, the materials on this site or the performance of the products.
          </p>

          <h2 className="font-playfair text-2xl text-charcoal mb-4">5. Governing Law</h2>
          <p className="mb-0">
            These Terms of Service and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of our operating jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
}
