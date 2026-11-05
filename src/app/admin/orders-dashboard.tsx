'use client';

/**
 * orders-dashboard.tsx
 * -----------------------------------------------------------------------------
 * Authenticated admin dashboard: order KPIs, status filter, search, and the
 * full order table. Reads /api/orders; links into /admin/orders/:id.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Loader2,
  Search,
  ExternalLink,
  ShoppingBag,
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
} from 'lucide-react';
import { OrderRecord, ORDER_STATUSES, ORDER_STATUS_LABELS } from '../../types/order';

import { AdminHeader } from './admin-header';
const STATUS_BADGE: Record<string, string> = {
  awaiting_payment: 'bg-amber-50 text-gold-700 border-gold-400/60',
  confirmed: 'bg-sky-50 text-sky-700 border-sky-200',
  crafting: 'bg-violet-50 text-violet-700 border-violet-200',
  dispatched: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  out_for_delivery: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  delivered: 'bg-[#ECFDF5] text-emerald-800 border-[#A7F3D0]',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

export function OrdersDashboard() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/orders?limit=200');
      if (!res.ok) throw new Error('Unauthorized or unavailable.');
      const data = await res.json();
      setOrders(data.items as OrderRecord[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load orders.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const s = {
      total: orders.length,
      awaiting_payment: 0,
      confirmed: 0,
      crafting: 0,
      dispatched: 0,
      out_for_delivery: 0,
      delivered: 0,
      cancelled: 0,
      paid: 0,
    };
    for (const o of orders) {
      if (o.status in s) (s as Record<string, number>)[o.status]++;
      if (o.payment.state === 'received') s.paid++;
    }
    return s;
  }, [orders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      const matchesQuery =
        !q ||
        o.trackingId.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.mobilePhone.replace(/\s/g, '').includes(q.replace(/\s/g, '')) ||
        o.customer.email.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [orders, statusFilter, query]);

  const statusCounts = (key: string) => (key === 'all' ? orders.length : stats[key as keyof typeof stats] ?? 0);

  return (
    <div className="min-h-dvh bg-cream-100">
      {/* Top bar */}
      <AdminHeader
        title="Orders"
        subtitle="Track, filter and fulfil every Hamper Queen order"
      />

      <main className="container-page py-8 space-y-6">
        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
          {[
            { key: 'total', label: 'All Orders', icon: ShoppingBag },
            ...ORDER_STATUSES.map((s) => ({ key: s, label: ORDER_STATUS_LABELS[s], icon: null })),
            { key: 'cancelled', label: 'Cancelled', icon: XCircle },
          ].map((card) => {
            const Icon = card.icon;
            const count = card.key === 'total' ? stats.total : stats[card.key as keyof typeof stats] ?? 0;
            return (
              <div
                key={card.key}
                className="rounded-2xl bg-white border border-line p-4 shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gold-700">
                    {card.label}
                  </span>
                  {Icon && <Icon className="w-4 h-4 text-gold-700" />}
                </div>
                <p className="font-cinzel text-2xl font-bold text-ink mt-1">{count}</p>
              </div>
            );
          })}
        </div>

        {/* Filter bar */}
        <div className="p-4 rounded-2xl bg-white border border-line shadow-soft flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {['all', ...ORDER_STATUSES, 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                aria-pressed={statusFilter === status}
                className={`chip text-xs font-semibold ${statusFilter === status ? 'chip-active' : ''}`}
              >
                {status === 'all' ? `All (${statusCounts('all')})` : `${ORDER_STATUS_LABELS[status]} (${statusCounts(status)})`}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-700" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ID, name, phone, email…"
              className="w-full pl-10 pr-4 py-2 rounded-full bg-cream-100 border border-line text-xs focus:outline-hidden focus:border-gold-300"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3 text-stone">
            <Loader2 className="w-8 h-8 animate-spin text-gold-700" />
            <p className="text-xs font-semibold">Loading orders…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Package className="w-10 h-10 mx-auto text-mist" />
            <p className="text-sm font-semibold text-cocoa">No orders match this filter yet.</p>
            <p className="text-xs text-mist">New bookings will appear here the moment customers confirm on the storefront.</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-line shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-cream-100 text-[11px] text-gold-700 font-bold border-b border-line">
                    <th className="px-4 py-3">Tracking ID</th>
                    <th className="px-4 py-3">Placed</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Items</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o) => {
                    const lineSummary = o.lines.map((l) => `${l.name} ×${l.qty}`).join(' + ');
                    return (
                      <tr
                        key={o.orderId}
                        className={`border-b border-line hover:bg-cream-50 ${
                          o.status === 'awaiting_payment' ? 'bg-amber-50/40' : ''
                        }`}
                      >
                        <td className="px-4 py-4">
                          <Link href={`/admin/orders/${o.orderId}`} className="font-mono text-[13px] font-bold text-gold-700 hover:underline">
                            {o.trackingId}
                          </Link>
                        </td>
                        <td className="px-4 py-4 text-cocoa whitespace-nowrap">
                          {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          <span className="block text-[11px] text-mist">
                            {new Date(o.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <strong className="text-ink">{o.customer.fullName}</strong>
                          <span className="block text-[11px] text-mist">{o.customer.mobilePhone}</span>
                        </td>
                        <td className="px-4 py-4 text-cocoa max-w-[220px] truncate" title={lineSummary}>
                          {lineSummary}
                        </td>
                        <td className="px-4 py-4 font-bold text-ink whitespace-nowrap">
                          {o.totals.grandTotal > 0 ? `₹${o.totals.grandTotal.toLocaleString('en-IN')}` : 'On request'}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold border ${
                            o.payment.state === 'received'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-gold-700 border-gold-400/60'
                          }`}>
                            {o.payment.state === 'received' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {o.payment.state === 'received' ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${STATUS_BADGE[o.status] ?? 'bg-white text-cocoa border-line'}`}>
                            {o.status === 'out_for_delivery' && <Truck className="w-3 h-3" />}
                            {o.status === 'delivered' && <CheckCircle2 className="w-3 h-3" />}
                            {o.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                            {o.status !== 'cancelled' && o.status !== 'delivered' && o.status !== 'out_for_delivery' && <SlidersHorizontal className="w-3 h-3" />}
                            {ORDER_STATUS_LABELS[o.status]}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <Link
                            href={`/admin/orders/${o.orderId}`}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-gold-700 hover:underline"
                          >
                            Open <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-cream-100 text-[11px] text-gold-700 font-semibold flex items-center gap-2">
              <Package className="w-3.5 h-3.5" />
              Showing {filtered.length} of {orders.length} orders · {stats.paid} payment(s) received
            </div>
          </div>
        )}
      </main>
    </div>
  );
}