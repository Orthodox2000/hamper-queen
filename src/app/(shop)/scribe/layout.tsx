import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  title: 'Free Calligraphy Gift Messages | Hamper Queen',
  description:
    'Handwritten calligraphy gift messages on wax-sealed cards — free with every Hamper Queen hamper, bouquet, tray or bag.',
  keywords: ['calligraphy gift card', 'handwritten gift message', 'wax seal card India'],
  canonical: '/scribe',
});

export default function ScribeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}