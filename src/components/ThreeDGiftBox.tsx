/**
 * ThreeDGiftBox.tsx
 * -----------------------------------------------------------------------------
 * Pure-CSS 3D gift container used as the hero centerpiece.
 *
 * Behaviour:
 *  - Gentle auto-rotation (rotateY) until the box is unboxed or the pointer
 *    engages it. While open the spin halts so every visitor sees the contents.
 *  - Clicking toggles the unbox state: the lid lifts straight up with a gentle
 *    tilt (decorated top stays visible), the camera tilts up to look into the
 *    box, and the nestled items — plus a "much more" chip — rise above the bed.
 *  - All four side faces are fully dressed (themed gradient + gold ribbon +
 *    royal medallion + brand label) so no side ever reads as "empty".
 *  - Lid skirts and ribbons pick up the active theme colors for contrast.
 *  - `shape` changes the box proportions (cube / wide casket / tall trunk / long
 *    keepsake) so different sizes & lengths are shown.
 *  - `type="bouquet"` renders the hand-tied 3D bouquet instead of the trunk.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Gift, Crown, Sparkles } from 'lucide-react';
import {
  BOX_THEMES,
  BOX_SIZE_PRESETS,
  BOX_SHAPES,
  BoxTheme,
  BoxShape,
  ContainerType,
  BouquetPalette,
  BOUQUET_PALETTES,
  TrayFinish,
  TRAY_FINISHES,
  BagColor,
  BAG_COLORS,
} from '../data/boxThemes';
import { triggerGoldConfetti } from '../utils/confetti';

type BoxSize = 'sm' | 'md' | 'lg';

export type BoxVariant = keyof typeof BOX_THEMES;
export type { BoxSize };

interface ThreeDGiftBoxProps {
  onOpenAtelier?: () => void;
  className?: string;
  variant?: BoxVariant;
  size?: BoxSize;
  shape?: BoxShape;
  type?: ContainerType;
  bouquetPalette?: string;
  trayFinish?: string;
  bagColor?: string;
}

/** Camera tilt used while the box is closed / open. */
const TILT_CLOSED = -15;
const TILT_OPEN = -40;

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

/* -------------------------------------------------------------------------- */
/* Hand-tied bouquet assembly — tall & slender, never looks like a trunk.     */
/* Fully recolourable via the selected BouquetPalette (blooms, cone, satin).  */
/* -------------------------------------------------------------------------- */
interface BouquetAssemblyProps {
  palette: BouquetPalette;
  isOpen: boolean;
  W: number;
  H: number;
  coneH: number;
  bloomY: number;
  className: string;
}

