# Env Fix + DB Auth + Promo Codes + Bootstrap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the broken `.env`, move admin auth into MongoDB (multi-account + sessions), add a promo-code/discount-coupon system with a redeem animation at checkout, add a DB bootstrap script, verify the booking flow, clean test data, and leave one `FIRSTHAMPER` coupon for live testing.

**Architecture:** Next.js 16 App Router + React 19 + MongoDB driver. Auth moves from an env-backed sha256 token to scrypt-hashed `adminUsers` + DB `sessions`. Promos are single-use `promoCodes` rows (duplicates allowed) validated server-side and burned claim-then-delete atomically with order creation. Totals gain a `discount` + `promo` record. Admin gains Promos and Staff sections.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, `mongodb` 7.x, `node:crypto` scrypt, `motion` (animations), canvas-confetti.

**Spec:** `docs/superpowers/specs/2026-09-24-env-auth-promo-bootstrap-design.md`

## Global Constraints

- Runtime env dependence reduced to `MONGODB_URI` only — the app must NOT read `ADMIN_PASSWORD`.
- Never commit secret passwords; bootstrap accepts password via prompt or `HQ_BOOTSTRAP_ADMIN_PASSWORD` env only.
- Promo discount = `min(flat | round(subtotal*pct/100), subtotal)`; free-delivery threshold uses pre-discount subtotal.
- Promo rows may repeat the same code; each row single-use, deleted on redemption.
- Admin staff cannot delete themselves or the last active admin.
- Code style: TS strict (lint = `tsc --noEmit`), no new dependencies.
- All DB writes guarded with try/catch; storefront degrades gracefully when Mongo is down.

---

### Task 1: Repair `.env` and remove env-password reliance

**Files:**
- Modify: `.env` (rewrite with proper newlines)
- Modify: `.env.example`
- Modify: `src/lib/admin.ts` (remove env-password code paths — superseded in Task 2)

**Interfaces:**
- Consumes: nothing.
- Produces: clean `.env` with `MONGODB_URI` only; code no longer reads `ADMIN_PASSWORD`.

- [ ] **Step 1: Rewrite `.env`** — replace the single-line 1101-byte file with a parsed, commented file containing only `MONGODB_URI` (keep the real local credentials; file is gitignored) and commented placeholders for `HQ_BOOTSTRAP_ADMIN_USER` / `HQ_BOOTSTRAP_ADMIN_PASSWORD`.
- [ ] **Step 2: Rewrite `.env.example`** — document `MONGODB_URI` (required) + the two bootstrap-only vars, removing the `ADMIN_PASSWORD` entry.
- [ ] **Step 3: Verify cleanup** — confirm no source reads `ADMIN_PASSWORD` after Task 2 lands (grep).
- [ ] **Step 4: Commit** `.env.example` only (`.env` stays gitignored).

### Task 2: DB bootstrap script

**Files:**
- Create: `scripts/bootstrap-db.mjs`
- Modify: `package.json` (add `db:bootstrap` script)

**Interfaces:**
- Consumes: `MONGODB_URI` env, `HQ_BOOTSTRAP_ADMIN_USER` / `HQ_BOOTSTRAP_ADMIN_PASSWORD` env or interactive prompt.
- Produces: idempotently ensures collections + indexes; `adminUsers` owner account; prints all collection names.

- [ ] **Step 1:** Write script — connect (reuse SRV→direct fallback from `scripts/test-mongo.mjs`), ensure index builds mirror the app's `mongo.ts` + new `adminUsers`/`sessions`/`promoCodes` indexes, create owner admin (scrypt salt+hash) only if none exists, prompt for password when env is absent.
- [ ] **Step 2:** Run `npm run db:bootstrap` against the real DB with the prompt/env; verify output.
- [ ] **Step 3:** Verify `tsc --noEmit` still clean (script is `.mjs`, unaffected) and commit.

### Task 3: DB-backed admin auth (lib + API + login UI)

**Files:**
- Create: `src/lib/auth.ts`
- Modify: `src/lib/admin.ts` (thin re-export shim or delete and replace imports)
- Modify: `src/lib/mongo.ts` (add `getAdminUsersCollection`, `getSessionsCollection`, `getPromoCodesCollection`)
- Modify: `src/app/api/admin/login/route.ts`, `src/app/api/admin/logout/route.ts`
- Modify: `src/app/api/admin/catalog/route.ts`, `src/app/api/admin/catalog/[id]/route.ts`
- Modify: `src/app/api/orders/route.ts`, `src/app/api/orders/[id]/route.ts`
- Modify: `src/app/admin/page.tsx`, `src/app/admin/catalog/page.tsx`, `src/app/admin/orders/[id]/page.tsx`
- Modify: `src/app/admin/admin-login.tsx` (add username field)

