import type { Metadata } from 'next';

export const SITE_NAME = 'Hamper Queen';
export const SITE_URL = 'https://hamper-queen.vercel.app';
export const OG_IMAGE = '/opengraph-image';
const DEFAULT_KEYWORDS = [
  'custom gift hampers',
  'chocolate bouquets',
  'gift hampers Mumbai',
  'personalised hampers',
  'birthday gift hampers',
  'luxury gifting',
  'photo keepsake hampers',
  'valentine chocolate bouquets',
  'bulk corporate gifts',
  'Hamper Queen',
];

interface SeoOptions {
  title: string;
  description: string;
  keywords?: string[];
  canonical: string;
  robots?: Metadata['robots'];
}

function absolutePath(path: string): string {
  return path.startsWith('http') ? path : `${SITE_URL}${path}`;
}

export function buildSeoMetadata({
  title,
  description,
  keywords = [],
  canonical,
  robots,
}: SeoOptions): Metadata {
  const url = absolutePath(canonical);
  const mergedKeywords = Array.from(new Set([...DEFAULT_KEYWORDS, ...keywords]));
  return {
    title,
    description,
    keywords: mergedKeywords,
    alternates: { canonical: url },
    robots:
      robots ?? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${title} — ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

export { DEFAULT_KEYWORDS };