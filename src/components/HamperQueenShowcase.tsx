/**
 * HamperQueenShowcase.tsx
 * -----------------------------------------------------------------------------
 * Product grid with category tabs, search, expandable item checklists, and
 * booking/WhatsApp/customise actions.
 *
 * With `spotlightOnly` (homepage), only the FEATURED_HOME_IDS trio is shown
 * until "Show More Hampers & Bouquets" expands the grid in place; the full
 * catalog tab keeps the complete filter/search UI.
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  MessageCircle, 
  Search, 
  Heart, 
  ArrowRight, 
  Package,
  CalendarCheck,
  Tag,
  Wand2,
} from 'lucide-react';
import { 
  HAMPER_QUEEN_PRODUCTS, 
  HamperQueenProduct, 
  HAMPER_QUEEN_OFFICIAL_CONTACT,
  getHamperQueenItemCode,
  getHamperQueenSubstitutions,
} from '../data/hamperQueenCatalog';
import { HamperQueenGraphic } from './HamperQueenGraphic';
import { LanguageMode, CustomHamper } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { royaleLogger } from '../utils/logger';
import { triggerGoldConfetti } from '../utils/confetti';

interface HamperQueenShowcaseProps {
  language: LanguageMode;
  onCustomizeProduct: (product: HamperQueenProduct) => void;
  onOpenScribe: () => void;
  onOpenBooking?: (product?: HamperQueenProduct, isBulk?: boolean) => void;
  /** When true (homepage), only the spotlight trio is rendered until "Show More". */
  spotlightOnly?: boolean;
}

/**
 * The three hand-picked spotlight products shown first on the homepage.
 * Order matters: Pocket Delight (from INR 149), KitKat Bouquet (Customer Favorite),
 * Elegant Pink (Top Birthday Pick).
 */
export const FEATURED_HOME_IDS = [
  'starter-pocket-delight',
  'bouquet-chocolate-kitkat',
  'hamper-1-elegant-pink',
];

