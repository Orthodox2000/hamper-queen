# Hamper Queen — Database Schema

Managed by `npm run db:bootstrap` (`scripts/bootstrap-db.mjs`, idempotent). Database name: **`hamper_queen`** (MongoDB Atlas).

## Collections

### `orders`
Bookings created through the concierge/booking modal (`POST /api/orders`) or seeded by staff.

```ts
{
  _id: ObjectId,
  trackingId: string,            // "HQ-" + 6 chars, no 0/O/1/I
  status: OrderStatus,           // awaiting_payment | confirmed | crafting | dispatched
                                 // | out_for_delivery | delivered | cancelled
  payment: { state: 'awaiting_payment' | 'received', method: 'upi' | 'bank_transfer' | 'advance_cod' | 'not_set' },
  orderType: 'individual' | 'bulk',
  bulkQuantity?: number,
  lines: Array<{
    kind: 'product' | 'custom_hamper' | 'bulk',
    productId?: string,
    itemCode?: string,
    name: string,
    priceDisplay: string,        // human label, e.g. "INR 1,299"
    priceValue: number,          // numeric price used for totals
    qty: number,
    itemsIncluded?: string[],
    notes?: string,
  }>,
  customer: {
    fullName, email, mobilePhone, altPhone, recipientName: string,
  },
  delivery: {
    flatBuilding, streetAddress, landmark, city, pincode: string,
    geo: { lat: number, lng: number, label?: string },   // pinned map point
  },
  preferences: {
    occasion, deliveryDate, timeSlot, waxSealDesign, cardMessage: string,
    addons: string[],
    customNotes: string,
  },
  totals: {
    subtotal: number,            // Σ line priceValue × qty
    deliveryFee: number,         // 49 unless subtotal ≥ 499 (FREE_DELIVERY_THRESHOLD)
    discount: number,            // promo discount applied (0 when none)
    grandTotal: number,          // subtotal + deliveryFee - discount
  },
  promo?: {                       // set only when a coupon was redeemed
    code: string,                 // e.g. "FIRSTHAMPER"
    kind: 'flat' | 'percent',
    value: number,                // 200 or 10 (%)
    couponId: string,             // ObjectId of the single-use row it consumed
  },
  consent: { given: boolean, at: string },
  meta: { ip?, ipInfo?, userAgent?, referer?, browserLanguage? },   // admin-only (never public)
  notes?: string | { admin: string; system?: string },             // staff notes (public track page)
  events: Array<{ status: OrderStatus, at: string, by: 'customer' | 'admin' }>,
  createdAt: string,   // ISO
  updatedAt: string,
}
```

Indexes (bootstrap):
- `trackingId` — **unique** (`trackingId_1`)
- `createdAt` — desc (dashboard listing)
- `status` + `createdAt` (filtered listing)

### `promoCodes`
Single-use coupon rows. **The same `code` string may appear on many rows** — one row per attendee/event — each row is consumed independently.

```ts
{
  _id: ObjectId,
  code: string,                    // normalized uppercase, ≤ 16 chars (e.g. "FIRSTHAMPER")
  discount: { kind: 'flat' | 'percent', value: number },
  eventName?: string,              // human label, e.g. "Neev 2026 Corporate Gifting"
  minSubtotal?: number | null,     // minimum order subtotal to use the code
  expiresAt?: string | null,       // ISO; past/null means expired / no expiry
  active: boolean,                 // manual kill-switch
  redeemedAt?: string | null,      // when claimed
  claimedFor?: string,             // trackingId of the order that claimed it
  createdAt: string,
  updatedAt: string,
  createdBy?: string,              // admin userId
}
```

Redemption contract (`src/lib/promo.ts`):
1. **Claim** — atomic `findOneAndUpdate` of an eligible row (`active`, `redeemedAt: null`, not expired, `minSubtotal` satisfied) setting `redeemedAt` + `claimedFor`.
2. **Store** — order is inserted with `totals.discount` + `promo`. If insert fails → **rollback** (`redeemedAt` cleared) so the coupon survives.
3. **Burn** — `deleteOne` after the order is safely stored. A crash between claim and burn leaves a claimed-but-unburned row (never double-spendable).

`GET /api/promo/validate` is **preview-only** — it never claims or burns.

Indexes (bootstrap):
- `code` (`idx_code`)
- `redeemedAt` (`idx_redeemedAt`)

### `adminUsers`
Panel accounts. Passwords are scrypt (`randomBytes(16)` salt, 64-byte hash, hex) — **no plaintext, ever**.

```ts
{
  _id: ObjectId,
  username: string,               // lowercase, unique (login handle)
  name?: string,                  // display name
  passwordHash: string,           // scrypt hex
  passwordSalt: string,           // scrypt salt hex
  role: 'owner' | 'admin',        // owner can manage staff + all accounts
  active: boolean,                // false = login blocked, sessions dropped
  createdAt: string,
  updatedAt: string,
  createdBy?: string,             // userId that created this account
}
```

Indexes (bootstrap):
- `username` — **unique** (`uniq_username`)

Guards:
- Only the **owner** can create/reset/disable/delete accounts (403 otherwise).
- No self-demote / self-deactivate / self-delete.
- Never remove the last **active** admin, nor the last active **owner**.

### `sessions`
Signed-in staff sessions (`hq_admin` httpOnly cookie, 7-day expiry).

```ts
{
  _id: ObjectId,
  token: string,                  // 64-hex random, unique
  userId: string,                 // adminUsers._id
  username: string,
  createdAt: string,
  expiresAt: string,              // usually now + 7 days
}
```

Indexes (bootstrap):
- `token` — **unique** (`uniq_token`)
- `expiresAt` — TTL `expireAfterSeconds: 0` (`ttl_expiresAt`) — Mongo auto-deletes expired sessions.

### `catalogOverrides`
Optional per-product price/availability overrides managed from `/admin/catalog`.

```ts
{
  _id: ObjectId,
  productId: string,              // matches catalog product id (unique)
  overridePrice?: string,         // display price to swap in
  overrideStatus?: string,        // e.g. 'low_stock' | 'available' | ...
  updatedAt: string,
  updatedBy?: string,
}
```

Indexes (bootstrap):
- `productId` — unique (`productId_1`)

## Bootstrap behaviour

Rerunning `npm run db:bootstrap` is safe:
- collections/indexes are created only if missing (existing indexes with equivalent keys are kept);
- the owner admin is created **only when `adminUsers` is empty** (guarded — never overwrites).

Bootstrap reads credentials from `HQ_BOOTSTRAP_ADMIN_USER` / `HQ_BOOTSTRAP_ADMIN_PASSWORD` (gitignored `.env`) or an interactive prompt. Nothing is hardcoded or committed.