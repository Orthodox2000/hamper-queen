'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Crown, RefreshCcw, MessageCircle } from 'lucide-react';
import { HAMPER_QUEEN_OFFICIAL_CONTACT } from '../data/hamperQueenCatalog';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled page error:', error);
  }, [error]);

  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-[#FFFDF9] text-[#141414] border-b border-[#EAE5D9] px-4 py-16 sm:py-24">
      <div className="max-w-xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF5E8] border border-[#EAE0C8] text-[#8C6821] text-[10px] font-cinzel font-bold tracking-widest uppercase">
          <Crown className="w-3.5 h-3.5 text-[#B8860B]" />
          <span>Hamper Queen · A Glitch in the Royal Wrapping</span>
        </div>

        <div className="w-16 h-16 mx-auto rounded-full bg-[#FBF6E8] border-2 border-[#D4AF37]/70 text-[#B8860B] flex items-center justify-center">
          <RefreshCcw className="w-8 h-8" />
        </div>

        <h1 className="font-seasons text-3xl sm:text-4xl font-bold tracking-tight">
          Something Went <span className="text-[#B8860B] italic">Slightly Off</span>
        </h1>
        <p className="font-seasons text-base sm:text-lg text-[#524B40] leading-relaxed">
          An unexpected hiccup happened while wrapping this page. Try again — and if it persists,
          our team is one WhatsApp message away.
        </p>

        <p className="text-[11px] text-[#A49B8A]">Reference: {error.digest ?? '—'}</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#141414] text-[#DFBA54] border border-[#D4AF37] font-cinzel text-xs font-bold uppercase tracking-wider hover:bg-[#252525] transition-all cursor-pointer"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FAF5E8] text-[#8C6821] border border-[#D4AF37] font-cinzel text-xs font-bold uppercase tracking-wider hover:bg-[#F3E5AB] transition-all"
          >
            Back to Home
          </Link>
          <a
            href={`https://wa.me/91${HAMPER_QUEEN_OFFICIAL_CONTACT.phone}?text=${encodeURIComponent('Hi Hamper Queen! I hit an error on your website while customising an order.')}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-sans text-xs font-bold transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            WhatsApp Support
          </a>
        </div>
      </div>
    </section>
  );
}