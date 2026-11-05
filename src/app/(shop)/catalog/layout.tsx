import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  title: 'Catalog & Signature Gift Collections | Hamper Queen',
  description:
    'Browse Hamper Queen signature gift hampers, chocolate bouquets, photo keepsakes and curated collections priced from INR 140, hand-packed in Mumbai.',
  keywords: ['gift hampers catalogue', 'chocolate bouquet collection', 'luxury hamper collection India'],
  canonical: '/catalog',
});

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}