import React from 'react';
import {
  Package,
  Gift,
  Building2,
  Users,
  Sparkles,
  Heart,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  BadgePercent,
  CalendarCheck,
} from 'lucide-react';
import { HAMPER_QUEEN_OFFICIAL_CONTACT } from '../data/hamperQueenCatalog';
import { triggerGoldConfetti } from '../utils/confetti';

interface BulkOrdersSectionProps {
  onOpenBulkBooking: () => void;
}

export const BulkOrdersSection: React.FC<BulkOrdersSectionProps> = ({ onOpenBulkBooking }) => {
  const bulkTiers = [
    {
      qty: '10 - 24 Hampers',
      discount: '5% Off',
      tag: 'Tier 1',
      perk: 'Custom Event Tag with Name/Logo',
    },
    {
      qty: '25 - 49 Hampers',
      discount: '10% Off',
      tag: 'Tier 2 (Popular)',
      perk: 'Complimentary Wax Seal & Theme Ribbons',
    },
    {
      qty: '50 - 99 Hampers',
      discount: '15% Off',
      tag: 'Tier 3',
      perk: 'Custom Packaging Box Colors & Free Delivery in Mumbai',
    },
    {
      qty: '100+ Hampers',
      discount: '20% Off',
      tag: 'Royal Enterprise Tier',
      perk: 'Custom Design, Dedicated Support & Priority Batch Dispatch',
    },
  ];

  const bulkCategories = [
    {
      title: 'Wedding & Trousseau Return Favors',
      icon: Heart,
      desc: 'Opulent return gifts for baraatis, mehendi favors, dry fruit trays, and bridal trousseau trunks tailored to wedding color palettes.',
      tag: 'Weddings',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=85&w=800&auto=format&fit=crop',
    },
    {
      title: 'Party Gifts & Baby Showers',
      icon: Users,
      desc: 'Theme-coordinated favors for first birthdays, sweet-sixteen celebrations, baby welcoming, and bachelorette party boxes with custom names.',
      tag: 'Celebrations',
      image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=85&w=800&auto=format&fit=crop',
    },
    {
      title: 'Corporate & Festive Gifting',
      icon: Building2,
      desc: 'Diwali, Eid, Christmas, and New Year employee appreciation and VIP client luxury gift boxes with company monogram engraving.',
      tag: 'Corporate',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=85&w=800&auto=format&fit=crop',
    },
  ];

  const pastBulkOrders = [
    {
      tag: 'Corporate • Diwali',
      title: 'Festive Client Gifting',
      detail: '120 monogrammed velvet trunks with dry fruits, candles & wax-seal keepsakes.',
      qty: '120 hampers',
      approx: '≈ ₹72,000 order',
    },
    {
      tag: 'Wedding Return Favors',
      title: 'Bridal Trousseau Trunks',
      detail: '50 rose-gold boxes personalised with the couple’s names & mehendi theme.',
      qty: '50 pieces',
      approx: '≈ ₹46,000 order',
    },
    {
      tag: 'Baby Shower',
      title: 'First Birthday Party Boxes',
      detail: '24 theme-coordinated kits with fairy lights, teddy, candles & photo prints.',
      qty: '24 kits',
      approx: '≈ ₹18,000 order',
    },
    {
      tag: 'Corporate • New Year',
      title: 'Employee Appreciation Crates',
      detail: '300 compact gift crates with chocolates, stationery & greeting cards.',
      qty: '300 crates',
      approx: '≈ ₹95,000 order',
    },
  ];

  return (
    <section id="bulk-orders-section" className="py-16 sm:py-20 bg-[#FAF9F5] text-[#141414] border-b border-[#EAE5D9] content-visibility-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#D4AF37]/60 text-[#8C6821] text-xs font-cinzel font-bold tracking-widest uppercase shadow-2xs">
            <Package className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Scale With Grandeur</span>
          </div>

          <h2 className="font-seasons text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#141414]">
            Bulk Orders & <span className="text-[#B8860B] italic">Party Gifting</span>
          </h2>

          <p className="font-seasons text-lg sm:text-xl text-[#524B40] leading-relaxed">
            Planning a grand wedding, gala event, or corporate festival? Hamper Queen designs, packs, and dispatches uniform luxury hampers in volume with your company or family branding.
          </p>
        </div>

        {/* 3 Bulk Use Cases */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bulkCategories.map((cat, idx) => {
            const IconComp = cat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-[#EAE5D9] hover:border-[#D4AF37] shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div className="relative h-48 overflow-hidden bg-stone-100">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#F3E5AB] text-[10px] font-cinzel font-bold border border-[#D4AF37]/50">
                    {cat.tag}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-[#FAF5E8] border border-[#EAE0C8] text-[#8C6821] flex items-center justify-center">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <h3 className="font-cinzel text-base font-bold text-[#141414]">
                      {cat.title}
                    </h3>
                    <p className="font-cormorant text-xs text-[#6B6559] leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F0ECE1]">
                    <button
                      onClick={() => {
                        triggerGoldConfetti(0.5, 0.5);
                        onOpenBulkBooking();
                      }}
                      className="w-full py-3 px-4 rounded-xl bg-[#FAF9F5] hover:bg-[#141414] text-[#8C6821] hover:text-[#DFBA54] border border-[#E5DAC2] hover:border-[#D4AF37] text-xs font-cinzel font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#D4AF37]/40 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#8C6821] block">
                Exclusive Wholesale Volume Matrix
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#141414] mt-0.5">
                Bulk Discounts & Customization Perks
              </h3>
            </div>

            <button
              onClick={() => {
                triggerGoldConfetti(0.5, 0.5);
                onOpenBulkBooking();
              }}
              className="px-6 py-3 rounded-full bg-[#141414] hover:bg-[#252525] text-[#DFBA54] font-cinzel font-bold text-xs uppercase tracking-wider border border-[#D4AF37] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Book Bulk Order (WhatsApp Verified)</span>
              <ArrowRight className="w-4 h-4 text-[#DFBA54]" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bulkTiers.map((tier, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#EAE5D9] space-y-2 hover:border-[#D4AF37] transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-[#E5DAC2] text-[#6B6559]">
                    {tier.tag}
                  </span>
                  <span className="text-xs font-bold text-[#16A34A] flex items-center gap-0.5">
                    <BadgePercent className="w-3.5 h-3.5" />
                    <span>{tier.discount}</span>
                  </span>
                </div>

                <h4 className="font-cinzel text-sm font-bold text-[#141414]">
                  {tier.qty}
                </h4>

                <p className="text-[11px] text-[#524B40] leading-tight">
                  ✦ {tier.perk}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#F0ECE1] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B6559] gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              <span>Timely batch fulfillment guarantee across Mumbai, Navi Mumbai, and Thane.</span>
            </div>
            <div className="font-semibold text-[#8C6821]">
              <span>Direct Bulk Hotline: +91 {HAMPER_QUEEN_OFFICIAL_CONTACT.phone}</span>
            </div>
          </div>
        </div>

        {/* Recent Bulk Fulfillments — real order references from the atelier */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#141414] text-white shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-1.5">
              <span className="text-[10px] font-cinzel font-bold uppercase tracking-widest text-[#DFBA54] block">
                Recent Bulk Fulfillments
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                Past Orders We Have Packed &amp; Delivered
              </h3>
              <p className="text-[11px] text-white/60 font-sans leading-relaxed max-w-2xl">
                We are a small, homegrown Mumbai atelier — every bulk order is hand-assembled and
                personally overseen by Ms. Supriya from first sample to final dispatch.
              </p>
            </div>
            <div className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/10 border border-[#D4AF37]/50 text-[10px] font-bold uppercase tracking-wider text-[#F3E5AB]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#DFBA54]" />
              <span>Representative References</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pastBulkOrders.map((order, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/60 transition-all space-y-2 flex flex-col"
              >
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#DFBA54]/15 text-[#F3E5AB] border border-[#DFBA54]/30 self-start">
                  {order.tag}
                </span>
                <h4 className="font-cinzel text-sm font-bold text-white leading-snug">
                  {order.title}
                </h4>
                <p className="text-[11px] text-white/65 leading-relaxed flex-1">
                  {order.detail}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px]">
                  <span className="font-bold text-[#F3E5AB]">{order.qty}</span>
                  <span className="text-white/70">{order.approx}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10.5px] text-white/50 font-sans italic">
            Approximate order values shown for reference only. Every event is unique, so pricing for
            your quantity &amp; design is confirmed personally over WhatsApp.
          </p>
        </div>

      </div>
    </section>
  );
};
