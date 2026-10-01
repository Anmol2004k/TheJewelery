import type { Product, Testimonial } from './types';

// Importing local high-resolution jewelry assets
import heroBanner from './assets/images/hero_banner_1787065526460.jpg';
import ugcNecklace from './assets/images/ugc_necklace_1787066630821.jpg';
import ugcRing from './assets/images/ugc_ring_1787066645865.jpg';
import ugcEarrings from './assets/images/ugc_earrings_1787066660576.jpg';

import productRing from './assets/images/product_ring_1787065538690.jpg';
import productNecklace from './assets/images/product_necklace_1787065551283.jpg';
import productEarrings from './assets/images/product_earrings_1787065562831.jpg';
import productBr1 from './assets/images/monstera-bloom-cuff.png';
import productBr2 from './assets/images/the-charm-evil-eye-cable-bangle.png';
import productBr3 from './assets/images/the-golden-bamboo-bangle.png';
import productBr4 from './assets/images/the-golden-nail-cuff.png';
import productBr5 from './assets/images/the-evil-eye-cable-bangle.png';
import productBr6 from './assets/images/the-flow-cuff.png';
import productBr7 from './assets/images/the-icon-crystal-bangle.png';
import productBr8 from './assets/images/the-orbit-nail-cuff.png';



export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  Rings: productRing,
  Necklaces: productNecklace,
  Earrings: productEarrings,
  Bracelets: productBr1,
  Watches: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&auto=format&fit=crop',
  Gifts: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop',
};

export function getCategoryFallback(category?: string): string {
  if (category && CATEGORY_FALLBACK_IMAGES[category]) {
    return CATEGORY_FALLBACK_IMAGES[category];
  }
  return productNecklace;
}

export const IMAGES = {
  hero: heroBanner,
  productRing,
  productNecklace,
  productEarrings,
   
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Eleanor V.',
    text: '"The craftsmanship is simply unparalleled. I wore the clover charm necklace and matching earrings to an evening gala, and it caught everyone\'s attention."',
    image: ugcNecklace,
    productInfo: 'Clover Charm Necklace & Earrings'
  },
  {
    id: 't2',
    name: 'Sophie M.',
    text: '"The gold-plated anti-tarnish rings and bracelets have been through daily showers and workouts without losing an ounce of luster. Incredible quality for the price."',
    image: ugcRing,
    productInfo: 'Gold-Plated Anti-Tarnish Ring'
  },
  {
    id: 't3',
    name: 'Clara J.',
    text: '"The peacock jhumka and pearl bow earrings are simply breathtaking. The detailing is so delicate, and they feel feather-light on the ears."',
    image: ugcEarrings,
    productInfo: 'Peacock Jhumka Earrings'
  }
];

