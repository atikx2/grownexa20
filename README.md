# Grownexa20 — Agency Website

Dark, premium agency site for Website Services, YouTube Services and Music Promotion.

## Admin
Go to `/admin`. The **first** account created there becomes the admin; later accounts get no access.
Manage services, packages & prices, portfolio, reviews, FAQs, statistics, leads and contact/payment details.

## Deploy (GitHub → Netlify → Production)
1. Connect this project to GitHub from Lovable.
2. In Netlify: **Add new site → Import from GitHub**, pick the repo.
3. Build command: `npm run build` · Publish directory: `dist/client` (SPA fallback: add a `_redirects` rule `/* /index.html 200`).
4. Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (publishable key only — never add secret keys).
5. Deploy. Add your custom domain under **Domain settings**.

Simplest option: publish directly from Lovable — no Netlify setup needed.
