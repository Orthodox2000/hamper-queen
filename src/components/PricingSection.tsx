import React, { useState } from 'react';
import { DollarSign, ShieldCheck, Check, Sparkles, HelpCircle, Calculator, Sliders, ArrowRight } from 'lucide-react';
import { PRICING_TIERS_CONFIG } from '../data/itemsData';
import { royaleLogger } from '../utils/logger';

export const PricingSection: React.FC = () => {
  const [showPricingDetails, setShowPricingDetails] = useState<boolean>(true);
  const [selectedTierId, setSelectedTierId] = useState<string>('tier-imperial');
  
  // Interactive Price Estimator State
  const [vesselType, setVesselType] = useState<'wicker' | 'hatbox' | 'trunk'>('trunk');
  const [itemCount, setItemCount] = useState<number>(5);
  const [floralUpgrade, setFloralUpgrade] = useState<'standard' | 'rare_orchids' | 'volcanic_50roses'>('rare_orchids');
  const [whiteGloveDelivery, setWhiteGloveDelivery] = useState<boolean>(true);
  const [customBrassPlaque, setCustomBrassPlaque] = useState<boolean>(true);

  // Calculate estimated investment
  const baseVesselCost = vesselType === 'trunk' ? 180 : vesselType === 'wicker' ? 95 : 85;
  const itemsCost = itemCount * 42;
  const floralCost = floralUpgrade === 'volcanic_50roses' ? 190 : floralUpgrade === 'rare_orchids' ? 140 : 65;
  const whiteGloveCost = whiteGloveDelivery ? 60 : 0;
  const plaqueCost = customBrassPlaque ? 45 : 0;
  const totalEstimate = baseVesselCost + itemsCost + floralCost + whiteGloveCost + plaqueCost;

  return (
    <section id="pricing-section" className="py-16 bg-white border-t border-[#EAE5D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Explicit Modularity */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF5E8] border border-[#EAE0C8] text-[#8C6821] text-xs uppercase tracking-widest font-cinzel font-bold mb-3">
            <DollarSign className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Dedicated Pricing & Investment Guidance</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#141414] tracking-tight">
            Commission Tiers & Budget Estimator
          </h2>
          <p className="font-cormorant text-lg text-[#575247] mt-2">
            Browse transparent pricing tiers and estimate your custom hamper cost below.
          </p>

          {/* Pricing Visibility Toggle */}
          <div className="mt-5 inline-flex items-center gap-3 p-1.5 rounded-full bg-white border border-[#D8CCA8] shadow-xs">
            <button
              onClick={() => {
                setShowPricingDetails(true);
                royaleLogger.action('Pricing', 'Switched to Transparent Pricing Mode');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                showPricingDetails
                  ? 'bg-[#141414] text-[#E5C07B]'
                  : 'text-[#615B4F] hover:text-[#141414]'
              }`}
            >
              Corporate & Client Pricing
            </button>
            <button
              onClick={() => {
                setShowPricingDetails(false);
                royaleLogger.action('Pricing', 'Switched to Pure Presentation Mode (Prices Hidden)');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                !showPricingDetails
                  ? 'bg-[#141414] text-[#E5C07B]'
                  : 'text-[#615B4F] hover:text-[#141414]'
              }`}
            >
              Presentation Mode (Hide Numbers)
            </button>
          </div>
        </div>

        {/* 3 Tier Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {PRICING_TIERS_CONFIG.map((tier) => {
            const isSelected = selectedTierId === tier.id;
            return (
              <div
                key={tier.id}
                id={`pricing-card-${tier.id}`}
                onClick={() => setSelectedTierId(tier.id)}
                className={`relative rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between cursor-pointer border ${
                  isSelected
                    ? 'bg-white border-[#C5A059]/70 ring-2 ring-[#C5A059]/40 shadow-xl'
                    : 'bg-white/80 hover:bg-white border-[#D4AF37]/30 shadow-sm hover:shadow-md'
                }`}
              >
                {tier.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#141414] text-[#E5C07B] border border-[#C5A059] px-3.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest shadow-md">
                    Most Favored Commission
                  </div>
                )}

                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C6821] block">
                    Custom Category
                  </span>
                  <h3 className="font-cinzel text-xl font-bold text-[#141414] mt-1">
                    {tier.name}
                  </h3>
                  <p className="font-cormorant text-sm text-[#666053] italic mt-0.5">
                    {tier.subtitle}
                  </p>

                  {/* Price Tag or Prestige Label */}
                  <div className="my-6 pb-6 border-b border-[#F0EAE0]">
                    {showPricingDetails ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-cinzel text-3xl sm:text-4xl font-bold text-[#141414]">
                          {tier.priceRange}
                        </span>
                        <span className="text-xs text-[#7A7366]">/ commission</span>
                      </div>
                    ) : (
                      <div className="py-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#8C6821] bg-[#FAF8F2] px-3 py-1.5 rounded-lg border border-[#D4AF37]/30">
                          Custom Gift Consultation
                        </span>
                      </div>
                    )}
                    <span className="text-[11px] text-[#554F42] block mt-1.5">
                      Recommended for: {tier.recommendedOccasion}
                    </span>
                  </div>

                  {/* Included Curation Highlights */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#141414] block">
                      Tier Inclusions & Standards
                    </span>
                    <ul className="space-y-2 text-xs text-[#443E33]">
                      {tier.curationHighlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#F0EAE0]">
                  <div className="text-[11px] text-[#787163] mb-3 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{tier.deliverySpeed}</span>
                  </div>

                  <a
                    href="#atelier-builder-section"
                    className="w-full py-3 rounded-xl bg-[#141414] hover:bg-[#262626] text-[#E5C07B] text-xs font-bold uppercase tracking-wider border border-[#C5A059] flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Assemble in Atelier</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#DFBA54]" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Bespoke Cost Estimator & Calculator */}
        <div className="bg-white rounded-3xl border border-[#C5A059]/70 p-8 shadow-lg max-w-4xl mx-auto">
          <div className="flex items-center gap-3 pb-4 border-b border-[#F0EAE0]">
            <div className="w-10 h-10 rounded-full bg-[#141414] text-[#DFBA54] flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-xl font-bold text-[#141414]">
                Interactive Custom Budget Estimator
              </h3>
              <p className="font-cormorant text-sm text-[#666053]">
                Add items to your hamper and watch the estimated price update instantly.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            {/* Controls */}
            <div className="space-y-5">
              {/* Vessel Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#141414] block mb-2">
                  Presentation Vessel Base
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'wicker', label: 'Willow Wicker ($95)' },
                    { id: 'hatbox', label: 'Hatbox ($85)' },
                    { id: 'trunk', label: 'Velvet Trunk ($180)' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVesselType(v.id as any)}
                      className={`p-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        vesselType === v.id
                          ? 'bg-[#141414] text-[#E5C07B] border-[#C5A059]'
                          : 'bg-[#FAF9F5] text-[#4F4A3F] border-[#E5DAC2] hover:bg-[#F2ECE0]'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Gourmet/Keepsake Items */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#141414]">
                    Curated Items Count: {itemCount}
                  </label>
                  <span className="text-xs text-[#787163]">($42 avg per item)</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={8}
                  step={1}
                  value={itemCount}
                  onChange={(e) => setItemCount(Number(e.target.value))}
                  className="w-full accent-[#C5A059] cursor-pointer"
                />
              </div>

              {/* Floral Arrangement Upgrade */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#141414] block mb-2">
                  Floral Botanical Inclusion
                </label>
                <select
                  value={floralUpgrade}
                  onChange={(e) => setFloralUpgrade(e.target.value as any)}
                  className="w-full text-xs p-3 bg-[#FAF9F5] border border-[#E5DAC2] rounded-xl text-[#141414] focus:outline-none focus:border-[#C5A059] cursor-pointer"
                >
                  <option value="standard">Standard Garden Blooms ($65)</option>
                  <option value="rare_orchids">Rare Cascading Phalaenopsis Orchids ($140)</option>
                  <option value="volcanic_50roses">50-Stem Ecuadorian Red Rose Cascade ($190)</option>
                </select>
              </div>

              {/* Checkbox Options */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#141414]">White-Glove Butler Hand Delivery (+$60)</span>
                  <input
                    type="checkbox"
                    checked={whiteGloveDelivery}
                    onChange={(e) => setWhiteGloveDelivery(e.target.checked)}
                    className="w-4 h-4 accent-[#C5A059] rounded cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#141414]">Hand-Engraved Brass Plaque (+$45)</span>
                  <input
                    type="checkbox"
                    checked={customBrassPlaque}
                    onChange={(e) => setCustomBrassPlaque(e.target.checked)}
                    className="w-4 h-4 accent-[#C5A059] rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Live Calculation Display */}
            <div className="bg-[#FAF9F5] rounded-2xl border border-[#C5A059]/70 p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C6821] block">
                  Estimated Atelier Quote
                </span>
                <div className="font-cinzel text-4xl font-bold text-[#141414] mt-2">
                  ${totalEstimate}
                </div>
                <p className="font-cormorant text-xs text-[#6E6759] italic mt-1">
                  Includes Italian silk ribbon tie, deckle-edge card, and authentic wax seal stamp.
                </p>

                <div className="space-y-1.5 pt-4 text-xs text-[#524C40] border-t border-[#E8DFCA] mt-4">
                  <div className="flex justify-between">
                    <span>Base Vessel:</span>
                    <span className="font-semibold">${baseVesselCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{itemCount} Curated Luxuries:</span>
                    <span className="font-semibold">${itemsCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Floral Suite:</span>
                    <span className="font-semibold">${floralCost}</span>
                  </div>
                  {whiteGloveDelivery && (
                    <div className="flex justify-between text-[#800E17]">
                      <span>White-Glove Butler Service:</span>
                      <span className="font-semibold">+$60</span>
                    </div>
                  )}
                  {customBrassPlaque && (
                    <div className="flex justify-between text-[#8C6821]">
                      <span>Brass Plaque Monogramming:</span>
                      <span className="font-semibold">+$45</span>
                    </div>
                  )}
                </div>
              </div>

              <a
                href="#atelier-builder-section"
                onClick={() => royaleLogger.action('Pricing', `Calculated estimate: $${totalEstimate}`)}
                className="w-full mt-6 py-4 rounded-full bg-[#141414] hover:bg-[#252525] text-[#E5C07B] text-xs font-bold uppercase tracking-wider border border-[#C5A059] flex items-center justify-center gap-2 shadow-md transition-all text-center"
              >
                <span>Assemble in Atelier</span>
                <ArrowRight className="w-4 h-4 text-[#DFBA54]" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
