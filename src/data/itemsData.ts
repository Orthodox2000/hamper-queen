import { LuxuryItem, VesselOption, RibbonOption, WaxSealOption, BrochureItem } from '../types';

export const LUXURY_ITEMS: LuxuryItem[] = [
  // --- ROYAL HAMPERS ---
  {
    id: 'hamper-crown-sovereign',
    name: 'The Crown Sovereign Imperial Trunk',
    category: 'royal_hampers',
    subtitle: 'Handcrafted Ivory Trunk with 24K Gilded Accents & Grand Epicurean Treasury',
    description:
      'Our signature gift. Packed in an ivory velvet trunk with brass fittings and filled with vintage preserves, 24K gold-dusted Belgian truffles, cold-pressed Himalayan honey, and ceremonial saffron tea.',
    details: [
      'Dimensions: 48cm × 34cm × 22cm',
      'Keepsake velvet-lined wood trunk with engraved brass latches',
      'Accompanied by custom calligraphy deckle-edge royal scroll',
      'Hand-tied with 40mm double-faced Italian satin gold ribbon',
      'White-glove climate-controlled presentation delivery',
    ],
    royalHighlights: ['24K Gold Dust Accents', 'Heirloom Brass Fitted Chest', 'VVIP Signature Commission'],
    occasions: ['Royal Weddings', 'Milestone Anniversaries', 'VVIP Corporate Honors', 'Diplomatic Gifting'],
    palette: { primary: '#C5A059', accent: '#800E17', label: 'Gold & Velvet Crimson' },
    imageSvgId: 'hamper-crown-sovereign',
    estimatedTier: 'Sovereign',
    approximateUnitValue: 450,
    isFeatured: true,
    customizable: true,
    origin: 'Studio Signature, Hand-assembled',
  },
  {
    id: 'hamper-imperial-wicker',
    name: 'The Imperial Golden Wicker Basket',
    category: 'royal_hampers',
    subtitle: 'Traditional Willow Hand-woven Hamper with Fine Silk Scalloped Lining',
    description:
      'An English countryside tradition elevated to regal heights. Hand-woven willow stained in light golden honey, lined with raw mulberry silk, and brimming with artisanal confections, fine estate preserves, and golden flutes.',
    details: [
      'Dimensions: 44cm × 30cm × 26cm',
      'Sustainably harvested golden willow with leather buckled straps',
      'Removable washable silk liner with scallop hem',
      'Includes pair of gold-rimmed crystal flutes and celebratory treats',
    ],
    royalHighlights: ['Artisan Hand-woven Willow', 'Mulberry Silk Lining', 'Timeless Heritage Appeal'],
    occasions: ['Festive Feasts', 'Grand Housewarmings', 'Luxury Picnics', 'Corporate Gratitude'],
    palette: { primary: '#D4AF37', accent: '#113357', label: 'Honey Gold & Sapphire' },
    imageSvgId: 'hamper-imperial-wicker',
    estimatedTier: 'Imperial',
    approximateUnitValue: 290,
    isFeatured: true,
    customizable: true,
    origin: 'Heritage Willow Crafts, Wiltshire',
  },
  {
    id: 'hamper-midnight-monarch',
    name: 'The Midnight Monarch Parisian Hatbox',
    category: 'royal_hampers',
    subtitle: 'Matte Ebony & Gold Foil Silhouette with Velvet Crimson Interior',
    description:
      'Dramatic, mysterious, and effortlessly regal. A cylindrical rigid Parisian hatbox wrapped in soft-touch midnight paper, stamped in heavy metallic gold leaf, housing dark chocolate grand cru pralines, damask rose mist, and amber candles.',
    details: [
      'Dimensions: 30cm Diameter × 28cm Height',
      'Rigid heavyweight board with matte ebony lamination',
      'Crimson velvet plush cushion bed',
      'Braided golden cord carrying handle with silk tassel',
    ],
    royalHighlights: ['Heavy Gold Hot-stamping', 'Velvet Cushion Interior', 'Parisian Silhouette'],
    occasions: ['Romantic Galas', 'Evening Soirées', 'Executive Milestones', 'Bridal Showers'],
    palette: { primary: '#1A1A1A', accent: '#D4AF37', label: 'Onyx & Royal Gold' },
    imageSvgId: 'hamper-midnight-monarch',
    estimatedTier: 'Imperial',
    approximateUnitValue: 240,
    isFeatured: true,
    customizable: true,
    origin: 'Parisian Design Studio',
  },

  // --- ARTISANAL BOUQUETS ---
  {
    id: 'bouquet-crimson-cascade',
    name: 'Velvet Crimson Ecuadorian Rose Cascade',
    category: 'artisanal_bouquets',
    subtitle: 'Grand 50-Stem Long-Stem Ecuadorian Red Roses with Gilded Ruscus Foliage',
    description:
      'A breathtaking statement of sovereign romance and prestige. Fifty velvet-finish volcanic Ecuadorian red roses hand-spiraled with shimmering golden ruscus and eucalyptus, swathed in textured obsidian wrap.',
    details: [
      'Stem Count: 50 Prime Grade A+ Ecuadorian Roses',
      'Stem Length: 70cm preserved in individual floral water ampoules',
      'Embellished with preserved 24K leaf dipped ruscus leaves',
      'Finished with 3-meter trailing crimson and gold silk ribbons',
    ],
    royalHighlights: ['50 Long-Stem Fresh Roses', 'Volcanic Soil Grown', 'Gilded Foliage Accents'],
    occasions: ['Grand Proposals', 'Golden Anniversaries', 'Romantic Tributes', 'Red Carpet Celebrations'],
    palette: { primary: '#800E17', accent: '#D4AF37', label: 'Imperial Crimson & Gold' },
    imageSvgId: 'bouquet-crimson-cascade',
    estimatedTier: 'Sovereign',
    approximateUnitValue: 320,
    isFeatured: true,
    customizable: true,
    origin: 'Pichincha Province, Ecuador',
  },
  {
    id: 'bouquet-orchid-ruscus',
    name: 'White Orchid & Golden Ruscus Symphony',
    category: 'artisanal_bouquets',
    subtitle: 'Cascading Phalaenopsis Orchids & Pure White Ranunculus with Gilded Palms',
    description:
      'Pure architectural grace and regal serenity. Cascades of immaculate white Phalaenopsis orchids paired with layered Japanese ranunculus, framed by sunburst golden fan palms and tied with royal sapphire silk.',
    details: [
      'Features 6 premium arching white Phalaenopsis spikes and 20 white ranunculus',
      'Sculptural metallic dried gold palm fans',
      'Hydration stems guaranteed fresh for up to 10 days',
      'Includes botanical care serum bottle',
    ],
    royalHighlights: ['Living Orchid Spikes', 'Japanese Ranunculus', 'Sculptural Modern Royalty'],
    occasions: ['Royal Weddings', 'High-Profile Banquets', 'Inaugurations', 'Symphony Openings'],
    palette: { primary: '#FFFFFF', accent: '#C5A059', label: 'Ivory White & Gilded Ruscus' },
    imageSvgId: 'bouquet-orchid-ruscus',
    estimatedTier: 'Sovereign',
    approximateUnitValue: 360,
    isFeatured: true,
    customizable: true,
    origin: 'Holland Botanical Reserve',
  },
  {
    id: 'bouquet-midnight-sapphire',
    name: 'Midnight Sapphire Hydrangea Cloud',
    category: 'artisanal_bouquets',
    subtitle: 'Deep Cobalt Dutch Hydrangeas with Metallic Gold Baby’s Breath & Thistles',
    description:
      'An enigmatic celestial masterpiece. Immense Dutch hydrangeas tinted with deep sapphire gradients, accented by Eryngium sea holly thistles and delicate sprigs of gold-dipped gypsophila.',
    details: [
      'Contains 7 jumbo Dutch hydrangeas and 15 metallic thistles',
      'Presented in midnight noir pleat wrap with gold foil borders',
      'Includes matching handwritten calligraphy card and envelope',
    ],
    royalHighlights: ['Rare Deep Blue Hue', 'Extravagant Volume', 'Celestial Aesthetics'],
    occasions: ['Black-Tie Galas', 'Gentlemen’s Milestones', 'Art Galas', 'Graduation Honors'],
    palette: { primary: '#113357', accent: '#DFBA54', label: 'Midnight Sapphire & Gold' },
    imageSvgId: 'bouquet-midnight-sapphire',
    estimatedTier: 'Imperial',
    approximateUnitValue: 260,
    isFeatured: false,
    customizable: true,
    origin: 'Aalsmeer, Netherlands',
  },

  // --- GOURMET CONFECTIONS ---
  {
    id: 'gourmet-gold-truffles',
    name: '24K Gold-Leaf Dark Ganache Truffles',
    category: 'gourmet_sweets',
    subtitle: 'Single-Origin 72% Venezuelan Cacao dusted with Edible 24K Pure Gold',
    description:
      'Handcrafted by Master Chocolatiers using grand cru Venezuelan single-origin beans, infused with Madagascar bourbon vanilla and enrobed in edible 24-karat gold leaf flakes. Presented in an octagonal lacquered caddy.',
    details: [
      'Quantity: 16 individual artisan truffles',
      'Fillings: Espresso Ganache, Salted Caramel Crunch, Saffron Honey Praline, Dark Truffle',
      'Zero artificial emulsifiers; 100% pure cocoa butter',
      'Shelf life: 45 days in climate controlled cellar',
    ],
    royalHighlights: ['24K Edible Gold Leaf', 'Grand Cru Criollo Beans', 'Artisan Lacquered Box'],
    occasions: ['Royal Weddings', 'Private Tastings', 'Dessert Pairings', 'Hamper Inclusions'],
    palette: { primary: '#D4AF37', accent: '#1A1A1A', label: '24K Gold & Dark Cacao' },
    imageSvgId: 'gourmet-gold-truffles',
    estimatedTier: 'Prestige',
    approximateUnitValue: 95,
    isFeatured: true,
    customizable: true,
    origin: 'Bruges, Belgium',
  },
  {
    id: 'gourmet-kashmir-saffron',
    name: 'Pure Kashmir Mongra Saffron Chest',
    category: 'gourmet_sweets',
    subtitle: 'Grade 1 Certified Organic Crimson Saffron Threads in Hand-Carved Box',
    description:
      'The red gold of Kashmir. Hand-harvested during October dawn in the Pampore plateau. Every filament features intense natural coloring power, intoxicating floral aroma, and high safranal concentration.',
    details: [
      'Net weight: 10 grams pure Mongra stigmas (approx. 4,500 flowers)',
      'Housed in hermetic glass vial nestled inside hand-carved walnut wood chest',
      'Includes brass measuring spoon and Certificate of Organic Purity',
    ],
    royalHighlights: ['Grade 1 Mongra Only', 'Hand-Carved Walnut Casket', 'Red Gold of the Himalayas'],
    occasions: ['Culinary Connoisseurs', 'Wedding Trousseau', 'Diwali & Eid Royal Honors', 'Custom Hampers'],
    palette: { primary: '#B81D2A', accent: '#D4AF37', label: 'Crimson Red & Walnut' },
    imageSvgId: 'gourmet-kashmir-saffron',
    estimatedTier: 'Sovereign',
    approximateUnitValue: 180,
    isFeatured: true,
    customizable: false,
    origin: 'Pampore Plateau, Kashmir',
  },
  {
    id: 'gourmet-royal-dates',
    name: 'Stuffed Medjool Dates with Pistachio & Gold',
    category: 'gourmet_sweets',
    subtitle: 'Jumbo Palestinian Medjool Dates stuffed with Roasted Bronte Pistachios',
    description:
      'Sun-ripened jumbo Medjool dates prized for their honeyed caramel texture, carefully pitted and stuffed with lightly roasted Sicilian Bronte pistachios, orange blossom water drizzle, and gold dust.',
    details: [
      'Weight: 500g (approx. 20 jumbo dates)',
      'Varieties: Bronte Pistachio, Candied Orange Peel & Roasted Almond, Saffron Pecan',
      'Presented on an embossed gilded paper insert',
    ],
    royalHighlights: ['Jumbo Imperial Grade', 'Bronte Pistachio Infill', 'Natural Caramel Sweetness'],
    occasions: ['Festive Celebrations', 'Ramadan & Eid Iftar', 'Wedding Favors', 'Afternoon Tea'],
    palette: { primary: '#2E1305', accent: '#D4AF37', label: 'Caramel Amber & Gold' },
    imageSvgId: 'gourmet-royal-dates',
    estimatedTier: 'Prestige',
    approximateUnitValue: 75,
    isFeatured: false,
    customizable: true,
    origin: 'Jordan River Valley',
  },

  // --- ROYAL FRAGRANCES ---
  {
    id: 'fragrance-amber-oud-candle',
    name: 'Royal Amber & Velvet Oud Candle',
    category: 'royal_fragrances',
    subtitle: 'Hand-Poured Botanical Soy Candle in Heavy Frosted Obsidian Vessel',
    description:
      'Warm resinous amber, aged Cambodian agarwood (oud), and subtle notes of smoked vanilla and bergamot. Crafted with 100% natural vegetable wax and twin braided Egyptian cotton wicks for a soot-free 70-hour royal burn.',
    details: [
      'Weight: 350g | Burn Time: 70+ Hours',
      'Fragrance Notes: Top: Bergamot, Pink Peppercorn; Heart: Damask Rose, Ambergris; Base: Royal Oud, Birchwood',
      'Weighted luxury obsidian glass tumbler with brass protective lid',
    ],
    royalHighlights: ['70-Hour Clean Burn', 'Natural Cambodian Oud', 'Solid Brass Dust Cover'],
    occasions: ['Evening Ambiance', 'Sanctuary Gifting', 'New Home Blessings', 'Master Suite Decor'],
    palette: { primary: '#1A1A1A', accent: '#C5A059', label: 'Obsidian & Warm Amber' },
    imageSvgId: 'fragrance-amber-oud-candle',
    estimatedTier: 'Prestige',
    approximateUnitValue: 85,
    isFeatured: true,
    customizable: true,
    origin: 'Grasse, France',
  },
  {
    id: 'fragrance-damask-mist',
    name: 'Damask Rose & Sandalwood Room Mist',
    category: 'royal_fragrances',
    subtitle: 'Artisanal Distillation of Isparta Roses with Golden Mysore Sandalwood',
    description:
      'A majestic atmospheric fragrance formulated with copper alembic distilled rose hydrosol and sustainable Mysore sandalwood oil. Delivers a delicate mist that envelops fine linens and royal chambers in serene splendor.',
    details: [
      'Volume: 150ml Fluted Glass Flacon with 24K Gold Plated Atomizer',
      'Free from synthetic phthalates and parabens',
      'Safe for Egyptian cotton linens and velvet cushions',
    ],
    royalHighlights: ['Copper Alembic Distillation', '24K Gold Plated Atomizer', 'Pure Botanical Oils'],
    occasions: ['Bridal Suites', 'Luxury Hospitality', 'Evening Rituals', 'Hamper Inclusions'],
    palette: { primary: '#8B1E26', accent: '#FAF9F5', label: 'Damask Rose & Crystal' },
    imageSvgId: 'fragrance-damask-mist',
    estimatedTier: 'Prestige',
    approximateUnitValue: 65,
    isFeatured: false,
    customizable: false,
    origin: 'Isparta, Turkey & Mysore, India',
  },

  // --- KEEPSAKE VESSELS ---
  {
    id: 'keepsake-crystal-flutes',
    name: 'Hand-Cut Gilded Crystal Flutes (Pair)',
    category: 'keepsake_vessels',
    subtitle: 'Mouth-Blown Bohemian Lead-Free Crystal with 24K Hand-Painted Rim',
    description:
      'A set of two tall, slender celebratory flutes hand-blown by Bohemian artisans. Fluted facets capture candlelight with diamond sparkle, crowned with hand-brushed 24-karat liquid gold around the drinking rim.',
    details: [
      'Height: 26cm | Capacity: 180ml',
      'Lead-free titanium crystal with acoustic resonance',
      'Individually boxed in padded silk presentation cases',
    ],
    royalHighlights: ['Bohemian Hand-Blown', 'Hand-Painted 24K Gold Rim', 'Resonant Clink'],
    occasions: ['Wedding Toasts', 'New Year Revelry', 'Corporate Milestone', 'Romantic Celebrations'],
    palette: { primary: '#FAF9F5', accent: '#D4AF37', label: 'Clear Crystal & Gold Rim' },
    imageSvgId: 'keepsake-crystal-flutes',
    estimatedTier: 'Imperial',
    approximateUnitValue: 140,
    isFeatured: true,
    customizable: true,
    origin: 'Bohemia, Czech Republic',
  },

  // --- EMBELLISHMENTS & STATIONERY ---
  {
    id: 'embellishment-wax-card',
    name: 'Royal Calligraphy Deckle-Edge Card & Seal',
    category: 'embellishments',
    subtitle: '300 GSM Handmade Cotton Paper with Personalized Wax Seal Stamp',
    description:
      'Pure poetry in paper. Crafted on archival handmade rag paper with natural deckled edges, inscribed by our atelier scribe, and sealed with flexible imperial wax and a pure gold crest impression.',
    details: [
      'Archival 100% cotton handmade paper from Amalfi',
      'Custom wax seal stamped in imperial crimson or royal gold',
      'Hand-inked with waterproof sepia or metallic gold calligraphy',
    ],
    royalHighlights: ['Handmade Amalfi Paper', 'Authentic Wax Stamp', 'Studio Calligrapher Inscribed'],
    occasions: ['All Custom Hampers', 'Formal Invitations', 'Private Letters', 'Custom Bouquets'],
    palette: { primary: '#FAF8F2', accent: '#800E17', label: 'Deckle Parchment & Crimson Wax' },
    imageSvgId: 'embellishment-wax-card',
    estimatedTier: 'Prestige',
    approximateUnitValue: 25,
    isFeatured: true,
    customizable: true,
    origin: 'Amalfi Coast, Italy',
  },
  {
    id: 'embellishment-satin-ribbon',
    name: 'Double-Faced Italian Satin Gold Ribbon',
    category: 'embellishments',
    subtitle: 'Heavy 40mm Woven Silk-Touch Ribbon with Hand-Tied Master Bow',
    description:
      'Woven in Como, Italy, this lustrous double-faced ribbon holds its architectural bow structure effortlessly, giving every parcel an unmistakable royal poise.',
    details: [
      'Width: 40mm | Length: 3.5m per parcel tie',
      'Double-sided high sheen gold finish',
      'Heat-sealed bias-cut ends to prevent fraying',
    ],
    royalHighlights: ['Como Italian Weave', 'High-Lustre Sheen', 'Architectural Master Bow'],
    occasions: ['All Packaging Customizations'],
    palette: { primary: '#D4AF37', accent: '#FFFFFF', label: 'Champagne Gold' },
    imageSvgId: 'embellishment-satin-ribbon',
    estimatedTier: 'Prestige',
    approximateUnitValue: 15,
    isFeatured: false,
    customizable: false,
    origin: 'Como, Italy',
  },
];

