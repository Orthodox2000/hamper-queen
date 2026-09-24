/**
 * Order domain types shared across the storefront, admin panel, tracking pages
 * and the server-side order library.
 */

export type OrderStatus =
  | 'awaiting_payment'
  | 'confirmed'
  | 'crafting'
  | 'dispatched'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export const ORDER_STATUSES: OrderStatus[] = [
  'awaiting_payment',
  'confirmed',
  'crafting',
  'dispatched',
  'out_for_delivery',
  'delivered',
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  awaiting_payment: 'Awaiting Payment',
  confirmed: 'Confirmed',
  crafting: 'Crafting',
  dispatched: 'Dispatched',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export type PaymentState = 'awaiting_payment' | 'received';
export type PaymentMethod = 'upi' | 'bank_transfer' | 'advance_cod' | 'not_set';

export type PromoDiscountKind = 'flat' | 'percent';

/** Promo applied to an order: which coupon was redeemed and by what rule. */
export interface OrderPromo {
  code: string;
  kind: PromoDiscountKind;
  value: number;
  couponId: string;
}

export type OrderLineKind = 'product' | 'custom_hamper' | 'bulk';

export interface OrderLine {
  kind: OrderLineKind;
  productId?: string;
  itemCode?: string;
  name: string;
  priceDisplay: string;
  priceValue: number;
  qty: number;
  itemsIncluded?: string[];
  notes?: string;
}

export interface GeoPin {
  lat: number;
  lng: number;
  label?: string;
}

export interface OrderMeta {
  ip: string;
  userAgent?: string;
  referer?: string;
  browserLanguage?: string;
  /** Enriched IP details from ip-api.com (free IP details checker). */
  ipInfo?: {
    country?: string;
    countryCode?: string;
    regionName?: string;
    city?: string;
    zip?: string;
    lat?: number;
    lon?: number;
    timezone?: string;
    isp?: string;
    org?: string;
    as?: string;
  } | null;
}

export interface OrderEvent {
  status: OrderStatus;
  at: string; // ISO timestamp
  note?: string;
  by?: 'customer' | 'admin' | 'system';
}

export interface OrderTotals {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  grandTotal: number;
}

export interface OrderRecord {
  _id?: unknown;
  orderId: string; // Mongo ObjectId (string) alias
  trackingId: string;
  status: OrderStatus;
  payment: {
    state: PaymentState;
    method: PaymentMethod;
  };
  lines: OrderLine[];
  orderType: 'individual' | 'bulk';
  bulkQuantity?: number;
  customer: {
    fullName: string;
    email: string;
    mobilePhone: string;
    altPhone: string;
    recipientName: string;
  };
  delivery: {
    flatBuilding: string;
    streetAddress: string;
    landmark: string;
    city: string;
    pincode: string;
    geo: GeoPin;
  };
  preferences: {
    occasion: string;
    deliveryDate: string;
    timeSlot: string;
    waxSealDesign: string;
    cardMessage: string;
    addons: string[];
    customNotes: string;
  };
  totals: OrderTotals;
  promo?: OrderPromo;
  consent: {
    given: boolean;
    at: string;
  };
  meta: OrderMeta;
  events: OrderEvent[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/** Public (no-login) view of an order for the /track pages. */
export interface PublicOrder {
  orderId: string;
  trackingId: string;
  status: OrderStatus;
  payment: OrderRecord['payment'];
  lines: OrderLine[];
  orderType: OrderRecord['orderType'];
  bulkQuantity?: number;
  customer: {
    fullName: string;
    mobilePhone: string;
    email: string;
    recipientName: string;
  };
  delivery: OrderRecord['delivery'];
  preferences: Omit<OrderRecord['preferences'], 'customNotes'> & { customNotes?: string };
  totals: OrderTotals;
  promo?: OrderPromo;
  events: OrderEvent[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/** Catalog override row stored in MongoDB. */
export interface CatalogOverride {
  _id?: unknown;
  productId: string;
  fields: {
    name?: string;
    nameHinglish?: string;
    approxPrice?: string;
    pricingNote?: string;
    subtitle?: string;
    subtitleHinglish?: string;
    itemsIncluded?: string[];
    categoryLabel?: string;
  };
  updatedAt: string;
}