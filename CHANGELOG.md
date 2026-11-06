# Changelog

All notable changes to Hamper Queen are documented here. Grouped by audience value.

## 2.2.3 — 2026-11-06 — Admin sign-in hardening & password reset

- **Fixed: a failed first database connection was cached forever** — one Atlas hiccup (IP allow-list not applied yet, brief network blip) made every admin/API call fail until the server instance restarted. The client is now retried on the next request.
- **Fixed: login redirect** — the form now does a full navigation to `/admin` after sign-in, so the fresh httpOnly cookie is always sent.
- **New: `npm run db:reset-admin`** (`scripts/reset-admin.mjs`) — create an admin or reset a forgotten password with a hidden prompt; revokes the user's old sessions; same scrypt format as the app.
- **Login rate limit** — 8 failed attempts per IP + username in 15 minutes returns 429; unknown usernames now cost the same time as wrong passwords (no username enumeration by timing).
- Docs: forgot-password section in the admin guide, new troubleshooting rows (cookie needs https, 429, wrong `MONGODB_DB`), login checklist in the testing guide.
- Verified with an automated harness against the real route + auth code (14 checks: login, cookie flags, session lookup, deactivated users, lockout, reset).

## 2.2.2 — 2026-11-06 — Favicons, app icons & site metadata

- **New crown favicon set** — the old icons were the full circular seal, unreadable at 16–32px. Small sizes now use the gold crown on ink: `favicon.ico` (16/32/48), `icon.png` (512), opaque `apple-icon.png` (180), `public/icons/favicon-16|32.png`, `mstile-150.png`.
- **Installable-app icons** — full seal `icon-192/512.png` (purpose `any`) plus new `maskable-192/512.png` so Android no longer crops the logo.
- **Manifest** — added `id`, `scope`, `lang`, `orientation`, `categories`, maskable icons and three home-screen shortcuts (Customise, Track, Collections).
- **Metadata** — `applicationName`, `category`, `authors`, `creator`, `publisher`, `formatDetection`, Windows tile (`browserconfig.xml`), `mobile-web-app-capable`.
- **Extras** — `/.well-known/security.txt` (expires 2027-11-06, renew yearly) and `/humans.txt`.
- **`npm run icons`** regenerates all icons from `public/hamper.png` (`scripts/generate-icons.py`, needs Pillow + NumPy).

## 2.2.1 — 2026-11-06 — Hero fit, new top bar, founder strip, cleaner bouquet rates

### Design
- **Hero fits a regular desktop viewport** — tighter card padding, smaller headline (`lg:text-[2.75rem]` / `xl:text-5xl`), shorter 3D stage (`lg:min-h-[250px]`), and the redundant scroll cue was removed. Columns stay equal height.
- **Top bar redesigned** — dark ink bar with a gold hairline, icon + diamond separated highlights (same-day dispatch, free delivery, custom hampers from the minimum order) and a pill phone button. It still scrolls away so only the nav bar is sticky.
- **"Founded by Ms. Supriya Khandekar" moved below the hero** into a new `FounderStrip` band (it no longer lives in the top bar).

### Content
- Removed the "Gurugram" label from the **Real Retail Rates** block on bouquet/hamper cards; it now reads "Updated <date>". `RETAIL_RATES_LOCATION` was deleted, and `scripts/fetch-retail-rates.mjs` no longer emits it (nor the `locality` key in `retailDataset.json`).

### Environment & docs
- New `.env.production` (gitignored) and `.env.production.example` listing only the variables the running app reads: `MONGODB_URI`, `MONGODB_DB`, `HQ_BASE_URL`, optional `MONGODB_DIRECT_HOSTS`.
- `docs/ENVIRONMENT.md`: new "Deployment environment" section with a local-to-deployment mapping, plus the test-only `HQ_ADMIN_USER` / `HQ_ADMIN_PASS` and `BASE_URL` variables that were previously undocumented.

## 2.2.0 — 2026-11-05 — Party-ready design, server-safe bouquets, one-command environment

### Design & motion
- **New type system** — Fraunces headlines, a handwritten gold-to-rose script accent (`.accent-script`) and Plus Jakarta Sans body, all self-hosted (no Google Fonts request). Fixed the script accent clipping the descenders of g / p / f.
- **One design system** — tokens, spacing rhythm, three shadows, one easing curve and shared `.btn` / `.card` / `.chip` / `.field` classes; 377 hard-coded colours collapsed into tokens.
- **Smoother, more playful interactions** — button sheen sweep, arrow nudge, card lift with gradient-border glow, nav underline, CSS-only scroll reveals. Hover effects are gated for touch screens and everything respects reduced motion.
- **Hero** — matched column heights, a staged 3D panel with fixed box size, items that pop out of opened boxes, lid that slides aside.
- **Bouquets rebuilt as SVG** (`BouquetArt`) — four palettes, chocolate roses, gold truffle, satin bow and tag, twinkling sparkles. Server-renderable and hydration-safe.
- **Checkout** — redesigned booking/payment modal and an **Ola-style pin-drop map** (fixed centre pin, lift/drop, search, locate-me, address auto-fill).
- **Admin** — one shared header with tabs and logout on every screen; unified fields and buttons.

### Reliability
- **Fixed: orders failed on a freshly bootstrapped database** — the app and `db:bootstrap` named the same indexes differently (`trackingId_1` vs `uniq_trackingId`), which MongoDB rejects. Index names are now canonical and equivalent indexes are accepted; checks run once per process.
- **Fixed: admin sessions were never purged** — `expiresAt` was stored as a string, which TTL indexes ignore; it is now a real Date. Servers without TTL support no longer break login.
- **Fixed: missing `<h1>` on five pages** and the site URL hard-coded in six places; it now comes from `HQ_BASE_URL`.
- Contrast: WhatsApp green, gold text and chips now meet AA (Customise page 270 → ~10 audit findings).
- `vh` → `dvh` for mobile browser toolbars; vendor-prefix and `backdrop-filter` fallbacks; `browserslist` baseline declared.

