/**
 * ThreeDGiftBox.tsx
 * -----------------------------------------------------------------------------
 * Pure-CSS 3D gift box used as the hero centerpiece.
 *
 * Behaviour:
 *  - Gentle auto-rotation (rotateY) until the pointer engages the box.
 *  - Clicking toggles the unbox state: the lid lifts and tilts backward so its
 *    decorated top stays visible (never inverting), the camera tilts up to look
 *    into the box, and the nestled items rise above the velvet bed.
 *  - All four side faces are fully dressed (themed gradient + gold ribbon +
 *    royal medallion + brand label) so no side ever reads as "empty".
 *  - Lid skirts and ribbons pick up the active theme colors for contrast.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Gift, Crown } from 'lucide-react';
import { BOX_THEMES, BOX_SIZE_PRESETS, BoxTheme } from '../data/boxThemes';
import { triggerGoldConfetti } from '../utils/confetti';

type BoxSize = 'sm' | 'md' | 'lg';

export type BoxVariant = keyof typeof BOX_THEMES;
export type { BoxSize };

interface ThreeDGiftBoxProps {
  onOpenAtelier?: () => void;
  className?: string;
  variant?: BoxVariant;
  size?: BoxSize;
}

/** Camera tilt used while the box is closed / open. */
const TILT_CLOSED = -15;
const TILT_OPEN = -34;

/* -------------------------------------------------------------------------- */
/* Medallion emblem shared by every face                                       */
/* -------------------------------------------------------------------------- */
interface FaceEmblemProps {
  theme: BoxTheme;
  logoClass: string;
  withLabel?: boolean;
}

const FaceEmblem: React.FC<FaceEmblemProps> = ({ theme, logoClass, withLabel = false }) => (
  <div className="relative z-10 flex flex-col items-center justify-center gap-1">
    <div className={`${logoClass} rounded-full bg-black/50 border ${theme.faceBorder} shadow-md flex items-center justify-center p-0.5 overflow-hidden`}>
      <img src="/hamper.png" alt="Hamper Queen logo" className="w-full h-full object-contain rounded-full" draggable={false} />
    </div>
    {withLabel && (
      <span className="text-[7px] font-sans font-bold tracking-widest text-[#F3E5AB] uppercase text-center px-1 leading-tight">
        Hamper Queen
      </span>
    )}
  </div>
);

