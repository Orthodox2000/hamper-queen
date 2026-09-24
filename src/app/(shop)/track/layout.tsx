import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  title: 'Track Your Hamper Queen Order Delivery | Hamper Queen',
  description:
    'Enter your Hamper Queen tracking ID (HQ-XXXXXX) to follow your gift from the studio to the doorstep — live delivery progress and WhatsApp support.',
  keywords: ['track gift hamper order', 'hamper courier tracking India', 'order delivery status Mumbai'],
  canonical: '/track',
});

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}