### Tooling & docs
- `npm run setup`, `db:up`, `db:down`, `db:logs`, `db:setup`, `check:ssr`; `docker-compose.yml`; `MONGODB_DB` / `MONGODB_DIRECT_HOSTS` env vars; `.env.example` is no longer gitignored by mistake; bootstrap scrubs its password from `.env` and requires 8+ characters.
- New internal docs in `docs/` (environment, architecture, design system, admin, browser support, testing).
- Removed 58 unused imports.

## 2.1.0 — 2026-09-23 — Order tracking, admin fulfilment & privacy-safe checkout

Easier to prove where your gift is, and easier for the atelier to fulfil it.

### Features
- **Order placement with a shareable tracking ID** — booking an order now returns a `HQ-XXXXXX` id (e.g. `HQ-NMHRSS`) and a **Public Tracking** page so recipients can see live delivery/payment status without any account. Free 3-letter delivery mapping stays consumer-friendly.
- **Admin fulfilment studio at `/admin`** — password-gated dashboard with an orders list, a per-order **Fulfilment** editor, and a **Catalog Management** override manager (edit hampers, categories and prices; category edits flow instantly into the gallery, override layer merges on top of the shipped catalogue).
- **Privacy-safe track API** — the public tracking endpoint never leaks IP info, user-agent, referer or contact details returned values are sanitised to the essentials a customer actually needs.

### Security
- **Every admin route, API and editor is gated** — unauthenticated requests get a 401 (APIs) or a login form (pages) and never see admin data; wrong-password login is rejected; the session (httpOnly cookie) can be revoked via logout, after which every gate closes again flavors.

### Fixes
- **Tracker page reads the API response shape correctly** — the page's client code now uses the flat returned order object (was reading a nested `data.order` that never existed), so public tracking renders consistently.

## 2.0.0 — 2026-09-23 — Real pages & a perfectly sealed gift box

The storefront grew from one long page into dedicated pages, and the 3D gift box now seals perfectly in every size.

### Features
- **Dedicated pages for every section** — the storefront now runs on its own pages with real URLs: `/` home, `/customised`, `/catalog`, `/hampers`, `/bulk`, `/inspirations`, `/atelier`, `/scribe`, `/brochures` and `/pricing`. Header and footer links jump straight to the right page, and legal pages stay separate from the shop.
- **Shared cart state** — one store powers the badge, drawer, booking modal and pages, with the cart saved in the browser. The cart opens empty by default.

### Fixes
- **3D gift box seals perfectly in every size** — the lid, ribbon and rosette now close flush on all four box shapes (Cube, Wide, Tall and Long). Before, the Long and Tall boxes had misaligned lids and side faces; now all six faces meet edge-to-edge with the lid sitting level on top.
- **Same wording everywhere** — "Free delivery above INR 499" is used in one form across the site (prices use INR words, never the ₹ symbol).

## 1.1.0 — 2026-09-22 — Shopping cart & 3D variants

New ways to build and preview your gift before you order.

### Features
- **Complete shopping cart** — the old slide-over tray is now a real cart: quantities with +/− steppers, per-line subtotals, cart subtotal, a delivery fee that drops to FREE on orders over INR 499, grand total, per-line removal, and a clear-cart button. It opens from the header (`ROYAL CART`) and the badge always shows the live item count.
- **Add a custom Atelier hamper straight to your cart** — at the final "Summary" step there is a one-tap *Add This Hamper to Cart* button that converts your chosen packaging, slots, ribbon and wax seal into cart lines; the drawer opens instantly so you can review.
- **Unlimited cart size** — the vessel capacity cap is gone for catalogue additions, so the cart never blocks a purchase.
- **3D gift boxes now come in different sizes & lengths** — switched territory brings four proportions: Classic Cube, Wide Casket, Tall Trunk and Long Keepsake, all share the same themes, cross-ribbon dressing and unboxing animation.
- **Hand-tied 3D bouquet assembly** — a new Bouquet container type renders a kraft-paper cone, staggered bloom cluster, fairy lights and wax seal with a gentle sway instead of full rotation, plus an "Enchant" unbox interaction.
- **Hero container switcher** — Hampers/Bouquet toggle and shape chips live under the 3D preview; captions adapt to what is shown.

### Fixes
- **Emblems now centered on every face** — the vertical gold ribbon band was laid out in-flow (not absolutely positioned), shoving the medallion to the bottom of the back/left/right faces. All four faces now center their emblem and thin gold cross precisely.
- **db:test resilience** — the MongoDB connection test now falls back to a direct connection when the SRV DNS lookup fails instead of erroring out.

## 1.0.0 — 2026-09-22 — Storefront polish & launch readiness

### Features
- **Spotlight trio & lighter cards** — denser hero with a founder line, lighter catalogue cards, and a "Recent Bulk Fulfillments" trust strip.
- **3D unboxing refinement** — fixed 3D gift box geometry and add-a-4th "much more in every box" indicator chip.
- **Own-item suggestion** — the visualizer accepts a customer-typed item and slots it as a custom add-on.
- **Slim header & legal pages** — smaller header chrome, sticky-robust layout, and terms/privacy/EULA pages.
- **PWA & metadata** — favicon set, web manifest, theme-color, generated Open Graph image, JSON-LD, and a rewritten README.
- **Next.js 16 migration** — hydrated state kept stable, navigation trimmed, MongoDB Atlas connection test added.

---

© Hamper Queen. All rights reserved.