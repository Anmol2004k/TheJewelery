import fs from 'fs';
import path from 'path';

/**
 * Migration Script: Transforms existing Firebase/admin_store data into clean,
 * relational PostgreSQL INSERT statements for Supabase.
 */

const dataPath = path.join(process.cwd(), 'data', 'admin_store.json');
const outputPath = path.join(process.cwd(), 'supabase', 'migrated_data.sql');

if (!fs.existsSync(dataPath)) {
  console.error('No data found at:', dataPath);
  process.exit(1);
}

const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

let sql = `-- ==============================================================================
-- The Jewel Studio - Migrated Existing Firebase Data to Supabase PostgreSQL
-- ==============================================================================
-- Generated migration: orders, order_items, contact_messages
-- ==============================================================================

`;

// 1. Orders and Order Items
if (rawData.orders && Array.isArray(rawData.orders)) {
  sql += `-- 1. ORDERS\n`;
  for (const o of rawData.orders) {
    const id = o.id || `ord_${Date.now()}`;
    const orderId = o.orderId || id;
    const email = (o.email || '').replace(/'/g, "''");
    const phone = (o.phone || '').replace(/'/g, "''");
    const firstName = (o.firstName || '').replace(/'/g, "''");
    const lastName = (o.lastName || '').replace(/'/g, "''");
    const address = (o.address || '').replace(/'/g, "''");
    const city = (o.city || '').replace(/'/g, "''");
    const state = (o.state || '').replace(/'/g, "''");
    const pincode = (o.pincode || '').replace(/'/g, "''");
    const amount = Number(o.amount || 0);
    const status = o.status || 'paid';
    const createdAt = o.createdAt || new Date().toISOString();

    sql += `INSERT INTO public.orders (id, order_id, email, phone, first_name, last_name, address, city, state, pincode, country, amount, currency, status, created_at)
VALUES ('${id}', '${orderId}', '${email}', '${phone}', '${firstName}', '${lastName}', '${address}', '${city}', '${state}', '${pincode}', 'India', ${amount}, 'INR', '${status}', '${createdAt}')
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, amount = EXCLUDED.amount;\n\n`;

    // Order Items
    if (o.items && Array.isArray(o.items)) {
      for (const item of o.items) {
        const prodName = (item.product?.name || 'Jewelry Piece').replace(/'/g, "''");
        const prodId = (item.product?.id || '').replace(/'/g, "''");
        const prodPrice = Number(item.product?.price || 0);
        const qty = Number(item.quantity || 1);
        const img = (item.product?.image || '').replace(/'/g, "''");

        sql += `INSERT INTO public.order_items (order_id, product_id, product_name, price, quantity, image)
VALUES ('${id}', '${prodId}', '${prodName}', ${prodPrice}, ${qty}, '${img}');\n`;
      }
      sql += `\n`;
    }
  }
}

// 2. Contact Messages
if (rawData.messages && Array.isArray(rawData.messages)) {
  sql += `-- 2. CONTACT MESSAGES\n`;
  for (const m of rawData.messages) {
    const id = (m.id || `inq_${Date.now()}`).replace(/'/g, "''");
    const firstName = (m.firstName || '').replace(/'/g, "''");
    const lastName = (m.lastName || '').replace(/'/g, "''");
    const fullName = (m.fullName || `${firstName} ${lastName}`).replace(/'/g, "''");
    const email = (m.email || '').replace(/'/g, "''");
    const subject = (m.subject || 'Inquiry').replace(/'/g, "''");
    const message = (m.message || '').replace(/'/g, "''");
    const status = m.status || 'unread';
    const createdAt = m.createdAt || new Date().toISOString();

    sql += `INSERT INTO public.contact_messages (id, first_name, last_name, full_name, email, subject, message, status, created_at)
VALUES ('${id}', '${firstName}', '${lastName}', '${fullName}', '${email}', '${subject}', '${message}', '${status}', '${createdAt}')
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;\n`;
  }
  sql += `\n`;
}

fs.writeFileSync(outputPath, sql, 'utf-8');
console.log('Successfully generated Supabase migration SQL to:', outputPath);
