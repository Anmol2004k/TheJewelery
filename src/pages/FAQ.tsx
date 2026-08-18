import React, { useState } from 'react';
import { SEO } from '../components/SEO';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const FAQS = [
  {
    question: "Are your diamonds ethically sourced and conflict-free?",
    answer: "Absolutely. At The Jewel Studio, we adhere to a strict zero-tolerance policy toward conflict diamonds. We only purchase diamonds through respected suppliers who, like us, proudly adhere to and enforce the standards established by the Kimberley Process."
  },
  {
    question: "Do you offer international shipping for your fine jewellery?",
    answer: "Yes, we ship our luxury jewellery worldwide. All international orders are shipped via insured express couriers. Please note that customs duties and taxes are the responsibility of the recipient."
  },
  {
    question: "How should I care for my diamond and gold jewellery?",
    answer: "We recommend cleaning your diamond pieces with a soft brush and mild soapy water. For gold jewellery, avoid harsh chemicals and store them in the original soft-lined box provided by The Jewel Studio. You can read more on our dedicated Jewellery Care page."
  },
  {
    question: "Can I return or exchange an engagement ring?",
    answer: "We offer a 30-day return policy for most of our pieces, including engagement rings, provided they are in pristine, unworn condition with all original tags and documentation. Bespoke or customized pieces are final sale."
  },
  {
    question: "Do your pieces come with a warranty?",
    answer: "Yes, all The Jewel Studio creations come with a lifetime warranty against manufacturing defects. We also offer complimentary annual cleaning and prong inspections."
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
