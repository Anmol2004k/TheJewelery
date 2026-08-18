import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { PenTool, Hammer, Search, ShieldCheck, Gem } from 'lucide-react';

// Images
import craftHero from '../assets/images/craft_hero_1787068831544.jpg';
import macroDetails from '../assets/images/macro_details_1787068846681.jpg';
import materialsGold from '../assets/images/materials_gold_1787068861166.jpg';

const JOURNEY_STEPS = [
  { icon: PenTool, title: 'Vision & Design', desc: 'Every piece begins as an inspired sketch, translating emotion into geometry.' },
  { icon: Hammer, title: 'Handcrafted Form', desc: 'Master artisans shape raw precious metals, heating and hammering them into life.' },
  { icon: Search, title: 'Meticulous Detailing', desc: 'Under intense magnification, every curve, prong, and edge is refined to perfection.' },
  { icon: ShieldCheck, title: 'Quality Check', desc: 'Rigorous inspection ensures structural integrity, balance, and flawlessness.' },
  { icon: Gem, title: 'Finished Jewel', desc: 'The stones are set, the metal is polished, and a masterpiece is born.' },
];

export function OurCraft() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Our Craft - Handmade Jewellery & Artisans",
    "description": "Discover the artisan craftsmanship behind The Jewel Studio's handcrafted jewellery.",
    "publisher": {
      "@type": "Organization",
      "name": "The Jewel Studio"
    }
  };

  return (
    <div className="bg-cream min-h-screen">
      <SEO 
        title="Our Craft | Handmade Jewellery"
        description="Explore the artistry behind The Jewel Studio. From ethically sourced materials to master artisans, discover our handcrafted jewellery process."
        keywords="handmade jewellery, handcrafted jewellery, jewellery artisans, artisan craftsmanship, bespoke jewelry design, luxury jewelry making"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Cinematic Hero */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            src={craftHero}
            alt="Master artisan crafting a luxury diamond necklace"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-charcoal/40" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-playfair text-5xl md:text-7xl text-white mb-6"
          >
            The Hands Behind Every Jewel
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="w-24 h-[1px] bg-gold mx-auto mb-6"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-white/90 text-lg md:text-xl font-light tracking-wide"
          >
            A dedication to traditional artisan craftsmanship and uncompromising luxury.
          </motion.p>
        </div>
      </section>

      {/* Animated Craft Journey */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="font-playfair text-4xl text-charcoal mb-4">The Artisan Craftsmanship Journey</h2>
            <p className="text-gray-500 font-light max-w-2xl mx-auto">
              Creating fine handcrafted jewellery is an intimate dance between the artist and the elements. We never rush perfection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-4 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-[1px] bg-gray-200 z-0" />
            
            {JOURNEY_STEPS.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-6 group-hover:border-gold transition-colors duration-500 shadow-sm">
                  <step.icon className="w-8 h-8 text-gold" strokeWidth={1.5} />
                </div>
                <h3 className="font-playfair text-xl text-charcoal mb-3">{step.title}</h3>
                <p className="text-sm text-gray-500 font-light leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Macro Details Section */}
      <section className="py-24 bg-charcoal text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="aspect-square w-full"
            >
              <img 
                src={macroDetails} 
                alt="Macro details of handcrafted diamond ring in 18k gold" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-playfair text-4xl mb-6 text-white">Precision in Every Facet</h2>
              <h3 className="text-gold tracking-widest uppercase text-sm mb-6">Our Master Jewellery Artisans</h3>
              <p className="text-white/70 font-light leading-relaxed mb-6">
                True luxury is found in the microscopic details that machines simply cannot replicate. Our master jewellery artisans employ techniques passed down through generations, utilizing specialized loupes and gravers to achieve absolute symmetry.
              </p>
              <p className="text-white/70 font-light leading-relaxed">
                When you view a piece of our handcrafted jewellery under magnification, you'll see prongs that are perfectly rounded and polished, ensuring maximum light return to the gemstone. It is this invisible labour of love that gives our pieces their breathtaking, signature fire.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <h2 className="font-playfair text-4xl mb-6 text-charcoal">Finest Materials & Quality</h2>
              <p className="text-gray-600 font-light leading-relaxed mb-6">
                Uncompromising artisan craftsmanship demands uncompromising materials. We source only the purest 18-karat gold, platinum, and conflict-free gemstones. Our artisans work closely with gemologists to ensure that every raw stone possesses exceptional clarity and color before it ever reaches the workbench.
              </p>
              <p className="text-gray-600 font-light leading-relaxed">
                By maintaining strict quality controls over both our raw materials and our crafting processes, we guarantee that every piece is not just a stunning adornment, but a durable heirloom designed to withstand the test of time.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2 aspect-[4/3] w-full bg-white shadow-xl p-4"
            >
              <img 
                src={materialsGold} 
                alt="18k gold ingots and raw diamonds on velvet" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Strong CTA */}
      <section className="py-32 bg-white text-center border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <Gem className="w-12 h-12 text-gold mx-auto mb-8" strokeWidth={1} />
            <h2 className="font-playfair text-4xl md:text-5xl text-charcoal mb-6">
              Experience the Craft
            </h2>
            <p className="text-gray-500 font-light text-lg mb-10 max-w-xl mx-auto">
              Now that you know the story behind our artisan craftsmanship, discover the finished masterpieces waiting for you.
            </p>
            <Link 
              to="/shop" 
              className="inline-block bg-charcoal text-white font-semibold uppercase tracking-widest text-sm px-12 py-4 hover:bg-gold transition-colors duration-300"
            >
              Explore Our Jewellery
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
