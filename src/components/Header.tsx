/**
 * Header.tsx
 * -----------------------------------------------------------------------------
 * Site chrome: slim announcement bar + main navigation row.
 *
 *  - Navbar height is padding-driven (min-h-14 / sm:min-h-16) for a compact,
 *    airy feel; the brand logo emblem is sized up (size="lg" crest).
 *  - Stable ids used by tests/tools: #nav-link-*, #mobile-nav-*,
 *    #btn-open-hamper-drawer, #btn-mobile-menu.
 */

import React, { useState } from 'react';
import { Crown, Sparkles, ShoppingBag, Menu, X, Globe, Compass, Gift, MessageCircle } from 'lucide-react';
import { CustomHamper, LanguageMode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { HamperQueenLogo } from './HamperQueenLogo';
import { HAMPER_QUEEN_OFFICIAL_CONTACT } from '../data/hamperQueenCatalog';
import { triggerGoldConfetti } from '../utils/confetti';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeHamper: CustomHamper;
  onOpenHamperDrawer: () => void;
  onOpenBooking?: () => void;
  language: LanguageMode;
  setLanguage: (lang: LanguageMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeHamper,
  onOpenHamperDrawer,
  onOpenBooking,
  language,
  setLanguage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[language];

  const navItems = [
    { id: 'home', label: t.nav.home, icon: Crown },
    { id: 'customised', label: t.nav.customised, icon: Gift },
    { id: 'catalog', label: t.nav.collections, icon: Compass },
  ];

  const handleWhatsApp = () => {
    triggerGoldConfetti(0.5, 0.4);
    const text = encodeURIComponent(
      `Hi Hamper Queen! I would like to inquire about customized luxury hampers & bouquets.`
    );
    window.open(`https://wa.me/91${HAMPER_QUEEN_OFFICIAL_CONTACT.phone}?text=${text}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-[#D4AF37]/30 shadow-xs">
      
      {/* 1. Announcement Top Bar: Tagline + WhatsApp / Book Order / Language */}
      <div className="bg-gradient-to-r from-[#141210] via-[#2A2318] to-[#141210] text-[#F3E5AB] text-[11px] py-1 px-4 sm:px-8 border-b border-[#D4AF37]/40 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 shadow-xs">
        <div className="hidden lg:flex items-center gap-2.5 text-[#EDE8DF] tracking-wide text-[11px]"> <div className="flex items-center justify-center gap-1.5 text-center px-2">
            <Crown className="w-3.5 h-3.5 text-[#DFBA54] shrink-0" />
            <span className="text-[11px] sm:text-xs text-[#F3E5AB] font-sans font-semibold tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              Founded by <strong>Ms. Supriya Khandekar</strong> — Homegrown Gifting Boutique
            </span>
          </div>
        </div>

        <div className="lg:hidden flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#DFBA54]" />
          <span className="font-sans font-semibold text-[#F3E5AB] text-[11px] tracking-wider uppercase">
            Luxury Gifting Atelier • Mumbai
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleWhatsApp}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[10.5px] font-bold tracking-wide transition-all cursor-pointer shadow-xs"
          >
            <MessageCircle className="w-3 h-3 fill-white" />
            <span>Order: 8080580105</span>
          </button>

          {onOpenBooking && (
            <button
              id="btn-open-booking-header"
              onClick={() => {
                triggerGoldConfetti(0.5, 0.5);
                onOpenBooking();
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5E8] hover:bg-[#F3E5AB] text-[#8C6821] border border-[#D4AF37] text-[10.5px] font-bold tracking-wide uppercase transition-all shadow-xs cursor-pointer"
            >
              <Gift className="w-3 h-3 text-[#B8860B]" />
              <span>Book Order</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-md border border-[#D4AF37]/40 text-[11px] font-bold text-[#F3E5AB]">
            <Globe className="w-3.5 h-3.5 text-[#DFBA54]" />
            <span>English (India)</span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 py-1 min-h-14 sm:min-h-16">

          {/* Brand Logo */}
          <HamperQueenLogo
            size="lg"
            showSubtitle={false}
            onClick={() => setActiveTab('home')}
          />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    triggerGoldConfetti(0.5, 0.4);
                    setActiveTab(item.id);
                  }}
                  className={`relative px-4 py-2 rounded-lg text-xs font-sans font-semibold tracking-wide uppercase transition-all duration-200 flex items-center cursor-pointer whitespace-nowrap shrink-0 border ${
                    isActive
                      ? 'bg-[#141414] text-[#F3E5AB] border-[#B8860B] shadow-sm ring-1 ring-[#DFBA54]/30'
                      : 'text-[#3D3A35] border-transparent hover:border-[#D8CCA8] hover:bg-[#FAF8F2] hover:text-[#141414]'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Buttons: Royal Cart + Mobile Menu */}
          <div className="flex items-center gap-2.5">

            {/* Custom Hamper Staging Drawer Trigger */}
            <button
              id="btn-open-hamper-drawer"
              onClick={() => {
                triggerGoldConfetti(0.5, 0.5);
                onOpenHamperDrawer();
              }}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#141414] to-[#24211E] text-[#F3E5AB] border border-[#D4AF37] hover:from-[#262626] hover:to-[#33302B] transition-all cursor-pointer shadow-md transform hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-4 h-4 text-[#DFBA54]" />
              <span className="text-[11px] font-sans font-bold tracking-widest uppercase hidden sm:inline">
                ROYAL CART
              </span>
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold bg-[#800E17] text-white border border-[#DFBA54]/50 ml-0.5">
                {activeHamper.items.length}
              </span>
            </button>

            {/* Mobile menu toggle */}
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#141414] border border-[#D8CCA8] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFDF9] border-b border-[#D4AF37]/40 px-4 pt-3 pb-5 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  triggerGoldConfetti(0.5, 0.4);
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-xs font-sans font-semibold uppercase tracking-wide flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-[#141414] text-[#F3E5AB] border border-[#B8860B]'
                    : 'text-[#3D3A35] hover:bg-[#F5F2EA]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#DFBA54]' : 'text-[#8C6821]'}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}

          <div className="pt-3 border-t border-[#EAE5D9] space-y-2">
            {onOpenBooking && (
              <button
                onClick={() => {
                  triggerGoldConfetti(0.5, 0.5);
                  onOpenBooking();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-lg bg-[#FAF5E8] border border-[#D4AF37] text-[#8C6821] text-xs font-sans font-bold uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer"
              >
                <Gift className="w-4 h-4 text-[#B8860B]" />
                <span>Book Hamper / Geolocation Pin</span>
              </button>
            )}

            <button
              onClick={handleWhatsApp}
              className="w-full py-3 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Direct WhatsApp: 8080580105</span>
            </button>
          </div>
        </div>
      )}

    </header>
  );
};