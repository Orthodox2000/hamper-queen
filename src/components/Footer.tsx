/**
 * Footer.tsx
 * -----------------------------------------------------------------------------
 * Site footer: compact Founder Note (founder line + signature love quote),
 * three columns (Brand / The Atelier navigation / Private Concierge contact),
 * and a bottom bar with real legal links (Terms, Privacy, EULA).
 *
 * Note: this file is a server-component-safe React component but is rendered
 * inside the client App tree.
 */

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Sparkles, Crown, Heart } from 'lucide-react';
import { HamperQueenLogo } from './HamperQueenLogo';
import { LanguageMode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { HAMPER_QUEEN_OFFICIAL_CONTACT } from '../data/hamperQueenCatalog';

interface FooterProps {
  language?: LanguageMode;
}

export const Footer: React.FC<FooterProps> = ({ language = 'en' }) => {
  const t = TRANSLATIONS[language];
  const { phone, phoneDisplay, email, tagline } = HAMPER_QUEEN_OFFICIAL_CONTACT;

  return (
    <footer className="bg-cream-50 text-ink border-t border-line pt-14 pb-10 overflow-x-hidden">
      <div className="container-page">

        {/* Founder Note: compact founder line + the love-and-care signature quote */}
        <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-cream-100 via-cream-50 to-[#F5EFE1] border border-line-strong shadow-soft relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-gold-300/10 blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 relative z-10">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-full bg-ink text-gold-300 flex items-center justify-center shrink-0 shadow-lift">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-seasons text-lg sm:text-xl font-bold leading-tight">
                  Founded by <span className="accent-script">Ms. Supriya Khandekar</span>
                </h3>
                <p className="text-xs text-stone font-sans mt-0.5">
                  Homegrown Mumbai gifting boutique — handcrafted hampers & bouquets
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 max-w-md text-right">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
              <p className="font-cormorant text-sm italic text-cocoa leading-snug">
                &ldquo;{tagline}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Grid: Brand / Atelier / Concierge */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-line">

          {/* Brand & Crest Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <HamperQueenLogo size="lg" theme="light" showSubtitle={true} bilingualSubtitle={false} />

            <p className="font-seasons text-sm text-cocoa leading-relaxed max-w-sm">
              Hamper Queen — custom gift hampers, chocolate bouquets, and velvet trunks, hand-packed in Mumbai and delivered across India.
            </p>

            <div className="flex items-center gap-2 pt-2 text-xs text-gold-700">
              <Sparkles className="w-4 h-4 text-gold-700" />
              <span className="font-semibold tracking-wide font-seasons">
                Birthday Hampers, Chocolate Bouquets & Custom Gifting
              </span>
            </div>
          </div>

          {/* Quick Navigation Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-seasons text-xs font-semibold text-ink">
The Studio
            </h4>
            <ul className="space-y-2 text-xs text-stone">
              <li>
                <Link href="/" className="hover:text-gold-700 transition-colors cursor-pointer">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/inspirations" className="hover:text-gold-700 transition-colors cursor-pointer">
                  {t.nav.inspirations}
                </Link>
              </li>
              <li>
                <Link href="/customised" className="hover:text-gold-700 transition-colors cursor-pointer font-semibold text-gold-700">
                  {t.nav.customised}
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="hover:text-gold-700 transition-colors cursor-pointer">
                  {t.nav.collections}
                </Link>
              </li>
              <li>
                <Link href="/atelier" className="hover:text-gold-700 transition-colors cursor-pointer">
                  {t.nav.atelier}
                </Link>
              </li>
              <li>
                <Link href="/scribe" className="hover:text-gold-700 transition-colors cursor-pointer">
                  {t.nav.calligraphy}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-gold-700 transition-colors cursor-pointer">
                  {t.nav.pricing}
                </Link>
              </li>
              <li>
                <Link href="/brochures" className="hover:text-gold-700 transition-colors cursor-pointer">
                  {t.nav.lookbooks}
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-gold-700 transition-colors cursor-pointer font-semibold text-gold-700">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Private Concierge & Delivery (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-sans text-xs font-semibold text-ink">
              {t.footer.conciergeTitle}
            </h4>
            <ul className="space-y-3 text-xs text-cocoa">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold-700 shrink-0 mt-0.5" />
                <span>Hamper Queen Studio • Handcrafted Packaging & Dispatch</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold-700 shrink-0" />
                <a
                  href={`tel:+91${phone}`}
                  className="font-semibold text-ink hover:text-gold-700 transition-colors cursor-pointer underline-offset-2 hover:underline"
                >
                  Call / WhatsApp: {phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-700 shrink-0" />
                <a
                  href={`mailto:${email}?subject=${encodeURIComponent('Hamper Queen Order Enquiry')}`}
                  className="text-ink hover:text-gold-700 transition-colors cursor-pointer underline-offset-2 hover:underline break-all"
                >
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-gold-700 shrink-0" />
                <a
                  href="https://www.instagram.com/hamper_queen/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-ink hover:text-gold-700 transition-colors cursor-pointer underline-offset-2 hover:underline"
                >
                  Instagram: @hamper_queen
                </a>
              </li>
            </ul>

            <div className="pt-3 border-t border-line">
              <span className="text-xs text-gold-700 font-sans block font-semibold">
                {t.footer.hours}
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-gold-700" />
            <span>© {new Date().getFullYear()} {t.footer.copyright}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
            <Link href="/track" className="hover:text-gold-700 transition-colors cursor-pointer font-semibold text-gold-700">
              Track Your Order
            </Link>
            <span className="text-mist">•</span>
            <Link href="/terms-of-service" className="hover:text-gold-700 transition-colors cursor-pointer">
              Terms of Service
            </Link>
            <span className="text-mist">•</span>
            <Link href="/privacy-policy" className="hover:text-gold-700 transition-colors cursor-pointer">
              Privacy Policy
            </Link>
            <span className="text-mist">•</span>
            <Link href="/eula" className="hover:text-gold-700 transition-colors cursor-pointer">
              EULA
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};