// VESSELS FOR BESPOKE BUILDER
export const VESSEL_OPTIONS: VesselOption[] = [
  {
    id: 'vessel-royal-trunk',
    name: 'The Sovereign Velvet Trunk',
    type: 'trunk',
    capacity: 8,
    subtitle: 'Wood Frame, Quilted Ivory Velvet & Engraved Brass Hinges',
    description:
      'Our most prestigious heirloom presentation. Reusable as a jewelry casket or luxury parlor keepsake for decades to come.',
    colorName: 'Ivory & Gilded Brass',
    imageSvgId: 'vessel-royal-trunk',
    tier: 'Sovereign',
    dimensions: '48 × 34 × 22 cm',
  },
  {
    id: 'vessel-golden-wicker',
    name: 'The Imperial Golden Wicker',
    type: 'basket',
    capacity: 6,
    subtitle: 'Hand-Woven Willow with Scalloped Mulberry Silk Lining',
    description:
      'A classic European country estate hamper with sturdy woven handle and rich honey lacquer finish.',
    colorName: 'Warm Honey Willow',
    imageSvgId: 'vessel-golden-wicker',
    tier: 'Imperial',
    dimensions: '44 × 30 × 26 cm',
  },
  {
    id: 'vessel-parisian-hatbox',
    name: 'The Parisian Midnight Hatbox',
    type: 'hatbox',
    capacity: 5,
    subtitle: 'Matte Ebony Cylinder with Heavy Gold Crest Stamping',
    description:
      'Contemporary French elegance. Deep velvet interior base that securely nests bottles, bouquets, and boxes.',
    colorName: 'Midnight Noir & Gold',
    imageSvgId: 'vessel-parisian-hatbox',
    tier: 'Imperial',
    dimensions: '30 cm Dia × 28 cm H',
  },
  {
    id: 'vessel-silk-wrap',
    name: 'The Sovereign Floral Silk Wrap',
    type: 'silk_wrap',
    capacity: 4,
    subtitle: 'Waterproof Japanese Chiffon & Obsidian Embossed Paper',
    description:
      'Designed specifically for cascading royal floral arrangements, tied with three meters of fluid silk ribbon.',
    colorName: 'Ebony, Gold & Sheer Ivory',
    imageSvgId: 'bouquet-crimson-cascade',
    tier: 'Prestige',
    dimensions: '75 cm Height',
  },
];

