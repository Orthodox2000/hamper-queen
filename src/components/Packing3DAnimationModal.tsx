import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Crown, CheckCircle2, Gift, Heart, ArrowRight } from 'lucide-react';
import { PackagingSizeOption, BrandedItem } from '../data/brandedItemsData';
import { triggerGoldConfetti, triggerGrandCelebration } from '../utils/confetti';

interface Packing3DAnimationModalProps {
  isOpen: boolean;
  onComplete: () => void;
  packaging: PackagingSizeOption;
  items: BrandedItem[];
  ribbonName: string;
  ribbonHex: string;
  hasWaxSeal: boolean;
  hasLights: boolean;
}

export const Packing3DAnimationModal: React.FC<Packing3DAnimationModalProps> = ({
  isOpen,
  onComplete,
  packaging,
  items,
  ribbonName,
  ribbonHex,
  hasWaxSeal,
  hasLights,
}) => {
  // Animation steps: 0 = inspecting, 1 = closing lid, 2 = tying ribbon, 3 = wax seal stamp, 4 = complete
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      return;
    }

    // Step 0: Nestling gifts
    const timer1 = setTimeout(() => {
      setStep(1); // Closing lid
    }, 900);

    const timer2 = setTimeout(() => {
      setStep(2); // Tying ribbons
    }, 1900);

    const timer3 = setTimeout(() => {
      setStep(3); // Stamping wax seal
      triggerGoldConfetti(0.5, 0.5);
    }, 2900);

    const timer4 = setTimeout(() => {
      setStep(4); // Fully packed celebration
      triggerGrandCelebration();
    }, 3900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isLidClosed = step >= 1;
  const isRibbonTied = step >= 2;
  const isSealStamped = step >= 3;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          className="relative w-full max-w-xl bg-gradient-to-b from-[#1C1814] via-[#120F0D] to-[#0A0807] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 text-white text-center shadow-2xl overflow-hidden flex flex-col items-center"
        >
          {/* Shimmering Ambient Glow Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,transparent_70%)] pointer-events-none" />

          {/* Top Brand Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-[#DFBA54]/50 text-amber-200 text-xs font-cinzel font-bold tracking-widest uppercase mb-3">
            <Crown className="w-3.5 h-3.5 text-[#DFBA54]" />
            <span>Hamper Queen • Packing Ceremony</span>
          </div>

          <h3 className="font-seasons text-2xl sm:text-3xl font-bold text-white mb-1">
            {step === 0 && 'Nestling Gifts in Crinkle Bedding...'}
            {step === 1 && 'Closing Handcrafted Rigid Box Lid...'}
            {step === 2 && `Tying ${ribbonName} Satin Ribbon Bow...`}
            {step === 3 && 'Stamping Royal Wax Seal with Gold Dust...'}
            {step >= 4 && 'Hamper Sealed with Love & Care!'}
          </h3>

          <p className="text-xs sm:text-sm text-stone-300 font-sans max-w-md mb-6">
            {step < 4
              ? 'Ms. Supriya is personally assembling and wrapping your custom gift box with precision craftsmanship.'
              : 'Your luxury hamper is sealed, dressed with satin ribbons, and ready for address & dispatch confirmation.'}
          </p>

          {/* 3D PACKING BOX CONTAINER */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 my-2 flex items-center justify-center perspective-[1000px]">
            {/* 3D Box Base Frame */}
            <div
              className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl bg-gradient-to-b from-[#3B060B] via-[#2A0508] to-[#160204] border-4 border-[#DFBA54] shadow-2xl flex flex-col items-center justify-center overflow-hidden transition-all duration-700"
              style={{
                transformStyle: 'preserve-3d',
                transform: isLidClosed ? 'rotateX(15deg)' : 'rotateX(25deg)',
              }}
            >
              {/* Internal Velvet & Treats (Visible when lid is open) */}
              {!isLidClosed && (
                <div className="absolute inset-2 bg-black/60 rounded-xl p-2 flex flex-col justify-between items-center text-center">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-amber-200 font-bold">
                    <Sparkles className="w-3 h-3 text-[#DFBA54]" />
                    <span>{items.length} Curated Items Inside</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 w-full max-w-[160px]">
                    {items.slice(0, 4).map((it, idx) => (
                      <div
                        key={idx}
                        className="bg-white/10 border border-amber-300/30 rounded px-1 py-0.5 text-[8px] text-amber-100 truncate"
                      >
                        {it.simpleName}
                      </div>
                    ))}
                  </div>
                  <span className="text-[9px] text-white/70 italic">
                    {packaging.name}
                  </span>
                </div>
              )}

              {/* 3D Box Lid (Slides down & closes over box) */}
              <motion.div
                initial={false}
                animate={{
                  translateY: isLidClosed ? 0 : -85,
                  rotateX: isLidClosed ? 0 : -95,
                  opacity: isLidClosed ? 1 : 0.85,
                }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#5C0A10] via-[#3B060B] to-[#220407] border-2 border-[#DFBA54] shadow-2xl flex flex-col items-center justify-center overflow-hidden"
              >
                {/* Gold Rim Inset */}
                <div className="absolute inset-2 border border-[#DFBA54]/40 rounded-lg pointer-events-none" />

                {/* Vertical Ribbon Wrap */}
                {isRibbonTied && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-y-0 w-8 shadow-md border-x border-white/30"
                    style={{ backgroundColor: ribbonHex }}
                  />
                )}

                {/* Horizontal Ribbon Wrap */}
                {isRibbonTied && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="absolute inset-x-0 h-8 shadow-md border-y border-white/30"
                    style={{ backgroundColor: ribbonHex }}
                  />
                )}

                {/* Center Ribbon Rosette Bow */}
                {isRibbonTied && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 12, delay: 0.3 }}
                    className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-xl border-2 border-white/50"
                    style={{ backgroundColor: ribbonHex }}
                  >
                    <Gift className="w-6 h-6 text-white" />
                  </motion.div>
                )}

                {/* Royal Wax Seal Stamped on Center */}
                {hasWaxSeal && isSealStamped && (
                  <motion.div
                    initial={{ scale: 2.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 10, stiffness: 200 }}
                    className="absolute z-20 w-12 h-12 rounded-full bg-[#800E17] border-2 border-[#DFBA54] flex flex-col items-center justify-center shadow-2xl text-amber-200"
                  >
                    <Crown className="w-3 h-3 text-[#DFBA54]" />
                    <span className="text-[10px] font-cinzel font-black tracking-widest">HQ</span>
                  </motion.div>
                )}

                {/* Fairy Lights Subtle Sparkle Indicator */}
                {hasLights && isLidClosed && (
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[8px] text-amber-300 font-bold bg-black/60 px-1.5 py-0.5 rounded-full border border-amber-300/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    <span>Lights Lit</span>
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="w-full max-w-sm mt-4">
            <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 h-full rounded-full"
                initial={{ width: '15%' }}
                animate={{
                  width:
                    step === 0
                      ? '25%'
                      : step === 1
                      ? '50%'
                      : step === 2
                      ? '75%'
                      : '100%',
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-stone-400 mt-2 font-cinzel">
              <span className={step >= 0 ? 'text-amber-300 font-bold' : ''}>1. Nestled</span>
              <span className={step >= 1 ? 'text-amber-300 font-bold' : ''}>2. Closed</span>
              <span className={step >= 2 ? 'text-amber-300 font-bold' : ''}>3. Ribbon Tied</span>
              <span className={step >= 3 ? 'text-amber-300 font-bold' : ''}>4. Wax Sealed</span>
            </div>
          </div>

          {/* Action Button: Skip or Proceed to Details */}
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={onComplete}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#DFBA54] via-[#F3E5AB] to-[#C5A059] text-black font-cinzel text-xs font-black tracking-wider uppercase shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 cursor-pointer border border-white"
            >
              <span>{step >= 4 ? 'Enter Recipient & Delivery Details' : 'Proceed to Confirmation'}</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
