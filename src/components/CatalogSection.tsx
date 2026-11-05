import React, { useState } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  Plus,
  Eye,
  Check,
  Upload,
  X,
  MapPin,
} from 'lucide-react';
import { LuxuryItem } from '../types';
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
    royaleLogger.action('Catalog', `Added item to Cart: "${item.name}"`);
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
    <section id="collections-section" className="section bg-white">
      <div className="container-page">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-50 border border-line-strong text-gold-700 text-xs font-sans font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gold-700" />
            <span>Curated Gifting Masterpieces</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-ink tracking-tight">
            Individual Treasures & Ingredients
          </h2>
          <p className="font-cormorant text-lg text-cocoa mt-2">
            Explore our artisanal confectioneries, rare Kashmiri saffron, luxury fragrances, and signature keepsake trunks available for custom curations.
          </p>
        </div>

        {/* Global Toast Notification when added */}
        {addedItemNotice && (
          <div className="fixed bottom-6 right-6 z-50 bg-ink text-gold-300 border border-gold-500 px-5 py-3 rounded-xl shadow-float flex items-center gap-3 animate-bounce">
            <Check className="w-5 h-5 text-gold-300" />
            <span className="text-xs font-semibold tracking-wide">
              Added to Cart: <strong className="text-white">{addedItemNotice}</strong>
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
                className={`px-4 py-2 rounded-full text-xs font-semibold  whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-ink text-gold-100 shadow-soft'
                    : 'bg-white text-[#4A463E] border border-line hover:border-gold-500 hover:bg-[#F8F5EC]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Occasion Sub-Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-gold-400/30 shadow-soft">
            {/* Search input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gold-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="catalog-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stems, saffron, trunks, flutes..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-cream-100 border border-line-strong rounded-xl text-ink placeholder-[#8C867A] focus:outline-none focus:border-gold-500"
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
              <Filter className="w-3.5 h-3.5 text-gold-700" />
              <span className="text-xs font-semibold text-[#5A554A]">Occasion:</span>
              <select
                id="catalog-occasion-select"
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value)}
                className="text-xs bg-cream-100 border border-line-strong rounded-xl px-3 py-2 text-ink focus:outline-none focus:border-gold-500 cursor-pointer"
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
          <div className="text-center py-16 bg-white rounded-3xl border border-gold-400/30 p-8">
            <p className="font-cinzel text-xl text-ink">No curations match your criteria</p>
            <p className="font-cormorant text-sm text-[#756E60] mt-1">
              Try adjusting your search query or reset the occasion filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedOccasion('all');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2 rounded-full bg-ink text-gold-100 text-xs font-semibold cursor-pointer"
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
                  className="group bg-white rounded-3xl border border-gold-400/30 hover:border-gold-500 p-6 flex flex-col justify-between transition-all duration-250 hover:shadow-float relative"
                >
                  {/* Card Top Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F5ECCF] text-[#876117] border border-gold-400/30">
                      {item.estimatedTier}
                    </span>
                    <span className="text-xs font-medium text-[#7C7465] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gold-500" />
                      <span>{item.origin?.split(',')[0]}</span>
                    </span>
                  </div>

                  {/* Isolated Background-Removed Graphic Stage */}
                  <div className="relative w-full h-56 flex items-center justify-center p-4 bg-cream-100 rounded-2xl border border-[#F2EDE1] group-hover:bg-[#FDFBF7] transition-colors mb-5 overflow-hidden">
                    <ItemGraphic
                      id={item.imageSvgId}
                      customImage={customImg}
                      size="lg"
                      className="transform group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Local User Image Upload Trigger Button */}
                    <label
                      title="Upload custom local photo for this item"
                      className="absolute bottom-2.5 right-2.5 p-1.5 rounded-full bg-white/90 hover:bg-white text-cocoa hover:text-ink border border-line-strong shadow-soft cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
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
                    <h3 className="font-cinzel text-lg font-bold text-ink group-hover:text-gold-700 transition-colors">
                      {item.name}
                    </h3>
                    <p className="font-cormorant text-sm text-cocoa line-clamp-2 leading-relaxed">
                      {item.subtitle}
                    </p>

                    {/* Royal Highlights */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {item.royalHighlights.slice(0, 2).map((highlight, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-medium text-cocoa bg-[#F7F4EC] px-2 py-0.5 rounded-md border border-line"
                        >
                          ✦ {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions (Inspect & Add to Hamper) */}
                  <div className="pt-5 mt-4 border-t border-cream-200 flex items-center gap-2">
                    <button
                      id={`btn-inspect-${item.id}`}
                      onClick={() => {
                        setActiveModalItem(item);
                        royaleLogger.action('Catalog', `Inspected details: ${item.name}`);
                      }}
                      className="flex-1 py-3 px-3 rounded-xl bg-cream-100 hover:bg-cream-200 text-ink text-xs font-semibold border border-line-strong transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-gold-700" />
                      <span>Details</span>
                    </button>

                    <button
                      id={`btn-add-hamper-${item.id}`}
                      onClick={() => handleAddItem(item)}
                      className="flex-1 py-3 px-3 rounded-xl bg-ink hover:bg-ink-soft text-gold-100 text-xs font-semibold border border-gold-500 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-soft"
                    >
                      <Plus className="w-3.5 h-3.5 text-gold-300" />
                      <span>Add to Cart</span>
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
            <div className="bg-cream-100 rounded-3xl border border-gold-500/70 max-w-2xl w-full p-6 sm:p-8 shadow-float relative max-h-[90dvh] overflow-y-auto">
              
              {/* Close Button */}
              <button
                id="btn-close-item-modal"
                onClick={() => setActiveModalItem(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white border border-line text-cocoa hover:text-ink transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                {/* Graphic Preview */}
                <div className="sm:col-span-5 bg-white rounded-2xl border border-line-strong p-6 flex flex-col items-center justify-center">
                  <ItemGraphic
                    id={activeModalItem.imageSvgId}
                    customImage={userUploadedImages[activeModalItem.id]}
                    size="xl"
                  />
                  <span className="text-xs text-gold-700 font-semibold mt-3">
                    {activeModalItem.palette.label}
                  </span>
                </div>

                {/* Details Narrative */}
                <div className="sm:col-span-7 space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-gold-700">
                      {activeModalItem.category.replace('_', ' ')}
                    </span>
                    <h3 className="font-cinzel text-2xl font-bold text-ink">
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
                  <div className="bg-white rounded-xl p-3 border border-line-strong space-y-1.5">
                    <span className="text-xs font-semibold text-ink block">
                      Provenance & Specifications
                    </span>
                    {activeModalItem.details.map((detail, idx) => (
                      <div key={idx} className="text-xs text-[#524B3E] flex items-start gap-1.5">
                        <span className="text-gold-500 font-bold">✓</span>
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
                      className="w-full py-3 rounded-full bg-ink text-gold-100 font-semibold text-xs border border-gold-500 shadow-lift hover:bg-ink-soft transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-gold-300" />
                      <span>Add to Cart</span>
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
