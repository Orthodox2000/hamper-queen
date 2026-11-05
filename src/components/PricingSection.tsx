import React, { useState } from 'react';
import {
  IndianRupee,
  ShieldCheck,
  Check,
  Calculator,
  ArrowRight,
} from 'lucide-react';
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
  const baseVesselCost = vesselType === 'trunk' ? 149 : vesselType === 'wicker' ? 79 : 69;
  const itemsCost = itemCount * 60;
  const floralCost = floralUpgrade === 'volcanic_50roses' ? 199 : floralUpgrade === 'rare_orchids' ? 149 : 75;
  const whiteGloveCost = whiteGloveDelivery ? 59 : 0;
  const plaqueCost = customBrassPlaque ? 49 : 0;
  const totalEstimate = baseVesselCost + itemsCost + floralCost + whiteGloveCost + plaqueCost;

  return (
    <section id="pricing-section" className="section bg-white">
      <div className="container-page">
        
        {/* Section Header with Explicit Modularity */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-50 border border-line-strong text-gold-700 text-xs font-sans font-semibold mb-3">
            <IndianRupee className="w-3.5 h-3.5 text-gold-700" />
            <span>Dedicated Pricing & Investment Guidance</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-ink tracking-tight">
            Commission Tiers & Budget Estimator
          </h2>
          <p className="font-cormorant text-lg text-[#575247] mt-2">
            Browse transparent pricing tiers and estimate your custom hamper cost below.
          </p>

          {/* Pricing Visibility Toggle */}
          <div className="mt-5 inline-flex items-center gap-3 p-1.5 rounded-full bg-white border border-line-strong shadow-soft">
            <button
              onClick={() => {
                setShowPricingDetails(true);
                royaleLogger.action('Pricing', 'Switched to Transparent Pricing Mode');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold   transition-all cursor-pointer ${
                showPricingDetails
                  ? 'bg-ink text-gold-100'
                  : 'text-[#615B4F] hover:text-ink'
              }`}
            >
              Corporate & Client Pricing
            </button>
            <button
              onClick={() => {
                setShowPricingDetails(false);
                royaleLogger.action('Pricing', 'Switched to Pure Presentation Mode (Prices Hidden)');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold   transition-all cursor-pointer ${
                !showPricingDetails
                  ? 'bg-ink text-gold-100'
                  : 'text-[#615B4F] hover:text-ink'
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
                className={`relative rounded-3xl p-8 transition-all duration-250 flex flex-col justify-between cursor-pointer border ${
                  isSelected
                    ? 'bg-white border-gold-500/70 ring-2 ring-gold-500/40 shadow-float'
                    : 'bg-white/80 hover:bg-white border-gold-400/30 shadow-soft hover:shadow-lift'
                }`}
              >
                {tier.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-ink text-gold-300 border border-gold-500 px-4 py-1 rounded-full text-xs font-semibold shadow-lift">
                    Most Favored Commission
                  </div>
                )}

                <div>
                  <span className="text-xs font-semibold text-gold-700 block">
                    Custom Category
                  </span>
                  <h3 className="font-cinzel text-xl font-bold text-ink mt-1">
                    {tier.name}
                  </h3>
                  <p className="font-cormorant text-sm text-stone italic mt-0.5">
                    {tier.subtitle}
                  </p>

                  {/* Price Tag or Prestige Label */}
                  <div className="my-6 pb-6 border-b border-cream-200">
                    {showPricingDetails ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-cinzel text-3xl sm:text-4xl font-bold text-ink">
                          {tier.priceRange}
                        </span>
                        <span className="text-xs text-[#7A7366]">/ commission</span>
                      </div>
                    ) : (
                      <div className="py-2">
                        <span className="text-xs font-semibold text-gold-700 bg-cream-100 px-3 py-1.5 rounded-lg border border-gold-400/30">
                          Custom Gift Consultation
                        </span>
                      </div>
                    )}
                    <span className="text-xs text-cocoa block mt-1.5">
                      Recommended for: {tier.recommendedOccasion}
                    </span>
                  </div>

                  {/* Included Curation Highlights */}
                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-ink block">
                      Tier Inclusions & Standards
                    </span>
                    <ul className="space-y-2 text-xs text-cocoa">
                      {tier.curationHighlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-cream-200">
                  <div className="text-xs text-stone mb-3 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
                    <span>{tier.deliverySpeed}</span>
                  </div>

                  <a
                    href="#atelier-builder-section"
                    className="w-full py-3 rounded-xl bg-ink hover:bg-ink-soft text-gold-100 text-xs font-semibold border border-gold-500 flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Design in Hamper Studio</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gold-300" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Bespoke Cost Estimator & Calculator */}
        <div className="bg-white rounded-3xl border border-gold-500/70 p-8 shadow-lift max-w-4xl mx-auto">
          <div className="flex items-center gap-3 pb-4 border-b border-cream-200">
            <div className="w-10 h-10 rounded-full bg-ink text-gold-300 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-xl font-bold text-ink">
                Interactive Custom Budget Estimator
              </h3>
              <p className="font-cormorant text-sm text-stone">
                Add items to your hamper and watch the estimated price update instantly.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            {/* Controls */}
            <div className="space-y-5">
              {/* Vessel Selection */}
              <div>
                <label className="text-xs font-semibold text-ink block mb-2">
                  Presentation Vessel Base
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'wicker', label: 'Willow Wicker (INR 79)' },
                    { id: 'hatbox', label: 'Hatbox (INR 69)' },
                    { id: 'trunk', label: 'Velvet Trunk (INR 149)' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVesselType(v.id as any)}
                      className={`p-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        vesselType === v.id
                          ? 'bg-ink text-gold-100 border-gold-500'
                          : 'bg-cream-100 text-[#4F4A3F] border-line-strong hover:bg-cream-200'
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
                  <label className="text-xs font-semibold text-ink">
                    Curated Items Count: {itemCount}
                  </label>
                  <span className="text-xs text-stone">(INR 60 avg per item)</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={8}
                  step={1}
                  value={itemCount}
                  onChange={(e) => setItemCount(Number(e.target.value))}
                  className="w-full accent-gold-500 cursor-pointer"
                />
              </div>

              {/* Floral Arrangement Upgrade */}
              <div>
                <label className="text-xs font-semibold text-ink block mb-2">
                  Floral Botanical Inclusion
                </label>
                <select
                  value={floralUpgrade}
                  onChange={(e) => setFloralUpgrade(e.target.value as any)}
                  className="w-full text-xs p-3 bg-cream-100 border border-line-strong rounded-xl text-ink focus:outline-none focus:border-gold-500 cursor-pointer"
                >
                  <option value="standard">Standard Garden Blooms (INR 75)</option>
                  <option value="rare_orchids">Rare Cascading Phalaenopsis Orchids (INR 149)</option>
                  <option value="volcanic_50roses">50-Stem Ecuadorian Red Rose Cascade (INR 199)</option>
                </select>
              </div>

              {/* Checkbox Options */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-ink">White-Glove Butler Hand Delivery (+INR 59)</span>
                  <input
                    type="checkbox"
                    checked={whiteGloveDelivery}
                    onChange={(e) => setWhiteGloveDelivery(e.target.checked)}
                    className="w-4 h-4 accent-gold-500 rounded cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-ink">Hand-Engraved Brass Plaque (+INR 49)</span>
                  <input
                    type="checkbox"
                    checked={customBrassPlaque}
                    onChange={(e) => setCustomBrassPlaque(e.target.checked)}
                    className="w-4 h-4 accent-gold-500 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Live Calculation Display */}
            <div className="bg-cream-100 rounded-2xl border border-gold-500/70 p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-gold-700 block">
                  Estimated Custom Quote
                </span>
                <div className="font-cinzel text-4xl font-bold text-ink mt-2">
                  INR {totalEstimate}
                </div>
                <p className="font-cormorant text-xs text-[#6E6759] italic mt-1">
                  Includes Italian silk ribbon tie, deckle-edge card, and authentic wax seal stamp.
                </p>

                <div className="space-y-1.5 pt-4 text-xs text-[#524C40] border-t border-[#E8DFCA] mt-4">
                  <div className="flex justify-between">
                    <span>Base Vessel:</span>
                    <span className="font-semibold">INR {baseVesselCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{itemCount} Curated Luxuries:</span>
                    <span className="font-semibold">INR {itemsCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Floral Suite:</span>
                    <span className="font-semibold">INR {floralCost}</span>
                  </div>
                  {whiteGloveDelivery && (
                    <div className="flex justify-between text-crimson">
                      <span>White-Glove Butler Service:</span>
                      <span className="font-semibold">+INR 59</span>
                    </div>
                  )}
                  {customBrassPlaque && (
                    <div className="flex justify-between text-gold-700">
                      <span>Brass Plaque Monogramming:</span>
                      <span className="font-semibold">+INR 49</span>
                    </div>
                  )}
                </div>
              </div>

              <a
                href="#atelier-builder-section"
                onClick={() => royaleLogger.action('Pricing', `Calculated estimate: INR ${totalEstimate}`)}
                className="w-full mt-6 py-4 rounded-full bg-ink hover:bg-ink-soft text-gold-100 text-xs font-semibold border border-gold-500 flex items-center justify-center gap-2 shadow-lift transition-all text-center"
              >
                <span>Design in Hamper Studio</span>
                <ArrowRight className="w-4 h-4 text-gold-300" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
