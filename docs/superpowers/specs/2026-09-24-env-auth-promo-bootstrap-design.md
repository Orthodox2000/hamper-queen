# Env Fix + DB Auth + Promo Codes + Bootstrap — Design

**Date:** 2026-09-24
**Status:** Approved in chat

## Problem

1. `.env` is malformed (zero line breaks — 1101 bytes on one line with literal backtick-n sequences), which broke local runtime env yesterday.
2. Admin auth depends on an env password (`ADMIN_PASSWORD` default `"123"`) + a deterministic sha256 token cookie — no session revocation, no multi-user, credentials not stored in DB.
3. No promo / discount coupon support anywhere.
4. No DB bootstrap/schema story; no seed path for a manual-test coupon.

## Goals

- Fix the `.env` file and reduce runtime env dependence to `MONGODB_URI` only.
- Migrate admin auth to MongoDB: multiple admin accounts (username + password), scrypt-hashed, DB-backed sessions, staff management UI.
- Add a promo-code / discount-coupon system: admin CRUD (single + batch), public validate endpoint, checkout integration with a redeem animation, single-use rows burned atomically with order creation. Duplicate code strings allowed (each row independently redeemable).
- Add an idempotent DB bootstrap script + documented schema.
- Verify the full booking flow, clean all test data, and leave exactly one `FIRSTHAMPER` coupon in the DB for live manual testing.

## Decisions (from user)

- Discount type: **both** flat INR amount and % — chosen per coupon.
- Code format: **free-form, auto-uppercase** (max 16 chars), e.g. `FIRSTHAMPER`.
- Duplicate semantics: **rows may repeat the same code string**; each row is single-use and deleted on redemption.
- Burn timing: **when the order is saved** (atomic with order creation; coupon survives if the order fails).
- Admin auth: **DB multiple admin accounts** (username + password).

## Architecture

- `src/lib/auth.ts` — scrypt hashing, `adminUsers` + `sessions` collections, async session guard.
- `src/lib/promo.ts` — promo collection access, validation, discount math, claim + burn redemption.
- `src/lib/orders.ts` — totals gain `discount` + `promo` field; createOrder performs the redeem.
- `src/app/api/promo/validate/route.ts` — public preview endpoint.
- `src/app/api/admin/promo*/...` — admin promo CRUD.
- `src/app/api/admin/staff/...` — staff CRUD.
- `src/app/admin/promo/page.tsx` + `promo-manager.tsx` — promo UI (mirrors catalog-manager patterns).
- `BookingOrderModal.tsx` — coupon input + redeem animation + payload.
- `scripts/bootstrap-db.mjs` — idempotent setup (indexes + first owner admin, password from prompt/env, never committed).
- `scripts/test-promo.mjs` — integration test suite.

## Data model

### `adminUsers`
`{ username: string (unique, lower), passwordHash: string, passwordSalt: string, role: 'owner'|'admin', active: boolean, createdAt, updatedAt }`

### `sessions`
`{ token: string, userId: ObjectId, username: string, createdAt, expiresAt }` — 7-day expiry.

### `promoCodes`
`{ code: string (uppercase), discount: { kind: 'flat'|'percent', value: number }, eventName?: string, minSubtotal?: number, expiresAt?: string|null, active: boolean, redeemedAt?: string|null, createdAt, updatedAt, createdBy?: string }`
- Index `{ code: 1 }` (non-unique), `{ redeemedAt: 1 }`.

### `orders` (delta)
`totals` gains `discount: number`; new top-level `promo?: { code, kind, value, couponId }`.

## Redemption algorithm (claim-then-burn)

1. Validate order lines and compute `subtotal`.
2. Find one claimable row: `code=upper(trim), active=true, redeemedAt=null, (expiresAt=null|future), subtotal>=minSubtotal`.
3. Claim atomically: `findOneAndUpdate({_id, redeemedAt:null}, {$set:{redeemedAt:now, claimedFor:`<trackingId>`}})`.
4. Insert order (discount applied to totals, promo metadata stored).
5. Burn: `deleteOne({_id})`.
6. On any failure after claim (before successful insert): rollback — unset `redeemedAt`/`claimedFor`.
7. Discount = `min(value if flat else round(subtotal*value/100), subtotal)`; free-delivery threshold evaluated on pre-discount subtotal.

## Security

- Passwords never logged, never returned, never committed. Bootstrap reads password from prompt or `HQ_BOOTSTRAP_ADMIN_PASSWORD` env.
- `isAdminRequest` replaced everywhere by async DB-backed session check; login verifies scrypt hash; logout deletes the session row.
- Staff: cannot delete yourself or the last active admin; deactivated users lose access immediately.