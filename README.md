# The Jewel Studio — Production Deployment & Secrets Management Guide

This guide details everything required to deploy **The Jewel Studio** safely and cleanly to production with your custom domain (`https://www.thejewelstudio.online`) and connected GitHub repository, ensuring **zero credential leaks** and strict security standards.

---

## 1. Architecture & Secrets Separation (Critical)

In modern web applications with a Vite frontend and an Express/Node backend, environment variables are split into **two strictly separated categories**:

| Category | Prefix | Visible To Browser? | Where Used | Examples |
| :--- | :--- | :--- | :--- | :--- |
| **Public / Client Keys** | `VITE_` | **YES** (bundled into JS) | React components (`src/`) | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_RAZORPAY_KEY_ID` |
| **Private / Server Secrets** | *No `VITE_` prefix* | **NO** (never sent to client) | Node.js Server (`server.ts`) | `RAZORPAY_KEY_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET` |

> ⚠️ **SECURITY RULE #1**: **NEVER** prefix `RAZORPAY_KEY_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, or `JWT_SECRET` with `VITE_`. If you do, Vite will bundle them into the publicly downloaded JavaScript files where anyone can inspect them.

---

## 2. Where to Paste Secret Keys (Based on Your Hosting Platform)

When deploying from your GitHub repository, you **never commit `.env` or secret keys to GitHub**. The `.gitignore` file is already configured to block `.env*` files (while keeping `.env.example`).

Instead, you enter your secret keys into your hosting provider's **Environment Variables** dashboard.

### Option A: If Deploying on Vercel
1. Go to your Project in the **Vercel Dashboard**.
2. Navigate to **Settings** > **Environment Variables**.
3. Add the keys one by one (or paste in bulk) for `Production` (and `Preview` if desired).

### Option B: If Deploying on Render / Railway / Cloud Run
1. In your service settings, navigate to the **Environment** / **Variables** tab.
2. Add the key-value pairs specified in the table below.

### Option C: If Deploying on a VPS / Dedicated Server (Ubuntu/Debian)
1. On the server in your project root, create a file named `.env`:
   ```bash
   nano .env
   ```
2. Paste the values, save (`Ctrl+O`, `Enter`), and exit (`Ctrl+X`).
3. Set strict file permissions so only the app user can read it:
   ```bash
   chmod 600 .env
   ```

---

## 3. Complete Environment Variables Master Checklist

Here is the exact list of variables you need to configure in your deployment platform:

```env
# ==============================================================================
# 1. APP & DOMAIN CONFIGURATION
# ==============================================================================
NODE_ENV=production
PORT=3000
APP_URL=https://www.thejewelstudio.online

# ==============================================================================
# 2. SUPABASE (PostgreSQL Database & Authentication)
# ==============================================================================
# Public credentials (used by React client):
VITE_SUPABASE_URL=https://oadkresiuupjythvdhtn.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_GITyK1cTSoqpy1qYNzh-4A_Vu0CVnpz

# Private Server Key (used ONLY by server.ts for elevated admin operations):
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# ==============================================================================
# 3. RAZORPAY PAYMENT GATEWAY
# ==============================================================================
# Public Key (Loaded in frontend checkout modal):
VITE_RAZORPAY_KEY_ID=rzp_live_your_actual_key_id
RAZORPAY_KEY_ID=rzp_live_your_actual_key_id

# Private Key (Used on server for HMAC-SHA256 signature verification & order creation):
RAZORPAY_KEY_SECRET=your_razorpay_live_secret_key_here

# Optional: Razorpay Webhook Secret (if configured in Razorpay Dashboard > Webhooks):
RAZORPAY_WEBHOOK_SECRET=your_webhook_signing_secret_here

# ==============================================================================
# 4. ADMIN PORTAL & AUTHENTICATION
# ==============================================================================
# Random 64-character string used to sign backend admin session tokens:
JWT_SECRET=generate_a_secure_random_64_character_string_here

# ==============================================================================
# 5. EMAIL NOTIFICATIONS (EmailJS - Frontend)
# ==============================================================================
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# ==============================================================================
# 6. ANALYTICS (Optional)
# ==============================================================================
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 4. How to Generate Secure Secrets

### Generate a Strong `JWT_SECRET`
Run this one-line command in your terminal to generate an unguessable 256-bit cryptographic secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and paste it as the value for `JWT_SECRET`.

---

## 5. Third-Party Dashboard Settings (Supabase & Razorpay)

### A. Supabase Dashboard (`https://supabase.com/dashboard`)
1. **URL Configuration**:
   * Go to **Authentication** > **URL Configuration**.
   * Set **Site URL**: `https://www.thejewelstudio.online`
   * Under **Redirect URLs**, add:
     * `https://www.thejewelstudio.online`
     * `https://www.thejewelstudio.online/orders`
     * `https://www.thejewelstudio.online/admin/dashboard`
     * `https://www.thejewelstudio.online/**`
2. **Google OAuth Provider**:
   * Go to **Authentication** > **Providers** > **Google**.
   * Ensure it is enabled, and enter your Google OAuth Client ID and Secret.
   * Copy the provided **Callback URL** into your Google Cloud Console Authorized Redirect URIs.
3. **Run Schema and Seed Migration**:
   * Open the **SQL Editor** in Supabase.
   * Run the SQL scripts from the repository in this order:
     1. `supabase/schema.sql` (Creates profiles, products, orders, order_items, RLS policies, triggers)
     2. `supabase/seed.sql` (Inserts initial product catalog)
     3. `supabase/migrated_data.sql` (Inserts existing orders and contact inquiries)