const BouquetAssembly: React.FC<BouquetAssemblyProps> = ({
  palette,
  isOpen,
  W,
  H,
  coneH,
  bloomY,
  className,
}) => {
  const bloomZ = 26;
  const lipY = bloomY + 34;
  const blooms = [
    { x: 16, d: -14, s: 34 },
    { x: 28, d: 6, s: 42 },
    { x: 40, d: -6, s: 38 },
    { x: 52, d: 14, s: 46 },
    { x: 64, d: -8, s: 38 },
    { x: 76, d: 8, s: 42 },
    { x: 88, d: -12, s: 30 },
  ];
  return (
    <div className="absolute inset-0 [transform-style:preserve-3d]">
      {/* Leaf fan tucked behind the blooms */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ top: `${lipY}px`, width: `${W * 0.82}px`, height: `${H * 0.34}px` }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute bottom-0"
            style={{
              left: `${12 + i * 17}%`,
              width: `${W * 0.3}px`,
              height: `${H * 0.24}px`,
              background: 'linear-gradient(to top, #3E6723, #5B8A2F 70%, #2E5018)',
              clipPath: 'polygon(50% 0, 100% 100%, 0 100%)',
              borderRadius: '50% 50% 0 0',
              transform: `translateZ(${bloomZ + 30}px) rotate(${i % 2 ? '-' : ''}${6 + i * 3}deg)`,
              opacity: 0.85,
            }}
          />
        ))}
      </div>

      {/* Bloom cluster — staggered across the wrappers lip, palette-tinted */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ top: `${bloomY}px`, width: `${W * 0.9}px`, height: `${H * 0.3}px` }}>
        {blooms.map((b, i) => (
          <div
            key={i}
            className={`absolute rounded-full border border-white/30 shadow-lg transition-transform duration-700 ${isOpen ? 'scale-105' : 'scale-100'}`}
            style={{
              left: `${b.x}%`,
              top: '42%',
              width: `${b.s}px`,
              height: `${b.s}px`,
              background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.55), ${palette.blooms[i % palette.blooms.length]} 58%, ${palette.sashKnot})`,
              transform: `translate(-50%, -68%) translateZ(${bloomZ + b.d}px)`,
            }}
          >
            <div className="absolute inset-[15%] rounded-full border border-[#F3E5AB]/25" />
          </div>
        ))}
        {/* Glowing fairy-light tips sprinkled through the blooms */}
        {[22, 38, 56, 70].map((x, i) => (
          <span
            key={`l-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#FFF6C9] shadow-[0_0_6px_2px_rgba(243,229,171,0.9)]"
            style={{
              left: `${x}%`,
              top: `${30 + (i % 2) * 14}%`,
              transform: `translateZ(${bloomZ + 20}px)`,
              animation: `twinkle ${1.6 + i * 0.35}s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Ice-cream-cone wrap — layered multi-colour paper fans + front taper */}
      <div className="absolute left-1/2 bottom-0" style={{ width: `${W * 0.98}px`, height: `${coneH * 0.96}px`, transform: 'translateX(-50%)', transformOrigin: '50% 100%' }}>
        {/* Fanned coloured papers (deep leaf outside -> light lining inside) */}
        {[
          { rot: -13, zI: 0 },
          { rot: -4, zI: 1 },
          { rot: 6, zI: 2 },
          { rot: 15, zI: 3 },
        ].map((fan, i) => {
          const paper = palette.papers[i % palette.papers.length];
          return (
            <div
              key={i}
              className="absolute bottom-0 left-1/2"
              style={{
                width: `${W * 1.02}px`,
                height: `${coneH * 0.94}px`,
                borderRadius: '12px 12px 0 0',
                clipPath: 'polygon(50% 100%, 99% 6%, 94% 0, 84% 7%, 74% 0, 64% 7%, 54% 0, 44% 7%, 34% 0, 24% 7%, 14% 0, 6% 5%, 1% 12%)',
                background: paper,
                transform: `translateX(-50%) rotate(${fan.rot}deg)`,
                zIndex: fan.zI,
                boxShadow: 'inset 0 0 24px rgba(0,0,0,0.28)',
              }}
            >
              <div className="absolute inset-0" style={{ background: 'linear-gradient(115deg, rgba(255,255,255,0.22) 0%, transparent 48%, rgba(0,0,0,0.24) 100%)' }} />
              <div className="absolute inset-x-0 top-0 h-px bg-white/40" />
            </div>
          );
        })}

        {/* Front pointed cone — the "ice-cream cone" silhouette */}
        <div
          className="absolute left-1/2 bottom-0"
          style={{
            width: `${W * 0.84}px`,
            height: `${coneH * 0.92}px`,
            transform: 'translateX(-50%)',
            zIndex: 10,
            background: palette.cone,
            clipPath: 'polygon(0% 0, 100% 0, 82% 62%, 50% 100%, 18% 62%)',
            borderRadius: '10px 10px 2px 2px',
          }}
        >
          <div className="absolute inset-0" style={{ background: 'linear-gradient(115deg, rgba(255,255,255,0.35) 0%, transparent 26%, transparent 74%, rgba(0,0,0,0.18) 100%)' }} />
          <div className="absolute left-1/2 top-0 bottom-[12%] w-px bg-black/10" />
          <div className="absolute inset-x-0 top-[10%] h-px bg-[#8A6328]/30" />
          {/* Satin tie binding the wrap just above the point */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center" style={{ bottom: '12%', transform: 'translateX(-50%)', transformOrigin: 'center' }}>
            <div className="w-16 h-3 rounded-full shadow" style={{ background: palette.satin, transform: 'rotate(-9deg)' }} />
            <div className="w-16 h-3 rounded-full shadow -ml-3" style={{ background: palette.satin, transform: 'rotate(9deg)' }} />
            <div className="absolute w-5 h-5 rounded-full border border-[#E8B64C]/50 flex items-center justify-center" style={{ background: palette.sashKnot }}>
              <Crown className="w-2.5 h-2.5 text-[#F3E5AB]" />
            </div>
          </div>
          {/* Wax seal dress card */}
          <div className="absolute left-1/2 bottom-[3%] -translate-x-1/2 px-2.5 py-1 rounded-md bg-black/70 border border-[#DFBA54]/70 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-[#DFBA54]" />
            <span className="text-[7px] font-bold text-[#F3E5AB] tracking-widest uppercase">Signature Bouquet</span>
          </div>
        </div>
      </div>

      {/* Soft ground shadow */}
      <div className={`absolute left-1/2 bg-black/60 rounded-full blur-xl pointer-events-none ${className}`} style={{ width: `${W * 0.72}px`, height: `20px`, transform: `translateX(-50%) rotateX(90deg) translateZ(-${H * 0.1}px)` }} />

      {/* Unboxed plaque — dangles in front of the bouquet */}
      {isOpen && (
        <div className="absolute left-1/2 top-[8%] -translate-x-1/2 pointer-events-none transition-all duration-700 flex flex-col items-center" style={{ transformStyle: 'preserve-3d', transform: 'translateX(-50%) translateZ(40px)' }}>
          <div className="px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-[#DFBA54] text-center shadow-2xl">
            <div className="flex items-center justify-center gap-1.5 text-[#F3E5AB] text-[10.5px] font-cinzel font-bold tracking-wider uppercase">
              <Crown className="w-3.5 h-3.5 text-[#DFBA54]" />
              <span>Bouquet Unboxed</span>
            </div>
            <div className="text-[9px] text-white/80 font-sans mt-0.5">Roses • Chocolates • Fairy Lights • Wax Seal</div>
          </div>
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Wooden / ethnic flat gift tray — wide & low with a cellophane dome         */
/* -------------------------------------------------------------------------- */
interface TrayAssemblyProps {
  finish: TrayFinish;
  isOpen: boolean;
  W: number;
  plateH: number;
  archH: number;
  className: string;
}

const TrayAssembly: React.FC<TrayAssemblyProps> = ({ finish, isOpen, W, plateH, archH, className }) => {
  const bedW = Math.round(W * 0.86);
  const contentRowY = Math.round(plateH * 0.28);
  const items = [
    { x: 16, c: '#FFF6C9', s: 16 },
    { x: 30, c: '#E8B64C', s: 20 },
    { x: 44, c: '#C2344A', s: 22 },
    { x: 58, c: '#DEB887', s: 18 },
    { x: 72, c: '#F3E5AB', s: 20 },
    { x: 84, c: '#A52A3A', s: 16 },
  ];
  return (
    <div className="absolute inset-0 [transform-style:preserve-3d]">
      {/* Wooden platter — wide, flat & low so it never reads as a box */}
      <div
        className="absolute left-1/2 -translate-x-1/2 overflow-hidden"
        style={{
          bottom: `${plateH * 0.08}px`,
          width: `${W}px`,
          height: `${plateH}px`,
          borderRadius: '14px',
          background: finish.body,
          boxShadow: '0 10px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -6px 14px rgba(0,0,0,0.35)',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 8%, rgba(255,255,255,0.28), transparent 55%)' }} />
        <div className="absolute inset-x-[6%] top-1/2 h-px bg-black/25 -translate-y-1/2" />
        <div className="absolute inset-x-[6%] top-[58%] h-px bg-black/15 -translate-y-1/2" />
        {/* Etched gold guest ring + raised outer rim */}
        <div className="absolute inset-x-[7%] top-[14%] bottom-[12%] rounded-full border border-[#F3E5AB]/25" />
        {/* Rim */}
        <div className="absolute inset-0 rounded-[14px] border-[3px]" style={{ borderColor: finish.rim, opacity: 0.9 }} />
        <div className="absolute inset-y-1.5 inset-x-0 bottom-0 rounded-b-[14px] border border-[#F3E5AB]/30 pointer-events-none" />
      </div>

      {/* Bed contents — sweet jars, roses & fairy lights */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: `${plateH * 0.34}px`, width: `${bedW}px`, height: `${archH}px` }}>
        {items.map((it, i) => {
          const isRosette = i === 3;
          return (
            <div
              key={i}
              className={`absolute rounded-full ${isRosette ? 'border border-amber-300/70' : 'rounded-b-sm'} ${isOpen ? 'scale-105' : 'scale-100'} transition-transform duration-700`}
              style={{
                left: `${it.x}%`,
                bottom: '16%',
                width: `${it.s * 2.1}px`,
                height: `${it.s * 2.6}px`,
                transform: `translateX(-50%) translateZ(${10 + i * 3}px)`,
                background: it.c,
                boxShadow: `0 0 ${8 + i}px rgba(243,229,171,${0.25 + i * 0.05})`,
              }}
            >
              <div className="absolute inset-x-1 top-1 h-1 rounded-full bg-white/50" />
            </div>
          );
        })}
      </div>

      {/* Shirred silk cover draped over the arranged items */}
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          bottom: `${plateH * 0.26}px`,
          width: `${W * 0.84}px`,
          height: `${archH * 0.92}px`,
          borderRadius: '50% 50% 14px 14px',
          background: finish.cloth,
          border: '1px solid rgba(255,255,255,0.35)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.22), inset 0 0 28px rgba(255,255,255,0.22), inset 0 -12px 22px rgba(0,0,0,0.25)',
          transform: `translateX(-50%) translateZ(6px)`,
        }}
      >
        {/* Vertical silk pleats */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: '50% 50% 14px 14px',
            background: 'repeating-linear-gradient(90deg, transparent 0 13px, rgba(0,0,0,0.14) 13px 14px, transparent 14px 28px, rgba(255,255,255,0.16) 28px 29px)',
          }}
        />
        {/* Gathered top drawstring */}
        <div className="absolute left-1/2 top-[5%] -translate-x-1/2 w-7 h-7 rounded-full bg-black/25 blur-[2px]" />
        <div className="absolute left-1/2 top-[7%] -translate-x-1/2 w-4 h-4 rounded-full bg-black/35 border border-[#F3E5AB]/40" />
        {/* Sheen sweep */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: '50% 50% 14px 14px',
            background: 'linear-gradient(115deg, rgba(255,255,255,0.35) 0%, transparent 42%, transparent 70%, rgba(0,0,0,0.18) 100%)',
          }}
        />
        {/* Cloth edges draping over the tray rim */}
        {[
          { x: 8, rot: -9, z: 14, w: 0.26, h: 0.42 },
          { x: 36, rot: -3, z: 8, w: 0.22, h: 0.5 },
          { x: 64, rot: 3, z: 8, w: 0.22, h: 0.48 },
          { x: 90, rot: 10, z: 14, w: 0.24, h: 0.4 },
        ].map((flap, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: '70%',
              left: `${flap.x}%`,
              width: `${W * flap.w}px`,
              height: `${archH * flap.h}px`,
              borderRadius: '0 0 55% 55%',
              background: finish.cloth,
              transform: `translateX(-50%) translateZ(${flap.z}px) rotate(${flap.rot}deg)`,
              boxShadow: 'inset 0 -10px 16px rgba(0,0,0,0.3)',
            }}
          />
        ))}
      </div>

      {/* Giant sunburst rosette on the front lip */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-end justify-center" style={{ bottom: `${plateH * 0.02}px`, transform: 'translateX(-50%) translateZ(14px)' }}>
        {finish.rosette.map((c, i) => (
          <div
            key={i}
            className="rounded-full border border-[#F3E5AB]/50"
            style={{
              width: `${40 - i * 7}px`,
              height: `${40 - i * 7}px`,
              marginLeft: i === 0 ? 0 : '-8px',
              background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.6), ${c})`,
              zIndex: finish.rosette.length - i,
            }}
          />
        ))}
        <div className="absolute -bottom-1 w-3.5 h-3.5 rounded-full bg-black/80 border border-[#DFBA54] flex items-center justify-center z-10">
          <Crown className="w-2 h-2 text-[#F3E5AB]" />
        </div>
      </div>

      {/* Soft ground shadow */}
      <div className={`absolute left-1/2 bg-black/60 rounded-full blur-xl pointer-events-none ${className}`} style={{ width: `${W * 0.8}px`, height: `18px`, transform: `translateX(-50%) rotateX(90deg) translateZ(-${plateH * 0.55}px)` }} />

      {/* Label plaque */}
      <div className="absolute left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-black/70 border border-[#DFBA54]/70 flex items-center gap-1.5" style={{ top: '2%', transform: 'translateX(-50%) translateZ(20px)' }}>
        <Sparkles className="w-2.5 h-2.5 text-[#DFBA54]" />
        <span className="text-[7px] font-bold text-[#F3E5AB] tracking-widest uppercase">Celebration Gift Tray</span>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Premium gift bag — pleated body, tissue spill, arched handles              */