// RIBBON SELECTIONS
export const RIBBON_OPTIONS: RibbonOption[] = [
  {
    id: 'ribbon-champagne-gold',
    name: 'Champagne Gold Satin',
    colorHex: '#D4AF37',
    borderHex: '#AA771C',
    material: 'Double-Faced Italian Satin',
  },
  {
    id: 'ribbon-imperial-crimson',
    name: 'Imperial Crimson Velvet',
    colorHex: '#800E17',
    borderHex: '#4D040A',
    material: 'Plush Micro-Velvet Ribbon',
  },
  {
    id: 'ribbon-royal-sapphire',
    name: 'Royal Sapphire Silk',
    colorHex: '#113357',
    borderHex: '#08182B',
    material: 'Lustrous Grosgrain Silk',
  },
  {
    id: 'ribbon-midnight-black',
    name: 'Obsidian Noir with Gold Edge',
    colorHex: '#1A1A1A',
    borderHex: '#D4AF37',
    material: 'Woven Satin with Gilded Border',
  },
];

// WAX SEAL OPTIONS
export const WAX_SEAL_OPTIONS: WaxSealOption[] = [
  {
    id: 'wax-seal-crown',
    name: 'Imperial Crown Crest',
    colorHex: '#800E17',
    stampDesign: 'crown',
    label: 'Deep Crimson & Crown',
  },
  {
    id: 'wax-seal-monogram',
    name: 'Royale Fleur-de-lis',
    colorHex: '#C5A059',
    stampDesign: 'fleur',
    label: 'Gilded Antique Gold',
  },
  {
    id: 'wax-seal-sapphire',
    name: 'Sovereign Shield',
    colorHex: '#113357',
    stampDesign: 'crest',
    label: 'Royal Navy Sapphire',
  },
  {
    id: 'wax-seal-emerald',
    name: 'Botanical Laurel Wreath',
    colorHex: '#1C4532',
    stampDesign: 'botanical',
    label: 'Deep Forest Green',
  },
];

