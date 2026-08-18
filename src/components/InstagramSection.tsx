import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Heart, MessageCircle } from 'lucide-react';

// Import generated images
import ig1 from '../assets/images/ig_model_earrings_1787069850773.jpg';
import ig2 from '../assets/images/ig_layered_necklaces_1787069876307.jpg';
import ig3 from '../assets/images/ig_sketching_bts_1787069891265.jpg';
import ig4 from '../assets/images/ig_ring_box_1787069914889.jpg';

const IG_POSTS = [
  { id: 1, img: ig1, likes: '2.4k', comments: '128' },
  { id: 2, img: ig2, likes: '3.1k', comments: '245' },
  { id: 3, img: ig3, likes: '1.8k', comments: '86' },
  { id: 4, img: ig4, likes: '4.5k', comments: '312' },
];

export function InstagramSection() {
  return (
    <section className="py-24 bg-white overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <motion.a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-lg mb-8 group"
          >
            <Instagram className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" strokeWidth={1.5} />
          </motion.a>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-playfair text-4xl text-charcoal mb-4"
          >
            Follow The Jewel Studio
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 font-light max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Join our community for new arrivals, jewellery trends, styling inspiration, and an exclusive behind-the-scenes look at our artisan crafting process.
          </motion.p>
          
          <motion.a 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-b-2 border-charcoal pb-1 text-charcoal font-semibold uppercase tracking-widest text-sm hover:text-gold hover:border-gold transition-colors duration-300"
          >
            @TheJewelStudio
          </motion.a>
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {IG_POSTS.map((post, i) => (
            <motion.a
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
              className="group relative aspect-square overflow-hidden bg-cream cursor-pointer rounded-sm"
            >
              <img 
                src={post.img} 
                alt={`Instagram post ${post.id}`} 
                className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110" 
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-6 backdrop-blur-[2px]">
                <div className="flex items-center gap-2 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                  <Heart className="w-5 h-5 fill-white" />
                  <span className="font-medium tracking-wide">{post.likes}</span>
                </div>
                <div className="flex items-center gap-2 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span className="font-medium tracking-wide">{post.comments}</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
