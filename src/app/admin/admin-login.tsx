'use client';

/**
 * admin-login.tsx
 * -----------------------------------------------------------------------------
 * Staff-only password gate for the /admin panel. POSTs to /api/admin/login and
 * reloads so the server-rendered dashboard can verify the session cookie.
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, Lock, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter the admin password.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || 'Incorrect password.');
        setSubmitting(false);
        return;
      }
      router.refresh();
      router.replace('/admin');
    } catch {
      setError('Connection error. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-[#FFFDF9] border-2 border-[#D4AF37]/50 shadow-md space-y-5">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#141414] text-[#DFBA54] flex items-center justify-center shadow-md">
              <Crown className="w-7 h-7" />
            </div>
            <h1 className="font-cinzel text-xl font-bold text-[#141414]">Hamper Queen Admin</h1>
            <p className="text-xs text-[#6B6559]">Staff panel — restricted access</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-[11px] font-semibold text-[#524B40]">Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              autoFocus
              className="w-full px-4 py-3 rounded-2xl bg-white border border-[#D4AF37]/70 text-sm focus:outline-hidden focus:border-[#B8860B]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-2xl bg-[#141414] hover:bg-[#252525] text-[#DFBA54] font-cinzel font-bold text-xs uppercase tracking-wider border border-[#D4AF37] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            <span>Unlock Panel</span>
          </button>

          <a
            href="/"
            className="flex items-center justify-center gap-1 text-[11px] text-[#8C6821] hover:underline cursor-pointer pt-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to storefront
          </a>
        </form>
      </div>
    </div>
  );
}