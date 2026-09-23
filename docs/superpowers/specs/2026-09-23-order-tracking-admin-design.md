# Hamper Queen — Order Tracking, Receipt & Admin System

## Goal

Persist orders in MongoDB, issue a simple shareable tracking ID + payment receipt per order,
capture IP metadata (server-side, enriched via a free IP-details API) with explicit consent,
pin exact delivery coordinates (Leaflet + OpenStreetMap, no API key), and give staff a
password-gated admin panel at `/admin` (never linked) to manage orders (full CRUD, status,
payment) and edit/add hampers & prices via MongoDB overrides on top of the code catalog.

## Decisions

- **Tracking ID**: `HQ-` + 6 chars from an unambiguous A-Z0-9 set (no 0/O/1/I), server-generated, uniqueness-checked.
- **Order statuses**: `awaiting_payment → confirmed → crafting → dispatched → out_for_delivery → delivered`, plus `cancelled`. Every transition appends a timestamped event.
- **Payment**: no gateway. Order created in `awaiting_payment`; admin flips `payment.state` to `received`. Customer sees "We'll share payment details on WhatsApp shortly".
- **IP capture**: server-side only, from `x-forwarded-for`/`x-real-ip`/`cf-connecting-ip`, enriched via `ip-api.com` (free, no key); stored in `order.meta.ipInfo`. Never taken from the client.
- **Consent**: required checkbox in the order form ("share contact, delivery location, IP/device info"). Blocked without it.
- **Map**: Leaflet + OSM tile layer, divIcon gold pin, Nominatim search + reverse geocode, browser locate button.
- **WhatsApp stays**: direct "Order on WA" prebuilt-message buttons remain on product cards, Atelier and Builder.
- **Cart**: store gains `productCartLines`; checkout (BookingOrderModal) aggregates product lines + the custom atelier hamper; cart clears after a successful order save.
- **Catalog overrides**: admin writes `catalogOverrides` keyed by `productId`; `src/lib/catalog.ts` merges over static `HAMPER_QUEEN_PRODUCTS`; override-only rows appear as new products. `GET /api/catalog` serves merged data.
- **Admin auth**: `ADMIN_PASSWORD` env (default `123`), sha256-compared; httpOnly cookie; every admin route/page re-checks the cookie. Not linked anywhere.

## Data model

Collection `orders`:
`{ _id, trackingId (unique idx), status, payment{state,method}, lines[], customer{}, delivery{flatBuilding,streetAddress,landmark,city,pincode,geo{lat,lng,label}}, preferences{deliveryDate,timeSlot,occasion,waxSeal,cardMessage,addons,customNotes,recipientName}, totals{subtotal,deliveryFee,grandTotal}, consent{given,at}, meta{ip,ipInfo,userAgent,referer}, events[], createdAt, updatedAt }`

Collection `catalogOverrides`: `{ productId (unique idx), fields{name?,nameHinglish?,approxPrice?,pricingNote?,subtitle?,itemsIncluded?,category?}, updatedAt }`

## API

- `POST /api/orders` — create (validates, IP-enriches, returns `{ trackingId, orderId }`).
- `GET /api/orders` — admin list (status filter, search, pagination).
- `GET|PATCH|DELETE /api/orders/[id]` — admin read/update (status, payment, customer, delivery, note)/delete.
- `GET /api/orders/track/[trackingId]` — public sanitized lookup (no meta).
- `POST|DELETE /api/admin/login|logout`.
- `GET|POST /api/admin/catalog`, `PATCH|DELETE /api/admin/catalog/[id]`.
- `GET /api/catalog` — merged catalog (public; static fallback if DB down).

## Routes

- `/track` — lookup box. `/track/[trackingId]` — status, receipt, map marker, timeline, print.
- `/admin` — gate + order dashboard. `/admin/orders/[id]` — detail + status stepper + edit + delete.
- `/admin/catalog` — hamper override manager (edit price/details, add new, delete override).

## Verification

`npm run lint` (tsc) clean; browser-test customer create → track page → admin update.