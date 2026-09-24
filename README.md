<div align="center">
  <img width="140" alt="Hamper Queen" src="https://github.com/Orthodox2000/hamper-queen/raw/main/public/hamper.png" />
  <h1>Hamper Queen</h1>
  <p><strong>Luxury Gifting Atelier · Mumbai</strong></p>
  <p>Custom gift hampers &amp; chocolate bouquets from INR 149 — velvet trunks, photo keepsakes, wax seals, and same-day dispatch.</p>
  <p>
    <a href="https://hamper-queen.vercel.app">hamper-queen.vercel.app</a> ·
    WhatsApp <a href="https://wa.me/918080580105">8080580105</a>
  </p>
</div>

## Overview

Hamper Queen is a high-converting gifting storefront built on the Next.js 16 App Router. Customers explore the catalogue, unbox an animated 3D gift box, customize hampers item-by-item, and order directly through WhatsApp or the in-app booking/concierge desk — all with celebratory confetti sprinkled throughout.

## Features

- **Interactive 3D unbox experience** — theme switcher, shape variants (cube / wide / tall / long), hand-tied bouquet mode, item pop-out animations, auto-rotation
- **Customise Atelier** — pick a vessel, add luxury items up to capacity, tie ribbon, stamp a wax seal
- **Royal Cart** — persistent slide-over cart with quantity steppers, subtotals, free delivery above INR 499, and one-tap add-from-Atelier
- **Hamper Builder & Calligraphy Scribe** — 4-step builder and bespoke card/message studio
- **Booking & Concierge Desk** — order + map pin-pointing modal, bulk/corporate gifting flow, coupon codes with cut-stamp redeem animation
- **Promo codes & coupons** — single-use codes (repeatable per event) with flat/percentage discounts, admin manager UI, live validation at checkout, automatic burn on order creation with rollback if the order fails
- **Admin panel** — DB-backed staff accounts (scrypt + sessions), order tracking dashboard, catalog override manager, promo manager, team/staff management
- **Order tracking** — public track-by-ID page with live timeline, promo savings and delivery pin
- **WhatsApp ordering** — one-tap `wa.me` checkout with prefilled message (includes applied coupon savings)
- **Multilingual copy layer** — `en`, `hinglish`, `bilingual` translation map (saved to localStorage)
- **Confetti system** — gold, party, romantic and grand-celebration bursts (canvas + CSS fallback)
- **Responsive & accessibility-oriented** — verified at 1440 / 1024 / 390 with zero horizontal overflow

## Tech Stack

| Layer | Tech |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, static prerender) |
| UI | React 19, Tailwind CSS v4, lucide-react icons |
| Motion | CSS 3D transforms, canvas-confetti 1.9, motion 12 |
| Data | MongoDB Atlas (`mongodb` driver), scrypt-hashed staff accounts + 7-day sessions |
| Deploy target | Vercel |

## Getting Started

Prerequisites: Node.js 20+ and npm.

```bash
npm install        # install dependencies
npm run dev        # http://localhost:3000  (binds 127.0.0.1 only)
```

Production build:

```bash
npm run build
npm run start      # serves the production build on :3000
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server on `127.0.0.1:3000` (never 0.0.0.0) |
| `npm run build` | Production build + static prerender |
| `npm run start` | Serve production build |
| `npm run lint` | TypeScript typecheck (`tsc --noEmit`) |
| `npm run db:test` | Ping MongoDB Atlas (reads `MONGODB_URI`) |
| `npm run db:bootstrap` | Idempotent bootstrap: collections, indexes, owner admin account |
| `npm run db:test-promo` | Promo integration suite against the running dev server (validates then cleans up) |

## Environment Variables

Copy `.env.example` to `.env` and fill in values. `.env*` is gitignored — never commit real credentials. Runtime admin auth lives entirely in MongoDB (`adminUsers` + `sessions`); no admin passwords are read from the environment by the app.

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Yes (DB features) | Atlas connection string, e.g. `mongodb+srv://user:<db_password>@cluster0.abcd.mongodb.net/?appName=Cluster0` |
| `HQ_BOOTSTRAP_ADMIN_USER` | Bootstrap only | First owner-admin username (falls back to an interactive prompt) |
| `HQ_BOOTSTRAP_ADMIN_PASSWORD` | Bootstrap only | First owner-admin password (falls back to an interactive prompt) |
| `HQ_ADMIN_USER` / `HQ_ADMIN_PASS` | `db:test-promo` only | Owner credentials used by the promo integration suite |
| `GEMINI_API_KEY` | No (planned) | Reserved for AI-assisted gifting prompts |
| `APP_URL` | No | Public origin for absolute links (canonical/SEO) |

