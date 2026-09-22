import { LanguageMode } from '../types';

export interface TranslationDict {
  brand: {
    name: string;
    tagline: string;
    subtagline: string;
    royaltyBadge: string;
  };
  nav: {
    home: string;
    collections: string;
    inspirations: string;
    atelier: string;
    calligraphy: string;
    pricing: string;
    lookbooks: string;
    customised: string;
    royalTray: string;
    itemsCount: string;
    emptyTray: string;
    diagnostics: string;
  };
  cover: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    unveilBtn: string;
    buildBtn: string;
    exploreBtn: string;
    soundOn: string;
    soundOff: string;
    switchThemesPrompt: string;
    themeWedding: string;
    themeMidnight: string;
    themeGolden: string;
    themeJashn: string;
    unboxingTitle: string;
    unboxingSubtitle: string;
    clickToUnbox: string;
    unboxedBadge: string;
    itemsInside: string;
    royalDelivery: string;
  };
  inspiration: {
    eyebrow: string;
    title: string;
    subtitle: string;
    filterAll: string;
    filterWeddings: string;
    filterFestive: string;
    filterCorporate: string;
    filterRomance: string;
    customizeThis: string;
    viewDetails: string;
    touchToInspect: string;
    includedTreasures: string;
  };
  atelier: {
    title: string;
    subtitle: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    chooseVessel: string;
    addItems: string;
    accents: string;
    review: string;
    itemsSelected: string;
    capacity: string;
    cardAttached: string;
    attachMessage: string;
    proceedToCard: string;
  };
  calligraphy: {
    title: string;
    subtitle: string;
    chooseStationery: string;
    recipientName: string;
    senderName: string;
    messagePlaceholder: string;
    waxSeal: string;
    previewSeal: string;
    attachToHamper: string;
  };
  pricing: {
    title: string;
    subtitle: string;
    disclaimer: string;
    requestQuote: string;
  };
  footer: {
    atelierHQ: string;
    conciergeTitle: string;
    conciergeText: string;
    hours: string;
    newsletterTitle: string;
    newsletterText: string;
    subscribeBtn: string;
    copyright: string;
  };
}