/* -------------------------------------------------------------------------- */
interface BagAssemblyProps {
  color: BagColor;
  isOpen: boolean;
  W: number;
  H: number;
  className: string;
}

const BagAssembly: React.FC<BagAssemblyProps> = ({ color, isOpen, W, H, className }) => {
  const bagH = Math.round(H * 0.8);
  const sideW = Math.round(W * 0.16);
  const tissueBits = [
    { x: 20, h: 0.32, z: 6 },
    { x: 40, h: 0.42, z: 12 },
    { x: 60, h: 0.38, z: 16 },
    { x: 80, h: 0.3, z: 8 },
  ];
  return (
    <div className="absolute inset-0 [transform-style:preserve-3d]">
      {/* Right pleat */}
      <div
        className="absolute"
        style={{
          right: '0px',
          top: `${H - bagH + 4}px`,
          width: `${sideW}px`,
          height: `${bagH - 6}px`,
          transform: 'rotateY(8deg)',
          background: 'rgba(0,0,0,0.28)',
          borderRadius: '0 10px 10px 0',
        }}
      />
      {/* Left pleat */}
      <div
        className="absolute"
        style={{
          left: '0px',
          top: `${H - bagH + 4}px`,
          width: `${sideW}px`,
          height: `${bagH - 6}px`,
          transform: 'rotateY(-8deg)',
          background: 'rgba(0,0,0,0.28)',
          borderRadius: '10px 0 0 10px',
        }}
      />

      {/* Bag front body */}
      <div
        className="absolute left-1/2 -translate-x-1/2 overflow-hidden"
        style={{
          bottom: '0px',
          width: `${W}px`,
          height: `${bagH}px`,
          borderRadius: '2px 2px 14px 14px',
          background: color.body,
          boxShadow: '0 12px 26px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.2)',
        }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgba(255,255,255,0.14) 0%, transparent 30%, transparent 75%, rgba(0,0,0,0.22) 100%)' }} />
        {/* Waist band */}
        <div
          className="absolute inset-x-0 top-[58%] h-[14px]"
          style={{
            background: color.band,
            borderTop: '1px solid rgba(243,229,171,0.5)',
            borderBottom: '1px solid rgba(0,0,0,0.35)',
          }}
        />
        {/* Brand tag */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[12%] px-2 py-0.5 rounded-sm bg-black/70 border border-[#DFBA54]/60 flex items-center gap-1">
          <Crown className="w-2 h-2 text-[#DFBA54]" />
          <span className="text-[6.5px] font-bold text-[#F3E5AB] tracking-widest uppercase">Hamper Queen</span>
        </div>
      </div>

      {/* Tissue spilling from the opening */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ top: `${H - bagH - 2}px`, width: `${W * 0.86}px`, height: `${H * 0.26}px` }}>
        {tissueBits.map((t, i) => (
          <div
            key={i}
            className={`absolute bottom-0 rounded-t-lg ${isOpen ? 'scale-105' : 'scale-100'} transition-transform duration-700`}
            style={{
              left: `${t.x}%`,
              width: `${W * 0.22}px`,
              height: `${H * 0.26 * t.h}px`,
              transform: `translateX(-50%) translateZ(${t.z}px) rotate(${(i - 1.5) * 4}deg)`,
              background: `linear-gradient(to bottom, ${color.tissue}D9, ${color.tissue}99)`,
              boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
              clipPath: 'polygon(0 0, 100% 0, 94% 100%, 6% 100%)',
            }}
          />
        ))}
      </div>

      {/* Arched handles — popped well in front of the tissue so they read as the
          near handle, with the legs tucked into the bag mouth */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ top: `${H - bagH - H * 0.12}px`, width: `${W * 0.62}px`, height: `${H * 0.2}px`, transform: 'translateX(-50%) translateZ(30px) rotateX(-6deg)' }}>
        <div className="absolute inset-0 rounded-t-full" style={{ border: `5px solid ${color.handle}`, borderBottom: '0', opacity: 0.98, boxShadow: '0 3px 6px rgba(0,0,0,0.25)' }} />
        <div className="absolute inset-x-[7%] bottom-0 h-px bg-black/25" />
        {/* Grip shadow where the arch meets the bag lip */}
        <div className="absolute -inset-x-1 -bottom-0.5 h-2 bg-black/20 blur-[2px]" />
      </div>

      {/* Soft ground shadow */}
      <div className={`absolute left-1/2 bg-black/60 rounded-full blur-xl pointer-events-none ${className}`} style={{ width: `${W * 0.8}px`, height: `18px`, transform: `translateX(-50%) rotateX(90deg) translateZ(-${bagH * 0.06}px)` }} />
    </div>
  );
};

