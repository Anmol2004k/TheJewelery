import emailjs from '@emailjs/browser';

export interface EmailOrderData {
  firstName: string;
  email: string;
  orderId: string;
  amount: string;
  items: Array<{ quantity: number; product: { name: string } }>;
}

export interface EmailContactData {
  firstName: string;
  lastName?: string;
  email: string;
  subject?: string;
  message: string;
}

// Default to user's configured EmailJS credentials if not provided via Vite env
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_gi2hzzk';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_724u0gb';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '8IpEq4C2YWAhYo7Zo';

export const sendOrderConfirmationEmail = async (orderData: EmailOrderData) => {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn('EmailJS credentials are not configured. Skipping confirmation email.');
    return false;
  }

  try {
    const itemsFormatted = orderData.items && orderData.items.length > 0
      ? orderData.items.map(item => `${item.quantity}x ${item.product.name}`).join('\n')
      : 'Order Items';

    // The user template requires 'email' specifically as recipient field
    const templateParams: Record<string, string> = {
      email: orderData.email,
      to_email: orderData.email,
      user_email: orderData.email,
      reply_to: orderData.email,
      to_name: orderData.firstName,
      name: orderData.firstName,
      user_name: orderData.firstName,
      first_name: orderData.firstName,
      order_id: orderData.orderId,
      orderId: orderData.orderId,
      amount: orderData.amount,
      total: orderData.amount,
      items_list: itemsFormatted,
      message: `Thank you for your purchase with The Jewel Studio! Your order #${orderData.orderId} for ${orderData.amount} has been confirmed.\n\nItems:\n${itemsFormatted}`
    };

    console.log('Sending EmailJS confirmation to:', orderData.email, 'with Service:', SERVICE_ID);
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    console.log('SUCCESS! Order confirmation email sent via EmailJS:', response.status, response.text);
    return true;
  } catch (error) {
    console.error('EmailJS order confirmation delivery error:', error);
    return false;
  }
};

export const sendContactEmail = async (contactData: EmailContactData) => {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn('EmailJS credentials not configured for contact inquiry.');
    return false;
  }

  try {
    const fullName = `${contactData.firstName} ${contactData.lastName || ''}`.trim();
    const templateParams: Record<string, string> = {
      email: contactData.email,
      to_email: 'thejewelstudio.in1@gmail.com',
      user_email: contactData.email,
      reply_to: contactData.email,
      studio_email: 'thejewelstudio.in1@gmail.com',
      to_name: fullName,
      name: fullName,
      user_name: fullName,
      first_name: contactData.firstName,
      subject: contactData.subject || 'Customer Inquiry',
      order_id: 'INQUIRY-' + Date.now().toString().slice(-6),
      amount: 'N/A',
      items_list: 'Direct Inquiry from ' + fullName,
      message: `Inquiry Subject: ${contactData.subject || 'General'}\nFrom: ${fullName} (${contactData.email})\n\nMessage:\n${contactData.message}`
    };

    console.log('Sending EmailJS contact inquiry for:', contactData.email);
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    console.log('SUCCESS! Contact inquiry sent via EmailJS:', response.status, response.text);
    return true;
  } catch (error) {
    console.error('EmailJS contact form delivery error:', error);
    return false;
  }
};
