'use client';

import { Crown, RefreshCcw, MessageCircle } from 'lucide-react';
import { HAMPER_QUEEN_OFFICIAL_CONTACT } from '../data/hamperQueenCatalog';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FFFDF9] text-[#141414] antialiased selection:bg-[#D4AF37]/30 selection:text-[#111111]">
        <section className="min-h-screen flex items-center justify-center px-4 py-16">
          <div className="max-w-xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF5E8] border border-[#EAE0C8] text-[#8C6821] text-[10px] font-cinzel font-bold tracking-widest uppercase">
              <Crown className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>Hamper Queen · System Pause</span>
            </div>

            <div className="w-16 h-16 mx-auto rounded-full bg-[#FBF6E8] border-2 border-[#D4AF37]/70 text-[#B8860B] flex items-center justify-center">
              <RefreshCcw className="w-8 h-8" />
            </div>

            <h1 className="font-seasons text-3xl sm:text-4xl font-bold tracking-tight">
              The Royal Studio <span className="text-[#B8860B] italic">Just Flickered</span>
            </h1>
            <p className="font-seasons text-base sm:text-lg text-[#524B40] leading-relaxed">
              A system-level hiccup interrupted the gifting. Reload the page — your cart and selections
              are safe — or reach us on WhatsApp for instant help.
            </p>

            <p className="text-[11px] text-[#A49B8A]">Reference: {error.digest ?? '—'}</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#141414] text-[#DFBA54] border border-[#D4AF37] font-cinzel text-xs font-bold uppercase tracking-wider hover:bg-[#252525] transition-all cursor-pointer"
              >
                <RefreshCcw className="w-4 h-4" />
                Reload
              </button>
              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#FAF5E8] text-[#8C6821] border border-[#D4AF37] font-cinzel text-xs font-bold uppercase tracking-wider hover:bg-[#F3E5AB] transition-all cursor-pointer"
              >
                Back to Home
              </button>
              <a
                href={`https://wa.me/91${HAMPER_QUEEN_OFFICIAL_CONTACT.phone}?text=${encodeURIComponent('Hi Hamper Queen! The website hit a system error while I was using it.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-sans text-xs font-bold transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                WhatsApp Support
              </a>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}