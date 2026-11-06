'use client';

/**
 * Header.tsx
 * -----------------------------------------------------------------------------
 * Site chrome: a dark gold-accented announcement bar (scrolls away) + ONE slim
 * sticky navigation bar. The founder line lives in <FounderStrip /> below the hero.
 *
 *  - Sticky bar is a fixed 4rem (--header-h) so anchors, drawers and sticky
 *    sub-navs can all rely on the same offset — no layout shift.
 *  - Logo | centred nav | actions, the same structure as the reference store.
 *  - Mobile menu animates height with a grid-rows transition, closes on route
 *    change, on Escape, and exposes aria-expanded / aria-controls.
 *  - Stable ids used by tests/tools: #nav-link-*, #mobile-nav-*,
 *    #btn-open-hamper-drawer, #btn-mobile-menu, #btn-open-booking-header.
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Gift, MessageCircle, Search, Compass, Home, Sparkles, Zap, Truck, Phone } from 'lucide-react';
import { CustomHamper, LanguageMode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { HamperQueenLogo } from './HamperQueenLogo';
import { HAMPER_QUEEN_OFFICIAL_CONTACT } from '../data/hamperQueenCatalog';

interface HeaderProps {
  activeHamper: CustomHamper;
  onOpenHamperDrawer: () => void;
  onOpenBooking?: () => void;
  language: LanguageMode;
  setLanguage: (lang: LanguageMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeHamper,
  onOpenHamperDrawer,
  onOpenBooking,
  language,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = TRANSLATIONS[language];
  const pathname = usePathname();

  const navItems = [
    { id: 'home', label: t.nav.home, icon: Home, href: '/' },
    { id: 'customised', label: t.nav.customised, icon: Gift, href: '/customised' },
    { id: 'track', label: t.nav.track, icon: Search, href: '/track' },
    { id: 'catalog', label: t.nav.collections, icon: Compass, href: '/catalog' },
  ];

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hi Hamper Queen! I would like to inquire about customized luxury hampers & bouquets.`
    );
    window.open(`https://wa.me/91${HAMPER_QUEEN_OFFICIAL_CONTACT.phone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const isRouteActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Escape closes the menu; a subtle shadow appears once the page scrolls.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const cartCount = activeHamper.items.length;

  return (
    <>
      {/* Announcement bar — dark ink with gold accents; scrolls away so only one bar stays pinned */}
      <div className="relative bg-ink text-gold-100 text-xs overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-400/70 to-transparent" />
        <div className="container-page flex items-center justify-center lg:justify-between gap-6 py-2.5">
          <ul className="flex items-center justify-center gap-x-5 gap-y-1 min-w-0 font-medium tracking-wide">
            <li className="flex items-center gap-2 whitespace-nowrap">
              <Zap className="w-3.5 h-3.5 text-gold-300 shrink-0" aria-hidden="true" />
              <span>Same-day dispatch from Mumbai</span>
            </li>
            <li aria-hidden="true" className="hidden sm:block text-gold-500/60">◆</li>
            <li className="hidden sm:flex items-center gap-2 whitespace-nowrap">
              <Truck className="w-3.5 h-3.5 text-gold-300 shrink-0" aria-hidden="true" />
              <span>Free delivery above ₹{HAMPER_QUEEN_OFFICIAL_CONTACT.freeDeliveryThreshold}</span>
            </li>
            <li aria-hidden="true" className="hidden md:block text-gold-500/60">◆</li>
            <li className="hidden md:flex items-center gap-2 whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 text-gold-300 shrink-0" aria-hidden="true" />
              <span>Custom hampers from ₹{HAMPER_QUEEN_OFFICIAL_CONTACT.minOrder}</span>
            </li>
          </ul>
          <a
            href={`tel:+91${HAMPER_QUEEN_OFFICIAL_CONTACT.phone}`}
            className="hidden lg:inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1 font-semibold text-gold-100 shadow-[inset_0_0_0_1px_rgba(223,186,84,0.45)] hover:bg-gold-300 hover:text-ink transition-colors"
          >
            <Phone className="w-3.5 h-3.5" aria-hidden="true" />
            {HAMPER_QUEEN_OFFICIAL_CONTACT.phoneDisplay}
          </a>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 bg-white/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/75 transition-shadow duration-250 ${
          scrolled ? 'shadow-soft' : ''
        }`}
        style={{ boxShadow: scrolled ? undefined : 'inset 0 -1px 0 var(--color-line)' }}
      >
        <div className="container-page">
          <div className="h-16 grid grid-cols-[auto_1fr_auto] items-center gap-4">
            {/* Brand */}
            <Link href="/" aria-label="Hamper Queen — home" className="rounded-xl -ml-1 px-1">
              <HamperQueenLogo size="md" showSubtitle={false} />
            </Link>

            {/* Desktop navigation */}
            <nav aria-label="Primary" className="hidden lg:flex items-center justify-center gap-1">
              {navItems.map((item) => {
                const isActive = isRouteActive(item.href);
                return (
                  <Link
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-250 ${
                      isActive
                        ? 'bg-gold-50 text-ink shadow-[inset_0_0_0_1px_var(--color-gold-200)]'
                        : 'nav-underline text-cocoa hover:text-ink'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 sm:gap-3 col-start-3">
              {onOpenBooking && (
                <button
                  id="btn-open-booking-header"
                  onClick={onOpenBooking}
                  className="btn btn-ghost btn-sm hidden md:inline-flex"
                >
                  <Gift className="w-4 h-4 text-gold-700" aria-hidden="true" />
                  <span>Book order</span>
                </button>
              )}

              <button
                id="btn-open-hamper-drawer"
                onClick={onOpenHamperDrawer}
                aria-label={`Open cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
                className="btn btn-primary btn-sm"
              >
                <ShoppingBag className="w-4 h-4 text-gold-300" aria-hidden="true" />
                <span className="hidden sm:inline">Cart</span>
                <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-gold-300 text-ink text-xs font-bold leading-none">
                  {cartCount}
                </span>
              </button>

              <button
                id="btn-mobile-menu"
                onClick={() => setMobileMenuOpen((o) => !o)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full text-ink hover:bg-cream-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu — animates height without measuring */}
        <div
          id="mobile-menu"
          className={`lg:hidden grid transition-[grid-template-rows] duration-300 ease-[var(--ease-soft)] ${
            mobileMenuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="overflow-hidden">
            <div className="container-page pb-5 pt-1">
              <nav aria-label="Mobile" className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isRouteActive(item.href);
                  return (
                    <Link
                      key={item.id}
                      id={`mobile-nav-${item.id}`}
                      href={item.href}
                      tabIndex={mobileMenuOpen ? 0 : -1}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${
                        isActive ? 'bg-gold-50 text-ink' : 'text-cocoa hover:bg-cream-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-gold-700' : 'text-stone'}`} aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-3 pt-4 grid gap-2 border-t border-line">
                {onOpenBooking && (
                  <button
                    tabIndex={mobileMenuOpen ? 0 : -1}
                    onClick={() => {
                      onOpenBooking();
                      setMobileMenuOpen(false);
                    }}
                    className="btn btn-ghost w-full"
                  >
                    <Gift className="w-4 h-4 text-gold-700" aria-hidden="true" />
                    <span>Book hamper</span>
                  </button>
                )}
                <button tabIndex={mobileMenuOpen ? 0 : -1} onClick={handleWhatsApp} className="btn btn-whatsapp w-full">
                  <MessageCircle className="w-4 h-4 fill-white" aria-hidden="true" />
                  <span>WhatsApp {HAMPER_QUEEN_OFFICIAL_CONTACT.phone}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
