import React from 'react';
import { SEO } from '../components/SEO';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-cream pt-24 pb-24">
      <SEO 
        title="Privacy Policy" 
        description="Read The Jewel Studio's Privacy Policy to understand how we collect, use, and protect your personal information."
      />
      
      <div className="bg-white py-16 border-b border-gray-200 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-playfair text-4xl md:text-5xl text-charcoal mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto font-light">
            Your privacy is of the utmost importance to us.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 prose prose-slate">
        <div className="bg-white p-8 md:p-12 shadow-sm text-gray-600 font-light leading-relaxed">
          <h2 className="font-playfair text-2xl text-charcoal mb-4 mt-0">1. Information We Collect</h2>
          <p className="mb-6">
            When you visit The Jewel Studio, we may collect personal information such as your name, email address, shipping address, and payment details when you make a purchase or create an account. We also automatically collect certain information about your device and browsing actions.
          </p>

          <h2 className="font-playfair text-2xl text-charcoal mb-4">2. How We Use Your Information</h2>
          <p className="mb-6">
            We use the information we collect to fulfill your orders, communicate with you regarding your purchase, improve our website, and send you marketing communications (if you have opted in). We do not sell your personal information to third parties.
          </p>

          <h2 className="font-playfair text-2xl text-charcoal mb-4">3. Data Security</h2>
          <p className="mb-6">
            We implement industry-standard security measures to protect your personal information during transmission and upon receipt. Our checkout process is secured using SSL encryption to ensure your payment details are safe.
          </p>

          <h2 className="font-playfair text-2xl text-charcoal mb-4">4. Cookies</h2>
          <p className="mb-6">
            We use cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can choose to disable cookies through your browser settings, though this may affect site functionality.
          </p>

          <h2 className="font-playfair text-2xl text-charcoal mb-4">5. Contact Us</h2>
          <p className="mb-0">
            If you have any questions about this Privacy Policy or how we handle your data, please contact our concierge team at privacy@thejewelstudio.com.
          </p>
        </div>
      </div>
    </div>
  );
}
