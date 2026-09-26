-- ==============================================================================
-- The Jewel Studio - Migrated Existing Firebase Data to Supabase PostgreSQL
-- ==============================================================================
-- Generated migration: orders, order_items, contact_messages
-- ==============================================================================

-- 1. ORDERS
INSERT INTO public.orders (id, order_id, email, phone, first_name, last_name, address, city, state, pincode, country, amount, currency, status, created_at)
VALUES ('ord_tjs_1001', 'TJS-ORD-9841', 'priya.sharma@luxurygems.in', '+91 98201 44521', 'Priya', 'Sharma', 'Penthouse 4B, Signature Crest, Altamount Road', 'Mumbai', 'Maharashtra', '400026', 'India', 382500, 'INR', 'delivered', '2026-09-13T10:14:00.000Z')
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, amount = EXCLUDED.amount;

INSERT INTO public.order_items (order_id, product_id, product_name, price, quantity, image)
VALUES ('ord_tjs_1001', '1', 'The Imperial Sapphire Ring', 382500, 1, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop');

INSERT INTO public.orders (id, order_id, email, phone, first_name, last_name, address, city, state, pincode, country, amount, currency, status, created_at)
VALUES ('ord_tjs_1002', 'TJS-ORD-9842', 'vikram.mehta@heritage.com', '+91 98110 33912', 'Vikram', 'Mehta', 'B-14 Golf Links Boulevard', 'New Delhi', 'Delhi', '110003', 'India', 578000, 'INR', 'shipped', '2026-09-15T15:20:00.000Z')
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, amount = EXCLUDED.amount;

INSERT INTO public.order_items (order_id, product_id, product_name, price, quantity, image)
VALUES ('ord_tjs_1002', '4', 'Lumina Tennis Bracelet', 578000, 1, 'https://images.unsplash.com/photo-1611591475819-79b8b730ab09?q=80&w=600&auto=format&fit=crop');

INSERT INTO public.orders (id, order_id, email, phone, first_name, last_name, address, city, state, pincode, country, amount, currency, status, created_at)
VALUES ('ord_tjs_1003', 'TJS-ORD-9843', 'theadultanmol@gmail.com', '+91 99887 76655', 'Anmol', 'Kumar', '42 Orchid Villa, Jubilee Hills Road 36', 'Hyderabad', 'Telangana', '500033', 'India', 348500, 'INR', 'paid', '2026-09-16T18:45:00.000Z')
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, amount = EXCLUDED.amount;

INSERT INTO public.order_items (order_id, product_id, product_name, price, quantity, image)
VALUES ('ord_tjs_1003', '2', 'Aura Diamond Pendant', 238000, 1, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop');
INSERT INTO public.order_items (order_id, product_id, product_name, price, quantity, image)
VALUES ('ord_tjs_1003', '7', 'Midnight Onyx Studs', 102000, 1, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop');

INSERT INTO public.orders (id, order_id, email, phone, first_name, last_name, address, city, state, pincode, country, amount, currency, status, created_at)
VALUES ('ord_tjs_1004', 'TJS-ORD-9844', 'aarav.singh@gmail.com', '+91 97123 45678', 'Aarav', 'Singh', 'Flat 1202, Palm Meadows, Whitefield', 'Bengaluru', 'Karnataka', '560066', 'India', 272000, 'INR', 'processing', '2026-09-17T09:30:00.000Z')
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, amount = EXCLUDED.amount;

INSERT INTO public.order_items (order_id, product_id, product_name, price, quantity, image)
VALUES ('ord_tjs_1004', '3', 'Celestial Drop Earrings', 272000, 1, 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop');

INSERT INTO public.orders (id, order_id, email, phone, first_name, last_name, address, city, state, pincode, country, amount, currency, status, created_at)
VALUES ('ord_tjs_1005', 'TJS-ORD-9845', 'theadultanmol@gmail.com', '+91 99887 76655', 'Anmol', 'Kumar', '42 Orchid Villa, Jubilee Hills Road 36', 'Hyderabad', 'Telangana', '500033', 'India', 272000, 'INR', 'shipped', '2026-09-18T05:22:00.000Z')
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, amount = EXCLUDED.amount;

INSERT INTO public.order_items (order_id, product_id, product_name, price, quantity, image)
VALUES ('ord_tjs_1005', '3', 'Celestial Drop Earrings', 272000, 1, 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop');

