import React, { useState } from 'react';
import { Sparkles, ArrowRight, Crown } from 'lucide-react';
import { ROYAL_INSPIRATIONS, RoyalInspiration } from '../data/inspirationData';
import { TRANSLATIONS } from '../data/translations';
import { LanguageMode } from '../types';
import { royaleLogger } from '../utils/logger';
import { royalAudio } from '../utils/royalAudio';

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
    <section id="royal-inspirations-section" className="py-16 sm:py-24 bg-white text-[#141414] relative border-b border-[#EAE5D9] content-visibility-auto">
      
      {/* Royal Guilloche Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <div className="flex items-center justify-center gap-3">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C5A059]/40 to-[#C5A059]" />
          <div className="flex items-center gap-2 text-[#C5A059]">
            <Crown className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs tracking-[0.3em] uppercase font-cinzel font-bold">
              {t.inspiration.eyebrow}
            </span>
            <Crown className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#C5A059]/40 to-[#C5A059]" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10 sm:mb-16">
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#141414]">
            {t.inspiration.title}
          </h2>
          <p className="font-cormorant text-lg sm:text-xl text-[#5C5549] leading-relaxed">
            {t.inspiration.subtitle}
          </p>

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
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-cinzel uppercase tracking-wider transition-all cursor-pointer ${
                  selectedFilter === f.id
                    ? 'bg-[#141414] text-[#E5C07B] font-bold shadow-md border border-[#D4AF37]'
                    : 'bg-[#F2EFE8] text-[#5C5549] hover:bg-[#E8E3D7] hover:text-[#141414] border border-transparent'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Editorial Moodboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredInspirations.map((insp) => (
            <div
              key={insp.id}
              className="rounded-3xl bg-gradient-to-b from-[#FFFFFF] to-[#FAF8F2] border border-[#D4AF37]/30 shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col justify-between transition-all hover:shadow-[0_12px_40px_rgba(212,175,55,0.2)] group"
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
                  <span className="px-3 py-1 rounded-full text-[11px] font-cinzel font-bold tracking-widest uppercase bg-[#000000]/70 text-[#F5E7A3] border border-[#D4AF37]/50 backdrop-blur-sm">
                    {language === 'hinglish' ? insp.occasionBadgeHinglish : insp.occasionBadgeEn}
                  </span>
                  
                  <span className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-cormorant italic">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Hamper Queen Signature</span>
                  </span>
                </div>

                {/* Center Dramatic Graphic: Vessel & Emblem Preview */}
                <div className="relative z-10 my-auto flex items-center justify-center">
                  <div className="relative w-44 sm:w-48 h-32 rounded-xl bg-[#1C1A16] border border-[#D4AF37]/60 shadow-2xl flex flex-col items-center justify-center p-3 transform group-hover:scale-105 transition-transform duration-500">
                    
                    {/* Ribbon Accent */}
                    <div 
                      className="absolute inset-y-0 w-6 shadow-md"
                      style={{ backgroundColor: insp.ribbon.colorHex }}
                    />
                    
                    {/* Wax Seal Monogram */}
                    <div 
                      className="relative z-10 w-10 h-10 rounded-full border border-[#FFF3B0]/60 shadow-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: insp.waxSeal.colorHex }}
                    >
                      <Crown className="w-5 h-5 text-[#F5E7A3]" />
                    </div>

                    <span className="relative z-10 font-cinzel text-[11px] font-bold text-[#F5E7A3] mt-2 uppercase tracking-widest">
                      {insp.royalVessel.name}
                    </span>
                  </div>
                </div>

                {/* Bottom Card Proclamation Quote */}
                <div className="relative z-10 text-center">
                  <p className="font-cormorant italic text-sm text-[#E5C07B]/90 line-clamp-1">
                    {language === 'hinglish' ? insp.quoteHinglish : insp.quoteEn}
                  </p>
                </div>

              </div>

              {/* Card Body & Details */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                
                <div>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#141414] leading-snug">
                    {language === 'hinglish' ? insp.titleHinglish : insp.titleEn}
                  </h3>
                  <p className="font-cormorant text-base text-[#8C6821] font-semibold mt-1">
                    {language === 'hinglish' ? insp.subtitleHinglish : insp.subtitleEn}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => handleOpenCustomize(insp)}
                    className="w-full sm:flex-1 py-3 px-5 rounded-full bg-[#141414] text-[#E5C07B] font-cinzel text-xs font-bold uppercase tracking-wider hover:bg-[#2A2823] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md group"
                  >
                    <span>{t.inspiration.customizeThis}</span>
                    <ArrowRight className="w-4 h-4 text-[#DFBA54] group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => setActiveModalInsp(insp)}
                    className="w-full sm:w-auto py-3 px-5 rounded-full bg-white border border-[#D4AF37]/50 text-[#141414] font-cinzel text-xs uppercase tracking-wider hover:bg-[#FAF8F2] transition-colors cursor-pointer"
                  >
                    {t.inspiration.viewDetails}
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* Custom Calligraphy Promo Banner */}
        <div className="mt-16 p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#171613] via-[#2B2519] to-[#12110D] border border-[#D4AF37]/40 shadow-xl text-[#FAF9F5] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5E7A3] text-xs font-cinzel uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Royal Scribe Studio</span>
            </span>
            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#F3E5AB]">
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
            className="shrink-0 px-6 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#AA7A1E] text-[#0A0A08] font-cinzel font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all cursor-pointer"
          >
            {language === 'hinglish' ? 'Shahi Sandesh Likhein →' : 'Enter Scribe Studio →'}
          </button>
        </div>

      </div>

      {/* Details Modal */}
      {activeModalInsp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FAF9F5] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#D4AF37] shadow-2xl relative space-y-5">
            <button
              onClick={() => setActiveModalInsp(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#EAE6DC] text-[#141414] flex items-center justify-center font-bold hover:bg-[#D4AF37] cursor-pointer transition-colors"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="text-xs font-cinzel uppercase tracking-widest text-[#8C6821] font-bold">
                {language === 'hinglish' ? activeModalInsp.occasionBadgeHinglish : activeModalInsp.occasionBadgeEn}
              </span>
              <h3 className="font-cinzel text-2xl font-bold text-[#141414]">
                {language === 'hinglish' ? activeModalInsp.titleHinglish : activeModalInsp.titleEn}
              </h3>
            </div>

            <p className="text-sm text-[#5C5549] leading-relaxed">
              {language === 'hinglish' ? activeModalInsp.storyHinglish : activeModalInsp.storyEn}
            </p>

            <div className="p-4 rounded-xl bg-[#F0ECE1] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="font-semibold text-[#141414]">Vessel / Box:</span>
                <span className="text-[#5C5549]">{activeModalInsp.royalVessel.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-[#141414]">Satin Ribbon:</span>
                <span className="text-[#5C5549]">{activeModalInsp.ribbon.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-[#141414]">Wax Seal:</span>
                <span className="text-[#5C5549]">{activeModalInsp.waxSeal.label}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-cinzel text-xs uppercase tracking-wider text-[#141414] font-bold">
                Treasures Included:
              </h4>
              <ul className="space-y-1.5 text-xs text-[#5C5549]">
                {activeModalInsp.curatedItems.map((item) => (
                  <li key={item.id} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    <span className="font-medium text-[#141414]">{item.name}</span> — {item.subtitle}
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
              className="w-full py-3 rounded-full bg-[#141414] text-[#E5C07B] font-cinzel text-xs font-bold uppercase tracking-wider hover:bg-[#2A2823] transition-colors cursor-pointer"
            >
              {t.inspiration.customizeThis}
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
