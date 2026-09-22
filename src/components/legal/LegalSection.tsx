/**
 * LegalSection.tsx
 * -----------------------------------------------------------------------------
 * Numbered section block used across the standalone legal pages.
 */
import React from 'react';

interface LegalSectionProps {
  title: string;
  id?: string;
  children: React.ReactNode;
}

export const LegalSection: React.FC<LegalSectionProps> = ({ title, id, children }) => (
  <section id={id} className="space-y-3">
    <h2 className="font-seasons text-xl sm:text-2xl font-bold text-[#141414] flex items-center gap-2">
      <span className="w-1.5 h-6 rounded-full bg-[#D4AF37] inline-block shrink-0" />
      {title}
    </h2>
    <div className="space-y-3 text-[13px] sm:text-sm text-[#524B40] leading-relaxed font-sans">{children}</div>
  </section>
);