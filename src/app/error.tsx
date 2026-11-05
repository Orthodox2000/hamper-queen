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
    <section className="min-h-[70dvh] flex items-center justify-center bg-cream-50 text-ink px-4 section">
      <div className="max-w-xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-50 border border-line-strong text-gold-700 text-xs font-sans font-semibold">
          <Crown className="w-3.5 h-3.5 text-gold-700" />
          <span>Hamper Queen · A Glitch in the Royal Wrapping</span>
        </div>

        <div className="w-16 h-16 mx-auto rounded-full bg-[#FBF6E8] border border-gold-400/70 text-gold-700 flex items-center justify-center">
          <RefreshCcw className="w-8 h-8" />
        </div>

        <h1 className="font-seasons text-3xl sm:text-4xl font-bold tracking-tight">
          Something Went <span className="accent-script">Slightly Off</span>
        </h1>
        <p className="font-seasons text-base sm:text-lg text-cocoa leading-relaxed">
          An unexpected hiccup happened while wrapping this page. Try again — and if it persists,
          our team is one WhatsApp message away.
        </p>

        <p className="text-xs text-mist">Reference: {error.digest ?? '—'}</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-gold-100 font-sans text-xs font-semibold hover:bg-ink-soft transition-all cursor-pointer"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-50 text-gold-700 border border-gold-200 font-sans text-xs font-semibold hover:bg-gold-100 transition-all"
          >
            Back to Home
          </Link>
          <a
            href={`https://wa.me/91${HAMPER_QUEEN_OFFICIAL_CONTACT.phone}?text=${encodeURIComponent('Hi Hamper Queen! I hit an error on your website while customising an order.')}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-whatsapp hover:bg-whatsapp-dark text-white font-sans text-xs font-semibold transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            WhatsApp Support
          </a>
        </div>
      </div>
    </section>
  );
}