# Changelog

All notable changes to Hamper Queen are documented here. Grouped by audience value.

## 1.1.0 — 2026-09-22 — Shopping cart & 3D variants

New ways to build and preview your gift before you order.

### Features
- **Complete shopping cart** — the old slide-over tray is now a real cart: quantities with +/− steppers, per-line subtotals, cart subtotal, a delivery fee that drops to FREE on orders over ₹499, grand total, per-line removal, and a clear-cart button. It opens from the header (`ROYAL CART`) and the badge always shows the live item count.
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