import React, { useState } from 'react';
import { PenTool, Check, Copy, Download, Sparkles, RefreshCw, Stamp } from 'lucide-react';
import { CalligraphyCard } from '../types';
import { WAX_SEAL_OPTIONS } from '../data/itemsData';
import { royaleLogger } from '../utils/logger';

interface CustomMessagingPlatformProps {
  initialCard?: CalligraphyCard;
  onAttachCardToHamper: (card: CalligraphyCard) => void;
}

export const CustomMessagingPlatform: React.FC<CustomMessagingPlatformProps> = ({
  initialCard,
  onAttachCardToHamper,
}) => {
  const [stationery, setStationery] = useState<CalligraphyCard['stationery']>(
    initialCard?.stationery || 'deckle_edge'
  );
  const [recipient, setRecipient] = useState<string>(initialCard?.recipient || 'Her Royal Grace, Duchess Evelyn');
  const [sender, setSender] = useState<string>(initialCard?.sender || 'With highest esteem, The House of Sterling');
  const [occasion, setOccasion] = useState<string>(initialCard?.occasion || 'Royal Wedding');
  const [fontFamily, setFontFamily] = useState<CalligraphyCard['fontFamily']>(
    initialCard?.fontFamily || 'font-script'
  );
  const [waxSealId, setWaxSealId] = useState<string>(initialCard?.waxSealId || 'wax-seal-crown');
  const [message, setMessage] = useState<string>(
    initialCard?.message ||
      'May your union be crowned with lifelong splendor, enduring grace, and joyful abundance. May every dawn bring renewed light and noble purpose to your shared journey.'
  );

  const [attachedNotification, setAttachedNotification] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const occasionTemplates = [
    {
      id: 'wedding',
      label: 'Imperial Wedding',
      text: 'May your sacred union be crowned with lifelong splendor, enduring grace, and joyful abundance. May every dawn bring renewed light, noble purpose, and boundless warmth to your shared journey.',
    },
    {
      id: 'anniversary',
      label: 'Grand Anniversary',
      text: 'In celebration of another year graced by profound devotion, unwavering loyalty, and timeless elegance. May your legacy of affection continue to inspire generations.',
    },
    {
      id: 'distinction',
      label: 'Executive Honor',
      text: 'Presented in tribute to visionary leadership, steadfast integrity, and exceptional distinction. May your path forward remain paved with triumphs and illustrious success.',
    },
    {
      id: 'festive',
      label: 'Festive Festivities',
      text: 'May the festive radiance of this joyful season illuminate your home with peace, bountiful prosperity, and the sweet warmth of cherished fellowship.',
    },
  ];

  const selectedWaxSeal = WAX_SEAL_OPTIONS.find((s) => s.id === waxSealId) || WAX_SEAL_OPTIONS[0];

  const handleApplyTemplate = (templateText: string, occName: string) => {
    setMessage(templateText);
    setOccasion(occName);
    royaleLogger.action('RoyalScribe', `Applied message template for: ${occName}`);
  };

  const handleAttach = () => {
    const cardData: CalligraphyCard = {
      stationery,
      recipient,
      sender,
      occasion,
      fontFamily,
      waxSealId,
      message,
    };
    onAttachCardToHamper(cardData);
    setAttachedNotification(true);
    royaleLogger.action('RoyalScribe', `Attached personalized card to hamper for: "${recipient}"`);
    setTimeout(() => setAttachedNotification(false), 3000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(`${recipient}\n\n${message}\n\n${sender}`);
    setCopiedNotification(true);
    royaleLogger.action('RoyalScribe', 'Copied calligraphy card text to clipboard.');
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <section id="royal-scribe-section" className="py-16 bg-white border-b border-[#EAE5D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF5E8] border border-[#EAE0C8] text-[#8C6821] text-xs uppercase tracking-widest font-cinzel font-bold mb-3">
            <PenTool className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>The Royal Scribe Studio</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#141414] tracking-tight">
            Personalized Calligraphy & Wax Seals
          </h2>
          <p className="font-cormorant text-lg text-[#554F42] mt-2">
            Every sovereign parcel is accompanied by a hand-inscribed cotton card, embossed in gold foil and finished with molten wax bearing your chosen crest.
          </p>
        </div>

        {/* Studio Workspace: 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Live Card Preview (5 cols) */}
          <div className="lg:col-span-5 sticky top-28 space-y-4">
            <div className="bg-white rounded-3xl border border-[#C5A059]/70 p-6 shadow-xl relative overflow-hidden flex flex-col items-center">
              
              <div className="w-full flex items-center justify-between pb-3 border-b border-[#F0EAE0] mb-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C6821]">
                  Live Deckle-Edge Parchment Preview
                </span>
                <span className="text-xs text-[#787163] font-serif italic">
                  {selectedWaxSeal.name}
                </span>
              </div>

              {/* The Realistic Card Canvas */}
              <div
                className={`relative w-full max-w-sm aspect-[4/5] rounded-xl p-8 flex flex-col justify-between shadow-lg transition-all duration-300 border ${
                  stationery === 'deckle_edge'
                    ? 'bg-[#FAF8F0] border-[#D8CCA8] text-[#24211C]'
                    : stationery === 'midnight_gold'
                    ? 'bg-[#141414] border-[#D4AF37] text-[#E5C07B]'
                    : stationery === 'imperial_crimson'
                    ? 'bg-[#4A0A10] border-[#D4AF37] text-[#FAF8F0]'
                    : 'bg-white border-[#E8DFC9] text-[#1A1A1A]'
                }`}
                style={{
                  boxShadow: '0 12px 30px -5px rgba(0,0,0,0.12), inset 0 0 15px rgba(0,0,0,0.03)',
                }}
              >
                {/* Gold Foil Filigree Corner Frames */}
                <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#C5A059]/60" />
                <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#C5A059]/60" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#C5A059]/60" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#C5A059]/60" />

                {/* Card Top: Salutation */}
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A059] block font-cinzel">
                    Hamper Queen Royal Atelier
                  </span>
                  <h4 className="font-cinzel text-base sm:text-lg font-bold tracking-wide">
                    {recipient || 'To Honored Recipient'}
                  </h4>
                </div>

                {/* Card Body: Dynamic Script */}
                <div className="py-3 flex-1 flex items-center">
                  <p
                    className={`${fontFamily} ${
                      fontFamily === 'font-script'
                        ? 'text-xl sm:text-2xl leading-relaxed'
                        : fontFamily === 'font-brush'
                        ? 'text-lg sm:text-xl leading-relaxed'
                        : 'text-sm sm:text-base leading-relaxed italic'
                    }`}
                  >
                    "{message || 'Your personalized message will be inscribed here...'}"
                  </p>
                </div>

                {/* Card Bottom: Sender & Stamped Wax Seal */}
                <div className="flex items-end justify-between border-t border-[#C5A059]/30 pt-3">
                  <div className="max-w-[180px]">
                    <span className="text-[9px] uppercase tracking-wider opacity-70 block">
                      Cordially Inscribed,
                    </span>
                    <span className="font-cinzel text-xs font-bold truncate block">
                      {sender || 'The Sender'}
                    </span>
                  </div>

                  {/* 3D Wax Seal Impression Stamp */}
                  <div
                    className="w-13 h-13 rounded-full flex items-center justify-center text-white shadow-xl relative border-2 border-[#FFE8A3]/40"
                    style={{
                      backgroundColor: selectedWaxSeal.colorHex,
                      boxShadow: '0 6px 14px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.3)',
                    }}
                    title={selectedWaxSeal.name}
                  >
                    <div className="w-9 h-9 rounded-full border border-dashed border-white/50 flex items-center justify-center">
                      <span className="font-cinzel text-xs font-bold tracking-wider">
                        {selectedWaxSeal.stampDesign === 'crown'
                          ? '👑'
                          : selectedWaxSeal.stampDesign === 'fleur'
                          ? '⚜️'
                          : selectedWaxSeal.stampDesign === 'crest'
                          ? '🛡️'
                          : '🌿'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification when attached */}
              {attachedNotification && (
                <div className="mt-4 p-3 bg-[#F2F8F4] border border-[#38A169]/40 rounded-xl text-center text-xs font-semibold text-[#276749] flex items-center justify-center gap-2">
                  <Check className="w-4 h-4 text-[#38A169]" />
                  <span>Attached to Your Custom Hamper Tray</span>
                </div>
              )}

              {/* Action Buttons beneath preview */}
              <div className="w-full flex items-center gap-2 mt-4">
                <button
                  id="btn-attach-card-hamper"
                  onClick={handleAttach}
                  className="flex-1 py-3 rounded-full bg-[#141414] hover:bg-[#252525] text-[#E5C07B] text-xs font-bold uppercase tracking-wider border border-[#C5A059] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#DFBA54]" />
                  <span>Attach to Hamper</span>
                </button>

                <button
                  onClick={handleCopyMessage}
                  title="Copy Letter Text"
                  className="p-3 rounded-full bg-white text-[#141414] border border-[#D8CCA8] hover:bg-[#FAF9F5] transition-colors cursor-pointer"
                >
                  {copiedNotification ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Customization Controls (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#D4AF37]/30 p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Template Inspiration Pills */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#141414] block">
                Occasion Greeting Inspiration
              </label>
              <div className="flex flex-wrap gap-2">
                {occasionTemplates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => handleApplyTemplate(tpl.text, tpl.label)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#FAF9F5] hover:bg-[#F3EFE6] border border-[#E5DAC2] text-[#423C31] hover:border-[#C5A059] transition-all cursor-pointer"
                  >
                    ✦ {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient & Sender Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#141414] block mb-1">
                  Recipient Name / Salutation
                </label>
                <input
                  id="scribe-recipient-input"
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g., Lady Eleanor Vance"
                  className="w-full text-xs p-3 bg-[#FAF9F5] border border-[#E5DAC2] rounded-xl text-[#141414] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#141414] block mb-1">
                  Sender Sign-off / Signature
                </label>
                <input
                  id="scribe-sender-input"
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="e.g., The Harrington Family"
                  className="w-full text-xs p-3 bg-[#FAF9F5] border border-[#E5DAC2] rounded-xl text-[#141414] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Message Body Textarea */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-[#141414]">
                  Personal Heartfelt Letter
                </label>
                <span className="text-[10px] text-[#787163]">{message.length}/350 chars</span>
              </div>
              <textarea
                id="scribe-message-textarea"
                rows={4}
                maxLength={350}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Compose your royal congratulations or private note..."
                className="w-full text-xs p-3 bg-[#FAF9F5] border border-[#E5DAC2] rounded-xl text-[#141414] focus:outline-none focus:border-[#C5A059] leading-relaxed resize-none"
              />
            </div>

            {/* Stationery Style Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#141414] block">
                Choose Handmade Paper & Letterhead
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'deckle_edge', label: 'Amalfi Deckle-Edge', bg: '#FAF8F0', border: '#D8CCA8' },
                  { id: 'midnight_gold', label: 'Midnight Obsidian & Gold', bg: '#141414', border: '#D4AF37' },
                  { id: 'imperial_crimson', label: 'Imperial Crimson', bg: '#4A0A10', border: '#D4AF37' },
                  { id: 'pearl_white', label: 'Pure Pearl White', bg: '#FFFFFF', border: '#E8DFC9' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      setStationery(st.id as any);
                      royaleLogger.action('RoyalScribe', `Selected stationery: ${st.label}`);
                    }}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      stationery === st.id
                        ? 'border-[#C5A059] bg-[#FAF8F2] ring-2 ring-[#C5A059]/30'
                        : 'border-[#E5DAC2] hover:bg-[#FAF9F5]'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-md mx-auto mb-1.5 border"
                      style={{ backgroundColor: st.bg, borderColor: st.border }}
                    />
                    <span className="text-[11px] font-bold text-[#141414] block truncate">
                      {st.label.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Typography Script Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#141414] block">
                Calligraphy Lettering Style
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'font-script', name: 'Royal Script', sample: 'Pinyon Royal' },
                  { id: 'font-brush', name: 'Flourish Brush', sample: 'Alex Brush' },
                  { id: 'font-cormorant', name: 'Imperial Serif', sample: 'Garamond' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setFontFamily(f.id as any);
                      royaleLogger.action('RoyalScribe', `Selected typography: ${f.name}`);
                    }}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      fontFamily === f.id
                        ? 'border-[#C5A059] bg-[#FAF8F2] ring-2 ring-[#C5A059]/30'
                        : 'border-[#E5DAC2] hover:bg-[#FAF9F5]'
                    }`}
                  >
                    <span className={`text-base block mb-0.5 ${f.id}`}>
                      Royal Script
                    </span>
                    <span className="text-[10px] text-[#787163] uppercase tracking-wider">
                      {f.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Wax Seal Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#141414] block">
                Molten Wax Stamp Crest
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {WAX_SEAL_OPTIONS.map((seal) => (
                  <button
                    key={seal.id}
                    onClick={() => {
                      setWaxSealId(seal.id);
                      royaleLogger.action('RoyalScribe', `Selected seal insignia: ${seal.name}`);
                    }}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      waxSealId === seal.id
                        ? 'border-[#C5A059] bg-[#FAF8F2] ring-2 ring-[#C5A059]/30'
                        : 'border-[#E5DAC2] hover:bg-[#FAF9F5]'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-full mx-auto mb-1.5 flex items-center justify-center text-white text-xs shadow-xs"
                      style={{ backgroundColor: seal.colorHex }}
                    >
                      ✦
                    </div>
                    <span className="text-[11px] font-bold text-[#141414] block truncate">
                      {seal.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
