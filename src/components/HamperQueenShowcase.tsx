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
  ShoppingBag,
} from 'lucide-react';
import { 
  HAMPER_QUEEN_PRODUCTS, 
  HamperQueenProduct, 
  HAMPER_QUEEN_OFFICIAL_CONTACT,
  getHamperQueenItemCode,
  getHamperQueenSubstitutions,
} from '../data/hamperQueenCatalog';
import { HamperQueenGraphic } from './HamperQueenGraphic';
import { resolveRateLines } from '../utils/retailPricing';
import { RETAIL_RATES_CAPTURED_AT, RETAIL_RATES_LOCATION } from '../data/retailRates';
import { LanguageMode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { royaleLogger } from '../utils/logger';
import { triggerGoldConfetti } from '../utils/confetti';

interface HamperQueenShowcaseProps {
  language: LanguageMode;
  onCustomizeProduct: (product: HamperQueenProduct) => void;
  onOpenScribe: () => void;
  onOpenBooking?: (product?: HamperQueenProduct, isBulk?: boolean) => void;
  /** When set, shows an "Add to Cart" action on every product card. */
  onAddToCart?: (product: HamperQueenProduct) => void;
  /** When true (homepage), only the spotlight trio is rendered until "Show More". */
  spotlightOnly?: boolean;
}

/**
 * The three hand-picked spotlight products shown first on the homepage.
 * Order matters: Pocket Delight (from INR 280), KitKat Bouquet (Customer Favorite),
 * Elegant Pink (Top Birthday Pick).
 */
export const FEATURED_HOME_IDS = [
  'starter-pocket-delight',
  'bouquet-chocolate-kitkat',
  'hamper-1-elegant-pink',
];

/** Data-driven category tab labels (counts computed from the live catalog). */
const CATEGORY_TAB_LABELS: { id: string; label: string }[] = [
  { id: 'bouquets', label: 'Bouquets' },
  { id: 'birthday_hampers', label: 'Birthday Hampers' },
  { id: 'customised_hampers', label: 'Custom Made' },
  { id: 'specialty_boxes', label: 'Gift Boxes' },
  { id: 'gourmet_trays', label: 'Celebration Trays' },
  { id: 'addons_retail', label: 'Snack & Choco Add-ons' },
  { id: 'mugs_cups', label: 'Mugs & Cups' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'clothing', label: 'Clothing & Apparel' },
];

function categoryTabs(): { id: string; label: string }[] {
  const count = (id: string) => HAMPER_QUEEN_PRODUCTS.filter((p) => p.category === id).length;
  return [
    { id: 'all', label: 'All Offerings' },
    ...CATEGORY_TAB_LABELS
      .filter((tab) => count(tab.id) > 0)
      .map((tab) => ({ id: tab.id, label: `${tab.label} (${count(tab.id)})` })),
  ];
}

export const HamperQueenShowcase: React.FC<HamperQueenShowcaseProps> = ({
  language,
  onCustomizeProduct,
  onOpenScribe,
  onOpenBooking,
  onAddToCart,
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
    <section id="hamper-queen-catalog-section" className="section bg-cream-100">
      <div className="container-page">
        
        {/* Section Header */}
        <div className="section-head">
          <span className="eyebrow">
            <Sparkles className="w-3.5 h-3.5 text-gold-700" aria-hidden="true" />
            Lookbook &amp; offerings
          </span>
          <h2 className="section-title">
            Gift ideas &amp; <span className="accent-script">chocolate bouquets</span>
          </h2>
          <p className="section-lede">
            Thoughtful gifts beautifully packed with love and care. Browse customizable birthday hampers, chocolate &amp; snack bouquets, mugs, accessories and gift boxes, with direct maps-based booking.
          </p>
          <p className="text-xs sm:text-sm text-gold-700 bg-gold-50 rounded-full px-4 py-2 shadow-[inset_0_0_0_1px_var(--color-gold-200)]">
            {HAMPER_QUEEN_OFFICIAL_CONTACT.pricingPolicy}
          </p>
        </div>

        {/* BULK ORDERS & PARTY GIFTS NOTIFICATION BANNER */}
        {showCatalogControls && (
          <div className="mb-10 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-gold-50 to-blush-50 ring-1 ring-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="w-11 h-11 rounded-2xl bg-white text-gold-700 shadow-soft flex items-center justify-center shrink-0">
                <Package className="w-5 h-5" aria-hidden="true" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-ink">Bulk orders &amp; party gifts</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">Up to 20% off</span>
                </div>
                <p className="text-sm text-stone mt-1 max-w-2xl">
                  Weddings, baby showers, bachelorette favors and corporate hampers with custom branding.
                </p>
              </div>
            </div>
            <button onClick={() => onOpenBooking?.(undefined, true)} className="btn btn-primary btn-sm w-full sm:w-auto shrink-0">
              <span>Inquire bulk gifting</span>
              <ArrowRight className="w-4 h-4 text-gold-300" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Filter Controls & Search Bar */}
        {showCatalogControls && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categoryTabs().map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`chip ${selectedCategory === tab.id ? 'chip-active' : ''}`}
                aria-pressed={selectedCategory === tab.id}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-700" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hampers, codes, items..."
              className="field pl-10 !rounded-full"
            />
          </div>

        </div>
        )}

        {/* Product Cards Grid */}
        <div className="grid-cards">
          {visibleProducts.map((prod) => {
            const itemCode = getHamperQueenItemCode(prod);
            const substitutions = getHamperQueenSubstitutions(prod);
            const rateLines = prod.rateCard ? resolveRateLines(prod.rateCard) : [];

            return (
              <div
                key={prod.id}
                className="group card card-hover flex flex-col overflow-hidden h-full"
              >
                {/* Card Top: Graphic & Badges */}
                <div className="p-6 bg-gradient-to-b from-cream-50 to-white border-b border-line flex flex-col items-center relative">
                  
                  {/* Category & Item Code Badge */}
                  <div className="w-full flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1 text-xs font-sans font-semibold px-3 py-1 rounded-full bg-cream-100 border border-line text-ink">
                      <Tag className="w-2.5 h-2.5 text-gold-700" />
                      <span>{itemCode}</span>
                    </span>

                    {prod.badge && (
                      <span 
                        className="text-xs font-bold px-3 py-1 rounded-full shadow-soft"
                        style={{ backgroundColor: prod.themeColor.pillBg, color: prod.themeColor.pillText }}
                      >
                        {prod.badge}
                      </span>
                    )}
                  </div>

                  {/* Clean Background-Removed Graphic Artwork */}
                  <div className="card-art w-full min-h-[300px] lg:h-[320px] flex items-center">
                    <HamperQueenGraphic graphicId={prod.graphicId} product={prod} size="md" />
                  </div>

                  {/* Pricing Tag */}
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-50 border border-gold-400/50 text-xs font-bold text-gold-700 shadow-soft">
                    <span>{prod.approxPrice}</span>
                    <span className="text-xs font-normal text-stone">• Approx</span>
                  </div>
                </div>

                {/* Card Body: Details & Checklist */}
                <div className="p-6 flex-1 flex flex-col gap-5">
                  
                  <div className="space-y-1.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-cinzel text-lg sm:text-xl font-bold text-ink group-hover:text-gold-700 transition-colors">
                        {language === 'hinglish' ? prod.nameHinglish : prod.name}
                      </h3>
                    </div>
                    <p className="font-cormorant text-sm text-stone leading-snug">
                      {language === 'hinglish' ? prod.subtitleHinglish : prod.subtitle}
                    </p>
                  </div>

                  {/* WHAT IS PRESENT (AT-A-GLANCE PILLS) */}
                  <div className="pt-2 border-t border-line space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans font-semibold text-ink">
                        What's Inside
                      </span>
                      <span className="text-xs text-emerald-700 font-semibold">
                        {prod.itemsIncluded.length} items included
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {prod.itemsIncluded.slice(0, 3).map((item, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full bg-cream-100 border border-line-strong text-xs text-cocoa font-medium leading-none">
                          {item}
                        </span>
                      ))}
                      {prod.itemsIncluded.length > 3 && (
                        <span className="px-3 py-1 rounded-full bg-[#FEF3E2] border border-[#F5D9A9] text-xs text-gold-700 font-semibold leading-none">
                          +{prod.itemsIncluded.length - 3} more fillers
                        </span>
                      )}
                    </div>
                  </div>

                  {/* REAL RETAIL RATES (image + live rate per item) */}
                  {rateLines.length > 0 && (
                    <div className="pt-2 border-t border-line space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-sans font-semibold text-ink">
                          Real Retail Rates
                        </span>
                        <span className="text-xs text-gold-700 font-semibold">
                          {RETAIL_RATES_LOCATION} · {RETAIL_RATES_CAPTURED_AT}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {rateLines.map((line) => (
                          <div key={line.key} className="flex items-center gap-3 rounded-xl border border-line bg-white px-3 py-1.5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={line.image}
                              alt={line.name}
                              className="w-9 h-9 rounded-lg object-cover bg-[#F7F5F0] border border-line shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-ink truncate">{line.label}</p>
                              <p className="text-xs text-stone">
                                {line.qty} × ₹{line.price}/{line.unit.replace(/[0-9. ]/g, '') || 'pc'}
                              </p>
                            </div>
                            <span className="text-xs font-bold text-gold-700 shrink-0">₹{line.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ABSTRACTED CUSTOMIZATION HINT */}
                  <div className="pt-2 border-t border-line">
                    <span className="text-xs font-sans font-semibold text-gold-700">
                      ✦ Fully Customizable
                    </span>
                    <p className="text-xs text-stone leading-snug mt-1 font-cormorant italic">
                      {substitutions[0]}
                    </p>
                  </div>

                  {/* Card Bottom Actions: 3 Actions */}
                  <div className="mt-auto pt-5 border-t border-line flex flex-col gap-2">
                    
                    {/* Primary Action: Book with Geolocation Form */}
                    <button
                      onClick={() => {
                        if (onOpenBooking) onOpenBooking(prod, false);
                      }}
                      className="btn btn-primary w-full"
                    >
                      <CalendarCheck className="w-4 h-4 text-gold-300" />
                      <span>Book & Pinpoint Delivery</span>
                    </button>

                    <div className={`grid gap-2 ${onAddToCart ? 'grid-cols-3' : 'grid-cols-2'} [&>.btn]:px-2`}>
                      {/* Add to Cart (unified checkout) */}
                      {onAddToCart && (
                        <button
                          onClick={() => onAddToCart(prod)}
                          className="btn btn-ghost btn-sm"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-gold-700" />
                          <span>Add</span>
                        </button>
                      )}

                      {/* WhatsApp Inquiry Button */}
                      <button
                        onClick={() => handleWhatsAppOrder(prod)}
                        className="btn btn-whatsapp btn-sm"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        <span>on WA</span>
                      </button>

                      {/* Customize in Studio */}
                      <button
                        onClick={() => onCustomizeProduct(prod)}
                        className="btn btn-ghost btn-sm"
                      >
                        <Wand2 className="w-3.5 h-3.5 text-gold-700" />
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
              className="group btn btn-primary"
            >
              <span>Show More Hampers &amp; Bouquets</span>
              <ArrowRight className="w-4 h-4 text-gold-300 transition-transform group-hover:translate-x-1" />
            </button>
            <p className="text-xs text-stone font-sans">
              {HAMPER_QUEEN_PRODUCTS.length - featuredList.length} more options • from INR {HAMPER_QUEEN_PRODUCTS.reduce((min, p) => {
                const match = p.approxPrice.match(/INR ([0-9,]+)/);
                const val = match ? Number(match[1].replace(/,/g, '')) : Infinity;
                return val < min ? val : min;
              }, Infinity)} onward
            </p>
          </div>
        )}

        {/* Custom Order Callout Footer */}
        <div className="mt-16 p-8 sm:p-12 rounded-[2rem] surface-warm ring-1 ring-line text-center flex flex-col items-center gap-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#FFF0F3] text-[#9D174D] text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 fill-[#E11D48] text-[#E11D48]" />
            <span>Have a Unique Theme or Budget in Mind?</span>
          </span>

          <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-ink">
            "Rate as Per Customization" Promise
          </h3>

          <p className="font-cormorant text-sm sm:text-base text-stone max-w-2xl mx-auto leading-relaxed">
            Every celebration is distinct. We craft custom hampers ranging from INR 140 to INR 899+ with your preferred chocolates, cosmetics, colors, and personalized photos.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                if (onOpenBooking) onOpenBooking(undefined, false);
              }}
              className="btn btn-primary"
            >
              <span>Open Custom Booking Form</span>
              <ArrowRight className="w-4 h-4 text-gold-300" />
            </button>

            <button
              onClick={() => {
                if (onOpenBooking) onOpenBooking(undefined, true);
              }}
              className="btn btn-ghost"
            >
              <Package className="w-4 h-4 text-gold-700" />
              <span>Bulk & Party Gifting Inquiries</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
