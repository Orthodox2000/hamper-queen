import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  title: 'Gifting Brochures & Digital Lookbook | Hamper Queen',
  description:
    'Browse the Hamper Queen digital lookbook and glossy gifting brochures for corporate suites, weddings and seasonal collections.',
  keywords: ['gift brochure India', 'hamper lookbook', 'corporate gifting brochure'],
  canonical: '/brochures',
});

export default function BrochuresLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}