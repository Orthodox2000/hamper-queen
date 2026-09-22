import React from 'react';
import { Mail, Phone, MapPin, Sparkles, Crown } from 'lucide-react';
import { HamperQueenLogo } from './HamperQueenLogo';
import { LanguageMode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { HAMPER_QUEEN_OFFICIAL_CONTACT } from '../data/hamperQueenCatalog';

interface FooterProps {
  onNavigate: (tab: string) => void;
  language?: LanguageMode;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, language = 'en' }) => {
  const t = TRANSLATIONS[language];
  const { phone, phoneDisplay, email } = HAMPER_QUEEN_OFFICIAL_CONTACT;

  return (
    <footer className="bg-[#FFFDF9] text-[#141414] border-t border-[#EAE5D9] pt-16 pb-12 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* =========================================================================
            FEATURED FOUNDER & ATELIER STORY: MS. SUPRIYA KHANDEKAR
            ========================================================================= */}
        <div className="mb-16 p-6 sm:p-8 lg:p-10 rounded-2xl bg-gradient-to-br from-[#FAF8F5] via-[#FFFDF9] to-[#F5EFE1] border border-[#E5DAC2] shadow-xs relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-[#DFBA54]/10 blur-2xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Narrative */}
            <div className="lg:col-span-8 space-y-3.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] text-[#F3E5AB] text-[11px] font-cinzel font-bold tracking-widest uppercase">
                <Crown className="w-3.5 h-3.5 text-[#DFBA54]" />
                <span>Founder's Story & The Hamper Queen Mission</span>
              </div>

              <h3 className="font-seasons text-2xl sm:text-3xl font-extrabold text-[#141414] leading-tight">
                A Homegrown Boutique Founded by <br className="hidden sm:inline" />
                <span className="text-[#8C6821] italic font-normal">Ms. Supriya Khandekar</span>
              </h3>

              <div className="space-y-3 text-xs sm:text-sm text-[#524B40] leading-relaxed font-sans">
                <p>
                  <strong>Solving the Last-Moment Gifting Crisis:</strong> In a world running on frantic deadlines, finding a truly thoughtful gift at the eleventh hour used to mean settling for generic grocery sweets or uninspired plastic-wrapped baskets. Hamper Queen was founded by <strong>Ms. Supriya Khandekar</strong> to eradicate that panic forever. We handcraft and dispatch stunning, personalized gifts in record turnaround times—so you never show up empty-handed or apologetic.
                </p>
                <p>
                  <strong>No Cookie-Cutter Hampers:</strong> The gifting market splits into two extremes—generic low-cost hampers or overpriced boxes stuffed with filler. Ms. Supriya built Hamper Queen for the middle: velvet-lined rigid trunks, hand-stamped wax seals, custom photo prints, and premium chocolates that look 5x the price—from ₹799 to ₹2,500.
                </p>
                <p className="text-[#8C6821] font-semibold text-xs sm:text-xs">
                  🚚 <strong>Delivering to Every Corner:</strong> From the narrowest gullies of Mumbai to high-rise gated societies and nationwide pin codes across India, every parcel is dispatched with white-glove packaging.
                </p>
              </div>
            </div>

            {/* Right Highlights & Metrics Box */}
            <div className="lg:col-span-4 bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-[#E8DFC8] shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F0EBE0]">
                <Sparkles className="w-4 h-4 text-[#B8860B]" />
                <span className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#141414]">
                  The Hamper Queen Promise
                </span>
              </div>

              <ul className="space-y-2.5 text-xs text-[#524B40]">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-1.5 shrink-0" />
                  <span><strong>Zero Cookie-Cutter Gifts:</strong> Every hamper is customized to your recipient's taste and milestone.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-1.5 shrink-0" />
                  <span><strong>Rapid Same-Day / Next-Day Turnaround:</strong> Lightning dispatch for spontaneous celebrations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-1.5 shrink-0" />
                  <span><strong>Artisan Detail:</strong> Hand-tied French ribbons, warm fairy lights, and calligraphed cards.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-1.5 shrink-0" />
                  <span><strong>Direct Founder Assistance:</strong> Personal attention to every corporate and bespoke order.</span>
                </li>
              </ul>

              <div className="pt-2 border-t border-[#F0EBE0] flex items-center justify-between">
                <span className="text-[11px] text-[#7A7264] font-medium">Have a special request?</span>
                <a
                  href={`https://wa.me/91${phone}?text=${encodeURIComponent(
                    'Hi Ms. Supriya, I would like to discuss a custom hamper order.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#8C6821] hover:underline cursor-pointer"
                >
                  Chat with Supriya →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#EAE5D9]">
          
          {/* Brand & Crest Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <HamperQueenLogo size="lg" theme="light" showSubtitle={true} bilingualSubtitle={false} />

            <p className="font-seasons text-sm text-[#524B40] leading-relaxed max-w-sm">
              Hamper Queen — custom gift hampers, chocolate bouquets, and velvet trunks, hand-packed in Mumbai and delivered across India.
            </p>

            <div className="flex items-center gap-2 pt-2 text-xs text-[#8C6821]">
              <Sparkles className="w-4 h-4 text-[#B8860B]" />
              <span className="font-semibold tracking-wide font-seasons">
                Birthday Hampers, Chocolate Bouquets & Custom Gifting
              </span>
            </div>
          </div>

          {/* Quick Navigation Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-seasons text-xs font-bold uppercase tracking-widest text-[#141414]">
              The Atelier
            </h4>
            <ul className="space-y-2 text-xs text-[#6B6559]">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#B8860B] transition-colors cursor-pointer"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('inspirations')}
                  className="hover:text-[#B8860B] transition-colors cursor-pointer"
                >
                  {t.nav.inspirations}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('customised')}
                  className="hover:text-[#B8860B] transition-colors cursor-pointer font-bold text-[#8C6821]"
                >
                  {t.nav.customised}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-[#B8860B] transition-colors cursor-pointer"
                >
                  {t.nav.collections}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('atelier')}
                  className="hover:text-[#B8860B] transition-colors cursor-pointer"
                >
                  {t.nav.atelier}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('scribe')}
                  className="hover:text-[#B8860B] transition-colors cursor-pointer"
                >
                  {t.nav.calligraphy}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-[#B8860B] transition-colors cursor-pointer"
                >
                  {t.nav.pricing}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('brochures')}
                  className="hover:text-[#B8860B] transition-colors cursor-pointer"
                >
                  {t.nav.lookbooks}
                </button>
              </li>
            </ul>
          </div>

          {/* Private Concierge & Delivery (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-widest text-[#141414]">
              {t.footer.conciergeTitle}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#524B40]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
                <span>Hamper Queen Atelier & Studio • Handcrafted Packaging & Dispatch</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#B8860B] shrink-0" />
                <a
                  href={`tel:+91${phone}`}
                  className="font-semibold text-[#141414] hover:text-[#B8860B] transition-colors cursor-pointer underline-offset-2 hover:underline"
                >
                  Call / WhatsApp: {phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#B8860B] shrink-0" />
                <a
                  href={`mailto:${email}?subject=${encodeURIComponent('Hamper Queen Order Enquiry')}`}
                  className="text-[#141414] hover:text-[#B8860B] transition-colors cursor-pointer underline-offset-2 hover:underline break-all"
                >
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#B8860B] shrink-0" />
                <a
                  href="https://www.instagram.com/hamper_queen/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#141414] hover:text-[#B8860B] transition-colors cursor-pointer underline-offset-2 hover:underline"
                >
                  Instagram: @hamper_queen
                </a>
              </li>
            </ul>

            <div className="pt-3 border-t border-[#EAE5D9]">
              <span className="text-[11px] text-[#8C6821] font-cinzel uppercase tracking-wider block font-semibold">
                {t.footer.hours}
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Sovereignty */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B6559]">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-[#B8860B]" />
            <span>© {new Date().getFullYear()} {t.footer.copyright}</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="hover:text-[#B8860B] cursor-pointer">White-Glove Protocol</span>
            <span>•</span>
            <span className="hover:text-[#B8860B] cursor-pointer">Custom Hamper Policy</span>
            <span>•</span>
            <span className="hover:text-[#B8860B] cursor-pointer">Handmade With Love</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
