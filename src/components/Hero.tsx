import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Award, Gift } from 'lucide-react';
import { ItemGraphic } from './ItemGraphic';
import { royaleLogger } from '../utils/logger';

interface HeroProps {
  onStartBuilder: () => void;
  onExploreCatalog: () => void;
  onOpenScribe: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartBuilder,
  onExploreCatalog,
  onOpenScribe,
}) => {
  const [featuredId, setFeaturedId] = useState<'hamper-crown-sovereign' | 'bouquet-crimson-cascade' | 'gourmet-gold-truffles'>('hamper-crown-sovereign');

  const featuredItems = [
    {
      id: 'hamper-crown-sovereign' as const,
      title: 'The Crown Sovereign Trunk',
      category: 'Imperial Keepsake Hamper',
      quote: 'Handcrafted ivory velvet casket with 24K gilded accoutrements.',
      color: '#C5A059',
    },
    {
      id: 'bouquet-crimson-cascade' as const,
      title: 'Velvet Crimson Rose Cascade',
      category: 'Grand Botanical Arrangement',
      quote: 'Fifty long-stem volcanic Ecuadorian roses with golden foliage.',
      color: '#800E17',
    },
    {
      id: 'gourmet-gold-truffles' as const,
      title: '24K Gold-Leaf Truffle Casket',
      category: 'Grand Cru Confectionery',
      quote: 'Venezuelan single-origin cacao gilded with edible 24K pure gold.',
      color: '#1A1A1A',
    },
  ];

  const currentItem = featuredItems.find((f) => f.id === featuredId) || featuredItems[0];

  const handleSelectFeatured = (id: typeof featuredId) => {
    setFeaturedId(id);
    royaleLogger.action('Hero', `User previewed flagship masterpiece: ${id}`);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 bg-cream-100">
      {/* Decorative Royal Guilloche / Filigree Border Line */}
      <div className="container-page mb-4">
        <div className="flex items-center justify-center gap-3">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gold-500/40 to-gold-500" />
          <div className="flex items-center gap-1.5 text-gold-500">
            <span className="text-xs font-sans font-semibold">Atelier Royale</span>
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-gold-500/40 to-gold-500" />
        </div>
      </div>

      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Royal Narrative & Calls to Action */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cream-200 border border-gold-400/40 text-gold-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-gold-300" />
              <span>Custom Gifts • Same-Day Dispatch • Free Delivery Above INR 499</span>
            </div>

            <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink leading-[1.18]">
              Custom Hampers &{' '}
              <span className="bg-gradient-to-r from-gold-300 via-[#B38728] to-[#876117] bg-clip-text text-transparent block sm:inline">Chocolate Bouquets</span>{' '}
              for Every Occasion
            </h1>

            <p className="font-cormorant text-lg sm:text-xl text-[#4A463E] leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Build your own hamper—mix chocolates, dry fruits, skincare, and keepsakes—or pick a ready-made bouquet. Velvet trunks with wax seals from INR 799, same-day dispatch, and delivery across India.
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                id="btn-hero-start-builder"
                onClick={() => {
                  royaleLogger.action('Hero', 'Clicked Build Hamper');
                  onStartBuilder();
                }}
                className="w-full sm:w-auto px-6 py-4 rounded-full bg-ink text-gold-100 font-medium text-sm border border-gold-500 shadow-lift hover:bg-ink-soft transition-all flex items-center justify-center gap-3 cursor-pointer group"
              >
                <span>Build Your Hamper</span>
                <ArrowRight className="w-4 h-4 text-gold-300 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="btn-hero-explore-catalog"
                onClick={() => {
                  royaleLogger.action('Hero', 'Clicked Shop Ready-Made');
                  onExploreCatalog();
                }}
                className="w-full sm:w-auto px-6 py-4 rounded-full bg-white text-ink font-medium text-sm border border-line-strong hover:border-gold-500 hover:bg-cream-100 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-soft"
              >
                <span>Shop Ready-Made Gifts</span>
              </button>

              <button
                id="btn-hero-open-scribe"
                onClick={() => {
                  royaleLogger.action('Hero', 'Clicked Add Gift Message');
                  onOpenScribe();
                }}
                className="w-full sm:w-auto px-5 py-4 rounded-full text-crimson hover:bg-[#FBEBEB] text-xs font-semibold transition-colors cursor-pointer"
              >
                Add Gift Message
              </button>
            </div>

            {/* Atelier Quality Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#EAE5D8]">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <ShieldCheck className="w-5 h-5 text-gold-500 mb-1.5" />
                <span className="text-xs font-semibold text-ink">White-Glove</span>
                <span className="text-xs text-stone">Chauffeured Delivery</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <Heart className="w-5 h-5 text-crimson mb-1.5" />
                <span className="text-xs font-semibold text-ink">Grade A+ Fresh</span>
                <span className="text-xs text-stone">Volcanic Stems</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <Award className="w-5 h-5 text-gold-500 mb-1.5" />
                <span className="text-xs font-semibold text-ink">24K Pure Gold</span>
                <span className="text-xs text-stone">Artisanal Truffles</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <Gift className="w-5 h-5 text-[#113357] mb-1.5" />
                <span className="text-xs font-semibold text-ink">Handmade Paper</span>
                <span className="text-xs text-stone">Stamped Wax Seals</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Graphic Stage with Isolated Background-Removed Presentation */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-md aspect-square bg-white rounded-3xl border border-gold-400/30 shadow-lift p-6 flex flex-col items-center justify-center transition-all duration-250">
              
              {/* Subtle background radial aura */}
              <div className="absolute inset-4 rounded-2xl bg-radial from-[#FBF8EE] to-transparent pointer-events-none" />

              {/* Tag / Category */}
              <div className="absolute top-4 left-6 z-10">
                <span className="text-xs font-semibold text-gold-700 bg-cream-100 px-3 py-1 rounded-full border border-gold-400/30">
                  {currentItem.category}
                </span>
              </div>

              {/* Royal Seal Watermark */}
              <div className="absolute top-4 right-6 text-xs text-gold-500 font-sans font-bold">
                ROYALE
              </div>

              {/* High-definition Background-Removed Item Graphic */}
              <div className="relative z-10 w-full flex-1 flex items-center justify-center p-2">
                <ItemGraphic id={currentItem.id} size="xl" className="transform hover:scale-105 transition-transform duration-500" />
              </div>

              {/* Caption & Description */}
              <div className="relative z-10 text-center mt-2 border-t border-cream-200 pt-3 w-full">
                <h3 className="font-cinzel text-lg font-bold text-ink">
                  {currentItem.title}
                </h3>
                <p className="font-cormorant text-sm italic text-stone mt-0.5">
                  "{currentItem.quote}"
                </p>
              </div>
            </div>

            {/* Interactive Selector Pill Buttons for the 3 Flagships */}
            <div className="flex items-center justify-center gap-2 mt-5">
              {featuredItems.map((item) => (
                <button
                  key={item.id}
                  id={`btn-hero-select-${item.id}`}
                  onClick={() => handleSelectFeatured(item.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium  transition-all cursor-pointer ${
                    featuredId === item.id
                      ? 'bg-ink text-gold-100 shadow-soft'
                      : 'bg-white text-[#5C574C] hover:bg-cream-200 border border-line'
                  }`}
                >
                  {item.title.split(' ')[1] || item.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
