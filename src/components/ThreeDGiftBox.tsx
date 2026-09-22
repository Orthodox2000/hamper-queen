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
      <span className="text-[7px] font-sans font-bold tracking-widest text-[#F3E5AB] uppercase">
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
  const [rotateX, setRotateX] = useState(-15);
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

  // Interactive mouse tilt tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsAutoRotating(false);
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateY(Math.max(-45, Math.min(45, x * 0.25)));
    setRotateX(Math.max(-35, Math.min(15, -y * 0.25 - 15)));
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsAutoRotating(true);
    setRotateX(-15);
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
                <div className="w-full bg-gradient-to-r from-[#20003B] via-[#4A0072] to-[#20003B] border border-amber-300/80 rounded px-1.5 py-0.5 shadow-sm flex items-center justify-between text-[8px] text-amber-200 font-bold transition-transform duration-300 ease-out hover:[transform:translateZ(22px)_scale(1.03)]">
                  <span className="truncate">CADBURY SILK</span>
                  <span className="text-[7px] text-white/90">Pure Cocoa</span>
                </div>
              </div>

              {/* Nestled Item 2: Ferrero Rocher Spheres + Wax Seal */}
              <div className={`w-full z-10 ${isOpen ? 'item-pop' : 'opacity-0'}`} style={popDelay(1)}>
                <div className="w-full flex items-center justify-between gap-1 transition-transform duration-300 ease-out hover:[transform:translateZ(22px)_scale(1.03)]">
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
                <div className="w-full bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 border border-rose-400/50 rounded px-1 py-0.5 text-center text-[7px] text-rose-200 font-semibold tracking-wider uppercase transition-transform duration-300 ease-out hover:[transform:translateZ(22px)_scale(1.03)]">
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

          {/* 3D Box LID (Tilts and lifts when open) */}
          <div
            className="absolute inset-0 transition-all duration-700 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: 'top center',
              transform: isOpen
                ? `translateY(${lidLift}px) rotateX(-115deg) translateZ(15px)`
                : 'translateY(0px)',
            }}
          >
            {/* Top Face of the Lid */}
            <div
              className={`absolute bg-gradient-to-br ${theme.lidTop} ${theme.faceBorder} shadow-lg flex items-center justify-center`}
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

              {/* 3D Ribbon Rosette Bow on Top */}
              <div className="relative z-10 w-9 h-9 rounded-full bg-gradient-to-br from-[#DFBA54] via-[#F3E5AB] to-[#996515] border border-white shadow-md flex items-center justify-center">
                <Crown className="w-4 h-4 text-[#5C0A10]" />
              </div>
            </div>

            {/* Lid Rim / Skirt (front, back, left, right) */}
            <div
              className={`absolute bg-[#3B060B] ${theme.faceBorder}`}
              style={{ transform: `translateZ(${half + 1}px) translateY(-1px)`, width: `${lid}px`, height: `${rimH}px`, borderRadius: '2px' }}
            />
            <div
              className={`absolute bg-[#1E0430] ${theme.faceBorder}`}
              style={{ transform: `rotateY(180deg) translateZ(${half + 1}px) translateY(-1px)`, width: `${lid}px`, height: `${rimH}px` }}
            />
            <div
              className={`absolute bg-[#240640] ${theme.faceBorder}`}
              style={{ transform: `rotateY(-90deg) translateZ(${half + 1}px) translateY(-1px)`, width: `${lid}px`, height: `${rimH}px` }}
            />
            <div
              className={`absolute bg-[#2A0748] ${theme.faceBorder}`}
              style={{ transform: `rotateY(90deg) translateZ(${half + 1}px) translateY(-1px)`, width: `${lid}px`, height: `${rimH}px` }}
            />
          </div>

          {/* 3D Box BASE FACES */}

          {/* Front Face */}
          <div
            className={`absolute bg-gradient-to-b ${theme.frontFace} ${theme.faceBorder} shadow-md flex flex-col items-center justify-center p-2`}
            style={{ width: `${faceW}px`, height: `${faceH}px`, transform: `translateZ(${faceZ}px) translateY(${faceDrop}px)`, borderRadius: '4px' }}
          >
            {/* Vertical Ribbon */}
            <div className="absolute w-5 h-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] opacity-90" />

            {/* Front Royal Medallion */}
            <FaceEmblem theme={theme} logoClass={preset.logo} withLabel />
          </div>

          {/* Back Face */}
          <div
            className={`absolute ${theme.backFace} ${theme.faceBorder} flex items-center justify-center`}
            style={{ width: `${faceW}px`, height: `${faceH}px`, transform: `rotateY(180deg) translateZ(${faceZ}px) translateY(${faceDrop}px)` }}
          >
            <div className="w-5 h-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] opacity-75" />
            <FaceEmblem theme={theme} logoClass={preset.logo} />
          </div>

          {/* Left Face */}
          <div
            className={`absolute ${theme.leftFace} ${theme.faceBorder} flex items-center justify-center`}
            style={{ width: `${faceW}px`, height: `${faceH}px`, transform: `rotateY(-90deg) translateZ(${faceZ}px) translateY(${faceDrop}px)` }}
          >
            <div className="w-5 h-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] opacity-80" />
            <FaceEmblem theme={theme} logoClass={preset.logo} />
          </div>

          {/* Right Face */}
          <div
            className={`absolute ${theme.rightFace} ${theme.faceBorder} flex items-center justify-center`}
            style={{ width: `${faceW}px`, height: `${faceH}px`, transform: `rotateY(90deg) translateZ(${faceZ}px) translateY(${faceDrop}px)` }}
          >
            <div className="w-5 h-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] opacity-80" />
            <FaceEmblem theme={theme} logoClass={preset.logo} />
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