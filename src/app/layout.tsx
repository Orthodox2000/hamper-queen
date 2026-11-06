import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/fraunces/soft.css';
import '@fontsource-variable/fraunces/soft-italic.css';
import '@fontsource-variable/dancing-script';
import '@fontsource-variable/plus-jakarta-sans';
import './globals.css';
import { SITE_URL } from '../lib/seo';

const SITE_TITLE = 'Custom Gift Hampers & Chocolate Bouquets | Hamper Queen';
const SITE_DESCRIPTION =
  'Custom gift hampers and chocolate bouquets from INR 140 — velvet trunks, photo keepsakes, same-day dispatch from Mumbai with free delivery above INR 499.';

export const viewport: Viewport = {
  themeColor: '#141210',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  manifest: '/manifest.webmanifest',
  applicationName: 'Hamper Queen',
  category: 'shopping',
  authors: [{ name: 'Hamper Queen', url: SITE_URL }],
  creator: 'Ms. Supriya Khandekar',
  publisher: 'Hamper Queen',
  formatDetection: { telephone: false, email: false, address: false },
  other: {
    'msapplication-config': '/browserconfig.xml',
    'msapplication-TileColor': '#141210',
    'mobile-web-app-capable': 'yes',
  },
  appleWebApp: {
    title: 'Hamper Queen',
    capable: true,
    statusBarStyle: 'default',
  },
  keywords: [
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
  ],
  alternates: {
    canonical: '/',
  },
  robots: {
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
    url: SITE_URL,
    siteName: 'Hamper Queen',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Hamper Queen — custom gift hampers & chocolate bouquets',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/opengraph-image'],
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Hamper Queen',
  url: SITE_URL,
  logo: `${SITE_URL}/hamper.png`,
  telephone: '+918080580105',
  email: 'mailto:hamperqueen20@gmail.com',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+918080580105',
    contactType: 'sales',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi'],
  },
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-white text-ink antialiased selection:bg-gold-400/30 selection:text-ink">
        <link rel="preload" href="/fonts/TheSeasons-Regular.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/TheSeasons-Bold.woff2" as="font" type="font/woff2" crossOrigin="" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}