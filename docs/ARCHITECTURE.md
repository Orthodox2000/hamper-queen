# Architecture

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · MongoDB driver · self-hosted fonts.

## Routes

| Area | Routes |
| --- | --- |
| Storefront `(shop)` | `/`, `/catalog`, `/customised`, `/atelier`, `/scribe`, `/hampers`, `/inspirations`, `/pricing`, `/bulk`, `/brochures`, `/track`, `/track/[trackingId]` |
| Legal | `/privacy-policy`, `/terms-of-service`, `/eula` |
| Admin | `/admin`, `/admin/orders/[id]`, `/admin/catalog`, `/admin/promo`, `/admin/staff` |
| Public API | `GET /api/catalog`, `POST /api/orders`, `GET /api/orders/track/[trackingId]`, `POST /api/promo/validate` |
| Admin API (session cookie `hq_admin`) | `/api/admin/login`, `/api/admin/logout`, `/api/admin/{catalog,promo,staff}[/id]`, `GET /api/orders`, `GET|PATCH|DELETE /api/orders/[id]` |

Each storefront route folder has a `layout.tsx` exporting its own `metadata` (title/description) and a
`page.tsx` that renders a section component. Pages that are visually headed by a shared section also
render a `sr-only` `<h1>` so every page has exactly one level-1 heading in server HTML.

## What renders where

* **Server:** layouts, metadata, `robots`, `sitemap`, `manifest`, OG image, API routes, legal pages, and the initial HTML of every page (client components are still server-rendered on first request).
* **Client (`'use client'`):** interactive pieces - Header, hero configurator, cart drawer, booking modal, map picker, builders, admin screens.
* **Server-safe components:** `BouquetArt` (pure SVG, no `'use client'`, no browser APIs) can be used from Server Components, emails or OG images.

### SSR rules (what keeps hydration clean)

1. No `window`, `document`, `localStorage`, `Math.random()`, `Date.now()` or `new Date()` **during render**. Use them in effects/handlers.
2. Anything that changes after mount (3D rotation) is written to the DOM through refs, **not** state, and the server renders a sensible initial transform (`ThreeDGiftBox` sets `rotateX/rotateY` inline).
3. Generated ids come from `useId()` (stable across server/client), never counters or random strings.
4. Leaflet is imported dynamically inside an effect, never at module scope.

`npm run check:ssr` fetches every public route without JavaScript and fails on error shells, empty HTML, missing `<title>`/`<h1>`/viewport, or non-JSON API failures.

## Key components

| File | Role |
| --- | --- |
| `components/Header.tsx` | Dark gold-accented announcement bar (dispatch / delivery / min order / phone) + one sticky bar, animated mobile menu |
| `scripts/generate-icons.py` | Builds favicon / apple / PWA / maskable icons from `public/hamper.png` (`npm run icons`) |
| `components/FounderStrip.tsx` | "Founded by Ms. Supriya Khandekar" band, rendered directly below the hero on the home page |
| `components/RoyalCoverHero.tsx` | Hero card: copy column + 3D configurator panel (same height, stage background). Sized to fit a 1366x768 desktop viewport below the header |
| `components/ThreeDGiftBox.tsx` | CSS-3D boxes/trays/bags, rAF rotation, pop-out item cards |
| `components/BouquetArt.tsx` | SVG bouquet (palette-driven, SSR-safe) |
| `components/HamperQueenShowcase.tsx` | Catalogue cards, filters, bulk banner |
| `components/BookingOrderModal.tsx` | Two-step booking/payment flow |
| `components/MapPicker.tsx` | Ola-style centre-pin delivery picker (Leaflet + OSM/Nominatim) |
| `app/admin/admin-header.tsx` | Shared admin top bar (tabs, storefront link, logout) |

## Data & auth

* `lib/mongo.ts` - single cached client (`serverApi` strict), `ensureIndex`, one getter per collection. DB name from `MONGODB_DB`.
* `lib/orders.ts` - order creation (promo redemption, totals, tracking id), status events.
* `lib/auth.ts` - scrypt password hashing, sessions in Mongo (`expiresAt` is a real **Date** so the TTL index purges), 7-day cookie, `requireAdmin`.
* `lib/catalog.ts` - static catalogue merged with `catalogOverrides` (DB wins).
* `lib/seo.ts` - `SITE_URL` (from `HQ_BASE_URL`), metadata helpers.
* Orders recompose product lines from the catalogue on the server; the client never sets prices.

## Delivery map

`MapPicker` keeps the pin fixed at the centre and moves the map. On settle it reverse-geocodes via Nominatim (debounced, cancellable, `AbortController`), shows a "Delivering to" sheet, and on **Confirm** calls `onAddressResolved` so the booking modal fills street, city and pincode (flat and landmark only if empty). Tiles: CARTO Voyager (OSM data). No API key. Google Maps / Places would need a key and billing; the component API (`onLocationChange`, `onAddressResolved`) is the seam for swapping it.
