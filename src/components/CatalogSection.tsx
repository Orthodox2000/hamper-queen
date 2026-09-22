import React, { useState } from 'react';
import { Search, Filter, Sparkles, Plus, Eye, Check, Upload, X, Shield, MapPin } from 'lucide-react';
import { LuxuryItem, ItemCategory } from '../types';
import { LUXURY_ITEMS } from '../data/itemsData';
import { ItemGraphic } from './ItemGraphic';
import { royaleLogger } from '../utils/logger';

interface CatalogSectionProps {
  onAddItemToHamper: (item: LuxuryItem) => void;
  onCustomizeItem?: (item: LuxuryItem) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  onAddItemToHamper,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');
  const [activeModalItem, setActiveModalItem] = useState<LuxuryItem | null>(null);
  const [userUploadedImages, setUserUploadedImages] = useState<Record<string, string>>({});
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Curations' },
    { id: 'royal_hampers', label: 'Royal Hampers & Trunks' },
    { id: 'artisanal_bouquets', label: 'Artisanal Floral Bouquets' },
    { id: 'gourmet_sweets', label: 'Gourmet Sweets & Saffron' },
    { id: 'royal_fragrances', label: 'Royal Fragrances' },
    { id: 'keepsake_vessels', label: 'Keepsake Crystal & Vessels' },
    { id: 'embellishments', label: 'Ribbons & Wax Seals' },
  ];

  const occasions = [
    'all',
    'Royal Weddings',
    'Milestone Anniversaries',
    'VVIP Corporate Honors',
    'Festive Celebrations',
    'Grand Proposals',
    'Diplomatic Gifting',
  ];

  // Filtering items
  const filteredItems = LUXURY_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesOccasion =
      selectedOccasion === 'all' || item.occasions.includes(selectedOccasion);
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.royalHighlights.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesOccasion && matchesSearch;
  });

  const handleAddItem = (item: LuxuryItem) => {
    onAddItemToHamper(item);
    setAddedItemNotice(item.name);
    royaleLogger.action('Catalog', `Added item to Custom Hamper Tray: "${item.name}"`);
    setTimeout(() => {
      setAddedItemNotice(null);
    }, 2800);
  };

  // Allow client to upload their own photo locally for any item (as requested: "support to user uploaded images")
  const handleImageUpload = (itemId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setUserUploadedImages((prev) => ({
            ...prev,
            [itemId]: reader.result as string,
          }));
          royaleLogger.action('Catalog', `User uploaded custom local photo for item: ${itemId}`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section id="collections-section" className="py-16 bg-white border-b border-[#EAE5D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF5E8] border border-[#EAE0C8] text-[#8C6821] text-xs uppercase tracking-widest font-cinzel font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Curated Gifting Masterpieces</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#141414] tracking-tight">
            Individual Treasures & Ingredients
          </h2>
          <p className="font-cormorant text-lg text-[#524B40] mt-2">
            Explore our artisanal confectioneries, rare Kashmiri saffron, luxury fragrances, and signature keepsake trunks available for custom curations.
          </p>
        </div>

        {/* Global Toast Notification when added */}
        {addedItemNotice && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#141414] text-[#E5C07B] border border-[#C5A059] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
            <Check className="w-5 h-5 text-[#DFBA54]" />
            <span className="text-xs font-semibold tracking-wide">
              Added to Custom Tray: <strong className="text-white">{addedItemNotice}</strong>
            </span>
          </div>
        )}

        {/* Filter Controls: Categories, Search, Occasion */}
        <div className="space-y-4 mb-10">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`cat-tab-${cat.id}`}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  royaleLogger.action('Catalog', `Filtered category: ${cat.label}`);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#141414] text-[#E5C07B] shadow-xs'
                    : 'bg-white text-[#4A463E] border border-[#E2DAC6] hover:border-[#C5A059] hover:bg-[#F8F5EC]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Occasion Sub-Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-[#D4AF37]/30 shadow-xs">
            {/* Search input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#8C6821] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="catalog-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stems, saffron, trunks, flutes..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-[#FAF9F5] border border-[#E5DAC2] rounded-xl text-[#141414] placeholder-[#8C867A] focus:outline-none focus:border-[#C5A059]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Occasion Filter Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-[#8C6821]" />
              <span className="text-xs font-semibold text-[#5A554A] uppercase tracking-wider">Occasion:</span>
              <select
                id="catalog-occasion-select"
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value)}
                className="text-xs bg-[#FAF9F5] border border-[#E5DAC2] rounded-xl px-3 py-2 text-[#141414] focus:outline-none focus:border-[#C5A059] cursor-pointer"
              >
                {occasions.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ === 'all' ? 'All Occasions' : occ}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Populated Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#D4AF37]/30 p-8">
            <p className="font-cinzel text-xl text-[#141414]">No curations match your criteria</p>
            <p className="font-cormorant text-sm text-[#756E60] mt-1">
              Try adjusting your search query or reset the occasion filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedOccasion('all');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2 rounded-full bg-[#141414] text-[#E5C07B] text-xs font-semibold tracking-wider uppercase cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => {
              const customImg = userUploadedImages[item.id];
              return (
                <div
                  key={item.id}
                  id={`item-card-${item.id}`}
                  className="group bg-white rounded-3xl border border-[#D4AF37]/30 hover:border-[#C5A059] p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl relative"
                >
                  {/* Card Top Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-[#F5ECCF] text-[#876117] border border-[#D4AF37]/30">
                      {item.estimatedTier}
                    </span>
                    <span className="text-[10px] font-medium text-[#7C7465] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#C5A059]" />
                      <span>{item.origin?.split(',')[0]}</span>
                    </span>
                  </div>

                  {/* Isolated Background-Removed Graphic Stage */}
                  <div className="relative w-full h-56 flex items-center justify-center p-4 bg-[#FAF9F5] rounded-2xl border border-[#F2EDE1] group-hover:bg-[#FDFBF7] transition-colors mb-5 overflow-hidden">
                    <ItemGraphic
                      id={item.imageSvgId}
                      customImage={customImg}
                      size="lg"
                      className="transform group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Local User Image Upload Trigger Button */}
                    <label
                      title="Upload custom local photo for this item"
                      className="absolute bottom-2.5 right-2.5 p-1.5 rounded-full bg-white/90 hover:bg-white text-[#554F42] hover:text-[#141414] border border-[#D8CCA8] shadow-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(item.id, e)}
                      />
                    </label>
                  </div>

                  {/* Item Typography & Details */}
                  <div className="space-y-2 flex-1">
                    <h3 className="font-cinzel text-lg font-bold text-[#141414] group-hover:text-[#8C6821] transition-colors">
                      {item.name}
                    </h3>
                    <p className="font-cormorant text-sm text-[#5C5648] line-clamp-2 leading-relaxed">
                      {item.subtitle}
                    </p>

                    {/* Royal Highlights */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {item.royalHighlights.slice(0, 2).map((highlight, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium text-[#4A4437] bg-[#F7F4EC] px-2 py-0.5 rounded-md border border-[#E8E1CE]"
                        >
                          ✦ {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions (Inspect & Add to Hamper) */}
                  <div className="pt-5 mt-4 border-t border-[#F2ECE0] flex items-center gap-2">
                    <button
                      id={`btn-inspect-${item.id}`}
                      onClick={() => {
                        setActiveModalItem(item);
                        royaleLogger.action('Catalog', `Inspected details: ${item.name}`);
                      }}
                      className="flex-1 py-3 px-3 rounded-xl bg-[#FAF9F5] hover:bg-[#F2ECE0] text-[#141414] text-xs font-semibold tracking-wider uppercase border border-[#D8CCA8] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#8C6821]" />
                      <span>Details</span>
                    </button>

                    <button
                      id={`btn-add-hamper-${item.id}`}
                      onClick={() => handleAddItem(item)}
                      className="flex-1 py-3 px-3 rounded-xl bg-[#141414] hover:bg-[#262626] text-[#E5C07B] text-xs font-semibold tracking-wider uppercase border border-[#C5A059] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#DFBA54]" />
                      <span>Add to Tray</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detailed Item Modal */}
        {activeModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[#FAF9F5] rounded-3xl border border-[#C5A059]/70 max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              
              {/* Close Button */}
              <button
                id="btn-close-item-modal"
                onClick={() => setActiveModalItem(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white border border-[#E2DAC6] text-[#554F42] hover:text-[#141414] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                {/* Graphic Preview */}
                <div className="sm:col-span-5 bg-white rounded-2xl border border-[#E5DAC2] p-6 flex flex-col items-center justify-center">
                  <ItemGraphic
                    id={activeModalItem.imageSvgId}
                    customImage={userUploadedImages[activeModalItem.id]}
                    size="xl"
                  />
                  <span className="text-[10px] text-[#8C6821] font-semibold uppercase tracking-widest mt-3">
                    {activeModalItem.palette.label}
                  </span>
                </div>

                {/* Details Narrative */}
                <div className="sm:col-span-7 space-y-4">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-widest text-[#8C6821]">
                      {activeModalItem.category.replace('_', ' ')}
                    </span>
                    <h3 className="font-cinzel text-2xl font-bold text-[#141414]">
                      {activeModalItem.name}
                    </h3>
                    <p className="font-cormorant text-sm italic text-[#635C4E] mt-1">
                      {activeModalItem.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-[#423D33] leading-relaxed">
                    {activeModalItem.description}
                  </p>

                  {/* Specifications checklist */}
                  <div className="bg-white rounded-xl p-3 border border-[#EADFC7] space-y-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#141414] block">
                      Provenance & Specifications
                    </span>
                    {activeModalItem.details.map((detail, idx) => (
                      <div key={idx} className="text-xs text-[#524B3E] flex items-start gap-1.5">
                        <span className="text-[#C5A059] font-bold">✓</span>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>

                  {/* Modal Action */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      id="btn-modal-add-hamper"
                      onClick={() => {
                        handleAddItem(activeModalItem);
                        setActiveModalItem(null);
                      }}
                      className="w-full py-3 rounded-full bg-[#141414] text-[#E5C07B] font-semibold text-xs tracking-wider uppercase border border-[#C5A059] shadow-md hover:bg-[#222222] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#DFBA54]" />
                      <span>Add to Custom Tray</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
