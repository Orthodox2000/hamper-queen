import { buildSeoMetadata } from '@/lib/seo';

export const metadata = buildSeoMetadata({
  title: 'Bulk Corporate Gifts with Tiered Discounts | Hamper Queen',
  description:
    'Bulk-order custom hampers and corporate gifting from 5 hampers to 300+ with stackable tiered discounts up to 30% on large orders, delivered across India.',
  keywords: ['corporate bulk gifts', 'bulk order hampers India', 'employee gifting hampers Mumbai'],
  canonical: '/bulk',
});

export default function BulkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}