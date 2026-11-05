'use client';

/**
 * staff-manager.tsx
 * -----------------------------------------------------------------------------
 * Owner-only staff/team account management: create accounts, reset passwords,
 * toggle active, delete. Reuses the DB-backed adminUsers + scrypt auth.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  Users,
  Loader2,
  Plus,
  Trash2,
  BadgeCheck,
  Crown,
  UserCog,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

import { AdminHeader } from './admin-header';
export interface AdminStaffView {
  _id: string;
  username: string;
  name?: string;
  role: 'owner' | 'admin';
  active: boolean;
  createdAt: string;
  createdBy?: string;
}

const inputCls = 'field text-sm';
const labelCls = 'block text-xs font-semibold text-cocoa mb-1.5';

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
    <div className="min-h-dvh bg-cream-100">
      <AdminHeader
        title="Staff & admin accounts"
        subtitle="Owner can create, reset and disable accounts"
          actions={
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-50 text-gold-700 text-xs font-semibold shadow-[inset_0_0_0_1px_var(--color-gold-200)]">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              {rows.filter((r) => r.active).length} active
            </span>
          }
      />

      <main className="container-page py-8 space-y-6">
        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</div>
        )}

        {/* Create account */}
        <form onSubmit={handleCreate} className="rounded-3xl bg-white border border-line p-5 sm:p-6 shadow-soft space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-gold-700" />
            <h2 className="font-cinzel text-sm font-bold text-ink">Create Staff Account</h2>
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
            <p className="text-[11px] text-mist">
              New accounts get <strong className="text-gold-700">admin</strong> role and can sign in on the panel immediately. Only the owner can manage accounts.
            </p>
            <button
              type="submit"
              disabled={creating || !username.trim() || password.length < 8}
              className="btn btn-primary"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCog className="w-4 h-4" />}
              Create
            </button>
          </div>
        </form>

        {/* Accounts list */}
        <div className="rounded-3xl bg-white border border-line shadow-soft overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-cream-200">
            <h2 className="font-cinzel text-sm font-bold text-ink">Team Accounts</h2>
          </div>

          {loading ? (
            <div className="p-12 flex items-center justify-center text-gold-700">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
          ) : rows.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Users className="w-8 h-8 mx-auto text-mist" />
              <p className="text-sm font-semibold text-ink">No accounts found.</p>
            </div>
          ) : (
            <ul className="divide-y divide-cream-200">
              {rows.map((row) => {
                const isSelf = row._id === selfId;
                return (
                  <li key={row._id} className="px-5 sm:px-6 py-4 flex flex-col lg:flex-row lg:items-center gap-3">
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-ink">{row.username}</span>
                        {row.role === 'owner' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-ink border border-gold-200 text-gold-300 text-[11px] font-bold">
                            <Crown className="w-3 h-3" /> Owner
                          </span>
                        )}
                        {row.role === 'admin' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-[11px] font-bold">
                            <BadgeCheck className="w-3 h-3" /> Admin
                          </span>
                        )}
                        {isSelf && (
                          <span className="px-2 py-0.5 rounded-full bg-gold-50 border border-line-strong text-gold-700 text-[11px] font-bold">
                            You
                          </span>
                        )}
                        {!row.active && (
                          <span className="px-2 py-0.5 rounded-full bg-cream-200 border border-[#D8D0BF] text-stone text-[11px] font-bold">
                            Disabled
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone">
                        {row.name ? `${row.name} · ` : ''}Joined {new Date(row.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => { setResetPw(row._id); setResetVal(''); }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gold-50 hover:bg-[#F0E6CC] border border-line-strong text-gold-700 text-xs font-bold transition-colors cursor-pointer"
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
                      <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-xl bg-cream-100 border border-cream-200 p-3">
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
                          className="btn btn-primary"
                        >
                          Save password
                        </button>
                        <button
                          onClick={() => setResetPw(null)}
                          className="px-3 py-3 rounded-xl bg-white border border-line text-stone text-xs font-bold transition-colors cursor-pointer"
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