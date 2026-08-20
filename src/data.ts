import type { Product, Testimonial } from './types';

// Importing the generated images using standard Vite assets imports
import heroBanner from './assets/images/hero_banner_1787065526460.jpg';
import productRing from './assets/images/product_ring_1787065538690.jpg';
import productNecklace from './assets/images/product_necklace_1787065551283.jpg';
import productEarrings from './assets/images/product_earrings_1787065562831.jpg';
import productBracelet from './assets/images/product_bracelet_1787065575084.jpg';

// UGC images for testimonials
import ugcNecklace from './assets/images/ugc_necklace_1787066630821.jpg';
import ugcRing from './assets/images/ugc_ring_1787066645865.jpg';
import ugcEarrings from './assets/images/ugc_earrings_1787066660576.jpg';

export const IMAGES = {
  hero: heroBanner,
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Eleanor V.',
    text: '"The craftsmanship is simply unparalleled. I wore the diamond pendant to a charity gala, and it caught the light—and everyone\'s attention—all evening."',
    image: ugcNecklace,
    productInfo: 'Aura Diamond Pendant'
  },
  {
    id: 't2',
    name: 'Sophie M.',
    text: '"My fiancée completely surprised me with the Imperial Sapphire. It is the most exquisite ring I have ever seen. It feels both vintage and incredibly modern."',
    image: ugcRing,
    productInfo: 'Imperial Sapphire Ring'
  },
  {
    id: 't3',
    name: 'Clara J.',
    text: '"I bought these drops for my wedding day, and they were the perfect touch of elegance. I now wear them whenever I need a little extra confidence."',
    image: ugcEarrings,
    productInfo: 'Celestial Drop Earrings'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'The Imperial Sapphire Ring',
    price: 382500, // 4500 * 85
    category: 'Rings',
    image: productRing,
    description: 'A stunning center sapphire embraced by brilliant-cut diamonds on a platinum band. Exudes timeless elegance.',
    isNew: true,
    featured: true,
  },
  {
    id: '2',
    name: 'Aura Diamond Pendant',
    price: 238000,
    category: 'Necklaces',
    image: productNecklace,
    description: 'A delicate gold pendant featuring a solitaire diamond that catches the light from every angle. Suspended on a fine 18k gold chain.',
    featured: true,
  },
  {
    id: '3',
    name: 'Celestial Drop Earrings',
    price: 272000,
    category: 'Earrings',
    image: productEarrings,
    description: 'Classic diamond drop earrings that cascade gracefully. Perfect for adding a touch of sophisticated glamour to evening wear.',
    featured: true,
  },
  {
    id: '4',
    name: 'Lumina Tennis Bracelet',
    price: 578000,
    category: 'Bracelets',
    image: productBracelet,
    description: 'A continuous line of perfectly matched diamonds set in delicate rose gold. A true statement piece for any collection.',
    isNew: true,
  },
  // Adding a few more mocked products using the same images for layout purposes
  {
    id: '5',
    name: 'Eternity Diamond Band',
    price: 165750,
    category: 'Rings',
    image: productRing, // Reusing image for mockup
    description: 'A full circle of flawless diamonds set in 18k white gold. Symbolizes never-ending love and commitment.',
  },
  {
    id: '6',
    name: 'Pearl & Gold Collar',
    price: 263500,
    category: 'Necklaces',
    image: productNecklace,
    description: 'Lustrous South Sea pearls interspersed with textured gold links. A modern twist on a classic design.',
  },
  {
    id: '7',
    name: 'Midnight Onyx Studs',
    price: 102000,
    category: 'Earrings',
    image: productEarrings,
    description: 'Deep black onyx surrounded by a halo of micropavé diamonds. Bold, chic, and incredibly versatile.',
  },
  {
    id: '8',
    name: 'Woven Gold Cuff',
    price: 357000,
    category: 'Bracelets',
    image: productBracelet,
    description: 'Intricately woven 18k yellow gold creating a substantial yet comfortable cuff. Inspired by vintage Italian craftsmanship.',
    featured: true,
  },
  {
    id: '9',
    name: 'Classic Gold Watch',
    price: 450000,
    category: 'Watches',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&auto=format&fit=crop',
    description: 'A timeless timepiece featuring a solid 18k gold case and a genuine leather strap. Swiss automatic movement.',
    rating: 4.8
  },
  {
    id: '10',
    name: 'Royal Blue Chronograph',
    price: 520000,
    category: 'Watches',
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=600&auto=format&fit=crop',
    description: 'Precision chronograph with a striking royal blue dial and stainless steel mesh band. Built for elegance and performance.',
    rating: 4.9,
    featured: true
  },
  {
    id: '11',
    name: 'Elegant Rose Gold Watch',
    price: 380000,
    category: 'Watches',
    image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=600&auto=format&fit=crop',
    description: 'Minimalist dial encased in beautifully polished rose gold. Perfect for daily wear or evening occasions.',
    rating: 4.7
  },
  {
    id: '12',
    name: 'Minimal Silver Watch',
    price: 290000,
    category: 'Watches',
    image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=600&auto=format&fit=crop',
    description: 'Ultra-thin silver case with a clean white dial and classic Roman numerals.',
    rating: 4.5
  },
  {
    id: '13',
    name: 'Birthday Gift Box',
    price: 15000,
    category: 'Gifts',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop',
    description: 'A beautifully curated box of small luxuries perfect for celebrating a special birthday.',
    rating: 4.9,
    from: 'The Jewel Studio',
    to: 'Someone Special'
  },
  {
    id: '14',
    name: 'Anniversary Gift Set',
    price: 45000,
    category: 'Gifts',
    image: 'https://images.unsplash.com/photo-1577057864434-2e9ee6062f4c?q=80&w=600&auto=format&fit=crop',
    description: 'Celebrate years of love with this premium anniversary set featuring a curated pairing of fine accessories.',
    rating: 5.0,
    from: 'With Love',
    to: 'My Forever',
    featured: true
  },
  {
    id: '15',
    name: 'Rakhi Gift Box',
    price: 8500,
    category: 'Gifts',
    image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=600&auto=format&fit=crop',
    description: 'A traditional yet modern gift box crafted specially for the sibling bond.',
    rating: 4.8,
    from: 'Your Loving Sister',
    to: 'My Dear Brother'
  },
  {
    id: '16',
    name: 'Luxury Surprise Box',
    price: 25000,
    category: 'Gifts',
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=600&auto=format&fit=crop',
    description: 'An exquisite collection of small surprises, elegantly wrapped for that perfect moment.',
    rating: 4.9,
    from: 'Someone Special',
    to: 'You'
  }
];
