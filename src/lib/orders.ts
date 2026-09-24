/**
 * orders.ts
 * -----------------------------------------------------------------------------
 * Server-side order operations: tracking-ID generation, validation, creation,
 * lookup, admin updates, deletion, listing and public sanitization.
 */

import { ObjectId } from 'mongodb';
import { getOrdersCollection } from './mongo';
import {
  OrderLine,
  OrderMeta,
  OrderRecord,
  OrderStatus,
  ORDER_STATUSES,
  PaymentMethod,
  PaymentState,
  PublicOrder,
} from '../types/order';
import {
  burnPromoCoupon,
  claimPromoCode,
  normalizeCode,
  PromoRedeemError,
  rollbackPromoClaim,
} from './promo';

const TRACKING_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no 0/O/1/I
const TRACKING_LENGTH = 6;

export const FREE_DELIVERY_THRESHOLD = 499;
export const DELIVERY_FEE = 49;

/** Parse "INR 1,299" / "₹299" style price strings to a number. */
export function parsePriceString(price: string): number {
  const match = price.replace(/[₹Rs.,]/g, (c) => (c === ',' ? '' : '')).match(/[\d.]+/);
  if (!match) return 0;
  return Number(match[0]) || 0;
}

export function computeTotals(lines: OrderLine[]) {
  const subtotal = lines.reduce((sum, line) => sum + line.priceValue * Math.max(1, line.qty), 0);
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  return { subtotal, deliveryFee, discount: 0, grandTotal: subtotal + deliveryFee };
}

function randomTrackingCode(): string {
  let code = '';
  for (let i = 0; i < TRACKING_LENGTH; i++) {
    code += TRACKING_ALPHABET[Math.floor(Math.random() * TRACKING_ALPHABET.length)];
  }
  return code;
}

export async function generateTrackingId(): Promise<string> {
  const collection = await getOrdersCollection();
  for (let attempt = 0; attempt < 6; attempt++) {
    const trackingId = `HQ-${randomTrackingCode()}`;
    const existing = await collection.findOne({ trackingId }, { projection: { _id: 1 } });
    if (!existing) return trackingId;
  }
  throw new Error('Could not generate a unique tracking ID.');
}

export interface CreateOrderPayload {
  orderType: 'individual' | 'bulk';
  bulkQuantity?: number;
  lines: OrderLine[];
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
    geo: { lat: number; lng: number; label?: string };
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
  payment: { method: PaymentMethod };
  consent: boolean;
  promoCode?: string;
  browserLanguage?: string;
}

function cleanString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function validateOrderPayload(payload: Partial<CreateOrderPayload>): string[] {
  const errors: string[] = [];
  if (!cleanString(payload.customer?.fullName)) errors.push('Full name is required.');
  if (!cleanString(payload.customer?.mobilePhone)) errors.push('WhatsApp mobile number is required.');
  if (!Array.isArray(payload.lines) || payload.lines.length === 0) {
    errors.push('Please add at least one item to your order.');
  }
  if (!cleanString(payload.delivery?.flatBuilding)) errors.push('Flat / building is required.');
  if (!cleanString(payload.delivery?.streetAddress)) errors.push('Street / area is required.');
  if (!/^\d{6}$/.test(cleanString(payload.delivery?.pincode))) errors.push('Enter a valid 6-digit pincode.');
  if (!Number.isFinite(payload.delivery?.geo?.lat) || !Number.isFinite(payload.delivery?.geo?.lng)) {
    errors.push('Please confirm your exact delivery pin on the map.');
  }
  if (payload.consent !== true) {
    errors.push('Please accept the data-consent to submit your order.');
  }
  return errors;
}

export interface CreateOrderResult {
  trackingId: string;
  orderId: string;
  status: OrderStatus;
}

