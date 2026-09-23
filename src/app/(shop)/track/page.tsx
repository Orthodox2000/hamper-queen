'use client';

/**
 * track/page.tsx
 * -----------------------------------------------------------------------------
 * Public order lookup — enter a Hamper Queen tracking ID (HQ-XXXXXX) to view
 * live order status and delivery progression.
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, PackageCheck, Sparkles } from 'lucide-react';
import { royaleLogger } from '../../../utils/logger';

export default function TrackLookupPage() {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = trackingId.trim().toUpperCase().replace(/\s+/g, '');
    if (!cleaned) {
      setError('Please enter your tracking ID (e.g. HQ-7K2M9Q).');
      return;
    }
    if (!/^HQ-[A-Z2-9]{6}$/.test(cleaned)) {
      setError('That does not look like a Hamper Queen tracking ID. The format is HQ- followed by 6 letters/numbers.');
      return;
    }
    setError('');
    royaleLogger.action('Track', `User searching tracking ID: ${cleaned}`);
    router.push(`/track/${cleaned}`);
  };

  return (
    <section className="py-16 sm:py-20 bg-white text-[#141414] border-b border-[#EAE5D9]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF5E8] border border-[#EAE0C8] text-[#8C6821] text-xs font-cinzel font-bold tracking-widest uppercase">
            <PackageCheck className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Order Tracking & Validation</span>
          </div>
          <h1 className="font-seasons text-3xl sm:text-4xl font-bold tracking-tight">
            Track Your <span className="text-[#B8860B] italic">Hamper Queen</span> Order
          </h1>
          <p className="font-seasons text-base sm:text-lg text-[#524B40] leading-relaxed">
            Enter the tracking ID shared with you (or with the gift recipient) to see the live status of your order — from crafting to doorstep delivery.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-8 rounded-3xl bg-[#FFFDF9] border-2 border-[#D4AF37]/50 shadow-md space-y-4"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C6821]" />
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="e.g. HQ-7K2M9Q"
              autoFocus
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-[#D4AF37]/70 text-sm font-semibold uppercase tracking-wider placeholder:font-normal placeholder:normal-case placeholder:text-[#A49B8A] focus:outline-hidden focus:border-[#B8860B] shadow-2xs"
            />
          </div>

          {error && (
            <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-[#141414] hover:bg-[#252525] text-[#DFBA54] font-cinzel font-bold text-sm uppercase tracking-wider border border-[#D4AF37] shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Search My Order</span>
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-[#6B6559] pt-1">
            <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>
              No tracking ID yet? Every new order instantly receives one and it is shared on WhatsApp with your payment receipt.
            </span>
          </div>
        </form>
      </div>
    </section>
  );
}