import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SAMPLE_POLAROID_PRESETS, BrandedItem } from '../data/brandedItemsData';
import { X, Upload, Check, Camera, Sparkles, Image as ImageIcon } from 'lucide-react';
import { triggerRomanticConfetti } from '../utils/confetti';

interface PhotoCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetSlotIndex: number;
  initialPhotoUrl?: string;
  initialCaption?: string;
  onSavePhoto: (photoItem: BrandedItem, slotIndex: number) => void;
}

export const PhotoCustomizerModal: React.FC<PhotoCustomizerModalProps> = ({
  isOpen,
  onClose,
  targetSlotIndex,
  initialPhotoUrl,
  initialCaption,
  onSavePhoto,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>(
    initialPhotoUrl || SAMPLE_POLAROID_PRESETS[0].url
  );
  const [caption, setCaption] = useState<string>(
    initialCaption || SAMPLE_POLAROID_PRESETS[0].caption
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomPhotoUrl(event.target.result as string);
          setSelectedPresetId(null);
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const customItem: BrandedItem = {
      id: `custom-photo-${Date.now()}`,
      name: `Custom Polaroid Photo: "${caption || 'Memories'}"`,
      brand: 'Keepsake',
      category: 'photos',
      simpleName: 'Personalized Polaroid Memory Print',
      description: `Custom photo with handwritten note: "${caption}"`,
      weightOrQty: '1 Glossy Photo Print',
      unitPriceApprox: 80,
      isPhoto: true,
      photoUrl: customPhotoUrl,
      photoCaption: caption || 'Memories ❤️',
      tag: 'Custom Photo',
      colorScheme: {
        bg: '#0F172A',
        text: '#F8FAFC',
        border: '#94A3B8',
        accent: '#CBD5E1',
      },
    };

    triggerRomanticConfetti(0.5, 0.5);
    onSavePhoto(customItem, targetSlotIndex);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-xl bg-white border-2 border-[#D4AF37] shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Title */}
          <div className="flex items-center gap-2 mb-1">
            <Camera className="w-5 h-5 text-[#B8860B]" />
            <h3 className="font-seasons text-xl sm:text-2xl font-bold text-[#141414]">
              Personalized Polaroid Photo Card
            </h3>
          </div>
          <p className="font-seasons text-sm text-stone-500 mb-6">
            Add a real printed photo into Slot #{targetSlotIndex + 1} of your gift box or bouquet.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* Left: Live Polaroid Preview */}
            <div className="flex flex-col items-center">
              <div className="relative w-48 bg-white p-3 shadow-xl border border-stone-300 transform -rotate-2 hover:rotate-0 transition-transform">
                {/* Vintage Wooden Peg Clip */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-6 bg-amber-200 border border-amber-800/40 rounded-xs shadow-xs z-10" />
                
                {/* Photo Image */}
                <div className="w-full aspect-square overflow-hidden bg-stone-100 border border-stone-200">
                  <img
                    src={customPhotoUrl}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Polaroid Caption */}
                <div className="text-center pt-2 pb-1">
                  <p className="font-seasons text-xs font-semibold text-stone-800 tracking-wide">
                    {caption || 'Your Sweet Caption Here'}
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-stone-400 mt-3 text-center italic">
                Printed on 300 GSM glossy photo card with mini wooden craft peg
              </p>
            </div>

            {/* Right: Upload & Presets */}
            <div className="space-y-4">
              {/* Upload Own Photo Button */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Upload From Your Device
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-50 hover:bg-amber-100 border-2 border-dashed border-[#B8860B] text-[#B8860B] text-xs font-bold transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  {isUploading ? 'Uploading Photo...' : 'Click to Upload Photo'}
                </button>
              </div>

              {/* Or Select Sample Preset Photos */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Or Pick a Preset Memory Photo
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SAMPLE_POLAROID_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setSelectedPresetId(preset.id);
                        setCustomPhotoUrl(preset.url);
                        setCaption(preset.caption);
                      }}
                      className={`relative aspect-square overflow-hidden border-2 transition-all ${
                        selectedPresetId === preset.id || customPhotoUrl === preset.url
                          ? 'border-[#B8860B] ring-2 ring-[#B8860B]/50'
                          : 'border-stone-200 hover:border-stone-400 opacity-80 hover:opacity-100'
                      }`}
                      title={preset.title}
                    >
                      <img
                        src={preset.url}
                        alt={preset.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Caption Input */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Card Caption / Message
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={40}
                  placeholder="e.g. Forever & Always ❤️"
                  className="w-full px-3 py-2 border border-stone-300 text-xs focus:outline-none focus:border-[#B8860B]"
                />
                <span className="text-[10px] text-stone-400 block text-right mt-0.5">
                  {caption.length}/40 characters
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 border border-stone-300 hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#B8860B] hover:bg-[#996515] transition-colors shadow-sm"
            >
              <Check className="w-4 h-4" />
              Place Photo in Slot #{targetSlotIndex + 1}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
