/**
 * Google Analytics 4 (GA4) Integration & Tracking Utilities
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    GA_MEASUREMENT_ID?: string;
  }
}

export const GA_MEASUREMENT_ID =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GA_MEASUREMENT_ID) ||
  (typeof window !== 'undefined' && window.GA_MEASUREMENT_ID) ||
  'G-JEWELSTUDIO1';

let isInitialized = false;

/**
 * Initialize Google Analytics tag
 */
export function initGoogleAnalytics(measurementId: string = GA_MEASUREMENT_ID) {
  if (typeof window === 'undefined' || isInitialized) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  // Configure standard gtag
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: false, // We control page_view manually for SPA route changes
    transport_type: 'beacon',
  });

  // Check if script tag is already loaded
  const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`);
  if (!existingScript) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.onerror = () => {
      console.warn('Google Analytics script blocked or unreachable.');
    };
    document.head.appendChild(script);
  }

  isInitialized = true;
  console.info(`[Analytics] Google Analytics initialized with ID: ${measurementId}`);
}

/**
 * Track SPA Page Views on React Router route transition
 */
export function trackPageView(pagePath: string, pageTitle?: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: pageTitle || document.title,
    send_to: GA_MEASUREMENT_ID,
  });
}

/**
 * Custom Event Tracker
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', eventName, {
    ...params,
    send_to: GA_MEASUREMENT_ID,
  });
}

/**
 * Track WhatsApp Inquiries
 */
export function trackWhatsAppClick(source: string, phone: string = '+918477077001') {
  trackEvent('whatsapp_click', {
    event_category: 'Lead',
    event_label: `WhatsApp - ${source}`,
    contact_number: phone,
    source,
  });
}

/**
 * Track E-Commerce Add To Cart
 */
export function trackAddToCart(product: { id: string | number; name: string; price: number; category?: string }) {
  trackEvent('add_to_cart', {
    currency: 'INR',
    value: product.price,
    items: [
      {
        item_id: String(product.id),
        item_name: product.name,
        price: product.price,
        item_category: product.category || 'Jewelry',
        quantity: 1,
      },
    ],
  });
}

/**
 * Track Order Purchases
 */
export function trackPurchase(orderId: string, totalAmount: number, items: Array<{ id: string | number; name: string; price: number; quantity: number }>) {
  trackEvent('purchase', {
    transaction_id: orderId,
    value: totalAmount,
    currency: 'INR',
    items: items.map(item => ({
      item_id: String(item.id),
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
}
