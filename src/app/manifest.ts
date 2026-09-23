import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hamper Queen — Custom Gift Hampers & Chocolate Bouquets',
    short_name: 'Hamper Queen',
    description:
      'Custom gift hampers and chocolate bouquets from INR 799 — velvet trunks, photo keepsakes, same-day dispatch from Mumbai.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFDF9',
    theme_color: '#141210',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}