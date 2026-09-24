/**
 * RoyalCoverHero.tsx
 * -----------------------------------------------------------------------------
 * Full-viewport homepage hero.
 *
 *  - Full-width scene strip (all breakpoints) with centered founder line below.
 *  - Lightweight background imagery (q=45&w=1200) with a shimmer skeleton
 *    until each next/image finishes loading; only the first scene is priority.
 *  - Right column hosts the interactive ThreeDGiftBox; box size follows the
 *    selected theme variant via BOX_VARIANT_SIZES.
 */

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, MessageCircle, ChevronDown, Image as ImageIcon, Gift, Sparkles, MapPin, Zap, ShieldCheck, Crown } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { LanguageMode } from '../types';
import { royaleLogger } from '../utils/logger';
import { HAMPER_QUEEN_OFFICIAL_CONTACT } from '../data/hamperQueenCatalog';
import { triggerGoldConfetti } from '../utils/confetti';
import { ThreeDGiftBox, type BoxVariant } from './ThreeDGiftBox';
import {
  BOX_THEME_VARIANTS,
  BOX_VARIANT_SIZES,
  BOX_SHAPES,
  BOUQUET_PALETTE_LIST,
  TRAY_FINISH_LIST,
  BAG_COLOR_LIST,
  CONTAINER_LABELS,
  type BoxShape,
  type ContainerType,
} from '../data/boxThemes';

const CONTAINER_ORDER: ContainerType[] = ['box', 'bouquet', 'tray', 'bag'];

interface RoyalCoverHeroProps {
  language: LanguageMode;
  onStartBuilderWithInspiration?: (insp?: any) => void;
  onExploreCatalog: () => void;
  onExploreInspirations?: () => void;
  onOpenScribe?: () => void;
  onOpenCustomised?: () => void;
  onOpenBooking?: () => void;
  onOpenAtelier?: () => void;
}

// Curated high-resolution background scenes (downscaled/sharper params for a lighter, faster hero)
const HERO_BACKGROUND_SCENES = [
  {
    id: 'sovereign_hamper',
    label: 'Artisan Hamper',
    url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=45&w=1200&auto=format&fit=crop',
    alt: 'Opulent celebration hamper with fine ribbons and artisanal chocolates',
  },
  {
    id: 'velvet_roses_bouquet',
    label: 'Handcrafted Bouquet',
    url: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=45&w=1200&auto=format&fit=crop',
    alt: 'Hand-tied velvet crimson rose bouquet wrapped in luxury florist paper',
  },
  {
    id: 'bespoke_gourmet_crate',
    label: 'Luxury Gift Box',
    url: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=45&w=1200&auto=format&fit=crop',
    alt: 'Luxury custom presentation gift crate with gold-tied ribbons and warm light',
  },
  {
    id: 'candlelit_keepsake',
    label: 'Keepsake & Lights',
    url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=45&w=1200&auto=format&fit=crop',
    alt: 'Romantic candlelit photo and chocolate hamper with fairy lights',
  },
  {
    id: 'imperial_trunk',
    label: 'Imperial Trunk',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=45&w=1200&auto=format&fit=crop',
    alt: 'Royal vintage leather and gold celebration trunk hamper',
  },
];

