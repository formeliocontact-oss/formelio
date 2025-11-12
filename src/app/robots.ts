import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/', '/profile/', '/(auth)/'],
    },
    sitemap: 'https://formelio.fr/sitemap.xml',
  };
}
