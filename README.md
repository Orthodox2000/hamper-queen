<div align="center">
  <img width="140" alt="Hamper Queen" src="https://github.com/Orthodox2000/hamper-queen/raw/main/public/hamper.png" />
  <h1>Hamper Queen</h1>
  <p><strong>Luxury Gifting Atelier · Mumbai</strong></p>
  <p>Custom gift hampers &amp; chocolate bouquets from ₹799 — velvet trunks, photo keepsakes, wax seals, and same-day dispatch.</p>
  <p>
    <a href="https://hamper-queen.vercel.app">hamper-queen.vercel.app</a> ·
    WhatsApp <a href="https://wa.me/918080580105">8080580105</a>
  </p>
</div>

## Overview

Hamper Queen is a high-converting, single-page gifting storefront built on the Next.js 16 App Router. Customers explore the catalogue, unbox an animated 3D gift box, customize hampers item-by-item, and order directly through WhatsApp or the in-app booking/concierge desk — all with celebratory confetti sprinkled throughout.

## Features

- **Interactive 3D unbox experience** — theme switcher, item pop-out animations, auto-rotation
- **Customise Atelier** — pick a vessel, add luxury items up to capacity, tie ribbon, stamp a wax seal
- **Royal Tray** — persistent slide-over hamper staging drawer with live item count
- **Hamper Builder & Calligraphy Scribe** — 4-step builder and bespoke card/message studio
- **Booking & Concierge Desk** — order + map pin-pointing modal, bulk/corporate gifting flow
- **WhatsApp ordering** — one-tap `wa.me` checkout with prefilled message
- **Multilingual copy layer** — `en`, `hinglish`, `bilingual` translation map (saved to localStorage)
- **Confetti system** — gold, party, romantic and grand-celebration bursts (canvas + CSS fallback)
- **Responsive & accessibility-oriented** — verified at 1440 / 1024 / 390 with zero horizontal overflow

## Tech Stack

| Layer | Tech |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, static prerender) |
| UI | React 19, Tailwind CSS v4, lucide-react icons |
| Motion | CSS 3D transforms, canvas-confetti 1.9 |
| Data | `mongodb` driver (Atlas pending), localStorage persistence |
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

## Environment Variables

Copy `.env.example` to `.env` and fill in values. `.env*` is gitignored — never commit real credentials.

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | For DB features | Atlas connection string, e.g. `mongodb+srv://user:<db_password>@cluster0.abcd.mongodb.net/?appName=Cluster0` |
| `GEMINI_API_KEY` | No (planned) | Reserved for AI-assisted gifting prompts |
| `APP_URL` | No | Public origin for absolute links (canonical/SEO) |

**MongoDB connection test**

```bash
npm run db:test
```

Replace the `<db_password>` placeholder in `.env` with your Atlas database-user password first. The script uses the Stable API (`ServerApiVersion.v1`), pings `admin`, and prints `You successfully connected to MongoDB!`. It redacts the URI in output and fails with a clear message if the placeholder is still present.

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
│   ├── layout.tsx            # SEO metadata, fonts, JSON-LD
│   ├── opengraph-image.tsx   # generated 1200x630 social card
│   ├── globals.css           # Tailwind v4 + brand fonts
│   └── page.tsx              # client entry → <App/>
├── components/               # Header, hero, 3D box, sections, modals
├── data/                     # catalog, themes, items, translations
├── utils/                    # confetti, logger, audio
└── types/index.ts
scripts/test-mongo.mjs        # Atlas connection test
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