export const PRODUCTS: Product[] = [
  // ==========================================
  // BRACELETS (9 Products)
  // ==========================================
  {
    id: 'br-1',
    name: 'The Charm Evil Eye Cable Bangle',
    price: 499,
    category: 'Bracelets',
    image: productBr2,
    description: 'Protection meets luxury. A twisted cable bangle featuring a stunning evil eye charm.',
    isNew: true,
    featured: true,
    rating: 4.9
  },
  {
    id: 'br-2',
    name: 'Monstera Bloom Cuff Bracelet',
    price: 199,
    category: 'Bracelets',
    image: productBr1 ,
    description: 'Nature-inspired elegance for your wrist. A beautiful statement cuff featuring intricate monstera leaf details.',
    featured: true,
    rating: 4.8
  },
  {
    id: 'br-3',
    name: 'The Golden Bamboo Bangle ',
    price: 149,
    category: 'Bracelets',
    image:  productBr3,
    description: 'Earthy texture meets high fashion. A textured gold bangle inspired by the organic beauty of bamboo.',
    rating: 4.9
  },
  {
    id: 'br-4',
    name: 'The Golden Nail Cuff Bracelet',
    price: 149,
    category: 'Bracelets',
    image:  productBr4,
    description:'Bold, edgy, and iconic. A sleek industrial-style nail cuff for a confident look.',
    rating: 4.7
  },
  {
    id: 'br-5',
    name: 'The Evil Eye Cable Bangle gold',
    price: 299,
    category: 'Bracelets',
    image:  productBr5,
    description: 'Sleek, minimalist protection. A contemporary cable bangle with an embedded evil eye motif.',
    rating: 4.8
  },
  {
    id: 'br-6',
    name: 'The Flow Cuff Bracelet',
    price: 199,
    category: 'Bracelets',
    image:  productBr6,
    description: 'Fluid elegance and modern minimalism. A sleek, wavy cuff that mimics natural movement.',
    featured: true,
    rating: 4.9
  },
  {
    id: 'br-7',
    name: 'The Icon Crystal Bangle',
    price: 159,
    category: 'Bracelets',
    image: productBr7,
    description: 'Timeless sparkle and glamour. A luxurious bangle studded with premium, shimmering crystals.',
    rating: 4.8
  },
  {
    id: 'br-8',
    name: 'The Orbit Nail Cuff ',
    price: 449,
    category: 'Bracelets',
    image:  productBr8,
    description: 'A futuristic twist on a classic design. An interlocking nail cuff with an outer orbit ring.',
    isNew: true,
    rating: 4.9
  },
  
  
  {
    id: 'br-10',
    name: 'The Evil Eye Cable Bangle Silver',
    price: 299,
    category: 'Bracelets',
    image:  productBr5,
    description: 'Sleek, minimalist protection. A contemporary cable bangle with an embedded evil eye motif. color - Silver',
    rating: 4.8
  },
  
   {
    id: 'br-11',
    name: 'The Evil Eye Cable Bangle Rose',
    price: 299,
    category: 'Bracelets',
    image:  productBr5,
    description: 'Sleek, minimalist protection. A contemporary cable bangle with an embedded evil eye motif. color Rose',
    rating: 4.8
  },

  // ==========================================
  // NECKLACES (15 Products)
  // ==========================================
  {
    id: 'nk-1',
    name: 'Korean Minimal Pendant Necklace',
    price: 199,
    category: 'Necklaces',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=600&auto=format&fit=crop',
    description: 'Graceful Seoul-inspired geometric bar pendant on an ethereal whisper-thin chain. Ideal for effortless day-to-evening collarbone styling.',
    featured: true,
    rating: 4.9
  },
  {
    id: 'nk-2',
    name: 'Gold-Plated Heart Pendant Necklace',
    price: 249,
    category: 'Necklaces',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop',
    description: 'A luminous mirror-polished heart pendant gracefully sliding along an 18-inch adjustable 18k yellow gold vermeil chain.',
    rating: 4.8
  },
  {
    id: 'nk-3',
    name: 'Clover Charm Necklace',
    price: 301,
    category: 'Necklaces',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=600&auto=format&fit=crop',
    description: 'Iconic four-leaf lucky clover charm with lustrous black enamel and golden beaded perimeter. An enduring symbol of fortune and grace.',
    featured: true,
    isNew: true,
    rating: 5.0
  },
  {
    id: 'nk-4',
    name: 'Boho Multicolor Necklace',
    price: 269,
    category: 'Necklaces',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop',
    description: 'Bohemian festival-ready necklace strung with turquoise, coral, and lapis-toned semi-precious beads accented with textured golden spacers.',
    rating: 4.7
  },
  {
    id: 'nk-5',
    name: 'Layered Gold Chain Necklace',
    price: 299,
    category: 'Necklaces',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=600&auto=format&fit=crop',
    description: 'Effortlessly pre-layered dual necklace featuring a slim herringbone snake chain paired with an elongated paperclip link strand on a single clasp.',
    featured: true,
    rating: 4.9
  },
  {
    id: 'nk-6',
    name: 'Pearl Layered Necklace',
    price: 349,
    category: 'Necklaces',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
    description: 'Cascading tiers of hand-knotted freshwater-style faux pearls combined with delicate gilded cable chains for royal sophistication.',
    rating: 4.8
  },
  {
    id: 'nk-7',
    name: 'Evil Eye Pendant Necklace',
    price: 229,
    category: 'Necklaces',
    image: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?q=80&w=600&auto=format&fit=crop',
    description: 'Mediterranean spiritual talisman pendant inset with deep blue sapphire glass and sparkling micropavé halo on a 16-inch chain.',
    rating: 4.9
  },
  {
    id: 'nk-8',
    name: 'Butterfly Pendant Necklace',
    price: 219,
    category: 'Necklaces',
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=600&auto=format&fit=crop',
    description: 'Delicate sculpted butterfly pendant with subtle crystal accents on the wings, evoking elegance, metamorphosis, and natural freedom.',
    rating: 4.8
  },
  {
    id: 'nk-9',
    name: 'CZ Stone Statement Necklace',
    price: 399,
    category: 'Necklaces',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=600&auto=format&fit=crop',
    description: 'A dazzling red-carpet statement piece set with pear and emerald-cut cubic zirconia crystals that radiate unmatched brilliance and fire.',
    featured: true,
    rating: 5.0
  },
  {
    id: 'nk-10',
    name: 'Trendy Western Charm Necklace',
    price: 260,
    category: 'Necklaces',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop',
    description: 'Contemporary western-chic necklace with celestial coin, starburst, and medallion charms suspended from a textured curb chain.',
    rating: 4.7
  },
  {
    id: 'nk-11',
    name: 'Gold-Plated Statement Necklace',
    price: 364,
    category: 'Necklaces',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop',
    description: 'Bold sculptural golden collar necklace engineered to hug the contours of the neckline with seamless fluid movement and polished sheen.',
    isNew: true,
    rating: 4.9
  },
  {
    id: 'nk-12',
    name: 'Floral Pendant Necklace',
    price: 279,
    category: 'Necklaces',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop',
    description: 'Intricately filigreed floral medallion with a sparkling crystal center stone set on a diamond-cut rope chain.',
    rating: 4.8
  },
  {
    id: 'nk-13',
    name: 'Double-Layer Chain Necklace',
    price: 277,
    category: 'Necklaces',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=600&auto=format&fit=crop',
    description: 'Two harmoniously balanced golden chain tiers featuring a box chain choker and a drop lariat chain ending in a polished cylindrical bar.',
    rating: 4.7
  },
  {
    id: 'nk-14',
    name: 'Classic Pearl Necklace',
    price: 399,
    category: 'Necklaces',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=600&auto=format&fit=crop',
    description: 'Timeless strand of uniform 8mm creamy white faux pearls completed with a vintage-inspired 18k gold-plated filigree push clasp.',
    featured: true,
    rating: 4.9
  },
  {
    id: 'nk-15',
    name: 'Peacock Style Choker Necklace',
    price: 377,
    category: 'Necklaces',
    image: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?q=80&w=600&auto=format&fit=crop',
    description: 'Regal heritage choker necklace featuring sculpted peacock plumage adorned with emerald green and sapphire blue stones with dangling pearl drops.',
    isNew: true,
    rating: 5.0
  },

  // ==========================================
  // RINGS (10 Products)
  // ==========================================
  {
    id: 'rg-1',
    name: 'Gold-Plated Stackable Ring',
    price: 249,
    category: 'Rings',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
    description: 'Versatile textured band plated in warm 18k gold. Designed to be worn alone for minimalist chic or stacked together with your favorites.',
    featured: true,
    rating: 4.9
  },
  {
    id: 'rg-2',
    name: 'Korean Adjustable Ring',
    price: 199,
    category: 'Rings',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop',
    description: 'Open-ended flexible sizing ring inspired by Seoul street fashion, featuring dual asymmetrical sphere ends in high-polish gold.',
    rating: 4.8
  },
  {
    id: 'rg-3',
    name: 'CZ Solitaire Ring',
    price: 299,
    category: 'Rings',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
    description: 'A magnificent 2-carat equivalent round brilliant cubic zirconia stone held securely in a six-prong platinum-dipped cathedral setting.',
    featured: true,
    rating: 5.0
  },
  {
    id: 'rg-4',
    name: 'Rose Gold Multicolor Ring',
    price: 288,
    category: 'Rings',
    image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=600&auto=format&fit=crop',
    description: 'Romantic rose gold band inlaid with an array of rainbow pastel baguette crystals that reflect a spectrum of gentle hues.',
    rating: 4.7
  },
  {
    id: 'rg-5',
    name: 'Butterfly Adjustable Ring',
    price: 219,
    category: 'Rings',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop',
    description: 'Charming bypass design featuring two delicately perched butterflies with pavé crystal wings that wrap gracefully around the finger.',
    rating: 4.8
  },
  {
    id: 'rg-6',
    name: 'Heart Couple Ring',
    price: 249,
    category: 'Rings',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
    description: 'Matching companion design with interlocking heart motifs. Smooth comfort-fit inner band with anti-fade electroplating.',
    isNew: true,
    rating: 4.9
  },
  {
    id: 'rg-7',
    name: 'Gold-Plated Anti-Tarnish Ring',
    price: 330,
    category: 'Rings',
    image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=600&auto=format&fit=crop',
    description: 'Premium PVD-coated stainless steel core guaranteed against tarnishing, water, or sweat. Retains rich deep gold hue through everyday adventures.',
    featured: true,
    rating: 5.0
  },
  {
    id: 'rg-8',
    name: 'Emerald Stone Ring',
    price: 299,
    category: 'Rings',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
    description: 'Rich royal forest green emerald-cut centerpiece stone framed by a halo of micro-brilliants on a split shank golden band.',
    rating: 4.8
  },
  {
    id: 'rg-9',
    name: 'Minimal Open Ring',
    price: 179,
    category: 'Rings',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop',
    description: 'Clean architectural open band ring with square edges and high-polish finish. Lightweight, modern, and universally adjustable.',
    rating: 4.7
  },
  {
    id: 'rg-10',
    name: 'Floral Statement Ring',
    price: 269,
    category: 'Rings',
    image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=600&auto=format&fit=crop',
    description: 'An eye-catching sculpted blooming camellia flower with layered gold petals and a cluster of twinkling crystal stamens.',
    rating: 4.9
  },

  // ==========================================
  // EARRINGS (20 Products)
  // ==========================================
  {
    id: 'er-1',
    name: 'Korean Minimal Stud Earrings',
    price: 132,
    category: 'Earrings',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop',
    description: 'Clean geometric square studs with brushed gold finish and hypoallergenic surgical steel posts. Perfect for daily effortless wear.',
    featured: true,
    rating: 4.9
  },
  {
    id: 'er-2',
    name: 'Peacock Jhumka Earrings',
    price: 223,
    category: 'Earrings',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop',
    description: 'Exquisite traditional peacock motif crowning a bell-shaped jhumka decorated with delicate seed pearl hangings and vibrant enamel work.',
    featured: true,
    rating: 5.0
  },
  {
    id: 'er-3',
    name: 'Gold-Plated Dangler Earrings',
    price: 251,
    category: 'Earrings',
    image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=600&auto=format&fit=crop',
    description: 'Dramatic cascading golden teardrops linked together to create kinetic movement that catches the light gracefully as you turn.',
    rating: 4.8
  },
  {
    id: 'er-4',
    name: 'Oxidized Silver Jhumka Earrings',
    price: 159,
    category: 'Earrings',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop',
    description: 'Vintage tribal-inspired antique silver oxidized jhumkas with intricate paisley stamping and tiny chiming ghungroo bells.',
    rating: 4.7
  },
  {
    id: 'er-5',
    name: 'Butterfly Ear Cuff Earrings',
    price: 259,
    category: 'Earrings',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop',
    description: 'No piercing required for the upper cuff! Butterfly stud connected by a fine crystal chain to an adjustable ear cuff that climbs the helix.',
    isNew: true,
    rating: 4.9
  },
  {
    id: 'er-6',
    name: 'Pearl Bow Earrings',
    price: 179,
    category: 'Earrings',
    image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=600&auto=format&fit=crop',
    description: 'Coquette aesthetic gold ribbon bow studs accented with luminous teardrop faux pearl drops. Adds instant charm and elegance.',
    rating: 4.8
  },
  {
    id: 'er-7',
    name: 'Crystal Hoop Earrings',
    price: 229,
    category: 'Earrings',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop',
    description: 'Inside-out pavé crystal hoops measuring 25mm in diameter. Fitted with a secure hinge click-lock closure for comfortable all-day wear.',
    rating: 4.9
  },
  {
    id: 'er-8',
    name: 'Floral Drop Earrings',
    price: 249,
    category: 'Earrings',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop',
    description: 'Multi-tiered golden blossom earrings with textured petals and dangling crystal droplets. Evokes a blooming botanical garden.',
    rating: 4.8
  },
  {
    id: 'er-9',
    name: 'CZ Stone Stud Earrings',
    price: 199,
    category: 'Earrings',
    image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=600&auto=format&fit=crop',
    description: 'Classic 1-carat round brilliant cubic zirconia stones set in 4-prong solid sterling silver bases with double-notched butterfly backings.',
    featured: true,
    rating: 5.0
  },
  {
    id: 'er-10',
    name: 'Long Tassel Drop Earrings',
    price: 229,
    category: 'Earrings',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop',
    description: 'Sleek shoulder-duster chain fringe earrings that shimmer with fluid liquid-gold movement with every step.',
    rating: 4.7
  },
  {
    id: 'er-11',
    name: 'Boho Oxidized Earrings',
    price: 224,
    category: 'Earrings',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop',
    description: 'Artisanal antique-finish chandelier earrings featuring embossed ethnic motifs and turquoise stone cabochon centerpieces.',
    rating: 4.8
  },
  {
    id: 'er-12',
    name: 'Green & Blue Stone Hoop Earrings',
    price: 299,
    category: 'Earrings',
    image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=600&auto=format&fit=crop',
    description: 'Chic dual-tone huggie hoops channel-set with alternating emerald green and ocean blue sapphire crystals.',
    isNew: true,
    rating: 4.9
  },
  {
    id: 'er-13',
    name: 'Gold-Plated Party Earrings',
    price: 298,
    category: 'Earrings',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop',
    description: 'Glamorous fan-shaped statement earrings layered with micro-crystals that catch disco lights and gala chandeliers impeccably.',
    rating: 4.9
  },
  {
    id: 'er-14',
    name: 'Pearl Layered Earchain Earrings',
    price: 186,
    category: 'Earrings',
    image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=600&auto=format&fit=crop',
    description: 'Traditional Kan Chain earrings connecting a floral ear stud to your hair braid with a delicate multi-layered pearl chain.',
    rating: 4.8
  },
  {
    id: 'er-15',
    name: 'Korean Flower Stud Earrings',
    price: 169,
    category: 'Earrings',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop',
    description: 'Sweet white matte enameled daisy blossoms with a golden stamen. A staple in K-drama minimalist aesthetic wardrobes.',
    rating: 4.8
  },
  {
    id: 'er-16',
    name: 'Heart Drop Earrings',
    price: 199,
    category: 'Earrings',
    image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=600&auto=format&fit=crop',
    description: 'Hollow openwork heart silhouettes dangling from polished French wire hooks with a feather-light feel.',
    rating: 4.7
  },
  {
    id: 'er-17',
    name: 'Geometric Hoop Earrings',
    price: 219,
    category: 'Earrings',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop',
    description: 'Modern hexagonal tubular hoops in 18k yellow gold polish. A bold architectural upgrade to traditional circular hoops.',
    rating: 4.9
  },
  {
    id: 'er-18',
    name: 'Traditional Bridal Jhumka Earrings',
    price: 279,
    category: 'Earrings',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop',
    description: 'Heavy gold-temple style bridal jhumkas adorned with ruby red kundan stones, floral crowns, and cascading golden bell fringes.',
    featured: true,
    rating: 5.0
  },
  {
    id: 'er-19',
    name: 'Multi-Color Bohemian Earrings',
    price: 249,
    category: 'Earrings',
    image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=600&auto=format&fit=crop',
    description: 'Vibrant gemstone earrings featuring citrine, amethyst, and peridot-colored glass teardrops arranged in an antique filigree chandelier.',
    rating: 4.8
  },
  {
    id: 'er-20',
    name: 'Zircon Crystal Ear Cuff Set',
    price: 299,
    category: 'Earrings',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop',
    description: 'Curated 3-piece ear-stack set: Includes pavé huggie hoop, criss-cross ear cuff, and a solitaire stud. No piercings needed for the cuff!',
    isNew: true,
    featured: true,
    rating: 4.9
  },

  // ==========================================
  // WATCHES (4 Curated Timepieces)
  // ==========================================
  {
    id: 'wt-1',
    name: 'Classic Gold Watch',
    price: 999,
    category: 'Watches',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&auto=format&fit=crop',
    description: 'A timeless timepiece featuring a solid 18k gold-toned case and a genuine leather strap with quartz precision movement.',
    rating: 4.8
  },
  {
    id: 'wt-2',
    name: 'Royal Blue Chronograph',
    price: 1199,
    category: 'Watches',
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=600&auto=format&fit=crop',
    description: 'Precision chronograph with a striking royal blue sunburst dial and stainless steel mesh band. Built for elegance and performance.',
    rating: 4.9,
    featured: true
  },
  {
    id: 'wt-3',
    name: 'Elegant Rose Gold Watch',
    price: 899,
    category: 'Watches',
    image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=600&auto=format&fit=crop',
    description: 'Minimalist dial encased in beautifully polished rose gold finish with faceted crystal hour markers. Perfect for daily wear or evening occasions.',
    rating: 4.7
  },
  {
    id: 'wt-4',
    name: 'Minimal Silver Watch',
    price: 799,
    category: 'Watches',
    image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=600&auto=format&fit=crop',
    description: 'Ultra-thin silver case with a clean white dial, slim hands, and classic Roman numerals on a Milanese strap.',
    rating: 4.6
  },

  // ==========================================
  // GIFTS & CURATED BOXES (4 Curated Gift Sets)
  // ==========================================
  {
    id: 'gf-1',
    name: 'Birthday Gift Box',
    price: 499,
    category: 'Gifts',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop',
    description: 'A beautifully curated gift box featuring a signature jewellery piece, scented soy wax candle, and personalized note card.',
    rating: 4.9,
    from: 'The Jewel Studio',
    to: 'Someone Special'
  },
  {
    id: 'gf-2',
    name: 'Anniversary Gift Set',
    price: 699,
    category: 'Gifts',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop',
    description: 'Celebrate years of love with this premium anniversary set featuring a curated pairing of heart necklace and bracelet in a velvet case.',
    rating: 5.0,
    from: 'With Love',
    to: 'My Forever',
    featured: true
  },
  {
    id: 'gf-3',
    name: 'Rakhi Gift Box',
    price: 399,
    category: 'Gifts',
    image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=600&auto=format&fit=crop',
    description: 'A traditional yet modern festive gift box crafted specially to celebrate love, protection, and lifelong sibling bonds.',
    rating: 4.8,
    from: 'Your Loving Sister',
    to: 'My Dear Brother'
  },
  {
    id: 'gf-4',
    name: 'Luxury Surprise Box',
    price: 549,
    category: 'Gifts',
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=600&auto=format&fit=crop',
    description: 'An exquisite collection of small surprises including surprise jewellery and keepsake velvet pouch, elegantly wrapped with satin ribbon.',
    rating: 4.9,
    from: 'Someone Special',
    to: 'You'
  }
];
