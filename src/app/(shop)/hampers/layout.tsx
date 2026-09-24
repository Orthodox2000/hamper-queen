import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  title: 'Luxury Gift Hampers for Every Occasion | Hamper Queen',
  description:
    'Velvet trunks, curated hampers and keepsake gift boxes for birthdays, anniversaries and Diwali — same-day dispatch from Mumbai with free delivery above INR 499.',
  keywords: ['birthday gift hampers India', 'anniversary hamper box', 'Diwali gift hamper Mumbai'],
  canonical: '/hampers',
});

export default function HampersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}