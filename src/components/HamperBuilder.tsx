import React, { useState } from 'react';
import { Sparkles, Trash2, Plus, Check, Shield, FileText, ArrowRight, RefreshCw, PenTool, Gift } from 'lucide-react';
import { CustomHamper, LuxuryItem, VesselOption, RibbonOption, WaxSealOption, CalligraphyCard } from '../types';
import { VESSEL_OPTIONS, RIBBON_OPTIONS, WAX_SEAL_OPTIONS, LUXURY_ITEMS } from '../data/itemsData';
import { ItemGraphic } from './ItemGraphic';
import { royaleLogger } from '../utils/logger';

interface HamperBuilderProps {
  customHamper: CustomHamper;
  onUpdateHamper: (hamper: CustomHamper) => void;
  onOpenScribe: () => void;
}

export const HamperBuilder: React.FC<HamperBuilderProps> = ({
  customHamper,
  onUpdateHamper,
  onOpenScribe,
}) => {
  const [activeStep, setActiveStep] = useState<'vessel' | 'items' | 'accents' | 'card' | 'summary'>('vessel');
  const [itemCategoryFilter, setItemCategoryFilter] = useState<string>('all');
  const [commissionSubmitted, setCommissionSubmitted] = useState<boolean>(false);

  // Switch vessel
  const handleSelectVessel = (vessel: VesselOption) => {
    onUpdateHamper({
      ...customHamper,
      vessel,
    });
    royaleLogger.action('HamperBuilder', `Selected presentation vessel: ${vessel.name}`);
  };

  // Add item into hamper
  const handleAddItem = (item: LuxuryItem) => {
    if (customHamper.items.length >= customHamper.vessel.capacity) {
      royaleLogger.warn(
        'HamperBuilder',
        `Cannot add "${item.name}". Vessel capacity reached (${customHamper.vessel.capacity} items max).`
      );
      alert(`The ${customHamper.vessel.name} accommodates up to ${customHamper.vessel.capacity} custom items.`);
      return;
    }

    const updated = {
      ...customHamper,
      items: [...customHamper.items, item],
    };
    onUpdateHamper(updated);
    royaleLogger.action('HamperBuilder', `Added "${item.name}" to custom hamper. Total: ${updated.items.length}`);
  };

  // Remove item from hamper
  const handleRemoveItem = (index: number) => {
    const removedItem = customHamper.items[index];
    const newItems = customHamper.items.filter((_, i) => i !== index);
    onUpdateHamper({
      ...customHamper,
      items: newItems,
    });
    royaleLogger.action('HamperBuilder', `Removed "${removedItem.name}" from hamper. Remaining: ${newItems.length}`);
  };

  // Select Ribbon
  const handleSelectRibbon = (ribbon: RibbonOption) => {
    onUpdateHamper({
      ...customHamper,
      ribbon,
    });
    royaleLogger.action('HamperBuilder', `Selected ribbon: ${ribbon.name}`);
  };

  // Select Wax Seal
  const handleSelectWaxSeal = (waxSeal: WaxSealOption) => {
    onUpdateHamper({
      ...customHamper,
      waxSeal,
    });
    royaleLogger.action('HamperBuilder', `Selected wax seal: ${waxSeal.name}`);
  };

  // Reset Hamper
  const handleResetHamper = () => {
    if (confirm('Start a new hamper? Your current build will be cleared.')) {
      onUpdateHamper({
        id: `hamper-${Date.now()}`,
        vessel: VESSEL_OPTIONS[0],
        items: [],
        ribbon: RIBBON_OPTIONS[0],
        waxSeal: WAX_SEAL_OPTIONS[0],
        botanicalSprig: true,
        createdAt: Date.now(),
      });
      setCommissionSubmitted(false);
      royaleLogger.action('HamperBuilder', 'Reset custom hamper to initial state.');
    }
  };

  // Filter items available for addition
  const availableItems = LUXURY_ITEMS.filter((item) => {
    if (item.category === 'royal_hampers' || item.category === 'embellishments') return false;
    if (itemCategoryFilter === 'all') return true;
    return item.category === itemCategoryFilter;
  });

  const capacityPercentage = Math.min(
    100,
    Math.round((customHamper.items.length / customHamper.vessel.capacity) * 100)
  );

  return (
    <section id="atelier-builder-section" className="py-16 bg-white border-b border-[#EAE5D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Atelier Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF5E8] border border-[#EAE0C8] text-[#8C6821] text-xs uppercase tracking-widest font-cinzel font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Interactive Hamper & Bouquet Maker</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#141414] tracking-tight">
            Build Your Hamper
          </h2>
          <p className="font-cormorant text-lg text-[#554F42] mt-2">
            Compose an heirloom presentation. Select your presentation trunk or wrap, assemble artisanal stems and gourmet indulgences, and seal with your choice of royal wax.
          </p>
        </div>

        {/* Builder Main Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Visual Hamper Stage (5 cols) */}
          <div className="lg:col-span-5 space-y-4 sticky top-28">
            <div className="bg-white rounded-3xl border border-[#C5A059]/70 p-6 shadow-xl relative overflow-hidden">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#F2EDE1]">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C6821]">
                    Live Arrangement Stage
                  </span>
                  <span className="font-cinzel text-base font-bold text-[#141414]">
                    {customHamper.vessel.name}
                  </span>
                </div>
                <button
                  onClick={handleResetHamper}
                  title="Reset Curation"
                  className="p-1.5 rounded-full hover:bg-[#F3EFE6] text-[#787163] hover:text-[#800E17] transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Visual Hamper Assembly Canvas */}
              <div className="relative w-full h-80 bg-gradient-to-b from-[#FAF9F5] to-[#F3EFE6] rounded-2xl border border-[#E8E1CE] my-4 p-4 flex flex-col items-center justify-center overflow-hidden">
                {/* Contact shadow */}
                <div className="absolute bottom-6 w-48 h-8 rounded-full bg-black/10 filter blur-md" />

                {/* Vessel Base Graphic */}
                <div className="relative z-10">
                  <ItemGraphic id={customHamper.vessel.imageSvgId} size="xl" />
                </div>

                {/* Layered Nested Items Grid overlay */}
                {customHamper.items.length > 0 && (
                  <div className="absolute top-6 inset-x-8 z-20 flex flex-wrap items-center justify-center gap-1.5 p-2 bg-white/85 backdrop-blur-xs rounded-xl border border-[#D4AF37]/30 shadow-md">
                    {customHamper.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="relative group p-1 bg-[#FAF9F5] rounded-lg border border-[#E5DAC2] flex items-center gap-1.5"
                      >
                        <ItemGraphic id={it.imageSvgId} size="sm" className="w-8 h-8" />
                        <span className="text-[10px] font-medium text-[#141414] max-w-[80px] truncate">
                          {it.name}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(idx)}
                          className="text-[#800E17] hover:text-red-700 p-0.5 rounded cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Ribbon and Wax Seal Accent Overlay at bottom */}
                <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between px-3 py-1.5 bg-white/90 backdrop-blur-xs rounded-full border border-[#D8CCA8] shadow-xs text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: customHamper.ribbon.colorHex }}
                    />
                    <span className="text-[11px] font-medium text-[#443E33]">
                      {customHamper.ribbon.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-[#8C6821]">
                    <span>Seal:</span>
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: customHamper.waxSeal.colorHex }}
                    />
                    <span>{customHamper.waxSeal.stampDesign.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#5A5447]">Hamper Fill Capacity</span>
                  <span className="font-bold text-[#141414]">
                    {customHamper.items.length} of {customHamper.vessel.capacity} slots filled
                  </span>
                </div>
                <div className="w-full h-2 bg-[#EAE4D5] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#AA771C] transition-all duration-300"
                    style={{ width: `${capacityPercentage}%` }}
                  />
                </div>
              </div>

              {/* Card status notice */}
              <div className="mt-4 p-3 bg-[#FAF8F2] rounded-xl border border-[#D4AF37]/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-[#800E17]" />
                  <span>
                    {customHamper.card
                      ? `Card for: "${customHamper.card.recipient || 'Beloved Recipient'}"`
                      : 'No calligraphy card attached yet'}
                  </span>
                </div>
                <button
                  onClick={onOpenScribe}
                  className="text-xs font-semibold text-[#800E17] hover:underline cursor-pointer"
                >
                  {customHamper.card ? 'Edit Card' : 'Compose'}
                </button>
              </div>

              {/* Quick Jump to Summary */}
              {customHamper.items.length > 0 && (
                <button
                  onClick={() => setActiveStep('summary')}
                  className="w-full mt-4 py-3 rounded-xl bg-[#141414] hover:bg-[#252525] text-[#E5C07B] text-xs font-semibold uppercase tracking-wider border border-[#C5A059] flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <span>Review & Finalize Commission</span>
                  <ArrowRight className="w-4 h-4 text-[#DFBA54]" />
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Configuration Tabs (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#D4AF37]/30 p-6 sm:p-8 shadow-sm">
            
            {/* Step Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-4 mb-6 overflow-x-auto gap-2 scrollbar-none">
              {[
                { id: 'vessel', label: '1. Vessel & Base' },
                { id: 'items', label: `2. Curate Items (${customHamper.items.length})` },
                { id: 'accents', label: '3. Ribbons & Seals' },
                { id: 'summary', label: '4. Royal Manifest' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  id={`builder-tab-${tab.id}`}
                  onClick={() => {
                    setActiveStep(tab.id as any);
                    royaleLogger.action('HamperBuilder', `Navigated to step: ${tab.label}`);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                    activeStep === tab.id
                      ? 'bg-[#141414] text-[#E5C07B] shadow-xs'
                      : 'text-[#615A4C] hover:bg-[#F3EFE6]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* STEP 1: VESSEL & BASE SELECTION */}
            {activeStep === 'vessel' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-[#141414]">
                    Select Your Presentation Vessel
                  </h3>
                  <p className="font-cormorant text-sm text-[#5C5648] mt-1">
                    The box sets the size and style of your hamper. All vessels are sturdy and reusable—built to be kept.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {VESSEL_OPTIONS.map((v) => {
                    const isSelected = customHamper.vessel.id === v.id;
                    return (
                      <div
                        key={v.id}
                        id={`vessel-card-${v.id}`}
                        onClick={() => handleSelectVessel(v)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#C5A059] bg-[#FAF8F2] ring-2 ring-[#C5A059]/30 shadow-md'
                            : 'border-[#E5DAC2] bg-white hover:border-[#C5A059] hover:bg-[#FAF9F5]'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6821]">
                              {v.tier} Tier
                            </span>
                            <h4 className="font-cinzel text-base font-bold text-[#141414] mt-0.5">
                              {v.name}
                            </h4>
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-[#141414] text-[#E5C07B] flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-[#DFBA54]" />
                            </div>
                          )}
                        </div>

                        <div className="h-32 flex items-center justify-center my-3">
                          <ItemGraphic id={v.imageSvgId} size="md" />
                        </div>

                        <div className="space-y-1 text-xs">
                          <p className="font-cormorant text-xs text-[#5C5648] italic">
                            {v.subtitle}
                          </p>
                          <div className="flex items-center justify-between text-[11px] text-[#7C7465] pt-2 border-t border-[#F0EAE0]">
                            <span>Cap: {v.capacity} items</span>
                            <span>{v.dimensions}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setActiveStep('items')}
                    className="px-6 py-3 rounded-full bg-[#141414] text-[#E5C07B] text-xs font-semibold tracking-wider uppercase border border-[#C5A059] flex items-center gap-2 cursor-pointer shadow-sm hover:bg-[#222222]"
                  >
                    <span>Proceed to Curate Items</span>
                    <ArrowRight className="w-4 h-4 text-[#DFBA54]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: CURATE ITEMS */}
            {activeStep === 'items' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-cinzel text-xl font-bold text-[#141414]">
                      Add Luxuries & Stems
                    </h3>
                    <p className="font-cormorant text-sm text-[#5C5648]">
                      Pick from Ecuadorian roses, 24K gold confections, crystal flutes, and Grasse fragrances.
                    </p>
                  </div>

                  {/* Sub-category tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'artisanal_bouquets', label: 'Blooms' },
                      { id: 'gourmet_sweets', label: 'Sweets' },
                      { id: 'royal_fragrances', label: 'Scents' },
                      { id: 'keepsake_vessels', label: 'Crystal' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setItemCategoryFilter(tab.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          itemCategoryFilter === tab.id
                            ? 'bg-[#141414] text-[#E5C07B]'
                            : 'bg-[#FAF9F5] text-[#554F42] hover:bg-[#EFEAE0]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Available Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
                  {availableItems.map((item) => {
                    const isAlreadyInHamper = customHamper.items.some((it) => it.id === item.id);
                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl border border-[#E5DAC2] hover:border-[#C5A059] bg-[#FAF9F5] flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="w-16 h-16 flex-shrink-0 bg-white rounded-xl border border-[#EFECE3] p-1 flex items-center justify-center">
                          <ItemGraphic id={item.imageSvgId} size="sm" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-cinzel text-xs font-bold text-[#141414] truncate">
                            {item.name}
                          </h4>
                          <p className="font-cormorant text-xs text-[#635D50] truncate">
                            {item.subtitle}
                          </p>
                          <span className="text-[10px] text-[#8C6821] font-semibold">
                            ✦ {item.royalHighlights[0]}
                          </span>
                        </div>

                        <button
                          id={`btn-add-builder-item-${item.id}`}
                          onClick={() => handleAddItem(item)}
                          className="p-2 rounded-xl bg-[#141414] hover:bg-[#252525] text-[#E5C07B] transition-colors cursor-pointer flex-shrink-0"
                          title="Add to hamper"
                        >
                          <Plus className="w-4 h-4 text-[#DFBA54]" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-between items-center border-t border-[#F0EAE0]">
                  <button
                    onClick={() => setActiveStep('vessel')}
                    className="text-xs font-semibold text-[#665F51] hover:text-[#141414] cursor-pointer"
                  >
                    ← Back to Vessel Selection
                  </button>
                  <button
                    onClick={() => setActiveStep('accents')}
                    className="px-6 py-3 rounded-full bg-[#141414] text-[#E5C07B] text-xs font-semibold tracking-wider uppercase border border-[#C5A059] flex items-center gap-2 cursor-pointer shadow-sm hover:bg-[#222222]"
                  >
                    <span>Proceed to Ribbons & Wax Seals</span>
                    <ArrowRight className="w-4 h-4 text-[#DFBA54]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: RIBBONS & WAX SEALS */}
            {activeStep === 'accents' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-[#141414]">
                    Select Finishing Accoutrements
                  </h3>
                  <p className="font-cormorant text-sm text-[#5C5648] mt-1">
                    Every parcel is crowned with an architectural hand-tied satin bow and an authentic molten wax impression.
                  </p>
                </div>

                {/* Ribbon Selector */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#141414] block">
                    Double-Faced Satin Silk Ribbon
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {RIBBON_OPTIONS.map((ribbon) => {
                      const isSelected = customHamper.ribbon.id === ribbon.id;
                      return (
                        <div
                          key={ribbon.id}
                          onClick={() => handleSelectRibbon(ribbon)}
                          className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#C5A059] bg-[#FAF8F2] ring-2 ring-[#C5A059]/30'
                              : 'border-[#E5DAC2] bg-white hover:bg-[#FAF9F5]'
                          }`}
                        >
                          <div
                            className="w-7 h-7 rounded-full mx-auto mb-2 border border-black/10 shadow-xs"
                            style={{ backgroundColor: ribbon.colorHex }}
                          />
                          <span className="text-xs font-bold text-[#141414] block truncate">
                            {ribbon.name.split(' ')[0]}
                          </span>
                          <span className="text-[10px] text-[#787163] block truncate">
                            {ribbon.material.split(' ')[0]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Wax Seal Selector */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#141414] block">
                    Hand-Stamped Wax Seal Insignia
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {WAX_SEAL_OPTIONS.map((seal) => {
                      const isSelected = customHamper.waxSeal.id === seal.id;
                      return (
                        <div
                          key={seal.id}
                          onClick={() => handleSelectWaxSeal(seal)}
                          className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#C5A059] bg-[#FAF8F2] ring-2 ring-[#C5A059]/30'
                              : 'border-[#E5DAC2] bg-white hover:bg-[#FAF9F5]'
                          }`}
                        >
                          <div
                            className="w-8 h-8 rounded-full mx-auto mb-1.5 flex items-center justify-center text-white text-xs font-bold shadow-md"
                            style={{ backgroundColor: seal.colorHex }}
                          >
                            ✦
                          </div>
                          <span className="text-xs font-bold text-[#141414] block truncate">
                            {seal.name}
                          </span>
                          <span className="text-[10px] text-[#787163] block">
                            {seal.stampDesign.toUpperCase()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Botanical Sprig & Brass Monogram Inscription */}
                <div className="space-y-4 pt-4 border-t border-[#F0EAE0]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#141414] block">
                        Include Preserved Golden Ruscus Sprig
                      </span>
                      <span className="text-[11px] text-[#6E685C]">
                        Tucked beneath the wax seal ribbon
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={customHamper.botanicalSprig}
                      onChange={(e) =>
                        onUpdateHamper({
                          ...customHamper,
                          botanicalSprig: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-[#C5A059] rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#141414] block mb-1">
                      Custom Brass Plaque Monogram (Optional)
                    </label>
                    <input
                      type="text"
                      maxLength={32}
                      placeholder="e.g., Lord & Lady Harrington 2026"
                      value={customHamper.customEngraving || ''}
                      onChange={(e) =>
                        onUpdateHamper({
                          ...customHamper,
                          customEngraving: e.target.value,
                        })
                      }
                      className="w-full text-xs p-3 bg-[#FAF9F5] border border-[#E5DAC2] rounded-xl text-[#141414] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center border-t border-[#F0EAE0]">
                  <button
                    onClick={() => setActiveStep('items')}
                    className="text-xs font-semibold text-[#665F51] hover:text-[#141414] cursor-pointer"
                  >
                    ← Back to Items
                  </button>
                  <button
                    onClick={() => setActiveStep('summary')}
                    className="px-6 py-3 rounded-full bg-[#141414] text-[#E5C07B] text-xs font-semibold tracking-wider uppercase border border-[#C5A059] flex items-center gap-2 cursor-pointer shadow-sm hover:bg-[#222222]"
                  >
                    <span>Review Royal Manifest</span>
                    <ArrowRight className="w-4 h-4 text-[#DFBA54]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: SUMMARY & COMMISSION MANIFEST */}
            {activeStep === 'summary' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-[#141414]">
                    Royal Commission Manifest
                  </h3>
                  <p className="font-cormorant text-sm text-[#5C5648] mt-1">
                    Your hamper is ready. Review the itemized list below before confirming your order.
                  </p>
                </div>

                {/* Manifest Card */}
                <div className="bg-[#FAF9F5] rounded-2xl border border-[#C5A059]/70 p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E8DFC9] pb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C6821]">
                        Commission ID
                      </span>
                      <h4 className="font-cinzel text-base font-bold text-[#141414]">
                        #ROYALE-ATELIER-{(customHamper.id.slice(-6)).toUpperCase()}
                      </h4>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 bg-white rounded-full border border-[#D4AF37]/30 text-[#141414]">
                      {customHamper.vessel.tier} Tier Commission
                    </span>
                  </div>

                  {/* Vessel Specification */}
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#141414]">Selected Presentation Base:</span>
                    <p className="text-xs text-[#554F42]">
                      {customHamper.vessel.name} ({customHamper.vessel.colorName}, {customHamper.vessel.dimensions})
                    </p>
                  </div>

                  {/* Included Items Manifest */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#141414]">
                      Curated Masterpieces ({customHamper.items.length}):
                    </span>
                    {customHamper.items.length === 0 ? (
                      <p className="text-xs text-[#800E17] italic">
                        No items added yet. Please return to Step 2 to populate your vessel.
                      </p>
                    ) : (
                      <ul className="space-y-1 pl-3 text-xs text-[#443E33]">
                        {customHamper.items.map((it, idx) => (
                          <li key={idx} className="list-disc">
                            <strong>{it.name}</strong> — {it.subtitle}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Ribbon & Seal */}
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-[#E8DFC9]">
                    <div>
                      <span className="font-bold text-[#141414] block">Satin Ribbon:</span>
                      <span className="text-[#554F42]">{customHamper.ribbon.name}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#141414] block">Wax Impression:</span>
                      <span className="text-[#554F42]">{customHamper.waxSeal.name}</span>
                    </div>
                  </div>

                  {/* Calligraphy Card summary */}
                  <div className="pt-2 text-xs border-t border-[#E8DFC9]">
                    <span className="font-bold text-[#141414] block">Attached Calligraphy Card:</span>
                    {customHamper.card ? (
                      <div className="bg-white p-3 rounded-lg border border-[#E5DAC2] mt-1 italic text-[#383329]">
                        "{customHamper.card.message}" — <strong className="not-italic">{customHamper.card.recipient}</strong>
                      </div>
                    ) : (
                      <span className="text-[#787163] italic">No personalized card attached.</span>
                    )}
                  </div>

                  {/* Custom Engraving */}
                  {customHamper.customEngraving && (
                    <div className="text-xs border-t border-[#E8DFC9] pt-2">
                      <span className="font-bold text-[#141414] block">Brass Plate Inscription:</span>
                      <span className="font-serif italic text-[#800E17] tracking-wider">
                        "{customHamper.customEngraving}"
                      </span>
                    </div>
                  )}
                </div>

                {/* Submission Confirmation */}
                {commissionSubmitted ? (
                  <div className="p-4 bg-[#F2F8F4] border border-[#38A169]/40 rounded-2xl text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-[#38A169] text-white mx-auto flex items-center justify-center">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="font-cinzel text-base font-bold text-[#22543D]">
                      Royal Commission Dispatched to Concierge
                    </h4>
                    <p className="text-xs text-[#2F855A]">
                      Your inquiry has been logged. A Hamper Queen concierge will contact you within 2 hours to confirm delivery timeline and presentation specifics.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      id="btn-submit-commission"
                      onClick={() => {
                        setCommissionSubmitted(true);
                        royaleLogger.action(
                          'HamperBuilder',
                          `User submitted Royal Commission #${customHamper.id} with ${customHamper.items.length} items.`
                        );
                      }}
                      className="w-full sm:flex-1 py-4 rounded-full bg-[#141414] hover:bg-[#252525] text-[#E5C07B] text-xs font-bold uppercase tracking-wider border border-[#C5A059] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Gift className="w-4 h-4 text-[#DFBA54]" />
                      <span>Confirm Custom Hamper Request</span>
                    </button>

                    <button
                      onClick={() => {
                        const jsonStr = JSON.stringify(customHamper, null, 2);
                        const blob = new Blob([jsonStr], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `Hamper_Queen_Manifest_${customHamper.id}.json`;
                        a.click();
                        royaleLogger.action('HamperBuilder', 'Exported manifest JSON.');
                      }}
                      className="w-full sm:w-auto px-5 py-4 rounded-full bg-white text-[#141414] text-xs font-semibold uppercase tracking-wider border border-[#D8CCA8] hover:bg-[#FAF9F5] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-[#8C6821]" />
                      <span>Export Manifest</span>
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};
