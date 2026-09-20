import React from 'react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { trackWhatsAppClick } from '../lib/analytics';

export function FloatingWhatsApp() {
  const phoneNumber = '+91 8477077001';
  const cleanNumber = '918477077001';
  const message = encodeURIComponent(
    'Hello The Jewel Studio, I would like to inquire about your jewellery collection.'
  );
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;

  const handleClick = () => {
    trackWhatsAppClick('floating_button', phoneNumber);
  };

  return (
    <aside
      aria-label="WhatsApp Quick Support"
      className="fixed bottom-6 right-6 z-50 flex items-center"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label="Chat with The Jewel Studio on WhatsApp"
        className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 group focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 border border-white/25"
      >
        <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white transition-transform group-hover:scale-110" color="#ffffff" />
        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping opacity-75" />
        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-200 rounded-full" />
      </a>
    </aside>
  );
}
