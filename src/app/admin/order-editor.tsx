'use client';

/**
 * order-editor.tsx
 * -----------------------------------------------------------------------------
 * Authenticated per-order management: status transitions with an optional note,
 * payment received/method toggles, editable customer & delivery details, order
 * notes, full event timeline, and delete.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronDown,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  MapPin,
  Save,
  Trash2,
  Truck,
  XCircle,
  Crown,
  Globe,
  ShieldAlert,
} from 'lucide-react';
import {
  OrderRecord,
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  OrderStatus,
  PaymentMethod,
} from '../../types/order';
import { HAMPER_QUEEN_OFFICIAL_CONTACT } from '../../data/hamperQueenCatalog';

interface Props {
  orderId: string;
}

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  upi: 'UPI (GPay / PhonePe / Paytm)',
  bank_transfer: 'Direct Bank Transfer',
  advance_cod: '50% Advance + COD',
  not_set: 'Not set',
};

const STATUS_BADGE: Record<string, string> = {
  awaiting_payment: 'bg-amber-50 text-[#8C6821] border-[#D4AF37]/60',
  confirmed: 'bg-sky-50 text-sky-700 border-sky-200',
  crafting: 'bg-violet-50 text-violet-700 border-violet-200',
  dispatched: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  out_for_delivery: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  delivered: 'bg-[#ECFDF5] text-[#1E7B3C] border-[#A7F3D0]',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

export function OrderEditor({ orderId }: Props) {
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Editable draft
  const [status, setStatus] = useState<OrderStatus>('awaiting_payment');
  const [statusNote, setStatusNote] = useState('');
  const [paymentState, setPaymentState] = useState<'awaiting_payment' | 'received'>('awaiting_payment');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [fullName, setFullName] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [email, setEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [flatBuilding, setFlatBuilding] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setNotFound(false);
    setError('');
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
      if (res.status === 404) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error('Unauthorized or unavailable.');
      const o = (await res.json()) as OrderRecord;
      setOrder(o);
      setStatus(o.status);
      setPaymentState(o.payment.state);
      setPaymentMethod(o.payment.method);
      setFullName(o.customer.fullName);
      setMobilePhone(o.customer.mobilePhone);
      setAltPhone(o.customer.altPhone);
      setEmail(o.customer.email);
      setRecipientName(o.customer.recipientName);
      setFlatBuilding(o.delivery.flatBuilding);
      setStreetAddress(o.delivery.streetAddress);
      setLandmark(o.delivery.landmark);
      setCity(o.delivery.city);
      setPincode(o.delivery.pincode);
      setNotes(o.notes ?? '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load order.');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    load();
  }, [load]);

  const events = useMemo(() => (order?.events ?? []).slice().reverse(), [order]);

  const save = async (event?: React.FormEvent) => {
    event?.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          note: statusNote || undefined,
          payment: { state: paymentState, method: paymentMethod },
          customer: { fullName, mobilePhone, altPhone, email, recipientName },
          delivery: { flatBuilding, streetAddress, landmark, city, pincode },
          notes,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Update failed.');
      }
      setStatusNote('');
      setMessage('Order saved.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save order.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Permanently delete order ${order?.trackingId ?? orderId}? This cannot be undone.`)) return;
    if (!window.confirm('Are you absolutely sure? This removes the order record and its tracking link forever.')) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed.');
      window.location.href = '/admin';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete order.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center gap-3 text-[#6B6559]">
        <Loader2 className="w-8 h-8 animate-spin text-[#B8860B]" />
        <p className="text-sm font-semibold">Loading order…</p>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center gap-4">
        <XCircle className="w-10 h-10 text-red-500" />
        <p className="text-sm font-semibold text-[#524B40]">This order could not be found.</p>
        <Link href="/admin" className="text-xs font-bold text-[#8C6821] hover:underline">
          <ArrowLeft className="w-4 h-4 inline -ml-1" /> Back to dashboard
        </Link>
      </div>
    );
  }

  const canDelete = order.totals.grandTotal === 0;

  return (
    <div className="min-h-screen bg-[#FAF9F5]">
      <header className="sticky top-0 z-20 bg-[#141414] text-white border-b border-[#D4AF37]/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              All orders
            </Link>
            <div className="w-px h-6 bg-white/20" />
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#DFBA54]/20 border border-[#DFBA54] flex items-center justify-center text-[#DFBA54]">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-cinzel text-sm font-bold tracking-wide font-mono">{order.trackingId}</h1>
                <p className="text-[10px] text-white/60">
                  Placed {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
            </div>
          </div>
          <a
            href={`/track/${order.trackingId}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-[#DFBA54]" />
            <span className="hidden sm:inline">Public Track Page</span>
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs">{error}</div>
        )}
        {message && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            {message}
          </div>
        )}

        {/* Status + Payment management */}
        <form onSubmit={save} className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#D4AF37]/50 shadow-sm space-y-6">
          <h2 className="font-cinzel text-sm font-bold uppercase tracking-widest text-[#141414]">
            Order Fulfilment
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6821] mb-1.5">
                Status
              </label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OrderStatus)}
                  className="w-full appearance-none px-4 py-3 rounded-2xl bg-white border border-[#E5E0D6] text-xs font-semibold focus:outline-hidden focus:border-[#B8860B] cursor-pointer"
                >
                  {([...ORDER_STATUSES, 'cancelled'] as OrderStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {ORDER_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6821] pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6821] mb-1.5">
                Payment State
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentState('awaiting_payment')}
                  className={`px-3 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                    paymentState === 'awaiting_payment'
                      ? 'bg-amber-50 border-[#D4AF37] text-[#8C6821]'
                      : 'bg-white border-[#E5E0D6] text-[#A49B8A]'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 inline mr-1" />
                  Pending
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentState('received')}
                  className={`px-3 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                    paymentState === 'received'
                      ? 'bg-emerald-50 border-emerald-300 text-[#1E7B3C]'
                      : 'bg-white border-[#E5E0D6] text-[#A49B8A]'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />
                  Received
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6821] mb-1.5">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E5E0D6] text-xs font-semibold focus:outline-hidden focus:border-[#B8860B] cursor-pointer"
              >
                {(Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[]).map((m) => (
                  <option key={m} value={m}>
                    {PAYMENT_METHOD_LABELS[m]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6821] mb-1.5">
              Status Note (optional — shown on the public tracking timeline)
            </label>
            <input
              type="text"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="e.g. Payment received via GPay — confirming hamper contents"
              className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#141414] text-[#DFBA54] border border-[#D4AF37] text-xs font-bold hover:bg-[#252525] transition-colors cursor-pointer disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Fulfilment
            </button>
          </div>
        </form>

        {/* Editable customer & delivery */}
        <form onSubmit={save} className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#EAE5D9] shadow-sm space-y-6">
          <h2 className="font-cinzel text-sm font-bold uppercase tracking-widest text-[#141414]">
            Customer & Delivery Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6821] mb-1.5">Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6821] mb-1.5">Mobile / WhatsApp</label>
              <input type="text" value={mobilePhone} onChange={(e) => setMobilePhone(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6821] mb-1.5">Alt Phone</label>
              <input type="text" value={altPhone} onChange={(e) => setAltPhone(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6821] mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6821] mb-1.5">Recipient Name</label>
              <input type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6821] mb-1.5">Flat / Building</label>
              <input type="text" value={flatBuilding} onChange={(e) => setFlatBuilding(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6821] mb-1.5">Street / Area</label>
              <input type="text" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6821] mb-1.5">Landmark</label>
              <input type="text" value={landmark} onChange={(e) => setLandmark(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6821] mb-1.5">City</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6821] mb-1.5">Pincode</label>
                <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]" />
              </div>
            </div>
            <div className="md:col-span-2 flex items-start gap-2 p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#EFE9DC] text-[11px] text-[#524B40]">
              <MapPin className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
              <span>
                Exact pin: <strong>({order.delivery.geo.lat.toFixed(5)}, {order.delivery.geo.lng.toFixed(5)})</strong>
                {order.delivery.geo.label ? ` — ${order.delivery.geo.label}` : ''}{' '}
                <a
                  href={`https://maps.google.com/?q=${order.delivery.geo.lat},${order.delivery.geo.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#8C6821] font-bold hover:underline inline-flex items-center gap-1"
                >
                  open map <ExternalLink className="w-3 h-3" />
                </a>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#141414] text-[#DFBA54] border border-[#D4AF37] text-xs font-bold hover:bg-[#252525] transition-colors cursor-pointer disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Details
            </button>
          </div>
        </form>

        {/* Order summary + internal notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#EAE5D9] shadow-sm space-y-4">
            <h2 className="font-cinzel text-sm font-bold uppercase tracking-widest text-[#141414]">Order Contents</h2>
            <div className="space-y-2.5">
              {order.lines.map((line, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#EFE9DC] flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#141414] truncate">{line.name}</p>
                    <p className="text-[11px] text-[#8C6821] font-semibold">
                      {line.itemCode ?? line.productId ?? (line.kind === 'custom_hamper' ? '#HQ-ATELIER-CUSTOM' : '')} · Qty {line.qty}
                    </p>
                  </div>
                  <p className="text-xs font-bold text-[#141414] shrink-0">
                    {line.priceValue > 0 ? `₹${(line.priceValue * line.qty).toLocaleString('en-IN')}` : line.priceDisplay}
                  </p>
                </div>
              ))}
              <div className="pt-2 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[#524B40]">
                  <span>Subtotal</span>
                  <strong className="text-[#141414]">{order.totals.subtotal > 0 ? `₹${order.totals.subtotal.toLocaleString('en-IN')}` : 'On request'}</strong>
                </div>
                <div className="flex items-center justify-between text-[#524B40]">
                  <span>Delivery</span>
                  <strong className={order.totals.deliveryFee === 0 ? 'text-[#1E7B3C]' : 'text-[#141414]'}>
                    {order.totals.deliveryFee === 0 ? 'FREE' : `₹${order.totals.deliveryFee}`}
                  </strong>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#EAE5D9] text-sm">
                  <span className="font-semibold text-[#141414]">Grand Total</span>
                  <strong className="font-cinzel text-[#B8860B]">{order.totals.grandTotal > 0 ? `₹${order.totals.grandTotal.toLocaleString('en-IN')}` : 'On request'}</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EAE5D9]">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#8C6821] mb-1.5">
                Internal Notes (visible on public track page via notes field)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="e.g. Call customer before dispatch; gate entry via Gate 2"
                className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]"
              />
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-[11px] text-[#6B6559]">
                  <Globe className="w-3.5 h-3.5 text-[#B8860B]" />
                  Occasion: {order.preferences.occasion} · {order.preferences.deliveryDate} ({order.preferences.timeSlot})
                </div>
                <button
                  onClick={save}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#141414] text-[#DFBA54] border border-[#D4AF37] text-xs font-bold cursor-pointer disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Notes
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#EAE5D9] shadow-sm space-y-5">
            <h2 className="font-cinzel text-sm font-bold uppercase tracking-widest text-[#141414]">Event Timeline</h2>
            {events.length === 0 ? (
              <p className="text-xs text-[#A49B8A]">No events yet.</p>
            ) : (
              <ol className="relative space-y-4 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-px before:bg-[#EAE0C8]">
                {events.map((ev, idx) => (
                  <li key={idx} className="relative pl-12">
                    <span className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      ev.status === 'cancelled'
                        ? 'bg-red-50 border-red-300 text-red-600'
                        : ev.status === 'delivered'
                        ? 'bg-[#ECFDF5] border-emerald-300 text-[#1E7B3C]'
                        : 'bg-[#141414] border-[#D4AF37] text-[#DFBA54]'
                    }`}>
                      {ev.status === 'delivered' || ev.status === 'cancelled' ? (
                        ev.status === 'delivered' ? <Truck className="w-4 h-4" /> : <XCircle className="w-4 h-4" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                    </span>
                    <div>
                      <p className="font-cinzel text-xs font-bold text-[#141414]">
                        {ORDER_STATUS_LABELS[ev.status]}
                        <span className="ml-2 text-[10px] font-sans font-semibold text-[#A49B8A]">
                          by {ev.by ?? 'system'} · {new Date(ev.at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </p>
                      {ev.note && <p className="text-xs text-[#6B6559] mt-1">{ev.note}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            )}

            {/* IP / device summary (admin only) */}
            <div className="pt-4 border-t border-[#EAE5D9]">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#8C6821] mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                Connection / Device Info
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#524B40]">
                <div className="p-2.5 rounded-xl bg-[#FAF9F5] border border-[#EFE9DC]">
                  <span className="block text-[9px] text-[#A49B8A] uppercase font-bold">IP Address</span>
                  <strong className="text-[#141414] break-all">{order.meta.ip || '—'}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF9F5] border border-[#EFE9DC]">
                  <span className="block text-[9px] text-[#A49B8A] uppercase font-bold">Browser Language</span>
                  <strong className="text-[#141414]">{order.meta.browserLanguage || '—'}</strong>
                </div>
                {order.meta.ipInfo && (
                  <>
                    <div className="p-2.5 rounded-xl bg-[#FAF9F5] border border-[#EFE9DC]">
                      <span className="block text-[9px] text-[#A49B8A] uppercase font-bold">Detected Region</span>
                      <strong className="text-[#141414]">
                        {[order.meta.ipInfo.city, order.meta.ipInfo.regionName, order.meta.ipInfo.country].filter(Boolean).join(', ') || '—'}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAF9F5] border border-[#EFE9DC]">
                      <span className="block text-[9px] text-[#A49B8A] uppercase font-bold">ISP / Organization</span>
                      <strong className="text-[#141414]">{order.meta.ipInfo.isp || order.meta.ipInfo.org || '—'}</strong>
                    </div>
                  </>
                )}
                {order.meta.userAgent && (
                  <div className="col-span-2 p-2.5 rounded-xl bg-[#FAF9F5] border border-[#EFE9DC] break-words">
                    <span className="block text-[9px] text-[#A49B8A] uppercase font-bold">User Agent</span>
                    <span className="text-[#524B40]">{order.meta.userAgent}</span>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-[#A49B8A] mt-2">
                Collected server-side from request headers only and cross-checked with a free IP details checker. Never shown to the recipient.
              </p>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="p-6 rounded-3xl bg-white border-2 border-red-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-red-700">Danger zone</p>
            <p className="text-[11px] text-[#6B6559]">
              Permanently delete this order and its tracking link. The recipient will no longer be able to track it.
            </p>
          </div>
          <button
            onClick={remove}
            disabled={saving || !canDelete}
            title={canDelete ? undefined : 'Deletion is locked while an order has a grand total — zero the totals in MongoDB or keep WhatsApp flow.'}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            Delete Order
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#A49B8A]">
          <span>Order ID: {order.orderId}</span>
          <a
            href={`https://wa.me/91${HAMPER_QUEEN_OFFICIAL_CONTACT.phone}?text=${encodeURIComponent(`Re: order ${order.trackingId} (${order.customer.fullName})`)}`}
            target="_blank"
            rel="noreferrer"
            className="text-[#8C6821] font-bold hover:underline"
          >
            Quick WhatsApp re: this order
          </a>
        </div>
      </main>
    </div>
  );
}