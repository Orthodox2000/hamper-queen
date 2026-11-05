'use client';

/**
 * admin-header.tsx
 * -----------------------------------------------------------------------------
 * The single top bar shared by every admin screen (orders, order editor,
 * catalog, promo codes, staff). One structure, one theme, one set of tabs, and
 * logout available everywhere — instead of five hand-rolled copies.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Crown, ExternalLink, Layers, Loader2, LogOut, Package, TicketPercent, Users } from 'lucide-react';

const TABS = [
  { href: '/admin', label: 'Orders', icon: Package, match: (p: string) => p === '/admin' || p.startsWith('/admin/orders') },
  { href: '/admin/catalog', label: 'Catalog', icon: Layers, match: (p: string) => p.startsWith('/admin/catalog') },
  { href: '/admin/promo', label: 'Promo codes', icon: TicketPercent, match: (p: string) => p.startsWith('/admin/promo') },
  { href: '/admin/staff', label: 'Staff', icon: Users, match: (p: string) => p.startsWith('/admin/staff') },
];

interface AdminHeaderProps {
  /** Page title shown under the brand, e.g. "Promo codes & coupons". */
  title: string;
  subtitle?: string;
  /** Page-specific controls (e.g. "New product") rendered before Storefront / Logout. */
  actions?: React.ReactNode;
}

export function AdminHeader({ title, subtitle, actions }: AdminHeaderProps) {
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      window.location.href = '/admin';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl shadow-[inset_0_-1px_0_var(--color-line)]">
      <div className="container-page">
        <div className="flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-10 h-10 shrink-0 rounded-2xl bg-ink text-gold-300 shadow-soft flex items-center justify-center">
              <Crown className="w-5 h-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h1 className="font-seasons text-base sm:text-lg font-bold text-ink leading-tight truncate">{title}</h1>
              {subtitle && <p className="text-xs text-stone truncate">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {actions}
            <a href="/" target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm hidden sm:inline-flex">
              <ExternalLink className="w-4 h-4 text-gold-700" aria-hidden="true" />
              <span>Storefront</span>
            </a>
            <button onClick={handleLogout} disabled={loggingOut} className="btn btn-ghost btn-sm text-red-700">
              {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" aria-hidden="true" />}
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>

        <nav aria-label="Admin sections" className="flex items-center gap-1 -mb-px overflow-x-auto pb-2">
          {TABS.map(({ href, label, icon: Icon, match }) => {
            const active = match(pathname);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-250 ${
                  active
                    ? 'bg-gold-50 text-ink shadow-[inset_0_0_0_1px_var(--color-gold-200)]'
                    : 'text-cocoa hover:text-ink hover:bg-cream-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-gold-700' : 'text-stone'}`} aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