### B. Razorpay Dashboard (`https://dashboard.razorpay.com`)
1. **Activate Live Business Account**:
   * Complete business KYC and add your verified company bank account in Razorpay.
2. **Toggle to Live Mode**:
   * In the top-left banner of Razorpay Dashboard, toggle the switch from **Test Mode** to **Live Mode**.
3. **Generate Live API Credentials**:
   * Go to **Account & Settings** > **API Keys**.
   * Click **Generate Key**.
   * You will receive:
     * **Key Id** (starts with `rzp_live_...`)
     * **Key Secret** (a confidential string shown only once)
4. **Webhooks Setup (Recommended for Instant Settlement & Event Sync)**:
   * Go to **Account & Settings** > **Webhooks**.
   * Click **Add New Webhook**.
   * **Webhook URL**: `https://www.thejewelstudio.online/api/razorpay/webhook`
   * **Secret**: Create a strong random webhook secret string (e.g. 32 chars).
   * **Active Events**: Check `order.paid`, `payment.captured`, and `payment.failed`.
   * Click **Create Webhook**.
   * Copy the webhook secret and paste it as `RAZORPAY_WEBHOOK_SECRET` in your hosting platform environment variables.

---

## 6. How to Switch from Razorpay Test Mode to Live Mode (Bank Settlement)

### Question: Do you need to modify source code files to go Live?
**NO source code files need to be edited.** The codebase was intentionally designed using standard 12-factor application architecture so that switching from test mode to live commercial mode requires **only updating environment variables in your hosting dashboard**:

| Variable Name | Test Value Example | Live Value (Real Bank Settlement) | Where to Update |
| :--- | :--- | :--- | :--- |
| `VITE_RAZORPAY_KEY_ID` | `rzp_test_XXXXXXXXXXXXXX` | `rzp_live_XXXXXXXXXXXXXXXXXX` | Hosting Provider Env Variables (Vercel/Render/Railway) |
| `RAZORPAY_KEY_ID` | `rzp_test_XXXXXXXXXXXXXX` | `rzp_live_XXXXXXXXXXXXXXXXXX` | Hosting Provider Env Variables (Vercel/Render/Railway) |
| `RAZORPAY_KEY_SECRET` | `your_test_secret_key` | `your_live_secret_key` | Hosting Provider Env Variables (Vercel/Render/Railway) |
| `RAZORPAY_WEBHOOK_SECRET` | `test_webhook_secret` | `live_webhook_secret` | Hosting Provider Env Variables (Vercel/Render/Railway) |

#### Exact Flow in Code:
1. **Client (`src/pages/Checkout.tsx`)**: Reads `import.meta.env.VITE_RAZORPAY_KEY_ID` dynamically to load the official Razorpay Checkout modal with the live key.
2. **Server (`server.ts`)**:
   - `app.post('/api/razorpay/order')` reads `process.env.RAZORPAY_KEY_ID` and `process.env.RAZORPAY_KEY_SECRET` to create genuine bank-backed order tokens.
   - `app.post('/api/razorpay/verify')` computes the cryptographic HMAC SHA-256 signature using `process.env.RAZORPAY_KEY_SECRET` to verify genuine payments.
   - `app.post('/api/razorpay/webhook')` verifies webhook signatures using `process.env.RAZORPAY_WEBHOOK_SECRET`.

When live keys (`rzp_live_...`) are set:
- Real credit/debit cards, UPI apps (Google Pay, PhonePe, Paytm), and NetBanking will be processed.
- Money is automatically settled directly into your linked bank account per your Razorpay settlement cycle (typically T+1 or T+2 business days).

---

## 7. Cleanup & Unused Files Optimization

If you are committing this repository to your clean GitHub repository for production, here are the cleanup considerations:

### Files That Can Be Safely Removed or Left Out:
1. **`firebase-blueprint.json` & `firestore.rules` & `firebase-applet-config.json`**:
   - *Status*: Residual configuration from previous Firebase setup. Since the application now uses Supabase + PostgreSQL, these files are not used at runtime. You can remove them or keep them in `.gitignore`.
2. **`scripts/generate-migration-sql.ts`**:
   - *Status*: One-time utility script used to convert existing orders and contact inquiries into `supabase/migrated_data.sql`. It is not needed during production runtime.
3. **`data/admin_store.json`**:
   - *Status*: The historical JSON mock file. All historical records have already been extracted into `supabase/migrated_data.sql`.

---

## 8. Pre-Flight Security & Deployment Checklist

Before triggering your production deployment:

- [ ] **`.gitignore` Verified**: Ensure `.env`, `.env.local`, and any credential files are in `.gitignore`.
- [ ] **No Hardcoded Keys in Git**:
  ```bash
  # Run this check locally to ensure no secrets remain in code:
  git grep -E "rzp_live|AIzaSy|sk_live|secret"
  ```
- [ ] **Build Verification**: Run `npm run build` locally to verify that Vite bundles successfully without TypeScript or build errors:
  ```bash
  npm run build
  ```
- [ ] **Production Run Command**: Ensure your host runs:
  * Build command: `npm run build`
  * Start command: `npm run start` (which executes `node dist/server.cjs`)
- [ ] **SSL / HTTPS Active**: Ensure your custom domain `https://www.thejewelstudio.online` has active SSL certificates (handled automatically by Vercel, Cloudflare, or Let's Encrypt).
