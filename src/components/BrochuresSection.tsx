import React, { useState } from 'react';
import {
  BookOpen,
  Download,
  Eye,
  X,
  Check,
} from 'lucide-react';
import { BROCHURES } from '../data/itemsData';
import { BrochureItem } from '../types';
import { ItemGraphic } from './ItemGraphic';
import { royaleLogger } from '../utils/logger';
import { HAMPER_QUEEN_OFFICIAL_CONTACT } from '../data/hamperQueenCatalog';

export const BrochuresSection: React.FC = () => {
  const [activePreviewBrochure, setActivePreviewBrochure] = useState<BrochureItem | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const handleDownload = (brochure: BrochureItem) => {
    setDownloadToast(`Preparing ${brochure.title} (PDF)...`);
    royaleLogger.action('Brochure', `User downloaded lookbook: ${brochure.downloadName}`);

    // Create a client-side simulated PDF/document download
    const documentContent = `
HAMPER QUEEN - ROYAL HAMPERS & BESPOKE BOUQUETS ATELIER
======================================================
CATALOGUE: ${brochure.title}
SUBTITLE: ${brochure.subtitle}
PAGE COUNT: ${brochure.pages} Pages
CATEGORY: ${brochure.tag}

HIGHLIGHTS:
${brochure.highlights.map((h) => `• ${h}`).join('\n')}

DESCRIPTION:
${brochure.description}

PRICING AT A GLANCE (TRANSPARENT):
• Orders start from INR 140 (+delivery)
• ≈ INR 70 per curated item for 2 - 5 items
• INR 399 (6 items) | INR 499 (7 items) | +INR 50 per item beyond 7
• Free delivery on orders above INR 499 (Mumbai)

HOW IT WORKS:
1. Choose your style
2. Select items from our menu
3. Tell us any personal preferences
4. We customize & deliver with love

ATELIER CONTACT:
WhatsApp / Call: ${HAMPER_QUEEN_OFFICIAL_CONTACT.phoneDisplay}
Instagram: @hamper_queen
Email: ${HAMPER_QUEEN_OFFICIAL_CONTACT.email}
"Gift your loved ones, make your little moments memorable with us"
    `.trim();

    const blob = new Blob([documentContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = brochure.downloadName.replace('.pdf', '.txt');
    a.click();

    setTimeout(() => {
      setDownloadToast(null);
    }, 3500);
  };

  return (
    <section id="brochures-section" className="section bg-white">
      <div className="container-page">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-50 border border-line-strong text-gold-700 text-xs font-sans font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5 text-gold-700" />
            <span>Digital Lookbooks & Editions</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-ink tracking-tight">
            Official Catalogue Collection
          </h2>
          <p className="font-cormorant text-lg text-cocoa mt-2">
            Six complete volumes: our signature hamper menu, category boxes, bouquet collections, bridal trousseau, corporate honors, and seasonal floral studio. Available for instant digital preview or immediate download.
          </p>
        </div>

        {/* Global Download Toast */}
        {downloadToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-ink text-gold-300 border border-gold-500 px-5 py-3 rounded-xl shadow-float flex items-center gap-3 animate-fade-in">
            <Check className="w-5 h-5 text-gold-300" />
            <span className="text-xs font-semibold">{downloadToast}</span>
          </div>
        )}

        {/* 3 Brochure Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BROCHURES.map((brochure) => (
            <div
              key={brochure.id}
              id={`brochure-card-${brochure.id}`}
              className="group bg-white rounded-3xl border border-gold-400/30 hover:border-gold-500 p-6 flex flex-col justify-between transition-all duration-250 hover:shadow-float"
            >
              {/* Cover Graphic Stage */}
              <div className="relative w-full h-52 bg-cream-100 rounded-2xl border border-cream-200 p-4 flex items-center justify-center mb-5 overflow-hidden group-hover:bg-[#FCFAF6] transition-colors">
                <ItemGraphic
                  id={brochure.coverGraphic}
                  size="lg"
                  className="transform group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 text-xs font-semibold bg-ink text-gold-300 px-3 py-1 rounded-full border border-gold-500/40">
                  {brochure.tag}
                </span>
                <span className="absolute bottom-3 left-3 text-xs font-semibold text-gold-700 bg-white/90 px-2 py-0.5 rounded-md border border-line-strong">
                  {brochure.pages} Pages • 2026 Edition
                </span>
              </div>

              {/* Text Information */}
              <div className="space-y-2 flex-1">
                <h3 className="font-cinzel text-lg font-bold text-ink group-hover:text-gold-700 transition-colors">
                  {brochure.title}
                </h3>
                <p className="font-cormorant text-sm text-stone leading-relaxed">
                  {brochure.subtitle}
                </p>

                {/* Bullet Highlights */}
                <div className="pt-3 space-y-1">
                  {brochure.highlights.map((item, idx) => (
                    <div key={idx} className="text-xs text-[#524B3E] flex items-center gap-1.5">
                      <span className="text-gold-500">✦</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 mt-4 border-t border-cream-200 flex items-center gap-2">
                <button
                  id={`btn-preview-brochure-${brochure.id}`}
                  onClick={() => {
                    setActivePreviewBrochure(brochure);
                    royaleLogger.action('Brochure', `Opened digital lookbook preview: ${brochure.title}`);
                  }}
                  className="flex-1 py-3 px-3 rounded-xl bg-cream-100 hover:bg-cream-200 text-ink text-xs font-semibold border border-line-strong transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-gold-700" />
                  <span>Preview</span>
                </button>

                <button
                  id={`btn-download-brochure-${brochure.id}`}
                  onClick={() => handleDownload(brochure)}
                  className="flex-1 py-3 px-3 rounded-xl bg-ink hover:bg-ink-soft text-gold-100 text-xs font-semibold border border-gold-500 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-soft"
                >
                  <Download className="w-3.5 h-3.5 text-gold-300" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Digital Lookbook Flip Modal */}
        {activePreviewBrochure && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-cream-100 rounded-3xl border border-gold-500/70 max-w-2xl w-full p-6 sm:p-8 shadow-float relative max-h-[90dvh] overflow-y-auto">
              
              <button
                id="btn-close-brochure-modal"
                onClick={() => setActivePreviewBrochure(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white border border-line text-cocoa hover:text-ink transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                <div>
                  <span className="text-xs font-semibold text-gold-700">
                    {activePreviewBrochure.tag} • {activePreviewBrochure.pages} Pages
                  </span>
                  <h3 className="font-cinzel text-2xl font-bold text-ink mt-1">
                    {activePreviewBrochure.title}
                  </h3>
                  <p className="font-cormorant text-sm italic text-[#635D50] mt-0.5">
                    {activePreviewBrochure.subtitle}
                  </p>
                </div>

                {/* Simulated Digital Lookbook Spread */}
                <div className="bg-white rounded-2xl border border-line-strong p-6 shadow-inner space-y-4">
                  <div className="h-44 bg-cream-100 rounded-xl flex items-center justify-center border border-line-strong">
                    <ItemGraphic id={activePreviewBrochure.coverGraphic} size="lg" />
                  </div>

                  <p className="text-xs text-cocoa leading-relaxed">
                    {activePreviewBrochure.description}
                  </p>

                  <div className="bg-cream-100 p-3 rounded-xl border border-[#E8DFCA]">
                    <span className="text-xs font-semibold text-ink block mb-1.5">
                      Curatorial Highlights inside this issue:
                    </span>
                    <ul className="space-y-1 text-xs text-cocoa">
                      {activePreviewBrochure.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-gold-500 font-bold">✓</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setActivePreviewBrochure(null)}
                    className="text-xs font-semibold text-[#665F50] hover:text-ink cursor-pointer"
                  >
                    Close Lookbook
                  </button>

                  <button
                    onClick={() => {
                      handleDownload(activePreviewBrochure);
                      setActivePreviewBrochure(null);
                    }}
                    className="px-6 py-3 rounded-full bg-ink text-gold-100 text-xs font-semibold border border-gold-500 shadow-lift hover:bg-ink-soft transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-gold-300" />
                    <span>Download Full Catalogue</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