### First-time database setup

```bash
cp .env.example .env        # add your MONGODB_URI
npm run db:test             # verify the Atlas connection
npm run db:bootstrap        # create collections, indexes, and the owner admin
npm run dev                 # sign in at /admin with the owner account
```

**MongoDB connection test**

```bash
npm run db:test
```

The script uses the Stable API (`ServerApiVersion.v1`), pings `admin`, and prints `You successfully connected to MongoDB!`. It redacts the URI in output and fails with a clear message if the placeholder is still present.

> **Atlas note:** some networks block mongodb+dns `Srv`/`Txt` lookups. `db:bootstrap` and `db:test` automatically fall back to a direct `mongodb://` URI built from known shard hosts; the Next.js runtime uses the standard `mongodb+srv://` string from `.env` (works fine when deployed and in most local setups).

### Database schema

See [`docs/db-schema.md`](docs/db-schema.md) for the collections, indexes, and documents the app maintains.

## SEO & Metadata

Managed centrally in `src/app/layout.tsx`:

- Title: `Custom Gift Hampers & Chocolate Bouquets | Hamper Queen` (~54 chars)
- Meta description: one sentence, under 155 chars, with the primary keyword
- Keywords, `robots`, and canonical URL
- Open Graph + Twitter `summary_large_image` card from a **generated OG image** (`src/app/opengraph-image.tsx`, 1200×630) — no asset maintenance needed
- JSON-LD `Organization` schema with contact point (+91 8080580105)

If you deploy to a custom domain, update `SITE_URL` in `src/app/layout.tsx` (it drives `metadataBase`, canonical, and JSON-LD).

## Project Structure

```text
src/
├── app/
│   ├── layout.tsx            # root SEO metadata, fonts, JSON-LD
│   ├── (shop)/
│   │   ├── layout.tsx        # shop chrome (header, footer, cart drawer)
│   │   └── <route>/page.tsx  # home, customised, catalog, hampers, bulk,
│   │                          #   inspirations, atelier, scribe, brochures, pricing
│   │   ├── track/            # public order tracking by ID
│   ├── admin/                # login, dashboard, catalog, promo, staff apps
│   ├── api/
│   │   ├── orders[/id]       # order create/list/update/delete (admin-guarded)
│   │   ├── orders/track/…    # public tracking lookup (sanitised)
│   │   ├── promo/validate    # coupon preview (never burns)
│   │   └── admin/            # login, logout, catalog, promo, staff
│   ├── opengraph-image.tsx   # generated 1200x630 social card
│   ├── globals.css           # Tailwind v4 + brand fonts
│   └── terms-of-service | privacy-policy | eula   # legal pages
├── store/shop-store.tsx      # client state: cart, language, drawer, booking
├── components/               # Header, hero, 3D box, sections, modals
├── data/                     # catalog, themes, items, translations
├── lib/                      # orders, tracking, catalog, auth (DB-backed), promo, mongo
├── utils/                    # confetti, logger, audio
└── types/index.ts
scripts/
├── test-mongo.mjs            # Atlas connection test
├── lib/db-utils.mjs          # shared Mongo connect + scrypt helpers
├── bootstrap-db.mjs          # collections, indexes, owner admin
└── test-promo.mjs            # promo integration suite (validate/redeem/burn)
docs/db-schema.md             # database schema reference
public/                       # hamper.png logo, The Seasons woff2 fonts
```

## Deployment (Vercel)

1. Push this repo to GitHub (remote already set to `https://github.com/Orthodox2000/hamper-queen.git`).
2. In Vercel, **Import Project** → pick the repo.
3. Framework preset: **Next.js** (build `next build`, output static + server).
4. Add env vars (`MONGODB_URI`, etc.) under **Settings → Environment Variables** — never in code.
5. Deploy. Runtime will be https://hamper-queen.vercel.app.

Local dev binds loopback-only; on Vercel traffic is served via HTTPS automatically.

## Contact

- Order on WhatsApp: [+91 80805 80105](https://wa.me/918080580105)
- Repository: [github.com/Orthodox2000/hamper-queen](https://github.com/Orthodox2000/hamper-queen)

---

© Hamper Queen. All rights reserved.