export const RoyalCoverHero: React.FC<RoyalCoverHeroProps> = ({
  language,
  onExploreCatalog,
  onOpenCustomised,
  onOpenBooking,
  onOpenAtelier,
}) => {
  const t = TRANSLATIONS[language];
  const [activeBgIdx, setActiveBgIdx] = useState<number>(0);
  const [boxVariant, setBoxVariant] = useState<BoxVariant>('royal');
  const [boxShape, setBoxShape] = useState<BoxShape>('cube');
  const [boxType, setBoxType] = useState<ContainerType>('box');
  const [bouquetPalette, setBouquetPalette] = useState<string>('crimson');
  const [trayFinish, setTrayFinish] = useState<string>('ethnic');
  const [bagColor, setBagColor] = useState<string>('obsidian');
  const [bgLoaded, setBgLoaded] = useState<boolean>(false);

  const currentBg = HERO_BACKGROUND_SCENES[activeBgIdx] || HERO_BACKGROUND_SCENES[0];

  const handleSelectBg = (idx: number) => {
    setActiveBgIdx(idx);
    setBgLoaded(false);
    triggerGoldConfetti(0.5, 0.4);
    royaleLogger.action('CoverHero', `Switched background scene to: ${HERO_BACKGROUND_SCENES[idx].label}`);
  };

  // Auto-rotate the background every 10s (no selection UI â€” decor only).
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBgIdx((prev) => (prev + 1) % HERO_BACKGROUND_SCENES.length);
      setBgLoaded(false);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleWhatsAppInquiry = () => {
    triggerGoldConfetti(0.5, 0.5);
    const text = encodeURIComponent(
      `Hi Ms. Supriya / Hamper Queen! I need a customized luxury hamper / bouquet urgently. Please share quick options!`
    );
    window.open(`https://wa.me/91${HAMPER_QUEEN_OFFICIAL_CONTACT.phone}?text=${text}`, '_blank');
  };

  const handleScrollToContent = () => {
    triggerGoldConfetti(0.5, 0.5);
    const catalogEl = document.getElementById('hamper-queen-catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      onExploreCatalog();
    }
  };

  return (
    <section 
      id="homepage-hero"
      className="relative w-full min-h-[86dvh] text-white flex flex-col justify-between overflow-x-hidden select-none"
    >
      {/* 100dvh Full Page Background Image with Crossfade */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#241B12] via-[#120E0A] to-[#0A0704]" />
        <div
          key={`skeleton-${currentBg.url}`}
          className={`absolute inset-0 hq-skeleton transition-opacity duration-700 ${bgLoaded ? 'opacity-0' : 'opacity-100'}`}
        />
        <Image
          key={currentBg.url}
          src={currentBg.url}
          alt={currentBg.alt}
          referrerPolicy="no-referrer"
          fill
          sizes="100vw"
          priority={activeBgIdx === 0}
          onLoad={() => setBgLoaded(true)}
          className={`object-cover object-center scale-[1.02] transition-all duration-1000 ease-out ${bgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Luminous & High-Contrast Scrim to ensure crisp readability */}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.65)_100%)]" />
      </div>

      {/* Main Hero Stage: Balanced 2-Column Responsive Layout */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 my-auto py-5 sm:py-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: High-Impact Mission, Value Pitch & Actions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-3 sm:space-y-4">
            
            {/* Value & Delivery Policy Banner */}
            <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/60 text-[#F3E5AB] text-xs font-cinzel font-bold tracking-wider uppercase shadow-md">
              <Zap className="w-3.5 h-3.5 text-[#DFBA54] animate-pulse" />
              <span>Experience to remember</span>
             
            </div>

            {/* Main Headline */}
            <div className="space-y-2 max-w-2xl">
              <h1 className="font-seasons text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] break-words">
                Handcrafted Luxury <br className="hidden sm:inline" />
                <span className="text-[#F3E5AB] italic font-normal">Hampers & Gift Boxes</span>
              </h1>

              <p className="font-sans text-sm sm:text-base text-[#EDE8DF] leading-relaxed max-w-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-normal">
                Handcrafted hampers, chocolate bouquets &amp; photo keepsakes â€” packed with love and dispatched same-day across India.
              </p>
            </div>

            {/* Value Highlights Row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-xl text-xs">
              <div className="p-2.5 rounded-xl bg-black/55 backdrop-blur-md border border-white/15 flex flex-col sm:flex-row items-center sm:items-start gap-1.5 sm:gap-2 text-center sm:text-left">
                <Zap className="w-4 h-4 text-[#DFBA54] shrink-0" />
                <div>
                  <span className="font-bold text-white block text-[11px] sm:text-xs">Same-Day Dispatch</span>
                  <span className="text-[10px] text-white/70">Fast Mumbai delivery</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/55 backdrop-blur-md border border-white/15 flex flex-col sm:flex-row items-center sm:items-start gap-1.5 sm:gap-2 text-center sm:text-left">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block text-[11px] sm:text-xs">Free Delivery</span>
                  <span className="text-[10px] text-emerald-300">On orders above INR 499</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/55 backdrop-blur-md border border-white/15 flex flex-col sm:flex-row items-center sm:items-start gap-1.5 sm:gap-2 text-center sm:text-left">
                <Sparkles className="w-4 h-4 text-[#DFBA54] shrink-0" />
                <div>
                  <span className="font-bold text-white block text-[11px] sm:text-xs">From INR 149</span>
                  <span className="text-[10px] text-amber-200">Pocket to Royal</span>
                </div>
              </div>
            </div>

            {/* Vibrant, Responsive Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3 w-full">
              {/* Customise Box & Bouquet Builder - Primary Vibrant Gold Button */}
              {onOpenCustomised && (
                <button
                  id="btn-hero-customise-box"
                  onClick={() => {
                    triggerGoldConfetti(0.5, 0.5);
                    onOpenCustomised();
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#DFBA54] via-[#F3E5AB] to-[#C5A059] hover:from-[#F3E5AB] hover:to-[#DFBA54] text-[#141414] font-cinzel text-xs sm:text-sm font-black tracking-wider uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(223,186,84,0.4)] flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 border border-white"
                >
                  <Gift className="w-4 h-4 text-[#141414]" />
                  <span>Customise Hamper (Drag &amp; Drop)</span>
                </button>
              )}

              {/* Browse Catalog */}
              <button
                id="btn-hero-explore"
                onClick={handleScrollToContent}
                className="flex-1 sm:flex-none px-5 py-3.5 rounded-xl bg-black/70 hover:bg-black/90 text-white border border-[#DFBA54]/70 font-cinzel text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
              >
                <span>View Menu (From INR 149)</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#DFBA54]" />
              </button>

              {/* WhatsApp Fast Order */}
              <button
                id="btn-hero-whatsapp"
                onClick={handleWhatsAppInquiry}
                className="flex-1 sm:flex-none px-5 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-sans text-xs font-bold tracking-wide transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer border border-[#1EBE5D]"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp Supriya</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive 3D Gift Box Centerpiece (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center pt-4 lg:pt-0">
            <div className="relative p-4 sm:p-6 rounded-3xl bg-black/40 backdrop-blur-md border border-[#D4AF37]/35 shadow-2xl flex flex-col items-center justify-center max-w-sm sm:max-w-md w-full">
              
              {/* Badge on Top of 3D Box */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141414]/90 border border-[#DFBA54]/50 text-[#F3E5AB] text-[10px] font-cinzel font-bold tracking-widest uppercase mb-2.5 shadow-md">
                <Sparkles className="w-3 h-3 text-[#DFBA54]" />
                <span>Interactive 3D Unboxing</span>
              </div>

              {/* Container Type Slider — Box ↔ Bouquet ↔ Tray ↔ Bag */}
              <div className="w-full max-w-[300px] px-1 mb-3">
                <input
                  type="range"
                  min={0}
                  max={3}
                  step={1}
                  value={CONTAINER_ORDER.indexOf(boxType)}
                  onChange={(e) => {
                    const next = CONTAINER_ORDER[parseInt(e.target.value, 10)];
                    if (next !== boxType) {
                      setBoxType(next);
                      triggerGoldConfetti(0.4, 0.3);
                      royaleLogger.action('CoverHero', `Switched 3D container type to: ${next}`);
                    }
                  }}
                  aria-label="Choose 3D container — hampers, bouquet, tray or gift bag"
                  className="w-full accent-[#B8860B] cursor-pointer"
                />
                <div className="flex items-center justify-between mt-1">
                  {CONTAINER_ORDER.map((ct, i) => (
                    <button
                      key={ct}
                      onClick={() => {
                        if (ct !== boxType) {
                          setBoxType(ct);
                          triggerGoldConfetti(0.4, 0.3);
                          royaleLogger.action('CoverHero', `Switched 3D container type to: ${ct}`);
                        }
                      }}
                      title={CONTAINER_LABELS[ct]}
                      className={`px-1.5 py-0.5 rounded-full text-[9px] font-sans font-bold tracking-wider uppercase transition-all cursor-pointer border ${
                        boxType === ct
                          ? 'text-[#F3E5AB] border-[#DFBA54]'
                          : i < CONTAINER_ORDER.indexOf(boxType)
                            ? 'text-white/45 border-white/10'
                            : 'text-white/45 border-white/10 hover:text-white/75'
                      }`}
                    >
                      {CONTAINER_LABELS[ct]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colour swatches — per active container type */}
              {boxType === 'box' ? (
                <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
                  {BOX_THEME_VARIANTS.map((th) => (
                    <button
                      key={th.id}
                      onClick={() => {
                        setBoxVariant(th.id as BoxVariant);
                        triggerGoldConfetti(0.4, 0.35);
                        royaleLogger.action('CoverHero', `Switched 3D box theme to: ${th.label}`);
                      }}
                      title={`${th.label} — ${th.boxLabel}`}
                      className={`px-2 py-0.5 rounded-full text-[9px] font-sans font-bold tracking-wider uppercase transition-all cursor-pointer border ${
                        boxVariant === th.id
                          ? 'bg-[#D4AF37] text-[#141414] border-[#F3E5AB] shadow-xs'
                          : 'bg-black/40 text-white/75 border-white/20 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {th.label}
                    </button>
                  ))}
                </div>
              ) : boxType === 'bouquet' ? (
                <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
                  {BOUQUET_PALETTE_LIST.map((pal) => (
                    <button
                      key={pal.id}
                      onClick={() => {
                        setBouquetPalette(pal.id);
                        triggerGoldConfetti(0.4, 0.35);
                        royaleLogger.action('CoverHero', `Switched bouquet palette to: ${pal.label}`);
                      }}
                      title={`Bouquet palette — ${pal.label}`}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-sans font-bold tracking-wider uppercase transition-all cursor-pointer border ${
                        bouquetPalette === pal.id
                          ? 'bg-[#D4AF37] text-[#141414] border-[#F3E5AB] shadow-xs'
                          : 'bg-black/40 text-white/75 border-white/20 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/40"
                        style={{ background: pal.swatch }}
                      />
                      {pal.label}
                    </button>
                  ))}
                </div>
              ) : boxType === 'tray' ? (
                <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
                  {TRAY_FINISH_LIST.map((fin) => (
                    <button
                      key={fin.id}
                      onClick={() => {
                        setTrayFinish(fin.id);
                        triggerGoldConfetti(0.4, 0.35);
                        royaleLogger.action('CoverHero', `Switched tray finish to: ${fin.label}`);
                      }}
                      title={`Tray finish — ${fin.label}`}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-sans font-bold tracking-wider uppercase transition-all cursor-pointer border ${
                        trayFinish === fin.id
                          ? 'bg-[#D4AF37] text-[#141414] border-[#F3E5AB] shadow-xs'
                          : 'bg-black/40 text-white/75 border-white/20 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/40"
                        style={{ background: fin.swatch }}
                      />
                      {fin.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
                  {BAG_COLOR_LIST.map((col) => (
                    <button
                      key={col.id}
                      onClick={() => {
                        setBagColor(col.id);
                        triggerGoldConfetti(0.4, 0.35);
                        royaleLogger.action('CoverHero', `Switched bag colour to: ${col.label}`);
                      }}
                      title={`Gift bag colour — ${col.label}`}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-sans font-bold tracking-wider uppercase transition-all cursor-pointer border ${
                        bagColor === col.id
                          ? 'bg-[#D4AF37] text-[#141414] border-[#F3E5AB] shadow-xs'
                          : 'bg-black/40 text-white/75 border-white/20 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/40"
                        style={{ background: col.swatch }}
                      />
                      {col.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Box shape chips — only for the hamper box */}
              {boxType === 'box' && (
                <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
                  {(Object.keys(BOX_SHAPES) as BoxShape[]).map((sh) => (
                    <button
                      key={sh}
                      onClick={() => {
                        setBoxShape(sh);
                        triggerGoldConfetti(0.35, 0.3);
                        royaleLogger.action('CoverHero', `Switched 3D box shape to: ${sh}`);
                      }}
                      title={`${BOX_SHAPES[sh].label} — ${sh} proportions`}
                      className={`px-2.5 py-0.5 rounded-full text-[9px] font-sans font-bold tracking-wider uppercase transition-all cursor-pointer border ${
                        boxShape === sh
                          ? 'bg-[#D4AF37] text-[#141414] border-[#F3E5AB] shadow-xs'
                          : 'bg-black/40 text-white/75 border-white/20 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {BOX_SHAPES[sh].label}
                    </button>
                  ))}
                </div>
              )}

              {/* The 3D container — size follows the selected theme variant */}
              <ThreeDGiftBox
                variant={boxVariant}
                size={BOX_VARIANT_SIZES[boxVariant] || 'md'}
                shape={boxShape}
                type={boxType}
                bouquetPalette={bouquetPalette}
                trayFinish={trayFinish}
                bagColor={bagColor}
                onOpenAtelier={onOpenCustomised || onOpenAtelier}
              />

            </div>
          </div>

        </div>
      </div>

      {/* Bottom Dock Bar: Smooth Scroll & Instagram */}
      <div className="relative z-10 w-full bg-black/70 backdrop-blur-md border-t border-white/15 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-seasons text-white/80">
          
          <div className="hidden sm:flex items-center gap-2 text-white/70 tracking-wider text-[11px] uppercase">
            <span className="w-2 h-2 rounded-full bg-[#DFBA54]" />
            <span>Delivering across Mumbai & all Indian pin codes</span>
          </div>

          {/* Center Smooth Scroll Arrow */}
          <button
            onClick={handleScrollToContent}
            className="mx-auto sm:mx-0 flex items-center gap-2 text-xs text-[#F3E5AB] hover:text-white transition-colors cursor-pointer group uppercase tracking-widest font-bold"
          >
            <span>Explore The 12 Birthday Hampers & Bouquets</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-[#DFBA54]" />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-white/70 tracking-wider text-[11px] uppercase">
            <span className="w-2 h-2 rounded-full bg-[#DFBA54]" />
            <span>WhatsApp / Call: +91 {HAMPER_QUEEN_OFFICIAL_CONTACT.phone}</span>
          </div>

        </div>
      </div>

    </section>
  );
};
