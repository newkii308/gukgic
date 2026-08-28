import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://friend-social.la';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/friends', '/u/'],
        disallow: ['/messages/', '/notifications', '/settings', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