// DIGITAL LOOKBOOKS / BROCHURES
export const BROCHURES: BrochureItem[] = [
  {
    id: 'brochure-signature-hampers',
    title: 'Signature Hampers: The 12 Occasion Collection',
    subtitle: '12 curated birthday & celebration hampers from our real menu — every item counted and priced openly',
    tag: 'Signature Hampers',
    pages: 32,
    description:
      'Our flagship menu of 12 birthday and celebration hampers, exactly as we wrap them: Self-Care, Jewellery, Coffee-Lover, Elegant Pink, Fashion, Luxury Skincare, Chocolate Indulgence, Wellness & Relaxation, Tea Time, Personalised, Minimal & Chic, and Floral & Lifestyle. Transparent pricing: real retail rates on branded items plus craft fee per curated composition.',
    highlights: [
      '12 hampers with their actual item-by-item menus',
      'Real retail rates on branded items • Signature hampers from INR 499',
      'How It Works: choose your style, select items, share preferences, we deliver with love',
      'Free delivery on orders above INR 499 in Mumbai',
    ],
    downloadName: 'Hamper_Queen_Signature_Hampers_Menu.pdf',
    coverGraphic: 'graphic-hamper-elegant-pink',
  },
  {
    id: 'brochure-categories-boxes',
    title: 'Gifting Categories & Signature Boxes',
    subtitle: 'Anniversary, Engagement, Wedding, Birthday, chocolate hampers & designer gift boxes',
    tag: 'Categories & Boxes',
    pages: 24,
    description:
      'Every way we say congratulations: wedding & engagement hampers, anniversary and birthday boxes, chocolate hampers, bouquets, and our signature dress, shirt, heart and watch gift boxes. Made and priced as per your customization.',
    highlights: [
      'Dress & Trousseau, Shirt & Cufflinks, Heart and Watch gift boxes',
      'Wedding, Engagement, Anniversary & Birthday hampers',
      'Chocolate hampers, bouquets & keepsake crates',
      'Gift your loved ones — make your little moments memorable with us',
    ],
    downloadName: 'Hamper_Queen_Categories_Boxes.pdf',
    coverGraphic: 'graphic-box-heart',
  },
  {
    id: 'brochure-bouquets-menu',
    title: 'Bouquets by Hamper Queen',
    subtitle: 'Chocolate, accessory & photo bouquets — hand-wrapped in Mumbai, from INR 280',
    tag: 'Bouquets Menu',
    pages: 20,
    description:
      'Our flowers-for-everyone bouquets: KitKat & Dark Fantasy chocolate bouquets, women accessory florals, men grooming bouquets, and fully custom Polaroid photo memory bouquets. Each bouquet is arranged by hand the same day it ships.',
    highlights: [
      'KitKat, Dark Fantasy, Kinder Joy & photo memory bouquets',
      'Women accessory & men grooming styled arrangements',
      'Add-ons: wax seals, calligraphy tags, fairy lights & custom prints',
      'Hand-wrapped in Mumbai with same-day dispatch',
    ],
    downloadName: 'Hamper_Queen_Bouquets_Menu.pdf',
    coverGraphic: 'graphic-kitkat-bouquet',
  },
  {
    id: 'brochure-weddings',
    title: 'Imperial Wedding & Trousseau Curation',
    subtitle: '2026/2027 Bridal Catalogue of Heirloom Hampers & Floral Suites',
    tag: 'Bridal & Trousseau',
    pages: 36,
    description:
      'Curated especially for royal brides, grooms, and grand destination celebrations. Features custom trunks, monogrammed silks, and guest favor collections.',
    highlights: [
      'Custom Trunk Monogramming Guide',
      'Destination Climate-Tolerant Florals',
      'Family & VIP Welcome Gift Suites',
      'Artisan Saffron & Sweets Pairings',
    ],
    downloadName: 'Hamper_Queen_Wedding_Collection_2026.pdf',
    coverGraphic: 'hamper-crown-sovereign',
  },
  {
    id: 'brochure-corporate',
    title: 'Corporate Distinction & Executive Honors',
    subtitle: 'B2B Gifting Suites, Board Gifts, and Diplomatic Parcels',
    tag: 'Corporate VVIP',
    pages: 28,
    description:
      'Designed for Fortune 500 leadership, banking institutes, and private family offices. Includes co-branded leather stamping and consolidated international dispatch.',
    highlights: [
      'Discreet White-Glove Hand Delivery',
      'Custom Embossed Metallic Seals',
      'Volume Tiers & Dedicated Concierge',
      'Alcohol-Free Gourmet Alternatives',
    ],
    downloadName: 'Hamper_Queen_Corporate_Distinction_2026.pdf',
    coverGraphic: 'hamper-midnight-monarch',
  },
  {
    id: 'brochure-floral',
    title: 'Floral Studio: Seasonal Royal Blooms',
    subtitle: 'Grand Stems, Rare Orchids, and Botanical Sculptures',
    tag: 'Floral Studio',
    pages: 24,
    description:
      'A showcase of rare stems imported weekly from Ecuador, Holland, and Japan. Detailed stem care guides and vessel pairing consultations.',
    highlights: [
      'Weekly Flower Concierge Subscriptions',
      'Preserved Eternal Golden Blooms',
      'Banquet Centerpiece Dimensions',
      'Signature Fragrance Spritzing',
    ],
    downloadName: 'Hamper_Queen_Floral_Studio_2026.pdf',
    coverGraphic: 'bouquet-crimson-cascade',
  },
];

