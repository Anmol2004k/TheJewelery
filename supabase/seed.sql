-- ==============================================================================
-- The Jewel Studio - Seed Products and Initial Data for Supabase PostgreSQL
-- ==============================================================================

INSERT INTO public.products (id, name, price, original_price, description, category, image, rating, reviews_count, featured, is_new)
VALUES
  ('p1', 'Emerald Cut Solitaire Ring', 249.00, 399.00, 'Exquisite 18k gold-plated brass ring set with a brilliant emerald-cut cubic zirconia centerpiece.', 'Rings', '/src/assets/images/product_ring_1787065538690.jpg', 4.9, 38, true, true),
  ('p2', 'Royal Kundan Choker Set', 499.00, 799.00, 'Handcrafted royal Kundan choker embellished with faux pearls and micro-pave detailing.', 'Necklaces', '/src/assets/images/product_necklace_1787065551283.jpg', 4.8, 42, true, false),
  ('p3', 'Peacock Meenakari Jhumkas', 189.00, 299.00, 'Traditional temple-inspired bell jhumkas with colorful Meenakari enameling and pearl droplets.', 'Earrings', '/src/assets/images/product_earrings_1787065562831.jpg', 4.9, 64, true, true),
  ('p4', 'Tennis Eternity Bracelet', 219.00, 349.00, 'Anti-tarnish 18k gold vermeil bracelet featuring continuous high-clarity simulated diamonds.', 'Bracelets', '/src/assets/images/product_bracelet_1787065575084.jpg', 4.7, 29, true, false),
  ('p5', 'Rose Gold Classic Chrono Watch', 599.00, 899.00, 'Rose gold plated mesh strap dress watch with sunray champagne dial and Swiss movement styling.', 'Watches', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&auto=format&fit=crop', 4.8, 19, false, true),
  ('p6', 'Bridal Luxury Gift Hamper', 849.00, 1299.00, 'Curated jewelry treasure chest featuring necklace, earrings, maang tikka, and matching ring.', 'Gifts', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop', 5.0, 51, true, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  image = EXCLUDED.image,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  featured = EXCLUDED.featured,
  is_new = EXCLUDED.is_new;
