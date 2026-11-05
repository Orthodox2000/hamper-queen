/**
 * LegalPageLayout.tsx
 * -----------------------------------------------------------------------------
 * Shared shell for the standalone legal pages (EULA / Privacy / Terms).
 * Server component: sticky brand header, cross-links to sibling policies,
 * content card, and a contact block with the official Hamper Queen details.
 */
import React from 'react';
import Link from 'next/link';
import { Crown, ArrowLeft, Mail, Phone, Instagram } from 'lucide-react';
import { HAMPER_QUEEN_OFFICIAL_CONTACT } from '../../data/hamperQueenCatalog';

interface LegalPageLayoutProps {
  title: string;
  updatedOn: string;
  children: React.ReactNode;
}

const LEGAL_LINKS = [
  { href: '/terms-of-service', label: 'Terms of Service' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/eula', label: 'End-User Licence Agreement' },
];

export const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({ title, updatedOn, children }) => {
  const { phone, phoneDisplay, email } = HAMPER_QUEEN_OFFICIAL_CONTACT;

  return (
    <main className="min-h-dvh bg-cream-50 text-ink antialiased">
      {/* Sticky legal-nav header */}
      <header className="sticky top-0 z-20 bg-ink text-gold-100 border-b border-gold-400/40 shadow-lift">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 text-xs font-sans font-semibold hover:text-white transition-colors">
            <Crown className="w-4 h-4 text-gold-300" />
            <span>Hamper Queen</span>
          </Link>
          <nav className="flex items-center gap-3 text-xs font-sans">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-gold-100/80 hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-gold-700 hover:text-ink transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>

        <div className="space-y-1.5 mb-8">
          <h1 className="font-seasons text-3xl sm:text-4xl font-bold tracking-tight">{title}</h1>
          <p className="text-xs font-sans text-stone">
            Hamper Queen • Last updated: {updatedOn}
          </p>
        </div>

        <div className="bg-white border border-[#EADFC6] rounded-3xl shadow-soft p-6 sm:p-10 space-y-8">
          {children}
        </div>

        {/* Contact block */}
        <section className="mt-8 p-6 rounded-2xl bg-white border border-[#EADFC6] text-center space-y-3">
          <h2 className="font-seasons text-lg font-bold">Questions or concerns?</h2>
          <p className="text-xs text-cocoa font-sans leading-relaxed max-w-prose mx-auto">
            Write to us or WhatsApp us a screenshot of this page, and we will respond within 24–48 hours.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-sans text-ink">
            <a href={`tel:+91${phone}`} className="inline-flex items-center gap-1.5 hover:text-gold-700 transition-colors">
              <Phone className="w-3.5 h-3.5 text-gold-700" />
              {phoneDisplay}
            </a>
            <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 hover:text-gold-700 transition-colors break-all">
              <Mail className="w-3.5 h-3.5 text-gold-700" />
              {email}
            </a>
            <a href="https://www.instagram.com/hamper_queen/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-gold-700 transition-colors">
              <Instagram className="w-3.5 h-3.5 text-gold-700" />
              @hamper_queen
            </a>
          </div>
        </section>
      </div>
    </main>
  );
};