import React, { useState } from 'react';
import { Sparkles, ArrowRight, Crown } from 'lucide-react';
import { ROYAL_INSPIRATIONS, RoyalInspiration } from '../data/inspirationData';
import { TRANSLATIONS } from '../data/translations';
import { LanguageMode } from '../types';
import { royaleLogger } from '../utils/logger';
import { royalAudio } from '../utils/royalAudio';

import { readableOn } from '../utils/color';
interface RoyalInspirationGalleryProps {
  language: LanguageMode;
  onCustomizeInspiration: (insp: RoyalInspiration) => void;
  onOpenScribe: () => void;
}

export const RoyalInspirationGallery: React.FC<RoyalInspirationGalleryProps> = ({
  language,
  onCustomizeInspiration,
  onOpenScribe,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'weddings' | 'festive' | 'corporate' | 'romance'>('all');
  const [activeModalInsp, setActiveModalInsp] = useState<RoyalInspiration | null>(null);

  const filteredInspirations = ROYAL_INSPIRATIONS.filter((item) => {
    if (selectedFilter === 'all') return true;
    return item.occasionCategory === selectedFilter;
  });

  const handleSelectFilter = (filter: typeof selectedFilter) => {
    setSelectedFilter(filter);
    royalAudio.playChime(520);
    royaleLogger.action('InspirationGallery', `Filtered inspirations: ${filter}`);
  };

  const handleOpenCustomize = (insp: RoyalInspiration) => {
    royalAudio.playRoyalFanfare();
    royaleLogger.action('InspirationGallery', `User chose to customize: ${insp.titleEn}`);
    onCustomizeInspiration(insp);
  };

  return (
    <section id="royal-inspirations-section" className="section bg-cream-100 text-ink relative">
      
      <div className="container-page">

        {/* Section Header */}
        <div className="section-head !mb-8">
          <span className="eyebrow">
            <Crown className="w-3.5 h-3.5 text-gold-700" aria-hidden="true" />
            {t.inspiration.eyebrow}
          </span>
          <h2 className="section-title">{t.inspiration.title}</h2>
          <p className="section-lede">{t.inspiration.subtitle}</p>
        </div>
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">

          {/* Occasion Filter Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {[
              { id: 'all', label: t.inspiration.filterAll },
              { id: 'weddings', label: t.inspiration.filterWeddings },
              { id: 'festive', label: t.inspiration.filterFestive },
              { id: 'corporate', label: t.inspiration.filterCorporate },
              { id: 'romance', label: t.inspiration.filterRomance },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => handleSelectFilter(f.id as typeof selectedFilter)}
                className={`chip ${selectedFilter === f.id ? 'chip-active' : ''}`}
                aria-pressed={selectedFilter === f.id}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Editorial Moodboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filteredInspirations.map((insp) => (
            <div
              key={insp.id}
              className="rounded-3xl bg-gradient-to-b from-[#FFFFFF] to-cream-100 border border-gold-400/30 shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col justify-between transition-all hover:shadow-[0_12px_40px_rgba(212,175,55,0.2)] group"
            >
              
              {/* Card Banner Image / Visual Stage */}
              <div 
                className={`relative h-64 sm:h-72 w-full p-6 flex flex-col justify-between bg-gradient-to-b ${insp.bgGradient} overflow-hidden`}
              >
                {/* Background Ambient Glow */}
                <div 
                  className="absolute inset-0 opacity-40 blur-3xl pointer-events-none"
                  style={{ backgroundColor: insp.glowColor }}
                />

                {/* Top Badge Row */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-sans font-semibold bg-[#000000]/70 text-gold-100 border border-gold-400/50 backdrop-blur-sm">
                    {language === 'hinglish' ? insp.occasionBadgeHinglish : insp.occasionBadgeEn}
                  </span>
                  
                  <span className="flex items-center gap-1.5 text-xs text-gold-400 font-cormorant italic">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Hamper Queen Signature</span>
                  </span>
                </div>

                {/* Center Dramatic Graphic: Vessel & Emblem Preview */}
                <div className="relative z-10 my-auto flex items-center justify-center">
                  <div className="relative w-44 sm:w-48 h-32 rounded-xl bg-[#1C1A16] border border-gold-400/60 shadow-float flex flex-col items-center justify-center p-3 transform group-hover:scale-105 transition-transform duration-500">
                    
                    {/* Ribbon Accent */}
                    <div 
                      className="absolute inset-y-0 w-6 shadow-lift"
                      style={{ backgroundColor: insp.ribbon.colorHex }}
                    />
                    
                    {/* Wax Seal Monogram */}
                    <div 
                      className="relative z-10 w-10 h-10 rounded-full border border-[#FFF3B0]/60 shadow-lift flex items-center justify-center"
                      style={{ backgroundColor: insp.waxSeal.colorHex, color: readableOn(insp.waxSeal.colorHex) }}
                    >
                      <Crown className="w-5 h-5 text-gold-100" />
                    </div>

                    <span className="relative z-10 font-sans text-xs font-semibold text-gold-100 mt-2">
                      {insp.royalVessel.name}
                    </span>
                  </div>
                </div>

                {/* Bottom Card Proclamation Quote */}
                <div className="relative z-10 text-center">
                  <p className="font-cormorant italic text-sm text-gold-300/90 line-clamp-1">
                    {language === 'hinglish' ? insp.quoteHinglish : insp.quoteEn}
                  </p>
                </div>

              </div>

              {/* Card Body & Details */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                
                <div>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-ink leading-snug">
                    {language === 'hinglish' ? insp.titleHinglish : insp.titleEn}
                  </h3>
                  <p className="font-cormorant text-base text-gold-700 font-semibold mt-1">
                    {language === 'hinglish' ? insp.subtitleHinglish : insp.subtitleEn}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => handleOpenCustomize(insp)}
                    className="w-full sm:flex-1 py-3 px-5 rounded-full bg-ink text-gold-100 font-sans text-xs font-semibold hover:bg-[#2A2823] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lift group"
                  >
                    <span>{t.inspiration.customizeThis}</span>
                    <ArrowRight className="w-4 h-4 text-gold-300 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => setActiveModalInsp(insp)}
                    className="w-full sm:w-auto py-3 px-5 rounded-full bg-white border border-gold-400/50 text-ink font-sans text-xs hover:bg-cream-100 transition-colors cursor-pointer"
                  >
                    {t.inspiration.viewDetails}
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* Custom Calligraphy Promo Banner */}
        <div className="mt-16 p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#171613] via-[#2B2519] to-[#12110D] border border-gold-400/40 shadow-float text-cream-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400/20 border border-gold-400/40 text-gold-100 text-xs font-sans">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Royal Scribe Studio</span>
            </span>
            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-gold-100">
              {language === 'hinglish'
                ? 'Har Hamper Ke Saath Shahi Sandesh (Calligraphy Card)'
                : 'Handwritten Gift Card Included With Every Hamper'}
            </h3>
            <p className="font-cormorant text-base sm:text-lg text-[#D5CCA8] max-w-2xl">
              {language === 'hinglish'
                ? 'Handmade deckle-edge parchment paper, royal scripts aur molten wax seal stamp ke sath aapka shahi sandesh likha jata hai.'
                : 'Hand-dipped deckle-edge cotton rag parchment penned with archival gold or ink script and stamped with your personalized royal wax seal.'}
            </p>
          </div>

          <button
            onClick={onOpenScribe}
            className="shrink-0 px-6 py-4 rounded-full bg-gradient-to-r from-gold-400 via-[#FFF3B0] to-[#AA7A1E] text-[#0A0A08] font-sans font-semibold text-xs shadow-lift hover:scale-105 transition-all cursor-pointer"
          >
            {language === 'hinglish' ? 'Shahi Sandesh Likhein →' : 'Enter Scribe Studio →'}
          </button>
        </div>

      </div>

      {/* Details Modal */}
      {activeModalInsp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-cream-100 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-gold-200 shadow-float relative space-y-5">
            <button
              onClick={() => setActiveModalInsp(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#EAE6DC] text-ink flex items-center justify-center font-semibold hover:bg-gold-400 cursor-pointer transition-colors"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="text-xs font-sans text-gold-700 font-semibold">
                {language === 'hinglish' ? activeModalInsp.occasionBadgeHinglish : activeModalInsp.occasionBadgeEn}
              </span>
              <h3 className="font-cinzel text-2xl font-bold text-ink">
                {language === 'hinglish' ? activeModalInsp.titleHinglish : activeModalInsp.titleEn}
              </h3>
            </div>

            <p className="text-sm text-cocoa leading-relaxed">
              {language === 'hinglish' ? activeModalInsp.storyHinglish : activeModalInsp.storyEn}
            </p>

            <div className="p-4 rounded-xl bg-line space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="font-semibold text-ink">Vessel / Box:</span>
                <span className="text-cocoa">{activeModalInsp.royalVessel.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-ink">Satin Ribbon:</span>
                <span className="text-cocoa">{activeModalInsp.ribbon.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-ink">Wax Seal:</span>
                <span className="text-cocoa">{activeModalInsp.waxSeal.label}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-sans text-xs text-ink font-semibold">
                Treasures Included:
              </h4>
              <ul className="space-y-1.5 text-xs text-cocoa">
                {activeModalInsp.curatedItems.map((item) => (
                  <li key={item.id} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                    <span className="font-medium text-ink">{item.name}</span> — {item.subtitle}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                const insp = activeModalInsp;
                setActiveModalInsp(null);
                handleOpenCustomize(insp);
              }}
              className="w-full py-3 rounded-full bg-ink text-gold-100 font-sans text-xs font-semibold hover:bg-[#2A2823] transition-colors cursor-pointer"
            >
              {t.inspiration.customizeThis}
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
