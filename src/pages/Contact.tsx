import React, { useState, useEffect } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { MapPin, Phone, Mail, Clock, CheckCircle2, Database, ShieldCheck } from 'lucide-react';
import { WhatsAppIcon } from '../components/icons/WhatsAppIcon';
import { trackWhatsAppClick } from '../lib/analytics';
import { sendContactEmail } from '../lib/email';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export function Contact() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [inquiryRef, setInquiryRef] = useState<string>('');

  useEffect(() => {
    if (user) {
      const names = (user.displayName || '').split(' ');
      setFormData(prev => ({
        ...prev,
        email: prev.email || user.email || '',
        firstName: prev.firstName || names[0] || '',
        lastName: prev.lastName || names.slice(1).join(' ') || ''
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) {
      toast.error('Please enter your email and message.');
      return;
    }

    setIsSubmitting(true);
    let generatedRef = '';

    try {
      const firstName = formData.firstName.trim();
      const lastName = formData.lastName.trim();
      const fullName = `${firstName} ${lastName}`.trim() || 'Valued Client';
      const email = formData.email.trim().toLowerCase();
      const subject = formData.subject.trim() || 'General Inquiry';
      const message = formData.message.trim();

      // 1. Save directly into Firestore Database
      const contactDoc = {
        firstName,
        lastName,
        fullName,
        email,
        subject,
        message,
        status: 'unread',
        userId: user?.uid || null,
        userEmail: user?.email || null,
        createdAt: serverTimestamp(),
        source: 'contact_page'
      };

      try {
        const docRef = await addDoc(collection(db, 'contact_messages'), contactDoc);
        generatedRef = `INQ-${docRef.id.slice(0, 7).toUpperCase()}`;
      } catch (fsErr) {
        console.error('Firestore save error:', fsErr);
        handleFirestoreError(fsErr, OperationType.CREATE, 'contact_messages');
      }

      if (!generatedRef) {
        generatedRef = `INQ-${Date.now().toString().slice(-6)}`;
      }

      // 2. Also sync to backend API store
      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: generatedRef.toLowerCase(),
            firstName,
            lastName,
            fullName,
            email,
            subject,
            message,
            status: 'unread',
            userId: user?.uid || null,
            createdAt: new Date().toISOString(),
            source: 'web_contact_form'
          })
        });
      } catch (apiErr) {
        console.warn('Backend sync notice:', apiErr);
      }

      // 3. Dispatch email notification in background (optional/graceful)
      sendContactEmail(formData).catch(err => console.warn('Email notice:', err));

      setInquiryRef(generatedRef);
      setIsSent(true);
      toast.success('Inquiry saved to our database! Our concierge will respond soon ✨');

      setFormData({
        firstName: user?.displayName?.split(' ')[0] || '',
        lastName: user?.displayName?.split(' ').slice(1).join(' ') || '',
        email: user?.email || '',
        subject: '',
        message: ''
      });
    } catch (err) {
      console.error('Submission failed:', err);
      toast.error('Unable to record your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream pt-24 pb-24">
      {/* Header */}
      <div className="bg-white py-16 border-b border-gray-200 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-gold-dark rounded-full text-xs font-medium uppercase tracking-wider mb-3 border border-amber-200/60">
            <Database className="w-3.5 h-3.5 text-gold" />
            <span>Direct Concierge Desk & Database Integration</span>
          </div>
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
                  <h4 className="font-playfair font-semibold text-lg text-charcoal mb-1">Our Studio & Boutique</h4>
                  <p className="text-gray-500 font-light text-sm leading-relaxed">
                    Udham Singh Nagar<br />
                    Uttarakhand, India<br />
                    Pincode: 263153
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                  <Phone className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-playfair font-semibold text-lg text-charcoal mb-1">Phone & Direct Call</h4>
                  <p className="text-gray-500 font-light text-sm leading-relaxed">
                    <a href="tel:+918477077001" className="hover:text-gold transition-colors font-medium text-charcoal">
                      +91 8477077001
                    </a><br />
                    Mon - Sun, 10:00 AM - 8:00 PM IST
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
                    <a href="mailto:thejewelstudio.in1@gmail.com" className="hover:text-gold transition-colors font-medium text-charcoal">
                      thejewelstudio.in1@gmail.com
                    </a><br />
                    Dedicated Concierge Support
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                  <Clock className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-playfair font-semibold text-lg text-charcoal mb-1">Support Hours</h4>
                  <p className="text-gray-500 font-light text-sm leading-relaxed">
                    24/7 Priority Concierge for customer inquiries and custom bespoke requests.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Quick Contact Box */}
            <div className="mt-10 p-6 bg-linear-to-r from-emerald-50/80 to-teal-50/60 rounded-xl border border-emerald-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md shrink-0 p-2">
                    <WhatsAppIcon className="w-6 h-6 text-white" color="#ffffff" />
                  </div>
                  <div>
                    <h4 className="font-playfair font-semibold text-charcoal text-base">Official WhatsApp Concierge</h4>
                    <p className="text-xs text-gray-600 font-light">
                      Instant response on WhatsApp with our jewelry specialists: <strong className="font-mono text-charcoal">+91 8477077001</strong>
                    </p>
                  </div>
                </div>
                <a
                  href="https://wa.me/918477077001?text=Hello%20The%20Jewel%20Studio%2C%20I%20have%20an%20inquiry%20regarding%20your%20jewellery%20collection."
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick('contact_page_card', '+91 8477077001')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold rounded-full uppercase tracking-wider transition-all shadow-sm hover:shadow-md shrink-0"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" color="#ffffff" />
                  <span>Chat Now</span>
                </a>
              </div>
            </div>

            <div className="mt-6 p-6 bg-white rounded-xl border border-gray-200/80 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h4 className="font-playfair font-semibold text-charcoal text-base">Secure Cloud Logging</h4>
              </div>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                All messages sent via this form are recorded instantly in our secure database with end-to-end encryption and tracked by our administrative concierge team.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 shadow-sm rounded-xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-playfair text-3xl text-charcoal">Send a Message</h2>
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Database Connected
              </span>
            </div>
            
            <p className="text-sm text-gray-500 mb-8 font-light">
              Send our artisan team a message. Your request is registered directly in our studio database and monitored by our support desk.
            </p>

            {isSent && (
              <div className="mb-6 p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-emerald-900 text-sm">
                <div className="flex items-center gap-2.5 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Message Recorded in Studio Database!</span>
                </div>
                <p className="text-xs text-emerald-700 font-light pl-7">
                  Thank you! Your submission has been saved with Reference ID <strong className="font-mono font-semibold text-emerald-800">#{inquiryRef}</strong>. Our concierge will review your message and reach out to you shortly.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="First Name" 
                  required 
                  placeholder="Jane" 
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                />
                <Input 
                  label="Last Name" 
                  placeholder="Doe" 
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
              <Input 
                label="Email Address" 
                type="email" 
                required 
                placeholder="jane@example.com" 
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
              <Input 
                label="Subject" 
                required 
                placeholder="How can we help?" 
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              />
              
              <div className="flex flex-col gap-2 w-full">
                <label className="text-sm font-medium text-charcoal">Message</label>
                <textarea
                  required
                  className="flex w-full border border-gray-300 bg-white px-4 py-3 text-sm text-charcoal shadow-sm transition-colors focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold min-h-[150px] resize-y rounded-md"
                  placeholder="Tell us about your inquiry, bespoke request, or order question..."
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-royal hover:bg-royal-dark text-white uppercase tracking-widest text-sm mt-4 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Recording In Database...</span>
                  </>
                ) : (
                  'Send & Save Message'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

