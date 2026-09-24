import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  title: 'Custom Gift Builder: Box, Bouquet, Tray & Bag | Hamper Queen',
  description:
    'Design your own luxury gift hamper, chocolate bouquet, wooden tray or tote — pick signature themes, add a wax-seal calligraphy card and deliver anywhere in India.',
  keywords: ['design your own gift hamper', 'custom chocolate bouquet', 'personalised gift box India'],
  canonical: '/customised',
});

export default function CustomisedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}