export const HamperQueenShowcase: React.FC<HamperQueenShowcaseProps> = ({
  language,
  onCustomizeProduct,
  onOpenScribe,
  onOpenBooking,
  spotlightOnly = false,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFeaturedMore, setShowFeaturedMore] = useState<boolean>(false);

  // Filter products (only used once the full catalog is revealed)
  const filteredProducts = HAMPER_QUEEN_PRODUCTS.filter((prod) => {
    const itemCode = getHamperQueenItemCode(prod);
    const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
    const matchesSearch = 
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.nameHinglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.itemsIncluded.some((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Homepage spotlight: the featured trio first, expanding in place to the full menu.
  const featuredList = FEATURED_HOME_IDS
    .map((id) => HAMPER_QUEEN_PRODUCTS.find((p) => p.id === id))
    .filter((p): p is HamperQueenProduct => Boolean(p));

  const visibleProducts = spotlightOnly
    ? (showFeaturedMore ? featuredList.concat(HAMPER_QUEEN_PRODUCTS.filter((p) => !FEATURED_HOME_IDS.includes(p.id))) : featuredList)
    : filteredProducts;

  const showCatalogControls = !spotlightOnly || showFeaturedMore;

  const handleWhatsAppOrder = (product: HamperQueenProduct) => {
    triggerGoldConfetti(0.5, 0.5);
    const itemCode = getHamperQueenItemCode(product);
    const itemsList = product.itemsIncluded.slice(0, 4).map((i) => `• ${i}`).join('\n');
    const text = encodeURIComponent(
      `👑 *HAMPER QUEEN INQUIRY*\n` +
      `🔖 *Item Code:* ${itemCode}\n` +
      `🎁 *Product:* ${product.name}\n` +
      `💰 *Approx Price:* ${product.approxPrice}\n` +
      `📋 *What is Present:*\n${itemsList}\n\n` +
      `Hi Hamper Queen! I would like to order this item. Please share custom packaging options, delivery time, and payment details.`
    );
    window.open(`https://wa.me/91${HAMPER_QUEEN_OFFICIAL_CONTACT.phone}?text=${text}`, '_blank');
    royaleLogger.action('Showcase', `WhatsApp inquiry for: ${product.name} (${itemCode})`);
  };

  return (
    <section id="hamper-queen-catalog-section" className="py-16 sm:py-20 bg-white text-[#141414] border-b border-[#EAE5D9] content-visibility-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Pure White & Gold Elegance */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF5E8] border border-[#EAE0C8] text-[#8C6821] text-xs font-cinzel font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Hamper Queen Lookbook & Offerings</span>
          </div>

          <h2 className="font-seasons text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#141414]">
            Gift Ideas & <span className="text-[#B8860B] italic">Chocolate Bouquets</span>
          </h2>

          <p className="font-seasons text-lg sm:text-xl text-[#524B40] leading-relaxed">
            Thoughtful gifts beautifully packed with love and care. Browse our complete menu of 12 customizable birthday hampers, chocolate bouquets, and royal gift boxes with direct maps-based booking.
          </p>

          {/* Pricing Guarantee Banner */}
          <div className="inline-block px-4 py-2 rounded-xl bg-[#FFFDF9] border border-[#D4AF37]/50 shadow-2xs text-xs font-semibold text-[#8C6821]">
            <span>✨ {HAMPER_QUEEN_OFFICIAL_CONTACT.pricingPolicy}</span>
          </div>
        </div>

        {/* BULK ORDERS & PARTY GIFTS NOTIFICATION BANNER */}
        {showCatalogControls && (
          <div className="mb-12 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#141414] via-[#241E16] to-[#141414] text-white border border-[#D4AF37]/60 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#DFBA54] shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-sm font-bold text-[#F3E5AB]">
                  Available for Bulk Orders & Party Gifts
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#16A34A] text-white text-[9px] font-bold">
                  Up to 20% Off
                </span>
              </div>
              <p className="text-xs text-white/75 mt-0.5">
                Weddings, baby shower return gifts, bachelorette favors, and corporate hampers with customized family/company branding.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              triggerGoldConfetti(0.5, 0.5);
              if (onOpenBooking) onOpenBooking(undefined, true);
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-full bg-[#DFBA54] hover:bg-[#C5A059] text-[#141414] font-cinzel font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Inquire Bulk Gifting</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        )}

        {/* Filter Controls & Search Bar */}
        {showCatalogControls && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[#EAE5D9]">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Offerings' },
              { id: 'bouquets', label: 'Bouquets (6)' },
              { id: 'birthday_hampers', label: '12 Birthday Hampers' },
              { id: 'customised_hampers', label: 'Custom Made (4)' },
              { id: 'specialty_boxes', label: 'Gift Boxes (4)' },
              { id: 'gourmet_trays', label: 'Celebration Trays' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-cinzel font-semibold transition-all cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-[#141414] text-[#F3E5AB] shadow-sm border border-[#D4AF37]'
                    : 'bg-white text-[#524B40] border border-[#E5E0D6] hover:bg-[#FAF9F5]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6821]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hampers, codes, items..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-[#E5E0D6] text-xs focus:outline-hidden focus:border-[#B8860B] shadow-2xs"
            />
          </div>

        </div>
        )}

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleProducts.map((prod) => {
            const itemCode = getHamperQueenItemCode(prod);
            const substitutions = getHamperQueenSubstitutions(prod);

            return (
              <div
                key={prod.id}
                className="group flex flex-col justify-between rounded-3xl bg-white border-2 border-[#EAE5D9] hover:border-[#D4AF37] transition-all duration-300 shadow-sm hover:shadow-lg overflow-hidden"
              >
                {/* Card Top: Graphic & Badges */}
                <div className="p-6 bg-gradient-to-b from-[#FFFDF9] to-white border-b border-[#F0ECE1] flex flex-col items-center relative">
                  
                  {/* Category & Item Code Badge */}
                  <div className="w-full flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-cinzel font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FAF9F5] border border-[#EAE5D9] text-[#141414]">
                      <Tag className="w-2.5 h-2.5 text-[#B8860B]" />
                      <span>{itemCode}</span>
                    </span>

                    {prod.badge && (
                      <span 
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full shadow-2xs"
                        style={{ backgroundColor: prod.themeColor.pillBg, color: prod.themeColor.pillText }}
                      >
                        {prod.badge}
                      </span>
                    )}
                  </div>

                  {/* Clean Background-Removed Graphic Artwork */}
                  <div className="py-2 transform group-hover:scale-105 transition-transform duration-300 w-full">
                    <HamperQueenGraphic graphicId={prod.graphicId} product={prod} size="md" />
                  </div>

                  {/* Pricing Tag */}
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDF9] border border-[#D4AF37]/50 text-xs font-bold text-[#8C6821] shadow-2xs">
                    <span>{prod.approxPrice}</span>
                    <span className="text-[10px] font-normal text-[#6B6559]">• Approx</span>
                  </div>
                </div>

                {/* Card Body: Details & Checklist */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  
                  <div className="space-y-1.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#141414] group-hover:text-[#8C6821] transition-colors">
                        {language === 'hinglish' ? prod.nameHinglish : prod.name}
                      </h3>
                    </div>
                    <p className="font-cormorant text-sm text-[#6B6559] leading-snug">
                      {language === 'hinglish' ? prod.subtitleHinglish : prod.subtitle}
                    </p>
                  </div>

                  {/* WHAT IS PRESENT (AT-A-GLANCE PILLS) */}
                  <div className="pt-2 border-t border-[#F0ECE1] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-cinzel font-bold text-[#141414] uppercase tracking-wider">
                        What's Inside
                      </span>
                      <span className="text-[10px] text-[#16A34A] font-semibold">
                        {prod.itemsIncluded.length} items included
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {prod.itemsIncluded.slice(0, 3).map((item, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-full bg-[#FAF7F0] border border-[#E8DFC9] text-[10px] text-[#524B40] font-medium leading-none">
                          {item}
                        </span>
                      ))}
                      {prod.itemsIncluded.length > 3 && (
                        <span className="px-2.5 py-1 rounded-full bg-[#FEF3E2] border border-[#F5D9A9] text-[10px] text-[#8C6821] font-semibold leading-none">
                          +{prod.itemsIncluded.length - 3} more fillers
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ABSTRACTED CUSTOMIZATION HINT */}
                  <div className="pt-2 border-t border-[#F0ECE1]">
                    <span className="text-[10px] font-cinzel font-bold text-[#8C6821] uppercase tracking-wider">
                      ✦ Fully Customizable
                    </span>
                    <p className="text-[11px] text-[#6B6559] leading-snug mt-1 font-cormorant italic">
                      {substitutions[0]}
                    </p>
                  </div>

                  {/* Card Bottom Actions: 3 Actions */}
                  <div className="pt-4 border-t border-[#F0ECE1] space-y-2">
                    
                    {/* Primary Action: Book with Geolocation Form */}
                    <button
                      onClick={() => {
                        triggerGoldConfetti(0.5, 0.5);
                        if (onOpenBooking) onOpenBooking(prod, false);
                      }}
                      className="w-full py-3 px-4 rounded-xl bg-[#141414] hover:bg-[#2A2A2A] text-[#DFBA54] border border-[#D4AF37] font-cinzel text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CalendarCheck className="w-4 h-4 text-[#DFBA54]" />
                      <span>Book & Pinpoint Delivery</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      {/* WhatsApp Inquiry Button */}
                      <button
                        onClick={() => handleWhatsAppOrder(prod)}
                        className="py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-sans text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        <span>Order on WA</span>
                      </button>

                      {/* Customize in Studio */}
                      <button
                        onClick={() => onCustomizeProduct(prod)}
                        className="py-2 px-3 rounded-xl bg-white hover:bg-[#FAF9F5] text-[#141414] border border-[#E5DAC2] font-cinzel text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Wand2 className="w-3.5 h-3.5 text-[#8C6821]" />
                        <span>Customize</span>
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Homepage Spotlight: "Show More" expands in place to the full menu */}
        {spotlightOnly && !showFeaturedMore && (
          <div className="mt-10 flex flex-col items-center gap-3">
            <button
              onClick={() => {
                setShowFeaturedMore(true);
                royaleLogger.action('Showcase', 'Expanded homepage spotlight to full catalog');
              }}
              className="group px-7 py-3.5 rounded-full bg-[#141414] hover:bg-[#2A2018] text-[#F3E5AB] border border-[#D4AF37] font-cinzel text-sm font-bold tracking-wider uppercase shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Show More Hampers &amp; Bouquets</span>
              <ArrowRight className="w-4 h-4 text-[#DFBA54] transition-transform group-hover:translate-x-1" />
            </button>
            <p className="text-[11px] text-[#6B6559] font-sans">
              {HAMPER_QUEEN_PRODUCTS.length - featuredList.length} more options • from INR {HAMPER_QUEEN_PRODUCTS.reduce((min, p) => {
                const match = p.approxPrice.match(/INR ([0-9,]+)/);
                const val = match ? Number(match[1].replace(/,/g, '')) : Infinity;
                return val < min ? val : min;
              }, Infinity)} onward
            </p>
          </div>
        )}

        {/* Custom Order Callout Footer */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-[#FFFDF9] via-white to-[#FAF8F5] border-2 border-[#D4AF37]/40 shadow-md text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF0F3] text-[#9D174D] text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 fill-[#E11D48] text-[#E11D48]" />
            <span>Have a Unique Theme or Budget in Mind?</span>
          </span>

          <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#141414]">
            "Rate as Per Customization" Promise
          </h3>

          <p className="font-cormorant text-sm sm:text-base text-[#6B6559] max-w-2xl mx-auto leading-relaxed">
            Every celebration is distinct. We craft custom hampers ranging from INR 149 to INR 899+ with your preferred chocolates, cosmetics, colors, and personalized photos.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                triggerGoldConfetti(0.5, 0.5);
                if (onOpenBooking) onOpenBooking(undefined, false);
              }}
              className="px-6 py-3 rounded-full bg-[#141414] text-[#DFBA54] border border-[#D4AF37] font-cinzel text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#242424] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Open Custom Booking Form</span>
              <ArrowRight className="w-4 h-4 text-[#DFBA54]" />
            </button>

            <button
              onClick={() => {
                triggerGoldConfetti(0.5, 0.5);
                if (onOpenBooking) onOpenBooking(undefined, true);
              }}
              className="px-6 py-3 rounded-full bg-[#FAF5E8] text-[#8C6821] border border-[#D4AF37] font-cinzel text-xs font-bold uppercase tracking-wider shadow-xs hover:bg-[#F3E5AB] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Package className="w-4 h-4 text-[#8C6821]" />
              <span>Bulk & Party Gifting Inquiries</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
