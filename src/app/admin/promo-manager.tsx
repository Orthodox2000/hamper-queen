'use client';

/**
 * promo-manager.tsx
 * -----------------------------------------------------------------------------
 * Admin promo code manager. Creates single-use coupon rows (batch per event),
 * lists them with status (active/used), filters, and deletes single rows.
 */

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TicketPercent,
  Loader2,
  Search,
  Trash2,
  ArrowLeft,
  Plus,
  CalendarClock,
  Tag,
  BadgeCheck,
  CheckCircle2,
} from 'lucide-react';

export interface AdminPromoRow {
  _id: string;
  code: string;
  discount: { kind: 'flat' | 'percent'; value: number };
  eventName?: string;
  minSubtotal?: number | null;
  expiresAt?: string | null;
  active: boolean;
  redeemedAt?: string | null;
  claimedFor?: string;
  createdAt: string;
}

const inputCls =
  'w-full rounded-xl border border-[#E3DCCB] bg-white px-3 py-2.5 text-sm text-[#141414] placeholder-[#A49B8A] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60 focus:border-[#D4AF37]';
const labelCls = 'block text-[10px] font-bold uppercase tracking-wider text-[#8C6821] mb-1';

export default function PromoManager() {
  const [rows, setRows] = useState<AdminPromoRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'used'>('all');
  const [query, setQuery] = useState('');

  const [code, setCode] = useState('');
  const [kind, setKind] = useState<'flat' | 'percent'>('flat');
  const [value, setValue] = useState('');
  const [count, setCount] = useState('1');
  const [eventName, setEventName] = useState('');
  const [minSubtotal, setMinSubtotal] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ limit: '300' });
      if (filter !== 'all') params.set('redeemed', filter);
      if (query.trim()) params.set('q', query.trim());
      const res = await fetch(`/api/admin/promo?${params.toString()}`);
      if (!res.ok) throw new Error('Unauthorized or unavailable.');
      const data = await res.json();
      setRows(data.items as AdminPromoRow[]);
      setTotal(data.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load promo codes.');
    } finally {
      setLoading(false);
    }
  }, [filter, query]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateMsg('');
    const payload = {
      code,
      kind,
      value: Number(value),
      count: Math.max(1, Number(count) || 1),
      eventName,
      minSubtotal: minSubtotal === '' ? null : Number(minSubtotal),
      expiresAt: expiresAt ? new Date(expiresAt + 'T23:59:59').toISOString() : null,
      active: true,
    };
    setCreating(true);
    try {
      const res = await fetch('/api/admin/promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || 'Could not create coupons.');
      setCreateMsg(
        `Created ${data.inserted} × ${payload.count === 1 ? 'code' : 'codes'} ${data.code} (${kind === 'percent' ? `${value}% off` : `INR ${value} off`}).`
      );
      setCode('');
      setValue('');
      setCount('1');
      setEventName('');
      setMinSubtotal('');
      setExpiresAt('');
      load();
    } catch (err) {
      setCreateMsg('');
      setError(err instanceof Error ? err.message : 'Could not create coupons.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this coupon? It is single-use and unrecoverable.')) return;
    try {
      const res = await fetch(`/api/admin/promo/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed.');
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete the coupon.');
    }
  };

  const discountLabel = (row: AdminPromoRow) =>
    row.discount.kind === 'percent' ? `${row.discount.value}% off` : `INR ${row.discount.value.toLocaleString('en-IN')} off`;

  return (
    <div className="min-h-screen bg-[#FAF9F5]">
      <header className="sticky top-0 z-20 bg-[#141414] text-white border-b border-[#D4AF37]/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-9 h-9 rounded-lg bg-[#DFBA54]/20 border border-[#DFBA54] flex items-center justify-center text-[#DFBA54]">
              <TicketPercent className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-cinzel text-sm font-bold tracking-wide">Promo Codes & Coupons</h1>
              <p className="text-[10px] text-white/60">One code string can carry many single-use rows</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#DFBA54]" />
            {total.toLocaleString('en-IN')} row{total === 1 ? '' : 's'}
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</div>
        )}

        {/* Create form */}
        <form
          onSubmit={handleCreate}
          className="rounded-3xl bg-white border border-[#EAE5D9] p-5 sm:p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#B8860B]" />
            <h2 className="font-cinzel text-sm font-bold uppercase tracking-widest text-[#141414]">
              Create Promo Codes
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={labelCls}>Code (auto-uppercase)</label>
              <input
                className={inputCls}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 16))}
                placeholder="FIRSTHAMPER"
                maxLength={16}
              />
            </div>
            <div>
              <label className={labelCls}>Discount value</label>
              <input
                className={inputCls}
                value={value}
                onChange={(e) => setValue(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder={kind === 'percent' ? '10' : '200'}
                inputMode="decimal"
              />
            </div>
            <div>
              <label className={labelCls}>Type</label>
              <div className="flex rounded-xl border border-[#E3DCCB] overflow-hidden">
                {(['flat', 'percent'] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKind(k)}
                    className={`flex-1 px-3 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors cursor-pointer ${
                      kind === k ? 'bg-[#141414] text-[#DFBA54]' : 'bg-white text-[#8C6821] hover:bg-[#FAF5E8]'
                    }`}
                  >
                    {k === 'flat' ? 'INR flat' : '% off'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>How many rows?</label>
              <input
                className={inputCls}
                value={count}
                onChange={(e) => setCount(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="1"
                inputMode="numeric"
              />
            </div>
            <div>
              <label className={labelCls}>Event name (optional)</label>
              <input
                className={inputCls}
                value={eventName}
                onChange={(e) => setEventName(e.target.value.slice(0, 80))}
                placeholder="Neev 2026 Corporate Gifting"
              />
            </div>
            <div>
              <label className={labelCls}>Min order subtotal (optional)</label>
              <input
                className={inputCls}
                value={minSubtotal}
                onChange={(e) => setMinSubtotal(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="499"
                inputMode="decimal"
              />
            </div>
            <div>
              <label className={labelCls}>Expires (optional)</label>
              <input
                className={inputCls}
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={creating || !code.trim() || !value}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#141414] hover:bg-[#241E16] disabled:opacity-50 disabled:cursor-not-allowed text-[#DFBA54] border border-[#D4AF37]/60 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Create
              </button>
            </div>
          </div>

          <p className="text-[11px] text-[#A49B8A]">
            Each row is a single-use coupon. The same code string can be created many times (one row per attendee of an
            event) — same discount, unique redemptions.
          </p>
          {createMsg && (
            <p className="text-xs font-bold text-[#1E7B3C] flex items-center gap-1.5">
              <BadgeCheck className="w-4 h-4" /> {createMsg}
            </p>
          )}
        </form>

        {/* List */}
        <div className="rounded-3xl bg-white border border-[#EAE5D9] shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#EFE9DC]">
            <h2 className="font-cinzel text-sm font-bold uppercase tracking-widest text-[#141414]">All Coupons</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A49B8A]" />
                <input
                  className={`${inputCls} pl-9`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search code…"
                />
              </div>
              <div className="flex rounded-xl border border-[#E3DCCB] overflow-hidden">
                {(['all', 'active', 'used'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors cursor-pointer ${
                      filter === f ? 'bg-[#141414] text-[#DFBA54]' : 'bg-white text-[#8C6821] hover:bg-[#FAF5E8]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 flex items-center justify-center text-[#8C6821]">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
          ) : rows.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Tag className="w-8 h-8 mx-auto text-[#C4BCAA]" />
              <p className="text-sm font-semibold text-[#141414]">No coupons{filter !== 'all' ? ` (${filter})` : ''} found.</p>
              <p className="text-xs text-[#6B6559]">Create a code above to get started.</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#F0EBE0]">
              {rows.map((row) => {
                const used = !!row.redeemedAt;
                const expired = !!row.expiresAt && new Date(row.expiresAt).getTime() < Date.now();
                return (
                  <li key={row._id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 sm:px-6 py-4">
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-extrabold tracking-widest text-[#141414]">{row.code}</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#FAF5E8] border border-[#EAE0C8] text-[#8C6821] text-[10px] font-bold">
                          {discountLabel(row)}
                        </span>
                        {!used && !expired && row.active && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                            Available
                          </span>
                        )}
                        {used && (
                          <span className="px-2 py-0.5 rounded-full bg-[#FBEBEB] border border-red-200 text-[#B3261E] text-[10px] font-bold">
                            Redeemed
                          </span>
                        )}
                        {expired && !used && (
                          <span className="px-2 py-0.5 rounded-full bg-[#F0EBE0] border border-[#D8D0BF] text-[#6B6559] text-[10px] font-bold">
                            Expired
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#6B6559]">
                        {row.eventName ? `${row.eventName} · ` : ''}Created {new Date(row.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        {typeof row.minSubtotal === 'number' && row.minSubtotal > 0 && ` · Min order INR ${row.minSubtotal}`}
                        {row.expiresAt && ` · Expires ${new Date(row.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                        {used && ` · Used on order ${row.claimedFor ?? ''}`}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(row._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}