export async function createOrder(
  payload: CreateOrderPayload,
  meta: OrderMeta
): Promise<CreateOrderResult> {
  const collection = await getOrdersCollection();
  const trackingId = await generateTrackingId();
  const totals = computeTotals(payload.lines);
  const now = new Date().toISOString();

  let promo: OrderRecord['promo'];
  let promoClaim: Awaited<ReturnType<typeof claimPromoCode>>;
  const promoCode = normalizeCode(payload.promoCode ?? '');
  if (promoCode) {
    promoClaim = await claimPromoCode(promoCode, totals.subtotal, trackingId);
    if (!promoClaim) {
      throw new PromoRedeemError('That coupon is invalid, expired, or already used.');
    }
    totals.discount = promoClaim.discount;
    totals.grandTotal = Math.max(0, totals.subtotal + totals.deliveryFee - totals.discount);
    promo = {
      code: promoCode,
      kind: promoClaim.kind,
      value: promoClaim.value,
      couponId: promoClaim.couponId,
    };
  }

  const doc = {
    trackingId,
    status: 'awaiting_payment' as OrderStatus,
    payment: { state: 'awaiting_payment' as PaymentState, method: payload.payment.method },
    lines: payload.lines,
    orderType: payload.orderType,
    bulkQuantity: payload.orderType === 'bulk' ? payload.bulkQuantity ?? 1 : undefined,
    customer: {
      fullName: cleanString(payload.customer.fullName),
      email: cleanString(payload.customer.email),
      mobilePhone: cleanString(payload.customer.mobilePhone),
      altPhone: cleanString(payload.customer.altPhone),
      recipientName: cleanString(payload.customer.recipientName),
    },
    delivery: {
      flatBuilding: cleanString(payload.delivery.flatBuilding),
      streetAddress: cleanString(payload.delivery.streetAddress),
      landmark: cleanString(payload.delivery.landmark),
      city: cleanString(payload.delivery.city) || 'Mumbai',
      pincode: cleanString(payload.delivery.pincode),
      geo: {
        lat: payload.delivery.geo.lat,
        lng: payload.delivery.geo.lng,
        label: cleanString(payload.delivery.geo.label) || undefined,
      },
    },
    preferences: {
      occasion: cleanString(payload.preferences.occasion) || 'Birthday Celebration',
      deliveryDate: cleanString(payload.preferences.deliveryDate),
      timeSlot: cleanString(payload.preferences.timeSlot) || 'Evening (4:00 PM - 8:00 PM)',
      waxSealDesign: cleanString(payload.preferences.waxSealDesign) || 'Crown',
      cardMessage: cleanString(payload.preferences.cardMessage),
      addons: Array.isArray(payload.preferences.addons) ? payload.preferences.addons.map(String) : [],
      customNotes: cleanString(payload.preferences.customNotes),
    },
    totals,
    promo: promo ?? undefined,
    consent: { given: true, at: now },
    meta: {
      ip: meta.ip,
      ipInfo: meta.ipInfo ?? null,
      userAgent: meta.userAgent,
      referer: meta.referer,
      browserLanguage: typeof payload.browserLanguage === 'string' ? payload.browserLanguage.slice(0, 24) : undefined,
    },
    events: [{ status: 'awaiting_payment', at: now, by: 'customer' } as const],
    createdAt: now,
    updatedAt: now,
  };

  let result;
  try {
    result = await collection.insertOne(doc as object);
  } catch (error) {
    if (promoClaim) await rollbackPromoClaim(promoClaim.couponId);
    throw error;
  }
  if (promoClaim) await burnPromoCoupon(promoClaim.couponId);
  return { trackingId, orderId: String(result.insertedId), status: doc.status };
}

export interface AdminOrderPatch {
  status?: OrderStatus;
  payment?: { state?: PaymentState; method?: PaymentMethod };
  customer?: Partial<OrderRecord['customer']>;
  delivery?: Partial<OrderRecord['delivery']> & { geo?: OrderRecord['delivery']['geo'] };
  notes?: string;
  note?: string;
}

