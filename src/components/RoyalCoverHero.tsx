'use client';

/**
 * RoyalCoverHero.tsx
 * -----------------------------------------------------------------------------
 * Homepage hero — a single rounded, softly-lit card (same idea as the reference
 * store) instead of a full-bleed dark scene.
 *
 *  - Left: eyebrow, headline, lede, three actions, three trust points.
 *  - Right: the interactive 3D container with ONE segmented type switch,
 *    colour dots and (for boxes) shape chips — all on one calm panel.
 *  - Background photography crossfades behind the card at low contrast. The
 *    next scene is preloaded before it is shown, rotation pauses while the tab
 *    is hidden and is disabled for prefers-reduced-motion, so nothing flashes
 *    or reflows.
 */

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, MessageCircle, ChevronDown, Gift, Sparkles, Zap, ShieldCheck, Tag } from 'lucide-react';
import { LanguageMode } from '../types';
import { royaleLogger } from '../utils/logger';
import { HAMPER_QUEEN_OFFICIAL_CONTACT } from '../data/hamperQueenCatalog';

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
const SCENE_INTERVAL_MS = 9000;

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

const HERO_BACKGROUND_SCENES = [
  { id: 'sovereign_hamper', label: 'Artisan Hamper', url: '/packaging/packaging-small-box.jpg', alt: 'Opulent celebration hamper with fine ribbons and artisanal chocolates' },
  { id: 'velvet_roses_bouquet', label: 'Handcrafted Bouquet', url: '/hero/hero-roses-bouquet.jpg', alt: 'Hand-tied velvet crimson rose bouquet wrapped in luxury florist paper' },
  { id: 'bespoke_gourmet_crate', label: 'Luxury Gift Box', url: '/packaging/packaging-medium-box.jpg', alt: 'Luxury custom presentation gift crate with gold-tied ribbons and warm light' },
  { id: 'candlelit_keepsake', label: 'Keepsake & Lights', url: '/packaging/packaging-heart-bouquet.jpg', alt: 'Romantic candlelit photo and chocolate hamper with fairy lights' },
  { id: 'imperial_trunk', label: 'Imperial Trunk', url: '/packaging/packaging-xl-trunk.jpg', alt: 'Royal vintage leather and gold celebration trunk hamper' },
];

const TRUST_POINTS = [
  { icon: Zap, title: 'Same-day dispatch', sub: 'Fast Mumbai delivery' },
  { icon: ShieldCheck, title: 'Free delivery', sub: `On orders above ₹${HAMPER_QUEEN_OFFICIAL_CONTACT.freeDeliveryThreshold}` },
  { icon: Tag, title: `From ₹${HAMPER_QUEEN_OFFICIAL_CONTACT.minOrder}`, sub: 'Pocket-friendly to royal' },
];

