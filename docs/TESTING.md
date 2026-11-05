# Testing & verification

There is no unit-test framework in this repo; correctness is guarded by the type-checker, a server-render
smoke test, and repeatable end-to-end and visual audits. Run these before every merge.

## 1. Always

```bash
npx tsc --noEmit        # = npm run lint
npm run build
```

Optional cleanliness check (reports unused imports/locals): `npx tsc --noEmit --noUnusedLocals`.

## 2. SSR smoke test

```bash
npm run build && npm run start          # terminal 1
npm run check:ssr                       # terminal 2   (BASE_URL=https://... for a deployment)
```

Fetches every public route **without JavaScript** and fails on: non-200, Next.js error shells, HTML under 4 kB
(empty shell), missing `<title>`, `<h1>` or viewport meta, missing key strings, or an API route that
returns HTML instead of JSON. Also checks `robots.txt`, `sitemap.xml`, `manifest`.

## 3. Database & admin flow (needs MongoDB)

```bash
npm run db:up && npm run db:setup && npm run dev
```

Manual end-to-end checklist (this exact flow is what was automated and verified for release 2.2.0):

1. Home → **Book & Pinpoint Delivery** on a product → fill name + phone → *Continue to delivery & payment*.
2. Fill address, tick both consents → **Confirm Order & Get Tracking ID** → note the `HQ-XXXXXX` id.
3. Open `/track/<id>` - id and status are shown.
4. `/admin` → wrong password is rejected; correct password signs in; the new order is listed.
5. Open the order → set status **Confirmed** → *Save Fulfilment* → reload `/track/<id>`: the new status shows.
6. Visit Catalog / Promo codes / Staff tabs; **Log out**; `/admin/staff` must show the login form again.

Re-run `npm run db:bootstrap` a second time: it must report existing indexes/owner and change nothing.

## 4. Visual & accessibility audits

* **Contrast audit:** for every visible text node compute `color` vs the effective background (walk up the DOM, blend alpha, average gradient stops) and flag < 4.5:1 (< 3:1 for ≥ 24px or ≥ 18.66px bold). Ignore text over photos. Release 2.2.0: Customise page 270 → ~10 findings (disabled controls + text over images).
* **Layout:** check 1440 / 1180 / 1024 / 390. Hero columns must be the same height (verified 558 = 558, 688 = 688 at 1024) and the panel height must not change when switching Hampers / Bouquet / Tray / Gift Bag.
* **Overflow:** `document.documentElement.scrollWidth <= clientWidth` at 390.
* **Reduced motion:** enable the OS setting; nothing should animate or auto-rotate.

## 5. Scripts

| Script | Purpose |
| --- | --- |
| `npm run setup` | create `.env` |
| `npm run db:test` | connectivity |
| `npm run db:bootstrap` / `db:setup` | collections, indexes, owner |
| `npm run db:test-promo` | promo redemption self-test |
| `npm run check:ssr` | SSR smoke test |

## 6. Known limits of the current automation

* Automated browser runs were **Chromium only**; Safari/Firefox rely on the checklist in BROWSER_SUPPORT.md.
* The end-to-end run used a MongoDB-compatible server (FerretDB) because real `mongod`/Atlas weren't reachable from the build sandbox. It supports everything the app uses except TTL indexes, which is why TTL creation is tolerated. Run the checklist once against real MongoDB/Atlas before launch.
* Reverse geocoding/search use Nominatim; behaviour was verified with mocked responses, not live traffic.