// PRICING TIERS (SEPARATE MODULAR CONFIGURATION)
// As explicitly instructed: "avoid pricing and keep pricing section seperate for chanfging"
export interface PricingTierDetail {
  id: string;
  name: string;
  subtitle: string;
  priceRange: string;
  curationHighlights: string[];
  recommendedOccasion: string;
  deliverySpeed: string;
  isPopular?: boolean;
}

export const PRICING_TIERS_CONFIG: PricingTierDetail[] = [
  {
    id: 'tier-prestige',
    name: 'The Prestige Tier',
    subtitle: 'Elegant Expressions of Grace & Taste',
    priceRange: 'INR 140 – INR 350',
    curationHighlights: [
      'Choice of Parisian Hatbox or Medium Woven Basket',
      '2 to 5 Artisanal Gourmet Delicacies or Floral Accents',
      'Handmade Deckle-Edge Card with Handwritten Calligraphy',
      'Satin Ribbon Tie & Single Monogram Wax Seal',
      'Express Same-Day Royal Courier Available',
    ],
    recommendedOccasion: 'Executive Appreciation, Birthdays & Housewarmings',
    deliverySpeed: 'Dispatched within 4 hours',
  },
  {
    id: 'tier-imperial',
    name: 'The Imperial Tier',
    subtitle: 'Richly Layered Luxury with Keepsake Accents',
    priceRange: 'INR 399 – INR 549',
    curationHighlights: [
      'Large Golden Willow Hamper or 50-Stem Grand Bouquet',
      '6 to 8 Curated Items: Truffles, scented candle, keepsake accents',
      'Custom Wax Seal Stamped in Imperial Crimson or Gold',
      'Preserved Botanical Sprig & Silk Lining Accents',
      'Dedicated Concierge Status Updates',
    ],
    recommendedOccasion: 'Grand Anniversaries, Festive Galas, Corporate VIPs',
    deliverySpeed: 'White-glove climate delivery',
    isPopular: true,
  },
  {
    id: 'tier-sovereign',
    name: 'The Custom Creator',
    subtitle: 'The Crown Jewel of Custom Royal Gifting',
    priceRange: 'INR 599+',
    curationHighlights: [
      'Full Quilted Ivory Velvet & Solid Brass Heirloom Trunk',
      'Everything included: Vintage reserves, Kashmir saffron, 24K leaf',
      'Custom Engraved Brass Plate with Family Crest / Monogram',
      'Multi-stem Phalaenopsis Orchid & Ecuadorian Rose Cascade',
      'Direct Master Florist & Scribe Consultation',
    ],
    recommendedOccasion: 'Royal Weddings, Milestone Jubilees, Diplomatic Honors',
    deliverySpeed: 'Hand-delivered by White-Glove Butler in Uniform',
  },
];
