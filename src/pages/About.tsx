import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';

// Assets
import workshopHands from '../assets/images/workshop_hands_1787067434390.jpg';
import workshopDesk from '../assets/images/workshop_desk_1787067453556.jpg';

export function About() {
  return (
    <div className="min-h-screen bg-cream pt-24 pb-24">
      {/* Header */}
      <div className="bg-white py-16 border-b border-gray-200 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-playfair text-4xl md:text-5xl text-charcoal mb-4">
            Our Heritage
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto font-light">
            A legacy of elegance, built on decades of uncompromising craftsmanship and an undying passion for fine jewellery.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Our Story Content */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 md:order-1"
            >
              <h2 className="font-playfair text-3xl text-charcoal mb-6">A Tradition of Brilliance</h2>
              <p className="text-gray-600 font-light leading-relaxed mb-6">
                Founded in 1995, The Jewel Studio was born from a singular vision: to create pieces that transcend time. What began as a small boutique in the heart of Geneva has blossomed into a globally recognized symbol of luxury, without ever losing its intimate soul.
              </p>
              <p className="text-gray-600 font-light leading-relaxed">
                We believe that true luxury lies in the details. Every gemstone is ethically sourced, hand-selected for its fire and brilliance, and set into designs that celebrate both traditional elegance and modern sophistication.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 md:order-2 aspect-[4/5] bg-gray-100 overflow-hidden relative"
            >
              <img
                src={workshopDesk}
                alt="Jewellery Designer's Desk"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </section>

        {/* Artisan Story Section */}
        <section className="bg-white p-8 md:p-16 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="aspect-[4/3] md:aspect-square bg-gray-100 overflow-hidden"
            >
              <img
                src={workshopHands}
                alt="Artisan hands setting a diamond"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              <h3 className="uppercase tracking-[0.2em] text-gold font-semibold text-xs mb-4">The Artisan's Touch</h3>
              <h2 className="font-playfair text-3xl md:text-4xl text-charcoal mb-6">Handmade Perfection</h2>
              <p className="text-gray-600 font-light leading-relaxed mb-6">
                Mass production has no place in our atelier. Every single piece bearing The Jewel Studio name is entirely handmade by our master artisans. From the initial conceptual sketch to the final, meticulous polishing of a diamond setting, human hands guide every step of the journey.
              </p>
              <p className="text-gray-600 font-light leading-relaxed mb-8">
                Our craftsmen undergo years of rigorous apprenticeship, mastering ancient metalworking techniques alongside cutting-edge precision tools. This dedication ensures that each piece is not merely a product, but a unique work of art imbued with character and soul.
              </p>
              
              <div>
                <Link to="/shop">
                  <Button className="bg-royal hover:bg-royal-dark text-white uppercase tracking-widest text-sm h-12 px-8">
                    Discover Our Craft
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
