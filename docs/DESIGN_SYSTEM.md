# Design system

Source of truth: `src/app/globals.css`. If a value is not a token there, it should not be in a component.

## Typography (self-hosted, no external font requests)

| Role | Font | Where it is set |
| --- | --- | --- |
| Headings (`h1–h3`, `.font-seasons`, `.font-cinzel`, `.font-cormorant`) | **Fraunces** (variable, `SOFT` axis = 100) | `--font-serif` |
| Highlighted words in headlines | **Dancing Script** with a gold→rose gradient | `.accent-script` / `--font-script` |
| Body & UI | **Plus Jakarta Sans** (variable) | `--font-sans` |
| Logo wordmark only | The Seasons | `.font-brand` / `--font-brand` |

Fonts load from npm (`@fontsource-variable/*`, imported in `app/layout.tsx`); there is no Google Fonts request.

**`.accent-script` clipping rule:** gradient text only paints inside its element box, so it keeps
`line-height: 1.35` and bottom padding. Do not shrink these or descenders (g, p, y, f) get cut off.

```tsx
<h2 className="section-title">Gift ideas &amp; <span className="accent-script">chocolate bouquets</span></h2>
```

## Colour tokens (Tailwind classes)

`ink`, `ink-soft`, `cocoa` (body), `stone` (secondary), `mist` (placeholder/disabled),
`gold-50…700` (use **700** for gold *text* on light backgrounds), `cream-50…300`, `line`, `line-strong`,
`blush-50/100`, `crimson`, `whatsapp`, `whatsapp-dark`.

**Contrast rules** (all measured, see TESTING.md): body text AA 4.5:1, large text 3:1. White text only on
`ink`, `gold-700`, `emerald-700`, `whatsapp`. For colours that come from data (chips, product art), use
`readableOn(bg)` from `utils/color.ts` instead of hard-coding `text-white`.

## Spacing & layout

| Token / class | Value |
| --- | --- |
| `.container-page` | max 80rem, fluid gutter `--gutter` (16→32px) |
| `.section` | vertical rhythm `--section-y` (56→96px) |
| `.section-head` + `.section-title` + `.section-lede` | the one heading block every section uses |
| `.grid-cards` | 1 / 2 / 3 columns, one gap |
| Surfaces | alternate `bg-cream-100` and `.surface-warm` so white cards always sit on a tint |

## Elevation

`shadow-soft` (resting cards) · `shadow-lift` (raised panels) · `shadow-float` (modals, pop-outs) · `--shadow-glow` (gold buttons).
White cards must have a ring **and** a shadow; never white-on-white with neither.

## Components (all in `@layer components`, so Tailwind utilities can override them)

`.btn` + `.btn-primary | .btn-gold | .btn-ghost | .btn-whatsapp` + `.btn-sm` · `.chip` (`aria-pressed` / `.chip-active`) ·
`.card` + `.card-hover` · `.field` (inputs/selects/textareas) · `.eyebrow` · `.divider`.

## Motion

* One duration (`--default-transition-duration: 250ms`) and one curve (`--ease-soft`) for UI; springs (`cubic-bezier(.34,1.56,.64,1)`) only for "pop" moments.
* Animate **transform and opacity only.**
* Hover effects live inside `@media (hover: hover) and (pointer: fine)`; touch devices never get stuck hovers.
* Current hover vocabulary: button sheen sweep, arrow nudge, gift/bag icon wiggle, chip lift, card lift + gradient-border glow + artwork zoom (`.card-art`), nav gold underline (`.nav-underline`).
* Scroll reveal is CSS-only (`animation-timeline: view()` behind `@supports`), applied to `.section-head`, `.reveal`, `.grid-cards > *`. Browsers without support just show the content. Nothing is hidden before JS runs.
* Page entrance: `app/(shop)/template.tsx` fades each route in.
* Everything is silenced by `prefers-reduced-motion`.

## 3D box and bouquet

* `ThreeDGiftBox` rotates via `requestAnimationFrame`, writing `transform` to a ref (no React renders per frame); it pauses off-screen, in hidden tabs and for reduced motion.
* Opening a container springs four readable item cards out in an arc (`PopOutItems`); the lid slides aside. In the hero it sits on a fixed-size **stage** (`size="md"`, `compact`) so switching colour/type never changes panel height.
* Bouquets are `BouquetArt` (SVG). Palette colours come from `BOUQUET_PALETTE_LIST` in `data/boxThemes.ts`; add a palette there and it recolours paper, blooms and ribbon automatically.

## Adding a new section - checklist

1. `<section className="section bg-cream-100">` → `<div className="container-page">` → `<div className="section-head">…</div>`.
2. Cards: `className="card card-hover"`, graphics wrapped in `.card-art`.
3. Buttons/inputs from the classes above; no raw hex; no `uppercase tracking-widest` labels.
4. Run the contrast audit (TESTING.md) and check at 390 / 1024 / 1440.

## Icons & app identity

* **Small sizes use the crown only** (gold `#C68F1E` on ink `#141210`); the full seal with text is only used at 192px and above on cream.
* Files: `src/app/favicon.ico`, `icon.png`, `apple-icon.png` (Next file conventions, auto-linked) and `public/icons/*` (manifest, Windows tile). Maskable icons keep the crown inside the 80% safe zone.
* Never edit these by hand: replace `public/hamper.png` and run `npm run icons`.
* After deploying, favicons are cached aggressively: hard-refresh or open in a private window to verify.
