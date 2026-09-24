import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/customised`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/catalog`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/hampers`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/bulk`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/inspirations`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/pricing`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/atelier`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/brochures`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/scribe`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/track`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/terms-of-service`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/eula`, changeFrequency: 'yearly', priority: 0.2 },
  ];
}