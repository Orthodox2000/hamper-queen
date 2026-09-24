import Link from 'next/link';
import { Crown, Compass, PackageSearch, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-[#FFFDF9] text-[#141414] border-b border-[#EAE5D9] px-4 py-16 sm:py-24">
      <div className="max-w-xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF5E8] border border-[#EAE0C8] text-[#8C6821] text-[10px] font-cinzel font-bold tracking-widest uppercase">
          <Crown className="w-3.5 h-3.5 text-[#B8860B]" />
          <span>Hamper Queen · Page Not Found</span>
        </div>

        <div className="text-[#B8860B] font-cinzel text-xs font-bold tracking-[0.5em] uppercase">404</div>
        <h1 className="font-seasons text-3xl sm:text-5xl font-bold tracking-tight">
          This Page Isn't <span className="text-[#B8860B] italic">In the Hamper</span>
        </h1>
        <p className="font-seasons text-base sm:text-lg text-[#524B40] leading-relaxed">
          The page you were looking for has moved, been customised away, or perhaps was a limited-edition
          treat. Head back and we will help you find something just as special.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#141414] text-[#DFBA54] border border-[#D4AF37] font-cinzel text-xs font-bold uppercase tracking-wider hover:bg-[#252525] transition-all"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FAF5E8] text-[#8C6821] border border-[#D4AF37] font-cinzel text-xs font-bold uppercase tracking-wider hover:bg-[#F3E5AB] transition-all"
          >
            <Compass className="w-4 h-4" />
            Browse Collections
          </Link>
          <a
            href="/track"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[#6B6559] font-sans text-xs font-semibold hover:text-[#141414] transition-colors"
          >
            <PackageSearch className="w-4 h-4" />
            Track an Order Instead
          </a>
        </div>
      </div>
    </section>
  );
}