export async function updateOrder(orderId: string, patch: AdminOrderPatch, by: 'admin' = 'admin') {
  const collection = await getOrdersCollection();
  const existing = await collection.findOne({ _id: new ObjectId(orderId) });
  if (!existing) throw new Error('Order not found.');

  const now = new Date().toISOString();
  const setFields: Record<string, unknown> = { updatedAt: now };
  const events = Array.isArray(existing.events) ? [...existing.events] : [];

  if (patch.status && ORDER_STATUSES.includes(patch.status)) {
    setFields.status = patch.status;
    events.push({ status: patch.status, at: now, by, note: patch.note ? cleanString(patch.note) : undefined });
  }

  if (patch.payment) {
    const payment = { ...(existing.payment as object), ...patch.payment };
    if (patch.payment.state) payment.state = patch.payment.state;
    setFields.payment = payment;
  }

  if (patch.customer) {
    const customer = { ...(existing.customer as object) };
    for (const key of ['fullName', 'email', 'mobilePhone', 'altPhone', 'recipientName'] as const) {
      const val = patch.customer[key];
      if (typeof val === 'string') (customer as Record<string, string>)[key] = val.trim();
    }
    setFields.customer = customer;
  }

  if (patch.delivery) {
    const delivery = { ...(existing.delivery as object) };
    for (const key of ['flatBuilding', 'streetAddress', 'landmark', 'city', 'pincode'] as const) {
      const val = patch.delivery[key];
      if (typeof val === 'string') (delivery as Record<string, string>)[key] = val.trim();
    }
    const geo = patch.delivery.geo;
    if (geo && Number.isFinite(geo.lat) && Number.isFinite(geo.lng)) {
      setFields['delivery.geo'] = {
        lat: geo.lat,
        lng: geo.lng,
        label: geo.label ? cleanString(geo.label) : undefined,
      };
    }
    setFields.delivery = delivery;
  }

  if (typeof patch.notes === 'string') setFields.notes = patch.notes.trim() || null;

  setFields.events = events;

  await collection.updateOne({ _id: new ObjectId(orderId) }, { $set: setFields });
  const updated = await collection.findOne({ _id: new ObjectId(orderId) });
  return updated;
}

export async function deleteOrder(orderId: string) {
  const collection = await getOrdersCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(orderId) });
  if (result.deletedCount === 0) throw new Error('Order not found.');
  return { ok: true };
}

export async function lookupOrderByTrackingId(trackingId: string) {
  const collection = await getOrdersCollection();
  return collection.findOne({ trackingId: cleanString(trackingId).toUpperCase() });
}

export async function lookupOrderById(orderId: string) {
  const collection = await getOrdersCollection();
  if (!ObjectId.isValid(orderId)) return null;
  return collection.findOne({ _id: new ObjectId(orderId) });
}

export interface ListOrdersOptions {
  status?: OrderStatus | 'all';
  q?: string;
  limit?: number;
  skip?: number;
}

export async function listOrders({ status = 'all', q, limit = 50, skip = 0 }: ListOrdersOptions = {}) {
  const collection = await getOrdersCollection();
  const filter: Record<string, unknown> = {};
  if (status !== 'all' && ORDER_STATUSES.concat('cancelled').includes(status as OrderStatus)) {
    filter.status = status;
  }
  if (typeof q === 'string' && q.trim()) {
    const term = q.trim();
    filter.$or = [
      { trackingId: new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
      { 'customer.fullName': new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
      { 'customer.mobilePhone': new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
    ];
  }
  const [items, total] = await Promise.all([
    collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Math.min(limit, 200)).toArray(),
    collection.countDocuments(filter),
  ]);
  return { items, total, skip, limit };
}

export function toOrderRecord(doc: Record<string, unknown>): OrderRecord {
  return { ...(doc as unknown as OrderRecord), orderId: String((doc as { _id?: { toString(): string } })._id ?? '') };
}

/** Sanitize a full order into the public, no-login tracking view (no IP/meta). */
export function sanitizeOrderPublic(doc: Record<string, unknown>): PublicOrder {
  const record = toOrderRecord(doc);
  return {
    orderId: record.orderId,
    trackingId: record.trackingId,
    status: record.status,
    payment: record.payment,
    lines: record.lines,
    orderType: record.orderType,
    bulkQuantity: record.bulkQuantity,
    customer: {
      fullName: record.customer.fullName,
      mobilePhone: record.customer.mobilePhone,
      email: record.customer.email,
      recipientName: record.customer.recipientName,
    },
    delivery: record.delivery,
    preferences: {
      ...record.preferences,
    },
    totals: record.totals,
    events: record.events,
    notes: record.notes,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}