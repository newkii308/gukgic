import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://gukgic.la';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/friends', '/u/', '/terms', '/privacy', '/about'],
        disallow: ['/messages/', '/notifications', '/settings', '/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
