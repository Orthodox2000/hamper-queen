/**
 * FounderStrip.tsx
 * -----------------------------------------------------------------------------
 * Slim "Founded by" band shown directly BELOW the homepage hero (it used to sit
 * in the top announcement bar). Static markup, server-renderable.
 */

import React from 'react';
import { Crown, Heart } from 'lucide-react';
import { HAMPER_QUEEN_OFFICIAL_CONTACT } from '../data/hamperQueenCatalog';

export const FounderStrip: React.FC = () => (
  <section aria-label="About the founder" className="bg-cream-100 border-y border-line">
    <div className="container-page flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 sm:gap-6 py-4 text-center sm:text-left">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 shrink-0 rounded-full bg-ink text-gold-300 flex items-center justify-center shadow-soft">
          <Crown className="w-5 h-5" aria-hidden="true" />
        </span>
        <p className="text-sm text-cocoa leading-snug">
          <span className="font-seasons text-base font-bold text-ink">
            Founded by <span className="accent-script">Ms. Supriya Khandekar</span>
          </span>
          <span className="block text-xs text-stone mt-0.5">Homegrown Mumbai gifting boutique</span>
        </p>
      </div>
      <p className="flex items-center gap-2 font-cormorant text-sm italic text-cocoa">
        <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" aria-hidden="true" />
        &ldquo;{HAMPER_QUEEN_OFFICIAL_CONTACT.tagline}&rdquo;
      </p>
    </div>
  </section>
);
