import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Lock, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';
import { formatPrice } from '../utils/format';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // If accessed without items, redirect home
  React.useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      navigate('/shop');
    }
  }, [items, navigate, isProcessing]);

  const loadRazorpay = async () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const resLoaded = await loadRazorpay();
      if (!resLoaded) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        setIsProcessing(false);
        return;
      }

      // Create Order on Server
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: totalPrice,
          receipt: `rcpt_${Date.now()}`
        }),
      });

      if (!orderRes.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderRes.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '', // Fallback to mock key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'The Jewel Studio',
        description: 'Luxury Fine Jewellery',
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            
            const verifyData = await verifyRes.json();
            
            if (verifyData.status === 'success') {
              toast.success('Payment successful!');
              clearCart();
              navigate('/order-confirmation', { state: { orderId: orderData.id } });
            } else {
              toast.error('Payment verification failed');
            }
          } catch (err) {
            toast.error('Payment verification error');
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#1A1A1A', // Charcoal
        },
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response: any) {
        toast.error('Payment failed: ' + response.error.description);
      });
      
      paymentObject.open();

    } catch (error) {
      console.error(error);
      toast.error('Something went wrong during checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && !isProcessing) return null;

  return (
    <div className="min-h-screen bg-cream pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-center mb-12 text-gray-500 gap-2">
          <Lock className="w-4 h-4" />
          <span className="uppercase tracking-widest text-sm font-semibold">Secure Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-12 bg-white p-8 shadow-sm">
              {/* Contact Info */}
              <section>
                <h3 className="font-playfair text-2xl text-charcoal mb-6 pb-2 border-b border-gray-100">Contact Information</h3>
                <div className="space-y-4">
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} label="Email Address" required placeholder="example@email.com" />
                  <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} label="Phone Number" required placeholder="+91 9876543210" />
                </div>
              </section>

              {/* Shipping Info */}
              <section>
                <h3 className="font-playfair text-2xl text-charcoal mb-6 pb-2 border-b border-gray-100">Shipping Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input name="firstName" value={formData.firstName} onChange={handleChange} label="First Name" required placeholder="Jane" />
                  <Input name="lastName" value={formData.lastName} onChange={handleChange} label="Last Name" required placeholder="Doe" />
                  <div className="col-span-2">
                    <Input name="address" value={formData.address} onChange={handleChange} label="Full Address" required placeholder="123 Luxury Ave, Apt 4B" />
                  </div>
                  <Input name="city" value={formData.city} onChange={handleChange} label="City" required placeholder="Mumbai" />
                  <Input name="state" value={formData.state} onChange={handleChange} label="State" required placeholder="Maharashtra" />
                  <Input name="pincode" value={formData.pincode} onChange={handleChange} label="Pincode" required placeholder="400001" />
                  <Input name="country" value={formData.country} onChange={handleChange} label="Country" required placeholder="India" disabled />
                </div>
              </section>

              {/* Payment Info */}
              <section>
                <h3 className="font-playfair text-2xl text-charcoal mb-6 pb-2 border-b border-gray-100">Payment Details</h3>
                <div className="flex items-center gap-4 bg-gray-50 p-6 border border-gray-200">
                  <CreditCard className="w-8 h-8 text-gold" />
                  <div>
                    <p className="font-medium text-charcoal text-lg">Razorpay Secure Checkout</p>
                    <p className="text-gray-500 text-sm mt-1">Pay via UPI, Cards, NetBanking, or Wallets securely.</p>
                  </div>
                </div>
              </section>

              <Button
                type="submit"
                className="w-full h-14 text-lg bg-royal hover:bg-royal-dark text-white uppercase tracking-widest font-semibold"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Pay ${formatPrice(totalPrice)}`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 shadow-sm sticky top-24">
              <h3 className="font-playfair text-2xl text-charcoal mb-6 pb-2 border-b border-gray-100">Order Summary</h3>
              
              <div className="flex flex-col gap-6 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-20 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute -top-2 -right-2 bg-gray-200 text-charcoal text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex flex-col flex-grow justify-between py-1 text-sm">
                      <span className="font-playfair font-medium text-charcoal">{item.product.name}</span>
                      <span className="text-gray-500">{formatPrice(item.product.price)}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col gap-4 text-sm pt-6 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Express Shipping</span>
                  <span className="text-green-600">Complimentary</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-2">
                  <span className="font-playfair text-xl text-charcoal font-bold">Total</span>
                  <span className="text-2xl font-medium text-charcoal">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