export const ThreeDGiftBox: React.FC<ThreeDGiftBoxProps> = ({
  onOpenAtelier,
  className = '',
  variant = 'royal',
  size = 'md',
  shape = 'cube',
  type = 'box',
  bouquetPalette = 'crimson',
  trayFinish = 'ethnic',
  bagColor = 'obsidian',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rotateX, setRotateX] = useState(TILT_CLOSED);
  const [rotateY, setRotateY] = useState(30);
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const theme = BOX_THEMES[variant as keyof typeof BOX_THEMES] || BOX_THEMES.royal;
  const preset = BOX_SIZE_PRESETS[size];
  const aspect = BOX_SHAPES[shape] || BOX_SHAPES.cube;
  const bouquetPaletteObj = BOUQUET_PALETTES[bouquetPalette] || BOUQUET_PALETTES.crimson;
  const trayFinishObj = TRAY_FINISHES[trayFinish] || TRAY_FINISHES.ethnic;
  const bagColorObj = BAG_COLORS[bagColor] || BAG_COLORS.obsidian;

  // Cuboid dimensions (width × height × depth) so boxes can be wide, tall,
  // long or a classic cube — always normalized to fit the same scene box.
  const edge = preset.edge;
  const boxW = Math.round(edge * aspect.w);
  const boxH = Math.round(edge * aspect.h);
  const boxD = Math.round(edge * aspect.d);

  // Faces match the exact footprint so every edge joins its neighbour flush.
  // `shapeTopY` vertically centres the box inside the square scene so wide/tall/
  // long shapes never float off-centre ("not aligned to edge").
  const faceW = boxW;
  const faceH = boxH;
  const sideW = boxD;
  const sideH = boxH;
  const lidW = boxW;
  const lidD = boxD;
  const bedW = boxW - 8;
  const bedD = boxD - 8;
  const rimH = preset.lidRimH;
  const halfW = boxW / 2;
  const halfH = boxH / 2;
  const halfD = boxD / 2;
  const shapeTopY = Math.round((edge - boxH) / 2);
  const bedZ = Math.round(-(shapeTopY + rimH));
  const shadowZ = Math.round(shapeTopY + boxH + 15);
  // Lid roof plane must sit `rimH` above the box rim for every shape.
  const lidRoofZ = Math.round(rimH);
  const lidUnderZ = lidRoofZ - 1;
  const lidLift = Math.round(-(boxH * 0.75 + shapeTopY));
  const glowOffsetY = Math.round(-boxH * 0.36);

  // Bouquet proportions (tall & slender — unlike any box shape)
  const isBouquet = type === 'bouquet';
  const isTray = type === 'tray';
  const isBag = type === 'bag';
  const isFlat = isBouquet || isTray || isBag; // sway (never full-spin) types

  const bouquetW = Math.round(edge * 1.3);
  const bouquetH = Math.round(edge * 1.68);
  const bouquetConeH = Math.round(bouquetH * 0.6);
  const bouquetBloomY = Math.round(bouquetH * 0.16);
  const bouquetShadowZ = halfH + 28;

  const trayW = Math.round(edge * 1.55);
  const trayPlateH = Math.round(edge * 0.34);
  const trayArchH = Math.round(edge * 0.46);

  const bagW = Math.round(edge * 0.85);
  const bagH = Math.round(edge * 1.5);

  // Gentle auto-rotation when not hovering or interacting.
  // Bouquets, trays & bags sway softly (never spin edge-on); boxes rotate fully.
  useEffect(() => {
    if (!isAutoRotating || isHovered) return;
    if (isFlat) {
      const interval = setInterval(() => {
        setRotateY((prev) => Math.sin(Date.now() / 850) * 16);
        setRotateX((prev) => -18 + Math.sin(Date.now() / 1200) * 3);
      }, 40);
      return () => clearInterval(interval);
    }
    const interval = setInterval(() => {
      setRotateY((prev) => (prev + 0.6) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoRotating, isHovered, isFlat]);

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
    const next = !isOpen;
    setIsOpen(next);
    setIsAutoRotating(!next);
    if (next) {
      if (!isFlat) {
        const facing = rotateY % 360;
        if (facing > 20 && facing < 340) {
          setRotateY(30);
        }
      } else {
        setRotateY(0);
      }
      triggerGoldConfetti(0.5, 0.4);
    } else {
      setRotateX(TILT_CLOSED);
    }
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
        title={
            isBouquet
              ? 'Click to Enchant & Explore 3D Royal Bouquet'
              : isTray
                ? 'Click to Explore 3D Celebration Gift Tray'
                : isBag
                  ? 'Click to Explore 3D Premium Gift Bag'
                  : 'Click to Unbox & Explore 3D Royal Gift'
          }
      >
        {/* The 3D Box Assembly */}
        <div
          className="relative transition-transform duration-300 ease-out"
          style={{
            width: isTray ? `${trayW}px` : isBag ? `${bagW}px` : isBouquet ? `${bouquetW}px` : `${edge}px`,
            height: isTray ? `${trayArchH + trayPlateH}px` : isBag ? `${bagH}px` : isBouquet ? `${bouquetH}px` : `${edge}px`,
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          }}
        >
          {isBouquet ? (
            <BouquetAssembly palette={bouquetPaletteObj} isOpen={isOpen} W={bouquetW} H={bouquetH} coneH={bouquetConeH} bloomY={bouquetBloomY} className={`${preset.shadow}`} />
          ) : isTray ? (
            <TrayAssembly finish={trayFinishObj} isOpen={isOpen} W={trayW} plateH={trayPlateH} archH={trayArchH} className={`${preset.shadow}`} />
          ) : isBag ? (
            <BagAssembly color={bagColorObj} isOpen={isOpen} W={bagW} H={bagH} className={`${preset.shadow}`} />
          ) : (
            <>
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
                width: `${bedW}px`,
                height: `${bedD}px`,
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

              {/* Last Item: "Much More In Every Box" indicator chip */}
              <div className={`w-full z-10 ${isOpen ? 'item-pop' : 'opacity-0'}`} style={popDelay(3)}>
                <div className="w-full flex items-center justify-center gap-1 bg-black/70 border border-[#DFBA54]/70 rounded px-1.5 py-0.5 text-[7.5px] font-bold text-[#F3E5AB] tracking-widest uppercase shadow-sm">
                  <Sparkles className="w-2.5 h-2.5 text-[#DFBA54]" />
                  <span>+ Much More In Every Box</span>
                </div>
              </div>
            </div>
          )}

          {/* 3D BOX LID — lifts straight up with a gentle lean toward the viewer;
              the decorated top stays fully visible (never inverts) */}
          <div
            className="absolute inset-0 transition-all duration-700 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: 'top center',
              transform: isOpen
                ? `translateY(${lidLift}px) rotateX(14deg) translateZ(12px)`
                : 'translateY(0px)',
            }}
          >
            {/* Top Face of the Lid (brand-ribbon rosette) */}
            <div
              className={`absolute bg-gradient-to-br ${theme.lidTop} ${theme.faceBorder} shadow-lg flex items-center justify-center overflow-hidden`}
              style={{
                width: `${lidW}px`,
                height: `${lidD}px`,
                transform: `translateY(${shapeTopY - halfD}px) rotateX(90deg) translateZ(${lidRoofZ}px)`,
                borderRadius: '6px',
              }}
            >
              {/* Gold Satin Cross Ribbon — thin lines crossing at the lid center */}
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[7px] bg-gradient-to-b from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] shadow-sm" />
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[7px] bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] shadow-sm" />

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
                width: `${lidW}px`,
                height: `${lidD}px`,
                transform: `translateY(${shapeTopY - halfD}px) rotateX(90deg) translateZ(${lidUnderZ}px) rotateY(180deg)`,
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
                transform: `translateY(${shapeTopY - rimH}px) translateZ(${halfD}px)`,
                width: `${lidW}px`,
                height: `${rimH}px`,
                borderRadius: '2px',
              }}
            />
            <div
              className={`absolute ${theme.faceBorder}`}
              style={{
                background: theme.backFace,
                transform: `translateY(${shapeTopY - rimH}px) rotateY(180deg) translateZ(${halfD}px)`,
                width: `${lidW}px`,
                height: `${rimH}px`,
              }}
            />
            <div
              className={`absolute ${theme.faceBorder}`}
              style={{
                background: theme.leftFace,
                transform: `translateY(${shapeTopY - rimH}px) rotateY(-90deg) translateZ(${halfD}px)`,
                width: `${lidD}px`,
                height: `${rimH}px`,
              }}
            />
