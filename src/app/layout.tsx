import type { Metadata, Viewport } from 'next';
import './globals.css';

const SITE_TITLE = 'Custom Gift Hampers & Chocolate Bouquets | Hamper Queen';
const SITE_DESCRIPTION =
  'Custom gift hampers and chocolate bouquets from INR 149 — velvet trunks, photo keepsakes, same-day dispatch from Mumbai with free delivery above INR 499.';
const SITE_URL = 'https://hamper-queen.vercel.app';

export const viewport: Viewport = {
  themeColor: '#141210',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  manifest: '/manifest.webmanifest',
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
      <body className="bg-white text-[#141414] antialiased selection:bg-[#D4AF37]/30 selection:text-[#111111]">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
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