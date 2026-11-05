# Admin guide

Open **`/admin`** and sign in. Not linked from the storefront. All admin pages and APIs return a login form / `401` without a valid session.

## Signing in

The first **owner** account is created by `npm run db:bootstrap` (see ENVIRONMENT.md). Sessions last 7 days
(cookie `hq_admin`) and are stored in MongoDB. **Log out** is in the top bar of every admin screen.

## The top bar (every screen)

Orders · Catalog · Promo codes · Staff tabs, a **Storefront** link (opens the live site), and **Log out**.
Page-specific buttons (e.g. *New product*, *Public track page*) appear to the left of them.

## Orders (`/admin`)

* Stat cards count orders per status; click a status chip to filter. Search matches tracking ID, name, phone, email.
* **Statuses:** Awaiting payment → Confirmed → Crafting → Dispatched → Out for delivery → Delivered (or Cancelled).
* Click a tracking ID to open the order editor.

### Order editor (`/admin/orders/[id]`)

| Card | What it does |
| --- | --- |
| Order Fulfilment | Set **status**, **payment state** and method, add a **status note**. The note and status appear on the customer's public tracking page. **Save Fulfilment** |
| Customer & Delivery Details | Correct name, phones, email, address and pin. **Save Details** |
| Order Contents | The items, quantities and totals on the order |
| Event Timeline | Read-only history of every status change, with who and when |
| Delete Order | Permanently removes the order and its tracking link. **Locked while the order has a grand total** (a safety rail so paid/priced orders aren't lost by accident); cancel such orders instead |

The customer's link is `/track/<ID>`; the *Public track page* button opens it. The public API never exposes IP, user agent or contact details.

## Catalog overrides (`/admin/catalog`)

The static catalogue ships with the code; a **database entry wins** over it for the same product ID. Use *Edit Fields* on a product to change **Name, Name (Hinglish), Price (approxPrice), Pricing Note, Category Label and Items Included** without a deploy. *New product* adds one. Changes are live on `/api/catalog` immediately (the booking API also recomposes order lines from this merged catalogue, so edited prices apply to new orders).

## Promo codes (`/admin/promo`)

* **One code, many rows:** a single code string can have many single-use rows (e.g. `DIWALI100` × 50). **Generate unique codes** creates distinct random codes instead (e.g. `NEVV25-AB3X9K`), handy for events and campaigns.
* Fields: type (flat INR / percent), value, event name, minimum subtotal, expiry, active.
* A row is **redeemed** when an order uses it and can't be used again. Use *Copy* / *Copy all* to hand codes out.
* *Delete* asks for confirmation and is permanent ("single-use and unrecoverable"), so delete only what you are sure about.

## Staff (`/admin/staff`)

Only the **owner** role can manage staff (others get `403`). Create accounts (username, name, temporary password ≥ 8 chars, role `admin` or `owner`), **reset passwords**, **disable/enable** and delete. The last active owner can't be demoted or deleted, so you can't lock yourself out. Regular `admin` accounts can work orders, catalogue and promo codes.

## Good practice

* One account per person; disable instead of sharing passwords when someone leaves.
* Change temporary passwords on first login.
* Admin work should happen over HTTPS only: in production the session cookie is `Secure; HttpOnly; SameSite=Lax`.