export const ThreeDGiftBox: React.FC<ThreeDGiftBoxProps> = ({
  onOpenAtelier,
  className = '',
  variant = 'royal',
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rotateX, setRotateX] = useState(TILT_CLOSED);
  const [rotateY, setRotateY] = useState(30);
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const theme = BOX_THEMES[variant as keyof typeof BOX_THEMES] || BOX_THEMES.royal;
  const preset = BOX_SIZE_PRESETS[size];

  const edge = preset.edge;
  const faceW = edge - 4;
  const faceH = edge - 20;
  const lid = edge + 2;
  const bed = edge - 8;
  const rimH = preset.lidRimH;
  const half = edge / 2;
  const bedZ = half - rimH;
  const faceDrop = Math.round(edge * 0.14);
  const faceZ = half;
  const shadowZ = half + 15;
  const lidLift = Math.round(-edge * 0.75);
  const glowOffsetY = Math.round(-edge * 0.36);
  const plaqueZ = Math.round(half + 20);

  // Gentle auto-rotation when not hovering or interacting
  useEffect(() => {
    if (!isAutoRotating || isHovered) return;
    const interval = setInterval(() => {
      setRotateY((prev) => (prev + 0.6) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoRotating, isHovered]);

  // Tilt the camera up into the box while it is open so items stay visible.
  useEffect(() => {
    setRotateX(isOpen ? TILT_OPEN : TILT_CLOSED);
  }, [isOpen]);

  // Interactive mouse tilt tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsAutoRotating(false);
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateY(Math.max(-45, Math.min(45, x * 0.25)));
    const base = isOpen ? TILT_OPEN : TILT_CLOSED;
    setRotateX(Math.max(-38, Math.min(15, -y * 0.25 + base)));
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsAutoRotating(true);
    setRotateX(isOpen ? TILT_OPEN : TILT_CLOSED);
  };

  const toggleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        triggerGoldConfetti(0.5, 0.4);
      }
      return next;
    });
  };

  const popDelay = (i: number) => ({ '--pop-delay': `${400 + i * 180}ms` } as React.CSSProperties);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* 3D Scene Container with CSS Perspective */}
      <div
        className={`${preset.scene} flex items-center justify-center cursor-grab active:cursor-grabbing`}
        style={{ perspective: `${900 + (size === 'sm' ? 0 : size === 'lg' ? 300 : 200)}px` }}
        onClick={toggleOpen}
        title="Click to Unbox & Explore 3D Royal Gift"
      >
        {/* The 3D Box Assembly */}
        <div
          className="relative transition-transform duration-300 ease-out"
          style={{
            width: `${edge}px`,
            height: `${edge}px`,
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          }}
        >
          {/* Internal Glow When Opened */}
          {isOpen && (
            <div
              className="absolute inset-0 rounded-full blur-xl pointer-events-none transition-all duration-700"
              style={{
                background: 'radial-gradient(circle, rgba(243,229,171,0.95) 0%, rgba(212,175,55,0.4) 60%, transparent 80%)',
                transform: `translateZ(0px) translateY(${glowOffsetY}px) scale(1.6)`,
              }}
            />
          )}

          {/* Authentic Recessed Velvet Bed & Nestled Gifts Inside the Box */}
          {isOpen && (
            <div
              className={`absolute ${theme.boxBorder} shadow-inner flex flex-col items-center justify-between p-2 pointer-events-none transition-all duration-700 [transform-style:preserve-3d]`}
              style={{
                width: `${bed}px`,
                height: `${bed}px`,
                background: `linear-gradient(to bottom, ${theme.bedBg}, #000)`,
                transform: `rotateX(90deg) translateZ(${bedZ}px)`,
                borderRadius: '4px',
              }}
            >
              {/* Shredded Gold Crinkle Bedding Texture */}
              <div className="absolute inset-0 bg-[radial-gradient(#DFBA54_1px,transparent_1px)] [background-size:6px_6px] opacity-25" />

              {/* Nestled Item 1: Cadbury Silk Mini Bar */}
              <div className={`w-full z-10 ${isOpen ? 'item-pop' : 'opacity-0'}`} style={popDelay(0)}>
                <div className="w-full bg-gradient-to-r from-[#20003B] via-[#4A0072] to-[#20003B] border border-amber-300/80 rounded px-1.5 py-0.5 shadow-sm flex items-center justify-between text-[8px] text-amber-200 font-bold">
                  <span className="truncate">CADBURY SILK</span>
                  <span className="text-[7px] text-white/90">Pure Cocoa</span>
                </div>
              </div>

              {/* Nestled Item 2: Ferrero Rocher Spheres + Wax Seal */}
              <div className={`w-full z-10 ${isOpen ? 'item-pop' : 'opacity-0'}`} style={popDelay(1)}>
                <div className="w-full flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-amber-600 to-yellow-500 rounded px-1.5 py-0.5 border border-amber-200 text-[7.5px] font-bold text-black shadow-xs">
                    <span>✨</span>
                    <span>Ferrero</span>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-[#800E17] border border-amber-300 flex items-center justify-center text-[7px] font-cinzel font-bold text-amber-200 shadow-sm">
                    HQ
                  </div>
                  <div className="flex items-center gap-1 bg-[#1A1A1A] rounded px-1.5 py-0.5 border border-white/30 text-[7.5px] text-white shadow-xs">
                    <span>💡</span>
                    <span>Lights</span>
                  </div>
                </div>
              </div>

              {/* Nestled Item 3: Velvet Rose Keepsake */}
              <div className={`w-full z-10 ${isOpen ? 'item-pop' : 'opacity-0'}`} style={popDelay(2)}>
                <div className="w-full bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 border border-rose-400/50 rounded px-1 py-0.5 text-center text-[7px] text-rose-200 font-semibold tracking-wider uppercase">
                  🌹 Hand-Tied Ribbon & Scribe Note
                </div>
              </div>
            </div>
          )}

          {/* Clean, Non-Crooked Unboxing Plaque Floating Gently Above Box */}
          {isOpen && (
            <div
              className="absolute -top-16 inset-x-[-32px] pointer-events-none transition-all duration-700 ease-out flex flex-col items-center justify-center"
              style={{
                transformStyle: 'preserve-3d',
                transform: `translateZ(${plaqueZ}px)`,
              }}
            >
              <div className="px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-[#DFBA54] text-center shadow-2xl">
                <div className="flex items-center justify-center gap-1.5 text-[#F3E5AB] text-[10.5px] font-cinzel font-bold tracking-wider uppercase">
                  <Crown className="w-3.5 h-3.5 text-[#DFBA54]" />
                  <span>Atelier Hamper Unboxed</span>
                </div>
                <div className="text-[9px] text-white/80 font-sans mt-0.5">
                  Cadbury Silk • Ferrero • Fairy Lights • Wax Seal
                </div>
              </div>
            </div>
          )}

          {/* 3D BOX LID — lifts and tilts backward; decorated top stays upright */}
          <div
            className="absolute inset-0 transition-all duration-700 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: 'top center',
              transform: isOpen
                ? `translateY(${lidLift}px) rotateX(-72deg) translateZ(8px)`
                : 'translateY(0px)',
            }}
          >
            {/* Top Face of the Lid (brand-ribbon rosette) */}
            <div
              className={`absolute bg-gradient-to-br ${theme.lidTop} ${theme.faceBorder} shadow-lg flex items-center justify-center overflow-hidden`}
              style={{
                width: `${lid}px`,
                height: `${lid}px`,
                transform: `rotateX(90deg) translateZ(${half}px)`,
                borderRadius: '6px',
              }}
            >
              {/* Gold Satin Cross Ribbon */}
              <div className="absolute w-6 h-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] shadow-sm" />
              <div className="absolute h-6 w-full bg-gradient-to-b from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] shadow-sm" />

              {/* 3D Ribbon Rosette Bow on Top (theme accent) */}
              <div
                className="relative z-10 w-9 h-9 rounded-full border border-white shadow-md flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${theme.ribbonHex}, #F3E5AB 55%, #996515)` }}
              >
                <Crown className="w-4 h-4 text-[#5C0A10]" />
              </div>
            </div>

            {/* Underside of the Lid (velvet inner) — keeps the lid from ever looking empty */}
            <div
              className={`absolute ${theme.faceBorder} flex items-center justify-center overflow-hidden`}
              style={{
                width: `${lid}px`,
                height: `${lid}px`,
                transform: `rotateX(90deg) translateZ(${half}px) rotateY(180deg)`,
                background: `linear-gradient(to bottom, ${theme.bedBg}, #000)`,
                borderRadius: '6px',
              }}
            >
              <div className="w-6 h-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] opacity-60" />
              <div className="absolute inset-2 rounded border border-dashed border-[#DFBA54]/40" />
            </div>

            {/* Lid Rim / Skirt — themed to match each side of the base */}
            <div
              className={`absolute ${theme.faceBorder}`}
              style={{
                background: `linear-gradient(to bottom, ${theme.ribbonHex}, ${theme.backFace})`,
                transform: `translateZ(${half + 1}px) translateY(-1px)`,
                width: `${lid}px`,
                height: `${rimH}px`,
                borderRadius: '2px',
              }}
            />
            <div
              className={`absolute ${theme.faceBorder}`}
              style={{
                background: theme.backFace,
                transform: `rotateY(180deg) translateZ(${half + 1}px) translateY(-1px)`,
                width: `${lid}px`,
                height: `${rimH}px`,
              }}
            />
            <div
              className={`absolute ${theme.faceBorder}`}
              style={{
                background: theme.leftFace,
                transform: `rotateY(-90deg) translateZ(${half + 1}px) translateY(-1px)`,
                width: `${lid}px`,
                height: `${rimH}px`,
              }}
            />
            <div
              className={`absolute ${theme.faceBorder}`}
              style={{
                background: theme.rightFace,
                transform: `rotateY(90deg) translateZ(${half + 1}px) translateY(-1px)`,
                width: `${lid}px`,
                height: `${rimH}px`,
              }}
            />
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* 3D BOX BASE FACES — ribbon, themed accent band, medallion, label  */}
          {/* ---------------------------------------------------------------- */}

          {/* Front Face */}
          <div
            className={`absolute bg-gradient-to-b ${theme.frontFace} ${theme.faceBorder} shadow-md flex flex-col items-center justify-center p-2`}
            style={{ width: `${faceW}px`, height: `${faceH}px`, transform: `translateZ(${faceZ}px) translateY(${faceDrop}px)`, borderRadius: '4px' }}
          >
            <div className="absolute w-5 h-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] opacity-90" />
            <div className="absolute bottom-1.5 inset-x-2 h-1 rounded-full opacity-70" style={{ backgroundColor: theme.ribbonHex }} />
            <FaceEmblem theme={theme} logoClass={preset.logo} withLabel />
          </div>

          {/* Back Face */}
          <div
            className={`absolute ${theme.faceBorder} flex flex-col items-center justify-center overflow-hidden`}
            style={{
              width: `${faceW}px`,
              height: `${faceH}px`,
              transform: `rotateY(180deg) translateZ(${faceZ}px) translateY(${faceDrop}px)`,
              background: `linear-gradient(to bottom, ${theme.backFace}, ${theme.leftFace})`,
              borderRadius: '4px',
            }}
          >
            <div className="w-5 h-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] opacity-75" />
            <div className="absolute top-1.5 inset-x-2 h-1 rounded-full opacity-70" style={{ backgroundColor: theme.ribbonHex }} />
            <FaceEmblem theme={theme} logoClass={preset.logo} />
          </div>

          {/* Left Face */}
          <div
            className={`absolute ${theme.faceBorder} flex flex-col items-center justify-center overflow-hidden`}
            style={{
              width: `${faceW}px`,
              height: `${faceH}px`,
              transform: `rotateY(-90deg) translateZ(${faceZ}px) translateY(${faceDrop}px)`,
              background: `linear-gradient(to bottom, ${theme.leftFace}, ${theme.backFace})`,
              borderRadius: '4px',
            }}
          >
            <div className="w-5 h-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] opacity-80" />
            <div className="absolute bottom-1.5 inset-x-2 h-1 rounded-full opacity-70" style={{ backgroundColor: theme.ribbonHex }} />
            <FaceEmblem theme={theme} logoClass={preset.logo} withLabel />
          </div>

          {/* Right Face */}
          <div
            className={`absolute ${theme.faceBorder} flex flex-col items-center justify-center overflow-hidden`}
            style={{
              width: `${faceW}px`,
              height: `${faceH}px`,
              transform: `rotateY(90deg) translateZ(${faceZ}px) translateY(${faceDrop}px)`,
              background: `linear-gradient(to bottom, ${theme.rightFace}, ${theme.backFace})`,
              borderRadius: '4px',
            }}
          >
            <div className="w-5 h-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] opacity-80" />
            <div className="absolute top-1.5 inset-x-2 h-1 rounded-full opacity-70" style={{ backgroundColor: theme.ribbonHex }} />
            <FaceEmblem theme={theme} logoClass={preset.logo} withLabel />
          </div>

          {/* Bottom Face */}
          <div
            className={`absolute ${theme.bottomFace} shadow-2xl`}
            style={{ width: `${faceW}px`, height: `${faceW}px`, transform: `rotateX(-90deg) translateZ(${half}px)` }}
          />

          {/* Shadow Below Box */}
          <div
            className={`absolute ${preset.shadow} bg-black/60 rounded-full blur-xl pointer-events-none`}
            style={{ transform: `rotateX(90deg) translateZ(-${shadowZ}px)` }}
          />
        </div>
      </div>

      {/* Interactive Trigger & Instruction Badge */}
      <div className="flex flex-col items-center gap-2 mt-2">
        <button
          onClick={toggleOpen}
          className="px-4 py-1.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-[#DFBA54]/60 text-[#F3E5AB] text-xs font-cinzel font-bold tracking-wider uppercase transition-all shadow-lg flex items-center gap-1.5 cursor-pointer transform hover:scale-105"
        >
          <Gift className="w-3.5 h-3.5 text-[#DFBA54]" />
          <span>{isOpen ? 'Close 3D Gift Box' : 'Click to Unbox 3D Gift'}</span>
        </button>

        <div className="flex items-center gap-3 text-[10px] text-white/70 font-sans tracking-wide">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DFBA54] animate-ping" />
            <span>Interactive 3D View (Drag to Rotate)</span>
          </span>
          {onOpenAtelier && (
            <button
              onClick={onOpenAtelier}
              className="text-[#F3E5AB] hover:underline font-semibold cursor-pointer"
            >
              Build Your Own →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};