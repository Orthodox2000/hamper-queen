import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  title: 'Gift Inspiration & Ideas for Every Cause | Hamper Queen',
  description:
    'Occasion-by-occasion gifting ideas — from just-because treats to weddings — with hamper theme suggestions, budgets and colour stories.',
  keywords: ['gift ideas India', 'gift hamper inspiration', 'chocolate gift ideas Mumbai'],
  canonical: '/inspirations',
});

export default function InspirationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}