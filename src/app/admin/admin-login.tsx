'use client';

/**
 * admin-login.tsx
 * -----------------------------------------------------------------------------
 * Staff-only password gate for the /admin panel. POSTs to /api/admin/login and
 * reloads so the server-rendered dashboard can verify the session cookie.
 */

import React, { useState } from 'react';
import { Crown, Lock, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

export function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please enter your admin username and password.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || 'Incorrect password.');
        setSubmitting(false);
        return;
      }
      // Full navigation: guarantees the fresh httpOnly cookie is sent and the server gate re-renders.
      window.location.replace('/admin');
    } catch {
      setError('Connection error. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-cream-50 border border-gold-400/50 shadow-lift space-y-5">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-ink text-gold-300 flex items-center justify-center shadow-lift">
              <Crown className="w-7 h-7" />
            </div>
            <h1 className="font-cinzel text-xl font-bold text-ink">Hamper Queen Admin</h1>
            <p className="text-xs text-stone">Staff panel — restricted access</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-[11px] font-semibold text-cocoa">Admin Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. superadmin"
              autoFocus
              className="w-full px-4 py-3 rounded-2xl bg-white border border-gold-400/70 text-sm focus:outline-hidden focus:border-gold-300"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-semibold text-cocoa">Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full px-4 py-3 rounded-2xl bg-white border border-gold-400/70 text-sm focus:outline-hidden focus:border-gold-300"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary w-full"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            <span>Unlock Panel</span>
          </button>

          <a
            href="/"
            className="flex items-center justify-center gap-1 text-[11px] text-gold-700 hover:underline cursor-pointer pt-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to storefront
          </a>
        </form>
      </div>
    </div>
  );
}