'use client';

/**
 * orders-dashboard.tsx
 * -----------------------------------------------------------------------------
 * Authenticated admin dashboard: order KPIs, status filter, search, and the
 * full order table. Reads /api/orders; links into /admin/orders/:id.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Crown,
  LogOut,
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
  Layers,
} from 'lucide-react';
import { OrderRecord, ORDER_STATUSES, ORDER_STATUS_LABELS } from '../../types/order';

const STATUS_BADGE: Record<string, string> = {
  awaiting_payment: 'bg-amber-50 text-[#8C6821] border-[#D4AF37]/60',
  confirmed: 'bg-sky-50 text-sky-700 border-sky-200',
  crafting: 'bg-violet-50 text-violet-700 border-violet-200',
  dispatched: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  out_for_delivery: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  delivered: 'bg-[#ECFDF5] text-[#1E7B3C] border-[#A7F3D0]',
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

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin';
  };

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
    <div className="min-h-screen bg-[#FAF9F5]">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-[#141414] text-white border-b border-[#D4AF37]/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#DFBA54]/20 border border-[#DFBA54] flex items-center justify-center text-[#DFBA54]">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-cinzel text-sm font-bold tracking-wide">Hamper Queen Admin</h1>
              <p className="text-[10px] text-white/60">Orders & Catalog Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/catalog"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold transition-colors"
            >
              <Layers className="w-4 h-4 text-[#DFBA54]" />
              <span className="hidden sm:inline">Catalog Overrides</span>
            </Link>
            <a
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-[#DFBA54]" />
              <span className="hidden sm:inline">Storefront</span>
            </a>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-400/40 text-xs font-bold text-red-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
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
                className="rounded-2xl bg-white border border-[#EAE5D9] p-4 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6821]">
                    {card.label}
                  </span>
                  {Icon && <Icon className="w-4 h-4 text-[#B8860B]" />}
                </div>
                <p className="font-cinzel text-2xl font-bold text-[#141414] mt-1">{count}</p>
              </div>
            );
          })}
        </div>

        {/* Filter bar */}
        <div className="p-4 rounded-2xl bg-white border border-[#EAE5D9] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {['all', ...ORDER_STATUSES, 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-cinzel font-bold transition-colors cursor-pointer border ${
                  statusFilter === status
                    ? 'bg-[#141414] text-[#F3E5AB] border-[#D4AF37]'
                    : 'bg-white text-[#524B40] border-[#E5E0D6] hover:bg-[#FAF9F5]'
                }`}
              >
                {status === 'all' ? `All (${statusCounts('all')})` : `${ORDER_STATUS_LABELS[status]} (${statusCounts(status)})`}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6821]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ID, name, phone, email…"
              className="w-full pl-10 pr-4 py-2 rounded-full bg-[#FAF9F5] border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B]"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3 text-[#6B6559]">
            <Loader2 className="w-8 h-8 animate-spin text-[#B8860B]" />
            <p className="text-xs font-semibold">Loading orders…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Package className="w-10 h-10 mx-auto text-[#C4BCAA]" />
            <p className="text-sm font-semibold text-[#524B40]">No orders match this filter yet.</p>
            <p className="text-xs text-[#A49B8A]">New bookings will appear here the moment customers confirm on the storefront.</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-[#EAE5D9] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#FAF9F5] text-[10px] uppercase tracking-wider text-[#8C6821] font-bold border-b border-[#EAE5D9]">
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
                        className={`border-b border-[#F0ECE1] hover:bg-[#FFFDF9] ${
                          o.status === 'awaiting_payment' ? 'bg-amber-50/40' : ''
                        }`}
                      >
                        <td className="px-4 py-3.5">
                          <Link href={`/admin/orders/${o.orderId}`} className="font-mono text-[13px] font-bold text-[#B8860B] hover:underline">
                            {o.trackingId}
                          </Link>
                        </td>
                        <td className="px-4 py-3.5 text-[#524B40] whitespace-nowrap">
                          {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          <span className="block text-[10px] text-[#A49B8A]">
                            {new Date(o.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <strong className="text-[#141414]">{o.customer.fullName}</strong>
                          <span className="block text-[11px] text-[#A49B8A]">{o.customer.mobilePhone}</span>
                        </td>
                        <td className="px-4 py-3.5 text-[#524B40] max-w-[220px] truncate" title={lineSummary}>
                          {lineSummary}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-[#141414] whitespace-nowrap">
                          {o.totals.grandTotal > 0 ? `₹${o.totals.grandTotal.toLocaleString('en-IN')}` : 'On request'}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border ${
                            o.payment.state === 'received'
                              ? 'bg-emerald-50 text-[#1E7B3C] border-emerald-200'
                              : 'bg-amber-50 text-[#8C6821] border-[#D4AF37]/60'
                          }`}>
                            {o.payment.state === 'received' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {o.payment.state === 'received' ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${STATUS_BADGE[o.status] ?? 'bg-white text-[#524B40] border-[#E5E0D6]'}`}>
                            {o.status === 'out_for_delivery' && <Truck className="w-3 h-3" />}
                            {o.status === 'delivered' && <CheckCircle2 className="w-3 h-3" />}
                            {o.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                            {o.status !== 'cancelled' && o.status !== 'delivered' && o.status !== 'out_for_delivery' && <SlidersHorizontal className="w-3 h-3" />}
                            {ORDER_STATUS_LABELS[o.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <Link
                            href={`/admin/orders/${o.orderId}`}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8C6821] hover:underline"
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
            <div className="px-4 py-3 bg-[#FAF9F5] text-[10px] text-[#8C6821] font-semibold flex items-center gap-2">
              <Package className="w-3.5 h-3.5" />
              Showing {filtered.length} of {orders.length} orders · {stats.paid} payment(s) received
            </div>
          </div>
        )}
      </main>
    </div>
  );
}