**Interfaces:**
- `src/lib/auth.ts`:
  - `hashPassword(password: string): Promise<{hash, salt}>`
  - `verifyPassword(password: string, hash: string, salt: string): Promise<boolean>`
  - `createSession(username: string): Promise<string>` (random hex token, inserts row, 7-day expiry)
  - `getSessionUser(token: string | undefined): Promise<{ userId: string; username: string; role: string } | null>`
  - `destroySession(token: string): Promise<void>`
  - `requireAdmin(request: NextRequest): Promise<{ userId: string; username: string; role: string } | null>`
- Remove `isAdminRequest(request)` and `adminToken`/`isAdminToken` from `lib/admin.ts`; keep `ADMIN_COOKIE`.

- [ ] **Step 1:** Write `src/lib/auth.ts` + mongo collection getters.
- [ ] **Step 2:** Rewrite login route (POST `{username, password}` → session cookie) and logout (destroy session row).
- [ ] **Step 3:** Replace all `isAdminRequest` call sites with `await requireAdmin(request)` (401 on null) across the routes and server page gates (server pages call `requireAdmin(cookieValue)` via `adminTokenFromCookie`).
- [ ] **Step 4:** Update `admin-login.tsx` with username + password fields.
- [ ] **Step 5:** Verify with running dev server: login with the bootstrap admin works; catalog route returns 401 without cookie.
- [ ] **Step 6:** Commit.

### Task 4: Promo library + order totals changes

**Files:**
- Create: `src/lib/promo.ts`
- Modify: `src/lib/orders.ts` (add `discount` to totals; `promo` field; `applyCouponToTotals`; redeem in `createOrder`)
- Modify: `src/types/order.ts` (`OrderTotals.discount`, `OrderRecord.promo`, `PublicOrder` carries promo + discount)
- Modify: `src/app/api/orders/route.ts` (accept/validate `promoCode`, pass to createOrder)
- Modify: `src/app/api/orders/track/[trackingId]/route.ts` + track page (show discount + promo credit)

**Interfaces:**
- `src/lib/promo.ts`:
  - `normalizeCode(code: string): string`
  - `findRedeemableCode(code: string, subtotal: number)` → row | null
  - `applyPromoDiscount(row, subtotal): number`
  - `redeemPromoCode(code: string, subtotal: number, trackingId: string)` → `{ couponId, kind, value, discount } | null` (claim→returns; rollback handled by caller)
  - `rollbackPromoClaim(couponId: string): Promise<void>`
  - `burnPromoCoupon(couponId: string): Promise<void>`
- `createOrder(payload, meta)` signature unchanged; `payload.promoCode?: string`; doc gains `totals.discount` + `promo`.

- [ ] **Step 1:** Write types + `promo.ts` helpers.
- [ ] **Step 2:** Extend orders lib: compute discount, claim/burn/rollback, store promo record, include discount in sanitized public order.
- [ ] **Step 3:** Wire `promoCode` through `POST /api/orders`; on invalid code return `400 { error, promoError: true }` without burning.
- [ ] **Step 4:** Track page + track API surface the discount line.
- [ ] **Step 5:** Run `tsc --noEmit`; commit.

### Task 5: Promo validation endpoint + admin promo CRUD + UI

**Files:**
- Create: `src/app/api/promo/validate/route.ts`
- Create: `src/app/api/admin/promo/route.ts`
- Create: `src/app/api/admin/promo/[id]/route.ts`
- Create: `src/app/admin/promo/page.tsx`
- Create: `src/app/admin/promo-manager.tsx`
- Modify: `src/app/admin/orders-dashboard.tsx` (header link to Promos)

**Interfaces:**
- `POST /api/promo/validate` body `{ code, subtotal }` → `200 { valid, discount, kind, value, message } | 400 { valid:false, error }` (never burns).
- `GET /api/admin/promo` → `{ promos: PromoDto[] }`; `POST /api/admin/promo` body `{ code, discountKind, discountValue, eventName?, minSubtotal?, expiresAt?, count? }` (count>1 → batch duplicate rows); `DELETE /api/admin/promo/[id]`.
- `PromoDto = { _id, code, discount:{kind,value}, eventName?, minSubtotal?, expiresAt?, active, redeemedAt?, createdAt, updatedAt }`

- [ ] **Step 1:** Validate endpoint.
- [ ] **Step 2:** Admin promo routes (auth via `requireAdmin`).
- [ ] **Step 3:** `promo-manager.tsx` — list, filter (active/redeemed), create single/batch, delete; styled like `catalog-manager.tsx`.
- [ ] **Step 4:** `/admin/promo/page.tsx` gate + dashboard link.
- [ ] **Step 5:** `tsc --noEmit`; commit.

