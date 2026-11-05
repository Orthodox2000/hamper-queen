# Browser support

## Baseline

Declared in `package.json › browserslist` and driven by Tailwind CSS 4 (it relies on `@property` and `color-mix()`):

| Browser | Minimum |
| --- | --- |
| Chrome / Edge | 111 |
| Safari / iOS Safari | 16.4 |
| Firefox | 128 |

Older browsers are not supported (they would render unstyled gradients/shadows). This covers ~all current phones and desktops.

## What we do for compatibility

| Concern | Handling |
| --- | --- |
| Vendor prefixes | Generated at build from the browserslist (verified in the compiled CSS: `-webkit-backdrop-filter`, `-webkit-mask-composite`, …). Hand-written gradient text and masks add `-webkit-background-clip`, `-webkit-text-fill-color`, `-webkit-mask` explicitly |
| `backdrop-filter` missing | `@supports not` rule makes the sticky header nearly opaque |
| Mobile browser toolbars | `vh` units replaced with `dvh` (`min-h-dvh`, `max-h-[72dvh]`) so modals/pages don't clip |
| Scroll-driven reveals | Pure progressive enhancement behind `@supports (animation-timeline: view())`; other browsers show content immediately |
| Hover on touch | All hover effects gated by `(hover: hover) and (pointer: fine)` |
| iOS input zoom | Inputs are 16px on small screens |
| Reduced motion | Global `prefers-reduced-motion` block; 3D rotation and carousels also stop |
| Gradient headline descenders | `.accent-script` keeps a generous line box + padding (Safari/Firefox clip text-gradients tightly) |
| Fonts | Self-hosted variable WOFF2 with `font-display: swap`; system fallbacks declared |
| SSR / no-JS | Content is in the server HTML (see TESTING.md › SSR) |

## Known risk areas to eyeball in Safari and Firefox

* **3D box (`transform-style: preserve-3d`)**: Safari flattens 3D children if an ancestor has `overflow:hidden`, `filter` or `opacity < 1` on the *same* element. The rig avoids this; keep it that way when editing.
* **SVG bouquet** uses `transform-box: fill-box` for sway/bloom motion (supported Safari 11+, Firefox 55+).
* **Map**: Leaflet + CARTO tiles; test pinch-zoom on iOS Safari.
* **`text-wrap: balance`** is progressive: unsupported browsers just wrap normally.

## How to test

Automated checks in this repo run in **Chromium only**. Before a release, spot-check the matrix below
(BrowserStack or real devices):

| Check | Chrome | Safari (macOS) | iOS Safari | Firefox | Android Chrome |
| --- | --- | --- | --- | --- | --- |
| Home hero + 3D box open/close | ☐ | ☐ | ☐ | ☐ | ☐ |
| Bouquet tab, all 4 colours | ☐ | ☐ | ☐ | ☐ | ☐ |
| Booking modal → map pin drag/search | ☐ | ☐ | ☐ | ☐ | ☐ |
| Header blur, mobile menu | ☐ | ☐ | ☐ | ☐ | ☐ |
| Card hover / touch tap | ☐ | ☐ | ☐ | ☐ | ☐ |
| Admin login + order edit | ☐ | ☐ | ☐ | ☐ | ☐ |

Playwright can run the same flows on all three engines: `npx playwright install` then point it at `npm run build && npm run start`.
