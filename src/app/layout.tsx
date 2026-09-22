import type { Metadata } from 'next';
import './globals.css';

const siteTitle = 'Hamper Queen — Custom Gift Hampers & Chocolate Bouquets';
const siteDescription =
  'Custom hampers and chocolate bouquets from ₹799. Velvet trunks, personalised photo keepsakes, same-day dispatch from Mumbai, free delivery over ₹499 across India.';

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  metadataBase: new URL('https://hamperqueen.example.com'),
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
  },
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
        {children}
      </body>
    </html>
  );
}