### Task 6: Checkout coupon UI + redemption animation

**Files:**
- Modify: `src/components/BookingOrderModal.tsx`

**Interfaces:**
- Consumes: `/api/promo/validate`; sends `promoCode` in order POST.
- Produces: `appliedPromo` state `{ code, kind, value, discount }`; `couponError` state; `couponApplied` boolean (also used in WhatsApp message + success receipt).

- [ ] **Step 1:** Add coupon input row beside the totals card in step 1 (Apply / Remove chip; disabled state while submitting).
- [ ] **Step 2:** On Apply → `POST /api/promo/validate`; success sets appliedPromo with a cut/tear animation (`motion`): coupon chip token, paper "process getting cut" strip, strikethrough on old grand total, discounted total slides in, gold confetti burst; failure shows inline error.
- [ ] **Step 3:** Recalculate order math client-side: `orderGrandTotal = subtotal + delivery - discount`; include `promoCode` in POST body.
- [ ] **Step 4:** Success receipt + WhatsApp message show "Coupon {code} applied — saved ₹X"; handle `promoError:true` server response by clearing the chip and showing the message.
- [ ] **Step 5:** `tsc --noEmit`; commit.

### Task 7: Staff management (adminUsers CRUD + UI)

**Files:**
- Create: `src/app/api/admin/staff/route.ts`
- Create: `src/app/api/admin/staff/[id]/route.ts`
- Create: `src/app/admin/staff-manager.tsx`
- Create: `src/app/admin/staff/page.tsx`
- Modify: `src/app/admin/orders-dashboard.tsx` (header link to Staff)

**Interfaces:**
- `GET /api/admin/staff` → `{ staff: Array<{_id, username, role, active, createdAt}> }` (no hashes).
- `POST /api/admin/staff` `{ username, password, role? }`; `DELETE /api/admin/staff/[id]` (guards: not self, not last active admin, not self-demote); `PATCH /api/admin/staff/[id]` `{ active?, role?, password? }`.

- [ ] **Step 1:** Staff routes.
- [ ] **Step 2:** `staff-manager.tsx` UI (list, add, deactivate/reactivate, password reset, delete).
- [ ] **Step 3:** Gate page + dashboard link.
- [ ] **Step 4:** `tsc --noEmit`; commit.

### Task 8: Integration tests + cleanup + FIRSTHAMPER

**Files:**
- Create: `scripts/test-promo.mjs`
- Modify: `package.json` (`db:test-promo` script)

**Interfaces:**
- Runs against real Mongo with a `TEST-PROMO-` prefix; expects env `HQ_TEST_ADMIN_USER`/`HQ_TEST_ADMIN_PASSWORD` or uses the bootstrap admin.

- [ ] **Step 1:** Test cases (direct lib/db calls, no HTTP where possible; createOrder via lib):
  - flat coupon: discount math on/under threshold
  - percent coupon rounding + cap at subtotal
  - expired coupon rejected
  - minSubtotal unmet rejected
  - duplicate-code rows: two rows same code; first order redeems one row, second order redeems the other
  - double-redeem on single row rejected (claim guard)
  - rollback: simulated order failure after claim → coupon still redeemable
  - booking validation edge cases (empty lines, bad pincode, missing geo, consent false, no name/phone)
  - brand-new sale: order stores `totals.discount` + `promo`
- [ ] **Step 2:** Run script; fix failures until green.
- [ ] **Step 3:** Cleanup — delete every `TEST-*` order/promo/admin/session created; verify zero leftovers.
- [ ] **Step 4:** Create exactly one active `FIRSTHAMPER` coupon in the DB (e.g. ₹200 flat, no expiry) via the admin API/lib using the bootstrap admin session.
- [ ] **Step 5:** Run `tsc --noEmit` + `next build`; run the Playwright booking flow (webapp-testing skill) end-to-end on the dev server: add to cart → booking step 1 (incl. coupon apply animation) → step 2 → submit → tracking shows discount → admin panel sees order + promos + staff.
- [ ] **Step 6:** Confirm test DB entries gone, `FIRSTHAMPER` present; commit final state + docs.

---

## Self-review notes

- Spec coverage: env fix (T1), bootstrap (T2), auth (T3), promo lib + totals (T4), validate + admin promo UI (T5), checkout animation (T6), staff (T7), integration tests + cleanup + FIRSTHAMPER (T8). All spec sections mapped.
- Type consistency: `PromoDto`, `discount: {kind, value}`, `OrderTotals.discount`, `OrderRecord.promo`, `requireAdmin(request)` used uniformly across routes and page gates.
- No placeholders: every task carries concrete file paths and signatures; code-level steps reference the spec's exact algorithms.