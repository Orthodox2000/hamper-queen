import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  title: 'Private Custom Hamper Atelier | Hamper Queen',
  description:
    'Order fully bespoke hampers from the Hamper Queen atelier — one-of-one keepsakes, monogrammed wax seals and white-glove corporate gifting.',
  keywords: ['bespoke gift hamper', 'custom luxury hamper Mumbai', 'monogrammed gift box India'],
  canonical: '/atelier',
});

export default function AtelierLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}