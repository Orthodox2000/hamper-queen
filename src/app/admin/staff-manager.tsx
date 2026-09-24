'use client';

/**
 * staff-manager.tsx
 * -----------------------------------------------------------------------------
 * Owner-only staff/team account management: create accounts, reset passwords,
 * toggle active, delete. Reuses the DB-backed adminUsers + scrypt auth.
 */

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Loader2,
  Plus,
  Trash2,
  ArrowLeft,
  BadgeCheck,
  Crown,
  UserCog,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

export interface AdminStaffView {
  _id: string;
  username: string;
  name?: string;
  role: 'owner' | 'admin';
  active: boolean;
  createdAt: string;
  createdBy?: string;
}

const inputCls =
  'w-full rounded-xl border border-[#E3DCCB] bg-white px-3 py-2.5 text-sm text-[#141414] placeholder-[#A49B8A] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60 focus:border-[#D4AF37]';
const labelCls = 'block text-[10px] font-bold uppercase tracking-wider text-[#8C6821] mb-1';

export default function StaffManager({ selfId }: { selfId?: string }) {
  const [rows, setRows] = useState<AdminStaffView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);

  const [resetPw, setResetPw] = useState<string | null>(null);
  const [resetVal, setResetVal] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/staff');
      if (!res.ok) throw new Error('Unauthorized or unavailable.');
      const data = await res.json();
      setRows(data.items as AdminStaffView[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load staff accounts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCreating(true);
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, name, password }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || 'Could not create the staff account.');
      setUsername('');
      setName('');
      setPassword('');
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the staff account.');
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (row: AdminStaffView) => {
    if (row._id === selfId) return;
    setError('');
    try {
      const res = await fetch(`/api/admin/staff/${encodeURIComponent(row._id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !row.active }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Could not update the account.');
      }
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update the account.');
    }
  };

  const handleReset = async (row: AdminStaffView) => {
    if (!resetVal) return;
    setError('');
    try {
      const res = await fetch(`/api/admin/staff/${encodeURIComponent(row._id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: resetVal }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Could not reset the password.');
      }
      setResetPw(null);
      setResetVal('');
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reset the password.');
    }
  };

  const handleDelete = async (row: AdminStaffView) => {
    if (row._id === selfId) return;
    if (!window.confirm(`Delete account "${row.username}"? This cannot be undone.`)) return;
    setError('');
    try {
      const res = await fetch(`/api/admin/staff/${encodeURIComponent(row._id)}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Could not delete the account.');
      }
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete the account.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5]">
      <header className="sticky top-0 z-20 bg-[#141414] text-white border-b border-[#D4AF37]/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-9 h-9 rounded-lg bg-[#DFBA54]/20 border border-[#DFBA54] flex items-center justify-center text-[#DFBA54]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-cinzel text-sm font-bold tracking-wide">Staff & Admin Accounts</h1>
              <p className="text-[10px] text-white/60">Manage panel access — owner can create/reset/disable accounts</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#DFBA54]/15 border border-[#DFBA54]/40 text-[#DFBA54] text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            {rows.filter((r) => r.active).length} active
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</div>
        )}

        {/* Create account */}
        <form onSubmit={handleCreate} className="rounded-3xl bg-white border border-[#EAE5D9] p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#B8860B]" />
            <h2 className="font-cinzel text-sm font-bold uppercase tracking-widest text-[#141414]">Create Staff Account</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className={labelCls}>Username (login)</label>
              <input className={inputCls} value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} placeholder="team.ankita" />
            </div>
            <div>
              <label className={labelCls}>Full name (optional)</label>
              <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ankita Sharma" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Temporary password (min 8 chars)</label>
              <input className={inputCls} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] text-[#A49B8A]">
              New accounts get <strong className="text-[#8C6821]">admin</strong> role and can sign in on the panel immediately. Only the owner can manage accounts.
            </p>
            <button
              type="submit"
              disabled={creating || !username.trim() || password.length < 8}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#141414] hover:bg-[#241E16] disabled:opacity-50 disabled:cursor-not-allowed text-[#DFBA54] border border-[#D4AF37]/60 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCog className="w-4 h-4" />}
              Create
            </button>
          </div>
        </form>

        {/* Accounts list */}
        <div className="rounded-3xl bg-white border border-[#EAE5D9] shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-[#EFE9DC]">
            <h2 className="font-cinzel text-sm font-bold uppercase tracking-widest text-[#141414]">Team Accounts</h2>
          </div>

          {loading ? (
            <div className="p-12 flex items-center justify-center text-[#8C6821]">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
          ) : rows.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Users className="w-8 h-8 mx-auto text-[#C4BCAA]" />
              <p className="text-sm font-semibold text-[#141414]">No accounts found.</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#F0EBE0]">
              {rows.map((row) => {
                const isSelf = row._id === selfId;
                return (
                  <li key={row._id} className="px-5 sm:px-6 py-4 flex flex-col lg:flex-row lg:items-center gap-3">
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-[#141414]">{row.username}</span>
                        {row.role === 'owner' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#141414] border border-[#D4AF37] text-[#DFBA54] text-[10px] font-bold">
                            <Crown className="w-3 h-3" /> Owner
                          </span>
                        )}
                        {row.role === 'admin' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-[10px] font-bold">
                            <BadgeCheck className="w-3 h-3" /> Admin
                          </span>
                        )}
                        {isSelf && (
                          <span className="px-2 py-0.5 rounded-full bg-[#FAF5E8] border border-[#EAE0C8] text-[#8C6821] text-[10px] font-bold">
                            You
                          </span>
                        )}
                        {!row.active && (
                          <span className="px-2 py-0.5 rounded-full bg-[#F0EBE0] border border-[#D8D0BF] text-[#6B6559] text-[10px] font-bold">
                            Disabled
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#6B6559]">
                        {row.name ? `${row.name} · ` : ''}Joined {new Date(row.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => { setResetPw(row._id); setResetVal(''); }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FAF5E8] hover:bg-[#F0E6CC] border border-[#EAE0C8] text-[#8C6821] text-xs font-bold transition-colors cursor-pointer"
                      >
                        <KeyRound className="w-3.5 h-3.5" /> Reset password
                      </button>
                      {!isSelf && (
                        <button
                          onClick={() => handleToggle(row)}
                          className={`inline-flex items-center px-3 py-2 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                            row.active
                              ? 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700'
                              : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700'
                          }`}
                        >
                          {row.active ? 'Disable' : 'Enable'}
                        </button>
                      )}
                      {!isSelf && (
                        <button
                          onClick={() => handleDelete(row)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      )}
                    </div>

                    {resetPw === row._id && (
                      <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-xl bg-[#FAF9F5] border border-[#EFE9DC] p-3">
                        <input
                          type="password"
                          value={resetVal}
                          onChange={(e) => setResetVal(e.target.value)}
                          placeholder="New password (min 8 chars)"
                          className={`${inputCls} sm:flex-1`}
                        />
                        <button
                          onClick={() => handleReset(row)}
                          disabled={resetVal.length < 8}
                          className="px-4 py-2.5 rounded-xl bg-[#141414] hover:bg-[#241E16] disabled:opacity-50 text-[#DFBA54] text-xs font-bold transition-colors cursor-pointer"
                        >
                          Save password
                        </button>
                        <button
                          onClick={() => setResetPw(null)}
                          className="px-3 py-2.5 rounded-xl bg-white border border-[#E3DCCB] text-[#6B6559] text-xs font-bold transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
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