import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { CheckCircle2 } from 'lucide-react';

export function OrderConfirmation() {
  const location = useLocation();
  const orderId = location.state?.orderId || `TJS-${Math.floor(Math.random() * 1000000)}`;

  return (
    <div className="min-h-screen bg-cream pt-32 pb-24 flex flex-col items-center justify-center">
      <div className="bg-white p-12 shadow-sm text-center max-w-lg mx-auto w-full mx-4">
        <CheckCircle2 className="w-20 h-20 text-gold mx-auto mb-6" />
        <h1 className="font-playfair text-4xl text-charcoal mb-4">Thank You</h1>
        <p className="text-gray-500 mb-2 font-light">
          Your order <span className="font-medium text-charcoal">#{orderId}</span> has been placed successfully.
        </p>
        <p className="text-gray-500 mb-8 font-light text-sm">
          We've sent a confirmation email with your order details and tracking information.
        </p>
        <Link to="/shop">
          <Button className="w-full bg-royal hover:bg-royal-dark text-white uppercase tracking-widest text-sm h-12">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