<div
              className={`absolute ${theme.faceBorder}`}
              style={{
                background: theme.leftFace,
                transform: `translateY(${shapeTopY - rimH}px) rotateY(90deg) translateZ(${boxW - halfD}px)`,
                width: `${lidD}px`,
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
            style={{ width: `${faceW}px`, height: `${faceH}px`, transform: `translateZ(${halfD}px) translateY(${shapeTopY}px)`, borderRadius: '4px' }}
          >
            {/* Centered cross ribbon: both lines cross behind the emblem */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[7px] bg-gradient-to-b from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] opacity-90" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[7px] bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] opacity-90" />
            <FaceEmblem theme={theme} logoClass={preset.logo} withLabel />
          </div>

          {/* Back Face */}
          <div
            className={`absolute ${theme.faceBorder} flex flex-col items-center justify-center overflow-hidden`}
            style={{
              width: `${faceW}px`,
              height: `${faceH}px`,
              transform: `rotateY(180deg) translateZ(${halfD}px) translateY(${shapeTopY}px)`,
              background: `linear-gradient(to bottom, ${theme.backFace}, ${theme.leftFace})`,
              borderRadius: '4px',
            }}
          >
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[7px] bg-gradient-to-b from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] opacity-75" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[7px] bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] opacity-75" />
            <FaceEmblem theme={theme} logoClass={preset.logo} />
          </div>

          {/* Left Face */}
          <div
            className={`absolute ${theme.faceBorder} flex flex-col items-center justify-center overflow-hidden`}
            style={{
              width: `${sideW}px`,
              height: `${sideH}px`,
              transform: `rotateY(-90deg) translateZ(${halfD}px) translateY(${shapeTopY}px)`,
              background: `linear-gradient(to bottom, ${theme.leftFace}, ${theme.backFace})`,
              borderRadius: '4px',
            }}
          >
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[7px] bg-gradient-to-b from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] opacity-80" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[7px] bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] opacity-80" />
            <FaceEmblem theme={theme} logoClass={preset.logo} withLabel />
          </div>

          {/* Right Face */}
          <div
            className={`absolute ${theme.faceBorder} flex flex-col items-center justify-center overflow-hidden`}
            style={{
              width: `${sideW}px`,
              height: `${sideH}px`,
              transform: `rotateY(90deg) translateZ(${boxW - halfD}px) translateY(${shapeTopY}px)`,
              background: `linear-gradient(to bottom, ${theme.rightFace}, ${theme.backFace})`,
              borderRadius: '4px',
            }}
          >
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[7px] bg-gradient-to-b from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] opacity-80" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[7px] bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] opacity-80" />
            <FaceEmblem theme={theme} logoClass={preset.logo} withLabel />
          </div>

          {/* Bottom Face */}
          <div
            className={`absolute ${theme.bottomFace} shadow-2xl`}
            style={{ width: `${boxW}px`, height: `${boxD}px`, transform: `rotateX(-90deg) translateZ(${shapeTopY + boxH - halfD}px)` }}
          />

          {/* Shadow Below Box */}
          <div
            className={`absolute ${preset.shadow} bg-black/60 rounded-full blur-xl pointer-events-none`}
            style={{ transform: `rotateX(90deg) translateZ(-${shadowZ}px)` }}
          />
            </>
          )}
        </div>
      </div>

      {/* Interactive Trigger & Instruction Badge */}
      <div className="flex flex-col items-center gap-2 mt-2">
        <button
          onClick={toggleOpen}
          className="px-4 py-1.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-[#DFBA54]/60 text-[#F3E5AB] text-xs font-cinzel font-bold tracking-wider uppercase transition-all shadow-lg flex items-center gap-1.5 cursor-pointer transform hover:scale-105"
        >
          <Gift className="w-3.5 h-3.5 text-[#DFBA54]" />
          <span>
            {isBouquet
              ? isOpen
                ? 'Close Enchanted Bouquet'
                : 'Click to Enchant Bouquet'
              : isTray
                ? isOpen
                  ? 'Close Celebration Tray'
                  : 'Click to Unveil Tray'
                : isBag
                  ? isOpen
                    ? 'Close Premium Gift Bag'
                    : 'Click to Peek Inside Bag'
                  : isOpen
                    ? 'Close 3D Gift Box'
                    : 'Click to Unbox 3D Gift'}
          </span>
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