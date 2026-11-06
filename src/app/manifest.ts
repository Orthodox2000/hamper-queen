import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hamper Queen — Custom Gift Hampers & Chocolate Bouquets',
    short_name: 'Hamper Queen',
    description:
      'Custom gift hampers and chocolate bouquets from INR 799 — velvet trunks, photo keepsakes, same-day dispatch from Mumbai.',
    id: '/',
    start_url: '/',
    scope: '/',
    lang: 'en-IN',
    dir: 'ltr',
    display: 'standalone',
    orientation: 'portrait',
    categories: ['shopping', 'lifestyle'],
    background_color: '#FFFDF9',
    theme_color: '#141210',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Customise a hamper', short_name: 'Customise', url: '/customised', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
      { name: 'Track my order', short_name: 'Track', url: '/track', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
      { name: 'Browse collections', short_name: 'Collections', url: '/catalog', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
    ],
  };
}