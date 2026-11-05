import React from 'react';
import {
  Package,
  Building2,
  Users,
  Heart,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  BadgePercent,
} from 'lucide-react';
import { HAMPER_QUEEN_OFFICIAL_CONTACT } from '../data/hamperQueenCatalog';
import { triggerGoldConfetti } from '../utils/confetti';

interface BulkOrdersSectionProps {
  onOpenBulkBooking: () => void;
}

export const BulkOrdersSection: React.FC<BulkOrdersSectionProps> = ({ onOpenBulkBooking }) => {
  const bulkTiers = [
    {
      qty: '5 - 10 Hampers',
      discount: '5% Off',
      tag: 'Tier 1',
      perk: 'Custom Event Tag with Name/Logo',
    },
    {
      qty: '11 - 24 Hampers',
      discount: '10% Off',
      tag: 'Tier 2',
      perk: 'Complimentary Wax Seal & Theme Ribbons',
    },
    {
      qty: '25 - 49 Hampers',
      discount: '15% Off',
      tag: 'Tier 3 (Popular)',
      perk: 'Custom Packaging Box Colors Matched to Your Theme',
    },
    {
      qty: '50 - 99 Hampers',
      discount: '20% Off',
      tag: 'Tier 4',
      perk: 'Free Delivery in Mumbai & Priority Batch Dispatch',
    },
    {
      qty: '100+ Hampers',
      discount: '30% Off',
      tag: 'Royal Enterprise Tier',
      perk: 'Custom Design, Dedicated Studio Support & Priority Dispatch',
    },
  ];

  const bulkCategories = [
    {
      title: 'Wedding & Trousseau Return Favors',
      icon: Heart,
      desc: 'Opulent return gifts for baraatis, mehendi favors, dry fruit trays, and bridal trousseau trunks tailored to wedding color palettes.',
      tag: 'Weddings',
      image: '/hero/bulk-podium.jpg',
    },
    {
      title: 'Party Gifts & Baby Showers',
      icon: Users,
      desc: 'Theme-coordinated favors for first birthdays, sweet-sixteen celebrations, baby welcoming, and bachelorette party boxes with custom names.',
      tag: 'Celebrations',
      image: '/hero/bulk-celebration.jpg',
    },
    {
      title: 'Corporate & Festive Gifting',
      icon: Building2,
      desc: 'Diwali, Eid, Christmas, and New Year employee appreciation and VIP client luxury gift boxes with company monogram engraving.',
      tag: 'Corporate',
      image: '/packaging/packaging-small-box.jpg',
    },
  ];

  const pastBulkOrders = [
    {
      tag: 'Party Favorites',
      title: 'Birthday Gift Bags',
      detail: '16 hand-packed gift bags with chocolates, candles & photo tags — our go-to small-party size.',
      qty: '16 bags',
      approx: '≈ INR 18,000 order',
    },
    {
      tag: 'Corporate • New Joiner',
      title: 'Employee Welcome Kits',
      detail: '36 onboarding crates with snacks, stationery & a handwritten founder note.',
      qty: '36 crates',
      approx: '≈ INR 40,000 order',
    },
    {
      tag: 'Baby Shower',
      title: 'First Birthday Party Boxes',
      detail: '24 theme-coordinated kits with fairy lights, teddy, candles & photo prints.',
      qty: '24 kits',
      approx: '≈ INR 26,000 order',
    },
    {
      tag: 'Wedding Return Favors',
      title: 'Bridal Trousseau Trunks',
      detail: '50 rose-gold boxes personalised with the couple’s names & mehendi theme.',
      qty: '50 pieces',
      approx: '≈ INR 55,000 order',
    },
    {
      tag: 'Corporate • Diwali',
      title: 'Festive Client Gifting',
      detail: '120 monogrammed velvet trunks with dry fruits, candles & wax-seal keepsakes.',
      qty: '120 hampers',
      approx: '≈ INR 132,000 order',
    },
    {
      tag: 'Corporate • New Year',
      title: 'Employee Appreciation Crates',
      detail: '300 compact gift crates with chocolates, stationery & greeting cards.',
      qty: '300 crates',
      approx: '≈ INR 330,000 order',
    },
  ];

  return (
    <section id="bulk-orders-section" className="section surface-warm text-ink">
      <div className="container-page flex flex-col gap-12 sm:gap-16">
        
        {/* Header */}
        <div className="section-head !mb-0">
          <span className="eyebrow">
            <Package className="w-3.5 h-3.5 text-gold-700" aria-hidden="true" />
            Scale with grandeur
          </span>
          <h2 className="section-title">
            Bulk orders &amp; <span className="accent-script">party gifting</span>
          </h2>
          <p className="section-lede">
            Planning a grand wedding, gala event, or corporate festival? Hamper Queen designs, packs, and dispatches uniform luxury hampers in volume with your company or family branding.
          </p>
        </div>

        {/* 3 Bulk Use Cases */}
        <div className="grid-cards">
          {bulkCategories.map((cat, idx) => {
            const IconComp = cat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-line hover:border-gold-200 shadow-soft hover:shadow-lift transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div className="relative h-48 overflow-hidden bg-stone-100">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-gold-100 text-xs font-sans font-bold border border-gold-400/50">
                    {cat.tag}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-gold-50 border border-line-strong text-gold-700 flex items-center justify-center">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <h3 className="font-cinzel text-base font-bold text-ink">
                      {cat.title}
                    </h3>
                    <p className="font-cormorant text-xs text-stone leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-line">
                    <button
                      onClick={() => {
                        onOpenBulkBooking();
                      }}
                      className="w-full py-3 px-4 rounded-full bg-cream-100 hover:bg-ink text-gold-700 hover:text-gold-300 border border-line-strong hover:border-gold-200 text-xs font-sans font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Inquire for {cat.tag}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Volume Tier Table & Guarantee Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gold-400/40 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-sans font-semibold text-gold-700 block">
                Exclusive Wholesale Volume Matrix
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-ink mt-0.5">
                Bulk Discounts & Customization Perks
              </h3>
            </div>

            <button
              onClick={() => {
                triggerGoldConfetti(0.5, 0.5);
                onOpenBulkBooking();
              }}
              className="px-6 py-3 rounded-full bg-ink hover:bg-ink-soft text-gold-100 font-sans font-semibold text-xs shadow-lift transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Book Bulk Order (WhatsApp Verified)</span>
              <ArrowRight className="w-4 h-4 text-gold-300" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {bulkTiers.map((tier, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-cream-100 border border-line space-y-2 hover:border-gold-200 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white border border-line-strong text-stone">
                    {tier.tag}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-0.5">
                    <BadgePercent className="w-3.5 h-3.5" />
                    <span>{tier.discount}</span>
                  </span>
                </div>

                <h4 className="font-sans text-sm font-bold text-ink">
                  {tier.qty}
                </h4>

                <p className="text-xs text-cocoa leading-tight">
                  ✦ {tier.perk}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-line flex flex-col sm:flex-row items-center justify-between text-xs text-stone gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Timely batch fulfillment guarantee across Mumbai, Navi Mumbai, and Thane.</span>
            </div>
            <div className="font-semibold text-gold-700">
              <span>Direct Bulk Hotline: +91 {HAMPER_QUEEN_OFFICIAL_CONTACT.phone}</span>
            </div>
          </div>
        </div>

        {/* Recent Bulk Fulfillments — real order references from the atelier */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white ring-1 ring-line shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-1.5">
              <span className="text-xs font-sans font-semibold text-gold-700 block">
                Recent Bulk Fulfillments
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-ink">
                Past Orders We Have Packed &amp; Delivered
              </h3>
              <p className="text-xs text-stone font-sans leading-relaxed max-w-2xl">
                We are a small, homegrown Mumbai atelier — every bulk order is hand-assembled and
                personally overseen by Ms. Supriya from first sample to final dispatch.
              </p>
            </div>
            <div className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-cream-100 border border-gold-200 text-xs font-semibold text-gold-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-gold-700" />
              <span>Representative References</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastBulkOrders.map((order, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-cream-100 border border-line hover:border-gold-200 transition-all space-y-2 flex flex-col"
              >
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gold-50 text-gold-700 border border-gold-200 self-start">
                  {order.tag}
                </span>
                <h4 className="font-sans text-sm font-bold text-ink leading-snug">
                  {order.title}
                </h4>
                <p className="text-xs text-stone leading-relaxed flex-1">
                  {order.detail}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-line text-xs">
                  <span className="font-bold text-gold-700">{order.qty}</span>
                  <span className="text-stone">{order.approx}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-stone font-sans italic">
            Approximate order values shown for reference only. Every event is unique, so pricing for
            your quantity &amp; design is confirmed personally over WhatsApp.
          </p>
        </div>

      </div>
    </section>
  );
};
