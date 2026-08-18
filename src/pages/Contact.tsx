import React from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for reaching out. We will get back to you shortly.');
  };

  return (
    <div className="min-h-screen bg-cream pt-24 pb-24">
      {/* Header */}
      <div className="bg-white py-16 border-b border-gray-200 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-playfair text-4xl md:text-5xl text-charcoal mb-4">
            Contact Us
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto font-light">
            We are here to assist you with any inquiries regarding our collections, bespoke services, or your recent order.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <h2 className="font-playfair text-3xl text-charcoal mb-8">Get in Touch</h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                  <MapPin className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-playfair font-semibold text-lg text-charcoal mb-1">Our Flagship Boutique</h4>
                  <p className="text-gray-500 font-light text-sm leading-relaxed">
                    742 Luxury Avenue<br />
                    New York, NY 10001<br />
                    United States
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                  <Phone className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-playfair font-semibold text-lg text-charcoal mb-1">Phone</h4>
                  <p className="text-gray-500 font-light text-sm leading-relaxed">
                    +1 (212) 555-0199<br />
                    Mon - Fri, 9am - 6pm EST
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                  <Mail className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-playfair font-semibold text-lg text-charcoal mb-1">Email</h4>
                  <p className="text-gray-500 font-light text-sm leading-relaxed">
                    concierge@thejewelstudio.com<br />
                    press@thejewelstudio.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 shadow-sm">
            <h2 className="font-playfair text-3xl text-charcoal mb-8">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="First Name" required placeholder="Jane" />
                <Input label="Last Name" required placeholder="Doe" />
              </div>
              <Input label="Email Address" type="email" required placeholder="jane@example.com" />
              <Input label="Subject" required placeholder="How can we help?" />
              
              <div className="flex flex-col gap-2 w-full">
                <label className="text-sm font-medium text-charcoal">Message</label>
                <textarea
                  required
                  className="flex w-full border border-gray-300 bg-white px-4 py-3 text-sm text-charcoal shadow-sm transition-colors focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold min-h-[150px] resize-y"
                  placeholder="Your message here..."
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-royal hover:bg-royal-dark text-white uppercase tracking-widest text-sm mt-4"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
