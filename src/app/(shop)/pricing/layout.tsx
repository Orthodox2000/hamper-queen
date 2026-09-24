import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  title: 'Transparent Hamper Pricing & Gifting Guide | Hamper Queen',
  description:
    'Clear, honest pricing for custom hampers and bouquets from INR 140 — no hidden fees, free delivery above INR 499 and bulk tier discounts up to 30%.',
  keywords: ['gift hamper price India', 'chocolate bouquet price', 'hamper cost Mumbai'],
  canonical: '/pricing',
});

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}