export const TRANSLATIONS: Record<LanguageMode, TranslationDict> = {
  en: {
    brand: {
      name: 'Hamper Queen',
      tagline: 'Custom Gift Hampers & Chocolate Bouquets',
      subtagline: 'Hand-packed in Mumbai, delivered across India',
      royaltyBadge: 'Made in Mumbai • Order on WhatsApp',
    },
    nav: {
      home: 'Home',
      collections: 'Collections',
      inspirations: 'Gift Ideas',
      atelier: 'Custom Hampers',
      calligraphy: 'Gift Message',
      pricing: 'Pricing',
      lookbooks: 'Lookbook',
      customised: 'Customise Box & Bouquet',
      royalTray: 'Your Hamper Tray',
      itemsCount: 'items in tray',
      emptyTray: 'Tray is empty',
      diagnostics: 'Diagnostics',
    },
    cover: {
      eyebrow: 'Custom Hampers • Same-Day Dispatch',
      headline: 'Custom Luxury Hampers, Priced Honestly',
      subheadline:
        'Pick a ready-made gift or build your own. Premium chocolates, velvet trunks, chocolate bouquets, and photo keepsakes—from ₹799, free delivery over ₹499, same-day dispatch across India.',
      unveilBtn: 'See Inside the Hamper',
      buildBtn: 'Build Your Own',
      exploreBtn: 'Browse Ready-Made',
      soundOn: 'Sound: ON',
      soundOff: 'Sound: Mute',
      switchThemesPrompt: 'Choose a Cover Theme:',
      themeWedding: 'Weddings & Trousseau',
      themeMidnight: "Men's & Corporate",
      themeGolden: 'Diwali & Festive',
      themeJashn: 'Bouquets & Everyday Gifting',
      unboxingTitle: 'Preview Your Hamper',
      unboxingSubtitle: 'See how your hamper opens before you send it',
      clickToUnbox: 'Tap to Open',
      unboxedBadge: 'Preview Ready',
      itemsInside: "What's Inside",
      royalDelivery: 'Same-Day Dispatch + Free Delivery Over ₹499',
    },
    inspiration: {
      eyebrow: 'Real Gift Inspirations',
      title: 'Gift Ideas for Real Occasions',
      subtitle:
        'For weddings, festivals, corporate events, and anniversaries. Customise any idea or buy it as shown.',
      filterAll: 'All Ideas',
      filterWeddings: 'Weddings & Trousseau',
      filterFestive: 'Festivals & Celebrations',
      filterCorporate: 'Corporate Gifting',
      filterRomance: 'Romance & Anniversaries',
      customizeThis: 'Customise This',
      viewDetails: 'View Details',
      touchToInspect: 'Tap to Preview',
      includedTreasures: 'Included Items',
    },
    atelier: {
      title: 'Build Your Hamper',
      subtitle: 'Four simple steps, from box to gift message.',
      step1: '1. Choose Your Box',
      step2: '2. Add Items',
      step3: '3. Ribbon & Wax Seal',
      step4: '4. Gift Card & Checkout',
      chooseVessel: 'Choose Your Box',
      addItems: 'Add Chocolates & Gifts',
      accents: 'Ribbon, Wax Seal & Finishing',
      review: 'Review & Confirm',
      itemsSelected: 'Items Added',
      capacity: 'Box Capacity',
      cardAttached: 'Gift Card Added',
      attachMessage: 'Write a Gift Message',
      proceedToCard: 'Add Gift Card',
    },
    calligraphy: {
      title: 'Your Gift Card',
      subtitle: 'Deckle-edge paper cards with your message, sealed with wax.',
      chooseStationery: 'Choose Card Style',
      recipientName: 'Recipient Name',
      senderName: 'From (Your Name)',
      messagePlaceholder: 'Write your message here...',
      waxSeal: 'Choose Wax Seal',
      previewSeal: 'Wax Seal Added',
      attachToHamper: 'Add Card to Hamper',
    },
    pricing: {
      title: 'Simple, Transparent Pricing',
      subtitle: 'See what you pay before you order. Volume discounts for bulk and corporate gifting.',
      disclaimer: 'Every tier is customizable. Bulk and corporate branding quoted on request.',
      requestQuote: 'Request a Quote',
    },
    footer: {
      atelierHQ: 'Hamper Queen — Mumbai',
      conciergeTitle: 'Direct Founder Support',
      conciergeText:
        'Text or WhatsApp Ms. Supriya Khandekar directly for help choosing, customising, and tracking orders.',
      hours: 'Mon - Sat: 9:00 AM - 9:00 PM IST',
      newsletterTitle: 'Get Seasonal Offers',
      newsletterText: 'New hampers, festive deals, and price drops. No spam.',
      subscribeBtn: 'Subscribe',
      copyright: '© Hamper Queen. All rights reserved.',
    },
  },

  hinglish: {
    brand: {
      name: 'Hamper Queen',
      tagline: 'Custom Hampers & Chocolate Bouquets',
      subtagline: 'Mumbai mein haath se pack, poore India mein delivery',
      royaltyBadge: 'Mumbai Banao • WhatsApp Par Order',
    },
    nav: {
      home: 'Home',
      collections: 'Sangrah',
      inspirations: 'Gift Ideas',
      atelier: 'Hamper Banao',
      calligraphy: 'Gift Sandesh',
      pricing: 'Price Guide',
      lookbooks: 'Lookbook',
      customised: 'Apna Box / Bouquet Banao',
      royalTray: 'Aapka Hamper Tray',
      itemsCount: 'items tray mein',
      emptyTray: 'Tray abhi khali hai',
      diagnostics: 'Logs',
    },
    cover: {
      eyebrow: 'Custom Hampers • Same-Day Dispatch',
      headline: 'Custom Luxury Hampers, Sahi Dam Par',
      subheadline:
        'Ready-made lo ya apna hamper banao. Premium chocolates, velvet trunks, chocolate bouquets aur photo keepsakes—₹799 se shuru, ₹499 par free delivery, same-day dispatch poore India mein.',
      unveilBtn: 'Hamper Ke Andar Dekho',
      buildBtn: 'Apna Hamper Banao',
      exploreBtn: 'Ready-Made Dekho',
      soundOn: 'Sound: ON',
      soundOff: 'Sound: Mute',
      switchThemesPrompt: 'Cover Theme Chunein:',
      themeWedding: 'Wedding & Trousseau',
      themeMidnight: "Men's & Corporate",
      themeGolden: 'Diwali & Festive',
      themeJashn: 'Bouquets & Everyday Gifting',
      unboxingTitle: 'Apna Hamper Preview Karo',
      unboxingSubtitle: 'Bhejne se pehle dekho hamper kaise khulta hai',
      clickToUnbox: 'Kholo',
      unboxedBadge: 'Preview Ready',
      itemsInside: 'Andar Kya Hai',
      royalDelivery: 'Same-Day Dispatch + ₹499 Par Free Delivery',
    },
    inspiration: {
      eyebrow: 'Asli Gift Inspirations',
      title: 'Har Mauke Ke Liye Gift Ideas',
      subtitle:
        'Shaadi, tyohar, corporate events aur anniversaries ke liye. Pasand aaye toh customise karo ya jaisa hai waisa order karo.',
      filterAll: 'Sabhi Ideas',
      filterWeddings: 'Wedding & Trousseau',
      filterFestive: 'Tyohar & Jashn',
      filterCorporate: 'Corporate Gifting',
      filterRomance: 'Pyar & Anniversaries',
      customizeThis: 'Customise Karo',
      viewDetails: 'Details Dekho',
      touchToInspect: 'Preview Karo',
      includedTreasures: 'Included Items',
    },
    atelier: {
      title: 'Apna Hamper Banao',
      subtitle: '4 aasan steps: box se gift message tak.',
      step1: '1. Box Chunein',
      step2: '2. Items Chunein',
      step3: '3. Ribbon & Wax Seal',
      step4: '4. Gift Card & Checkout',
      chooseVessel: 'Apna Box Chunein',
      addItems: 'Chocolates & Gifts Dalein',
      accents: 'Ribbon, Wax Seal & Finishing',
      review: 'Review & Confirm',
      itemsSelected: 'Items Jode Gaye',
      capacity: 'Box Ki Capacity',
      cardAttached: 'Gift Card Lag Gayi',
      attachMessage: 'Gift Sandesh Likhein',
      proceedToCard: 'Gift Card Jodein',
    },
    calligraphy: {
      title: 'Aapka Gift Card',
      subtitle: 'Deckle-edge paper card par aapka sandesh, wax seal ke saath.',
      chooseStationery: 'Card Style Chunein',
      recipientName: 'Kiske Liye',
      senderName: 'Kiski Taraf Se',
      messagePlaceholder: 'Apna sandesh yahan likhein...',
      waxSeal: 'Wax Seal Chunein',
      previewSeal: 'Wax Seal Lag Gayi',
      attachToHamper: 'Card Ko Hamper Mein Dalein',
    },
    pricing: {
      title: 'Sahi Price, Pehle Se Clear',
      subtitle: 'Order karne se pehle batao kya pay karna hoga. Bulk aur corporate mein volume discount.',
      disclaimer: 'Har tier custom hote hai. Bulk aur corporate branding ke liye alag quote.',
      requestQuote: 'Quote Maangein',
    },
    footer: {
      atelierHQ: 'Hamper Queen — Mumbai',
      conciergeTitle: 'Founder Se Direct Baat',
      conciergeText:
        'WhatsApp par Ms. Supriya Khandekar ko seedha likhein—gift chunne, customise karne aur order track karne ke liye.',
      hours: 'Somwar - Shanivar: 9:00 AM - 9:00 PM IST',
      newsletterTitle: 'Seasonal Offers Payein',
      newsletterText: 'Naye hampers, festive deals aur price drops. Koi spam nahi.',
      subscribeBtn: 'Subscribe',
      copyright: '© Hamper Queen. All rights reserved.',
    },
  },

  bilingual: {
    brand: {
      name: 'Hamper Queen',
      tagline: 'Custom Gift Hampers & Bouquets • कस्टम हैंपर्स',
      subtagline: 'Hand-packed in Mumbai, delivered across India • मुंबई में बना',
      royaltyBadge: 'Made in Mumbai • Order on WhatsApp',
    },
    nav: {
      home: 'Home • मुख्य',
      collections: 'Collections • संग्रह',
      inspirations: 'Gift Ideas • प्रेरणा',
      atelier: 'Custom Hampers • हैम्पर बनाएं',
      calligraphy: 'Gift Message • संदेश',
      pricing: 'Pricing • बजट',
      lookbooks: 'Lookbook • विवरणिका',
      customised: 'Customise Box • अपना बॉक्स बनाएं',
      royalTray: 'Your Tray • आपका ट्रे',
      itemsCount: 'items in tray',
      emptyTray: 'Tray is empty • ट्रे खाली है',
      diagnostics: 'Logs • सिस्टम लॉग्स',
    },
    cover: {
      eyebrow: 'Custom Hampers • Same-Day Dispatch',
      headline: 'Custom Luxury Hampers, Priced Honestly • सही दाम पर कस्टम हैंपर्स',
      subheadline:
        'Ready-made pick karein ya apna hamper banayein. Premium chocolates, velvet trunks, chocolate bouquets, aur photo keepsakes—from ₹799, free delivery over ₹499. (₹799 से शुरू, ₹499 पर फ्री डिलीवरी)',
      unveilBtn: 'See Inside • हैंपर देखें',
      buildBtn: 'Build Your Own • हैंपर बनाएं',
      exploreBtn: 'Browse Ready-Made • संग्रह देखें',
      soundOn: 'Sound: ON',
      soundOff: 'Sound: Mute',
      switchThemesPrompt: 'Choose a Cover Theme • थीम चुनें:',
      themeWedding: 'Wedding & Trousseau • शादी',
      themeMidnight: "Men's & Corporate • पुरुष/कॉर्पोरेट",
      themeGolden: 'Diwali & Festive • त्योहार',
      themeJashn: 'Bouquets & Gifting • बुके व उपहार',
      unboxingTitle: 'Preview Your Hamper • अनबॉक्सिंग',
      unboxingSubtitle: 'Verse panne dekhein, hamper kaise khulta hai • प्रीव्यू',
      clickToUnbox: 'Tap to Open • खोलें',
      unboxedBadge: 'Preview Ready • प्रीव्यू तैयार',
      itemsInside: "What's Inside • मुख्य उपहार",
      royalDelivery: 'Same-Day Dispatch + Free Delivery Over ₹499',
    },
    inspiration: {
      eyebrow: 'Real Gift Ideas • असली प्रेरणा',
      title: 'Gift Ideas for Real Occasions • हर अवसर के लिए उपहार',
      subtitle:
        'For weddings, festivals, corporate events, and anniversaries. Customise any idea or buy as shown. (शादी, त्योहार, कॉर्पोरेट और एनिवर्सरी के लिए)',
      filterAll: 'All Ideas • सभी',
      filterWeddings: 'Weddings & Trousseau • शादी',
      filterFestive: 'Festivals • त्योहार',
      filterCorporate: 'Corporate Gifting • कॉर्पोरेट',
      filterRomance: 'Romance • प्रेम',
      customizeThis: 'Customise This • कस्टमाइज़ करें',
      viewDetails: 'View Details • विवरण',
      touchToInspect: 'Preview • झलक',
      includedTreasures: 'Included Items • सम्मिलित',
    },
    atelier: {
      title: 'Build Your Hamper • हैम्पर स्टूडियो',
      subtitle: 'Four simple steps, from box to gift message • ४ चरण, बॉक्स से संदेश तक',
      step1: '1. Choose Your Box • पेटी',
      step2: '2. Add Items • उपहार',
      step3: '3. Ribbon & Wax Seal • रिबन व मोहर',
      step4: '4. Gift Card & Checkout • समीक्षा',
      chooseVessel: 'Choose Your Box • पेटी चुनें',
      addItems: 'Add Chocolates & Gifts • उपहार जोड़ें',
      accents: 'Ribbon, Wax Seal & Finishing • रिबन व मोहर',
      review: 'Review & Confirm • हैंपर की समीक्षा करें',
      itemsSelected: 'Items Added • उपहार जुड़े',
      capacity: 'Box Capacity • क्षमता',
      cardAttached: 'Gift Card Added • कार्ड जुड़ा है',
      attachMessage: 'Write a Gift Message • संदेश लिखें',
      proceedToCard: 'Add Gift Card • संदेश स्टूडियो',
    },
    calligraphy: {
      title: 'Your Gift Card • संदेश कक्ष',
      subtitle: 'Deckle-edge paper cards with your message, sealed with wax • हाथ से लिखा संदेश',
      chooseStationery: 'Choose Card Style • कागज़ चुनें',
      recipientName: 'Recipient • प्राप्तकर्ता',
      senderName: 'From (Your Name) • प्रेषक',
      messagePlaceholder: 'Write your message here... (अपनी बात यहाँ लिखें)',
      waxSeal: 'Choose Wax Seal • मोहर',
      previewSeal: 'Wax Seal Added • मोहर लगाई',
      attachToHamper: 'Add Card to Hamper • हैंपर में लगाएं',
    },
    pricing: {
      title: 'Simple, Transparent Pricing • मूल्य विवरण',
      subtitle: 'See what you pay before you order • पारदर्शी बजट श्रेणियां',
      disclaimer: 'Every tier is customizable • शत-प्रतिशत अनुकूलन योग्य',
      requestQuote: 'Request a Quote • संपर्क करें',
    },
    footer: {
      atelierHQ: 'Hamper Queen — Mumbai • हैम्पर क्वीन',
      conciergeTitle: 'Direct Founder Support • सीधा संपर्क',
      conciergeText: 'Text or WhatsApp Ms. Supriya Khandekar for help choosing, customising, and tracking.',
      hours: 'Mon - Sat: 9:00 AM - 9:00 PM IST',
      newsletterTitle: 'Get Seasonal Offers • ऑफ़र जानें',
      newsletterText: 'New hampers, festive deals, and price drops • विशेष ऑफ़र व नए हैंपर्स',
      subscribeBtn: 'Subscribe • जुड़ें',
      copyright: '© Hamper Queen. All rights reserved.',
    },
  },
};
