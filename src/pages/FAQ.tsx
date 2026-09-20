import React, { useState } from 'react';
import { SEO } from '../components/SEO';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const FAQS = [
  {
    question: "What materials are used in your jewellery?",
    answer: "Our collections feature premium artificial and imitation fashion jewellery crafted with high-grade 18k micron gold plating, hypoallergenic skin-safe alloy bases, and brilliant AAA+ cubic zirconia crystals with anti-tarnish protective sealing."
  },
  {
    question: "How long does shipping and delivery take?",
    answer: "Delivery will take 5 days from the date of dispatch. Each order is packed in a protective cushioned box to prevent transit damage, and real-time tracking details are provided upon shipment."
  },
  {
    question: "How should I care for my artificial and imitation jewellery?",
    answer: "To maintain maximum luster and longevity, keep your imitation jewellery away from direct water, perfumes, lotions, and harsh household chemicals. Store each piece in an airtight ziplock bag or soft fabric pouch when not in use."
  },
  {
    question: "What is your return and exchange policy?",
    answer: "Returns and replacements are accepted if a parcel unboxing video is submitted within 7 to 10 days of receipt. The video must show the sealed package being opened and the condition of the piece. Items must be unworn and in their original packaging."
  },
  {
    question: "Do your pieces come with a warranty?",
    answer: "As these are artificial and imitation fashion pieces, we do not offer a lifetime warranty. However, all pieces are strictly quality-inspected before dispatch, and any transit damage or manufacturing defect reported with video proof within 7 to 10 days will be promptly replaced or refunded."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-cream pt-24 pb-24">
      <SEO 
        title="Frequently Asked Questions" 
        description="Find answers to commonly asked questions about The Jewel Studio's luxury jewellery, ethical sourcing, international shipping, and diamond care."
        keywords="luxury jewellery FAQ, ethical diamonds, international shipping jewellery, engagement ring returns, fine jewellery warranty, The Jewel Studio support"
      />
      
      <div className="bg-white py-16 border-b border-gray-200 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-playfair text-4xl md:text-5xl text-charcoal mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto font-light">
            Everything you need to know about our craftsmanship, services, and policies.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div key={index} className="bg-white border border-gray-200">
              <button
                className="w-full px-6 py-4 flex justify-between items-center focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-playfair font-semibold text-lg text-charcoal text-left">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gold flex-shrink-0 ml-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gold flex-shrink-0 ml-4" />
                )}
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-600 font-light leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-500 font-light mb-4">Still have questions?</p>
          <a href="/contact" className="text-royal font-semibold uppercase tracking-widest text-sm hover:text-gold transition-colors border-b border-transparent hover:border-gold pb-1">
            Contact Our Concierge
          </a>
        </div>
      </div>
    </div>
  );
}
