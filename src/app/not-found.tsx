import Link from 'next/link';
import { Crown, Compass, PackageSearch, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="min-h-[70dvh] flex items-center justify-center bg-cream-50 text-ink px-4 section">
      <div className="max-w-xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-50 border border-line-strong text-gold-700 text-xs font-sans font-semibold">
          <Crown className="w-3.5 h-3.5 text-gold-700" />
          <span>Hamper Queen · Page Not Found</span>
        </div>

        <div className="text-gold-700 font-sans text-xs font-semibold tracking-[0.5em]">404</div>
        <h1 className="font-seasons text-3xl sm:text-5xl font-bold tracking-tight">
          This Page Isn't <span className="accent-script">In the Hamper</span>
        </h1>
        <p className="font-seasons text-base sm:text-lg text-cocoa leading-relaxed">
          The page you were looking for has moved, been customised away, or perhaps was a limited-edition
          treat. Head back and we will help you find something just as special.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-gold-100 font-sans text-xs font-semibold hover:bg-ink-soft transition-all"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-50 text-gold-700 border border-gold-200 font-sans text-xs font-semibold hover:bg-gold-100 transition-all"
          >
            <Compass className="w-4 h-4" />
            Browse Collections
          </Link>
          <a
            href="/track"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-stone font-sans text-xs font-semibold hover:text-ink transition-colors"
          >
            <PackageSearch className="w-4 h-4" />
            Track an Order Instead
          </a>
        </div>
      </div>
    </section>
  );
}