'use client';

/**
 * track/[trackingId]/page.tsx
 * -----------------------------------------------------------------------------
 * Public order status page. Looks up the order from /api/orders/track/:id and
 * renders a live timeline, order summary, delivery details and a static map
 * link. Only public (sanitised) data is shown — never IP/device details.
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  PackageCheck,
  Phone,
  ChevronLeft,
  Loader2,
  ExternalLink,
  AlertTriangle,
  Crown,
  Check,
} from 'lucide-react';
import { PublicOrder, ORDER_STATUSES, ORDER_STATUS_LABELS } from '../../../../types/order';
import { HAMPER_QUEEN_OFFICIAL_CONTACT } from '../../../../data/hamperQueenCatalog';

interface Props {
  params: Promise<{ trackingId: string }>;
}

export default function TrackStatusPage({ params }: Props) {
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  useEffect(() => {
    let active = true;
    params.then(({ trackingId: id }) => {
      const cleaned = id.toUpperCase().replace(/\s+/g, '');
      setTrackingId(cleaned);
      fetch(`/api/orders/track/${encodeURIComponent(cleaned)}`)
        .then(async (res) => {
          if (!active) return;
          if (!res.ok) {
            setNotFound(true);
            setLoading(false);
            return;
          }
          const data = await res.json();
          if (!active) return;
          setOrder(data as PublicOrder);
          setLoading(false);
        })
        .catch(() => {
          if (!active) return;
          setNotFound(true);
          setLoading(false);
        });
    });
    return () => {
      active = false;
    };
  }, [params]);
  let royal = '';

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 text-[#6B6559]">
        <Loader2 className="w-8 h-8 animate-spin text-[#B8860B]" />
        <p className="text-sm font-semibold">Looking up your order…</p>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <section className="py-16 sm:py-24 bg-white text-[#141414]">
        <div className="max-w-xl mx-auto px-4 text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#FBEBEB] border-2 border-red-200 text-[#B3261E] flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="font-seasons text-2xl sm:text-3xl font-bold">Tracking ID not found</h1>
          <p className="text-sm text-[#6B6559]">
            We could not find an order with the code <strong className="text-[#141414]">{trackingId}</strong>. Please double-check the ID and try again, or reach out to us on WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/track"
              className="px-6 py-3 rounded-full bg-[#141414] text-[#DFBA54] border border-[#D4AF37] font-cinzel text-xs font-bold uppercase tracking-wider text-center"
            >
              <ChevronLeft className="w-4 h-4 inline -ml-1" /> Try Another ID
            </Link>
            <a
              href={`https://wa.me/91${HAMPER_QUEEN_OFFICIAL_CONTACT.phone}?text=${encodeURIComponent('Hi Hamper Queen, I need help with my tracking ID.')}`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-full bg-[#25D366] text-white font-sans text-xs font-bold text-center"
            >
              <Phone className="w-4 h-4 inline fill-white mr-1" />
              WhatsApp Support
            </a>
          </div>
        </div>
      </section>
    );
  }

  const statusIndex = order.status === 'cancelled' ? -1 : ORDER_STATUSES.indexOf(order.status);
  const isPaid = order.payment.state === 'received';

  return (
    <section className="py-12 sm:py-16 bg-white text-[#141414]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back + share header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/track" className="inline-flex items-center gap-1 text-xs font-semibold text-[#8C6821] hover:underline">
            <ChevronLeft className="w-4 h-4" />
            Track another order
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5E8] border border-[#EAE0C8] text-[#8C6821] text-[10px] font-bold uppercase tracking-widest">
            <Crown className="w-3 h-3 text-[#B8860B]" />
            Hamper Queen Verified Order
          </span>
        </div>

        {/* Order header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#141414] via-[#241E16] to-[#141414] border border-[#D4AF37]/60 text-white shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] text-[#DFBA54] font-cinzel uppercase tracking-widest">Tracking ID</span>
              <h1 className="font-seasons text-2xl sm:text-3xl font-bold tracking-wide">{order.trackingId}</h1>
              <p className="text-xs text-white/70">
                Order placed {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border ${
                order.status === 'cancelled'
                  ? 'bg-red-500/15 text-red-300 border-red-400/50'
                  : isPaid
                  ? 'bg-[#16A34A]/15 text-emerald-300 border-emerald-400/50'
                  : 'bg-[#B45309]/20 text-amber-300 border-amber-400/50'
              }`}>
                <PackageCheck className="w-4 h-4" />
                {order.status === 'cancelled'
                  ? 'Order Cancelled'
                  : isPaid
                  ? 'Payment Confirmed'
                  : 'Payment Pending'}
              </span>
              <p className="text-[11px] text-white/60 mt-2">
                {order.status === 'cancelled'
                  ? 'This order was cancelled. Please reach out to us for a refund follow-up.'
                  : isPaid
                  ? 'Your payment receipt is confirmed. We are on it!'
                  : 'Payment details will be shared on WhatsApp shortly to confirm your order.'}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF9] border-2 border-[#D4AF37]/50 shadow-sm">
          <h2 className="font-cinzel text-sm font-bold uppercase tracking-widest text-[#141414] mb-6">
            Delivery Progress
          </h2>

          {order.status === 'cancelled' ? (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs">
              This order was cancelled. Hamper Queen will contact you on WhatsApp to complete refund or re-confirm details if a reorder was discussed.
            </div>
          ) : (
            <ol className="relative space-y-6 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-px before:bg-[#EAE0C8]">
              {ORDER_STATUSES.map((status, idx) => {
                const done = idx < statusIndex || order.status === status;
                const current = order.status === status;
                return (
                  <li key={status} className="relative pl-12">
                    <span className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      done
                        ? 'bg-[#141414] border-[#D4AF37] text-[#DFBA54]'
                        : 'bg-white border-[#E5E0D6] text-[#C4BCAA]'
                    }`}>
                      {done ? <Check className="w-4 h-4 stroke-[3]" /> : <span className="w-2 h-2 rounded-full bg-current" />}
                    </span>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className={`font-cinzel text-sm font-bold ${done ? 'text-[#141414]' : 'text-[#A49B8A]'}`}>
                          {ORDER_STATUS_LABELS[status]}
                        </span>
                        {current && (
                          <span className="px-2 py-0.5 rounded-full bg-[#FAF5E8] border border-[#D4AF37]/50 text-[#8C6821] text-[9px] font-bold uppercase tracking-wider animate-pulse">
                            Current
                          </span>
                        )}
                      </div>
                      {current && (
                        <p className="text-xs text-[#6B6559] mt-1">
                          {status === 'awaiting_payment'
                            ? 'Your order is saved. Share the tracking ID with your recipient — payment receipt and invoice will be shared on WhatsApp shortly.'
                            : status === 'crafting'
                            ? 'Your hamper is being hand-packed with fresh stock right now.'
                            : status === 'dispatched'
                            ? 'Your hamper has left the Hamper Queen studio and is on its way.'
                            : status === 'out_for_delivery'
                            ? 'Your rider is en route to the pinned location on the map below.'
                            : status === 'delivered'
                            ? 'Delivered! We hope your celebration was royally special.'
                            : 'Your order is confirmed and moved into crafting.'}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          {order.notes && (
            <div className="mt-6 p-3.5 rounded-2xl bg-[#FAF5E8] border border-[#EAE0C8] text-xs text-[#524B40]">
              <span className="font-bold text-[#8C6821]">Note from Hamper Queen: </span>
              {order.notes}
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#EAE5D9] shadow-sm">
          <h2 className="font-cinzel text-sm font-bold uppercase tracking-widest text-[#141414] mb-5">
            Order Summary
          </h2>
          <div className="space-y-3">
            {order.lines.map((line, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#EFE9DC]">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#141414] truncate">{line.name}</p>
                  <p className="text-[11px] text-[#8C6821] font-semibold mt-0.5">
                    {line.itemCode ?? line.productId ?? (line.kind === 'custom_hamper' ? '#HQ-ATELIER-CUSTOM' : '')}
                    {' · Qty '}{line.qty}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-[#141414]">
                    {line.priceValue > 0 ? `INR ${(line.priceValue * line.qty).toLocaleString('en-IN')}` : line.priceDisplay}
                  </p>
                  {line.priceValue > 0 && <p className="text-[10px] text-[#A49B8A]">{line.priceDisplay} each</p>}
                </div>
              </div>
            ))}

            <div className="pt-2 space-y-1.5 text-sm">
              <div className="flex items-center justify-between text-[#524B40]">
                <span>Items Subtotal</span>
                <strong className="text-[#141414]">{order.totals.subtotal > 0 ? `INR ${order.totals.subtotal.toLocaleString('en-IN')}` : 'On request'}</strong>
              </div>
              <div className="flex items-center justify-between text-[#524B40]">
                <span>Delivery Fee</span>
                <strong className={order.totals.deliveryFee === 0 ? 'text-[#1E7B3C]' : 'text-[#141414]'}>
                  {order.totals.deliveryFee === 0 ? 'FREE' : `INR ${order.totals.deliveryFee}`}
                </strong>
              </div>
              {order.totals.discount > 0 && (
                <div className="flex items-center justify-between text-[#1E7B3C]">
                  <span>
                    Coupon {order.promo ? `(${order.promo.code})` : ''} applied
                  </span>
                  <strong>-INR {order.totals.discount.toLocaleString('en-IN')}</strong>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-[#EAE5D9] text-base">
                <span className="font-semibold text-[#141414]">Grand Total (approx)</span>
                <strong className="font-cinzel text-[#B8860B]">{order.totals.grandTotal > 0 ? `INR ${order.totals.grandTotal.toLocaleString('en-IN')}` : 'On request'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery details & map */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#EAE5D9] shadow-sm space-y-5">
          <h2 className="font-cinzel text-sm font-bold uppercase tracking-widest text-[#141414]">
            Pinned Delivery Location
          </h2>
          <div className="space-y-1.5 text-xs text-[#524B40]">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
              <span>
                {order.delivery.flatBuilding}, {order.delivery.streetAddress}
                {order.delivery.landmark ? `, Near ${order.delivery.landmark}` : ''}, {order.delivery.city} - {order.delivery.pincode}
              </span>
            </p>
            {order.delivery.geo.lat ? (
              <a
                href={`https://maps.google.com/?q=${order.delivery.geo.lat},${order.delivery.geo.lng}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#8C6821] hover:underline pt-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open exact pin in Google Maps ({order.delivery.geo.lat.toFixed(5)}, {order.delivery.geo.lng.toFixed(5)})
              </a>
            ) : (
              <p className="text-[11px] text-[#A49B8A]">No exact pin recorded for this order.</p>
            )}
          </div>

          <div className="pt-4 border-t border-[#EAE5D9] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-[#524B40]">
              <span className="block text-[10px] font-bold text-[#8C6821] uppercase tracking-wider">Recipient</span>
              <strong className="text-[#141414]">{order.customer.recipientName || order.customer.fullName}</strong>
              {order.customer.recipientName && order.customer.recipientName !== order.customer.fullName && (
                <span className="text-[#A49B8A]"> (ordered by {order.customer.fullName})</span>
              )}
            </div>
            <div className="text-xs text-[#524B40] sm:text-right">
              <span className="block text-[10px] font-bold text-[#8C6821] uppercase tracking-wider">Delivery Window</span>
              <strong className="text-[#141414]">{new Date(order.preferences.deliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
              {' · '}{order.preferences.timeSlot}
            </div>
          </div>
        </div>

        {/* Help footer */}
        <div className="text-center space-y-3 pt-2">
          <p className="text-xs text-[#6B6559]">
            Need to reach us about this order? Tap WhatsApp below and quote your tracking ID.
          </p>
          <a
            href={`https://wa.me/91${HAMPER_QUEEN_OFFICIAL_CONTACT.phone}?text=${encodeURIComponent(`👋 Hi Hamper Queen! I have a question about my order ${order.trackingId}.`)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-sans text-sm font-bold shadow-md transition-all"
          >
            <Phone className="w-4 h-4 fill-white" />
            Chat about {order.trackingId} on WhatsApp
          </a>
          <p className="text-[11px] text-[#A49B8A]">
            Share this tracking ID with anyone who needs to follow the delivery.
          </p>
        </div>
      </div>
    </section>
  );
}