/** First hex colour found in a Tailwind gradient string, used as a swatch. */
const swatchFromGradient = (g: string): string => {
  const hits = g.match(/#[0-9A-Fa-f]{6}/g);
  return hits ? hits[Math.min(1, hits.length - 1)] : '#4b2a63';
};

interface SwatchOption { id: string; label: string; color: string }

export const RoyalCoverHero: React.FC<RoyalCoverHeroProps> = ({
  onExploreCatalog,
  onOpenCustomised,
}) => {
  const [activeScene, setActiveScene] = useState(0);
  const [shownScene, setShownScene] = useState(0);
  const [mountedScenes, setMountedScenes] = useState<number[]>([0]);
  const [loadedScenes, setLoadedScenes] = useState<number[]>([]);

  const [boxVariant, setBoxVariant] = useState<BoxVariant>('royal');
  const [boxShape, setBoxShape] = useState<BoxShape>('cube');
  const [boxType, setBoxType] = useState<ContainerType>('box');
  const [bouquetPalette, setBouquetPalette] = useState<string>('crimson');
  const [trayFinish, setTrayFinish] = useState<string>('ethnic');
  const [bagColor, setBagColor] = useState<string>('obsidian');

  // Rotate scenes (skipped for reduced motion, paused while the tab is hidden)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setActiveScene((prev) => (prev + 1) % HERO_BACKGROUND_SCENES.length);
    }, SCENE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  // Preload the NEXT scene as soon as the current one is active
  useEffect(() => {
    const next = (activeScene + 1) % HERO_BACKGROUND_SCENES.length;
    setMountedScenes((m) => (m.includes(next) ? m : [...m, next]));
  }, [activeScene]);

  // Only swap once the incoming image has loaded — the old one stays visible until then
  useEffect(() => {
    if (loadedScenes.includes(activeScene)) setShownScene(activeScene);
  }, [activeScene, loadedScenes]);

  const markLoaded = useCallback((idx: number) => {
    setLoadedScenes((l) => (l.includes(idx) ? l : [...l, idx]));
  }, []);

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Hi Ms. Supriya / Hamper Queen! I need a customized luxury hamper / bouquet urgently. Please share quick options!`
    );
    window.open(`https://wa.me/91${HAMPER_QUEEN_OFFICIAL_CONTACT.phone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleScrollToContent = () => {
    const catalogEl = document.getElementById('hamper-queen-catalog-section');
    if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else onExploreCatalog();
  };

  const changeType = (ct: ContainerType) => {
    if (ct === boxType) return;
    setBoxType(ct);
    royaleLogger.action('CoverHero', `Switched 3D container type to: ${ct}`);
  };

  // Swatches for whichever container type is active
  const swatches: SwatchOption[] =
    boxType === 'box'
      ? BOX_THEME_VARIANTS.map((th) => ({ id: th.id, label: th.label, color: swatchFromGradient(th.frontFace) }))
      : boxType === 'bouquet'
        ? BOUQUET_PALETTE_LIST.map((p) => ({ id: p.id, label: p.label, color: p.swatch }))
        : boxType === 'tray'
          ? TRAY_FINISH_LIST.map((p) => ({ id: p.id, label: p.label, color: p.swatch }))
          : BAG_COLOR_LIST.map((p) => ({ id: p.id, label: p.label, color: p.swatch }));

  const activeSwatch = boxType === 'box' ? boxVariant : boxType === 'bouquet' ? bouquetPalette : boxType === 'tray' ? trayFinish : bagColor;

  const pickSwatch = (id: string, label: string) => {
    if (boxType === 'box') setBoxVariant(id as BoxVariant);
    else if (boxType === 'bouquet') setBouquetPalette(id);
    else if (boxType === 'tray') setTrayFinish(id);
    else setBagColor(id);
    royaleLogger.action('CoverHero', `Switched ${boxType} colour to: ${label}`);
  };

  const activeSwatchLabel = swatches.find((s) => s.id === activeSwatch)?.label;

  return (
    <section id="homepage-hero" className="surface-warm section-tight pb-8 sm:pb-12">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[2rem] bg-white/50 shadow-soft ring-1 ring-line p-5 sm:p-10 lg:p-12">
          {/* Soft photography, faded out towards the copy so text stays crisp */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-full lg:w-3/5 opacity-20 lg:opacity-30 [mask-image:linear-gradient(to_left,black_15%,transparent_85%)]"
          >
            {mountedScenes.map((idx) => {
              const scene = HERO_BACKGROUND_SCENES[idx];
              return (
                <Image
                  key={scene.id}
                  src={scene.url}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  priority={idx === 0}
                  onLoad={() => markLoaded(idx)}
                  className={`object-cover object-center transition-opacity duration-[1400ms] ease-in-out ${
                    shownScene === idx ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              );
            })}
          </div>
          {/* Decorative glows (same device as the reference hero) */}
          <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-gold-200/40 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-blush-100 blur-3xl" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 lg:items-stretch">
            {/* ---------- Copy ---------- */}
            <div className="lg:col-span-7 flex flex-col items-start justify-center gap-8 lg:gap-10">
              <div className="flex w-full flex-col items-start gap-6">
              <span className="eyebrow">
                <Sparkles className="w-3.5 h-3.5 text-gold-700" aria-hidden="true" />
                Experience to remember
              </span>

              <div className="flex flex-col gap-4">
                <h1 className="font-seasons text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] text-ink">
                  Handcrafted luxury{' '}
                  <span className="accent-script block mt-1">hampers &amp; gift boxes</span>
                </h1>
                <p className="text-base sm:text-lg text-stone leading-relaxed max-w-xl">
                  Handcrafted hampers, chocolate bouquets &amp; photo keepsakes packed with love and dispatched same-day across India.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full">
                {onOpenCustomised && (
                  <button id="btn-hero-customise-box" onClick={onOpenCustomised} className="btn btn-primary w-full sm:w-auto">
                    <Gift className="w-4 h-4 text-gold-300" aria-hidden="true" />
                    <span>Customise hamper</span>
                    <ArrowRight className="w-4 h-4 text-gold-300" aria-hidden="true" />
                  </button>
                )}
                <button id="btn-hero-explore" onClick={handleScrollToContent} className="btn btn-ghost flex-1 sm:flex-none">
                  <span>Browse menu</span>
                </button>
                <button id="btn-hero-whatsapp" onClick={handleWhatsAppInquiry} className="btn btn-whatsapp flex-1 sm:flex-none">
                  <MessageCircle className="w-4 h-4 fill-white" aria-hidden="true" />
                  <span>WhatsApp</span>
                </button>
              </div>

              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
                {TRUST_POINTS.map(({ icon: Icon, title, sub }) => (
                  <li key={title} className="flex items-center gap-3 rounded-2xl bg-white/80 backdrop-blur shadow-soft ring-1 ring-line p-3">
                    <span className="w-9 h-9 shrink-0 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-ink leading-tight">{title}</span>
                      <span className="block text-xs text-stone leading-snug mt-0.5">{sub}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ---------- 3D configurator: same height as the copy column ---------- */}
            <div className="lg:col-span-5 flex">
              <div className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-3xl bg-white/85 p-4 shadow-lift ring-1 ring-line backdrop-blur-md sm:p-5 lg:max-w-none">
                {/* Container type: ONE segmented control */}
                <div
                  role="radiogroup"
                  aria-label="Choose 3D container"
                  className="grid w-full grid-cols-4 gap-1 rounded-full bg-cream-100 p-1 shadow-[inset_0_0_0_1px_var(--color-line)]"
                >
                  {CONTAINER_ORDER.map((ct) => (
                    <button
                      key={ct}
                      role="radio"
                      aria-checked={boxType === ct}
                      onClick={() => changeType(ct)}
                      className={`whitespace-nowrap rounded-full px-1 py-2 text-xs font-semibold transition-all duration-250 sm:text-sm ${
                        boxType === ct ? 'bg-ink text-gold-100 shadow-soft' : 'text-cocoa hover:bg-white hover:text-ink'
                      }`}
                    >
                      {CONTAINER_LABELS[ct]}
                    </button>
                  ))}
                </div>

                {/* Colour dots + selected name on one line */}
                <div className="flex items-center justify-between gap-3">
                  <div role="radiogroup" aria-label="Choose colour" className="flex flex-wrap items-center gap-2.5">
                    {swatches.map((s) => (
                      <button
                        key={s.id}
                        role="radio"
                        aria-checked={activeSwatch === s.id}
                        aria-label={s.label}
                        title={s.label}
                        onClick={() => pickSwatch(s.id, s.label)}
                        className={`h-7 w-7 rounded-full transition-transform duration-250 hover:scale-110 ${
                          activeSwatch === s.id ? 'scale-110 ring-2 ring-gold-700 ring-offset-2' : 'ring-1 ring-black/10'
                        }`}
                        style={{ background: s.color }}
                      />
                    ))}
                  </div>
                  <p className="shrink-0 text-xs font-semibold text-cocoa" aria-live="polite">{activeSwatchLabel}</p>
                </div>

                {/* Fixed-height slot: box shapes, or a caption for other types (no layout shift) */}
                <div className="flex h-9 items-center">
                  {boxType === 'box' ? (
                    <div role="radiogroup" aria-label="Box shape" className="flex w-full items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {(Object.keys(BOX_SHAPES) as BoxShape[]).map((sh) => (
                        <button
                          key={sh}
                          role="radio"
                          aria-checked={boxShape === sh}
                          onClick={() => {
                            setBoxShape(sh);
                            royaleLogger.action('CoverHero', `Switched 3D box shape to: ${sh}`);
                          }}
                          className={`chip shrink-0 px-3 text-xs ${boxShape === sh ? 'chip-active' : ''}`}
                        >
                          {BOX_SHAPES[sh].label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-stone">Hand-finished and ready to gift. Tap the gift to peek inside.</p>
                  )}
                </div>

                {/* Stage: its own background container, so the box always sits centred and well-sized */}
                <div className="relative min-h-[330px] flex-1 overflow-hidden rounded-2xl bg-[radial-gradient(ellipse_at_50%_58%,#ffffff_0%,#fdf6e6_55%,#f6e9cd_100%)] shadow-[inset_0_0_0_1px_var(--color-gold-200),inset_0_-24px_40px_-24px_rgba(140,104,33,0.25)]">
                  <ThreeDGiftBox
                    compact
                    variant={boxVariant}
                    size="md"
                    shape={boxShape}
                    type={boxType}
                    bouquetPalette={bouquetPalette}
                    trayFinish={trayFinish}
                    bagColor={bagColor}
                  />
                </div>

                <div className="flex items-center justify-between gap-3 text-xs text-stone">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-400" aria-hidden="true" />
                    Drag to rotate
                  </span>
                  {onOpenCustomised && (
                    <button onClick={onOpenCustomised} className="font-semibold text-gold-700 underline-offset-4 hover:text-ink hover:underline">
                      Build your own →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleScrollToContent}
            className="group inline-flex items-center gap-2 text-sm font-medium text-cocoa hover:text-ink transition-colors"
          >
            <span>Explore the 12 birthday hampers &amp; bouquets</span>
            <ChevronDown className="w-4 h-4 text-gold-700 transition-transform duration-250 group-hover:translate-y-0.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};
