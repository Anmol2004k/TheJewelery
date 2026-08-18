import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PageTransition } from './components/PageTransition';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'motion/react';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { Wishlist } from './pages/Wishlist';
import { Auth } from './pages/Auth';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { ShippingReturns } from './pages/ShippingReturns';
import { JewelleryCare } from './pages/JewelleryCare';
import { FAQ } from './pages/FAQ';
import { OurCraft } from './pages/OurCraft';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/shop" element={<PageTransition><Shop /></PageTransition>} />
            <Route path="/product/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
            <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
            <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
            <Route path="/order-confirmation" element={<PageTransition><OrderConfirmation /></PageTransition>} />
            <Route path="/wishlist" element={<PageTransition><Wishlist /></PageTransition>} />
            <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
            <Route path="/terms" element={<PageTransition><TermsOfService /></PageTransition>} />
            <Route path="/shipping-returns" element={<PageTransition><ShippingReturns /></PageTransition>} />
            <Route path="/jewellery-care" element={<PageTransition><JewelleryCare /></PageTransition>} />
            <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
            <Route path="/our-craft" element={<PageTransition><OurCraft /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <Toaster 
        position="bottom-right" 
        toastOptions={{ 
          style: { 
            background: '#1A1A1A', 
            color: '#fff', 
            borderRadius: '0',
            fontFamily: '"Montserrat", sans-serif',
            fontSize: '14px',
            border: '1px solid #D4AF37'
          } 
        }} 
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <CartProvider>
        <WishlistProvider>
          <AppContent />
        </WishlistProvider>
      </CartProvider>
    </Router>
  );
}
