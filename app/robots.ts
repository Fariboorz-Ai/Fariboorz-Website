import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',      
          '/auth/',        
          '/api/',          
          '/signin',
          '/signup',
        ],
      },
    ],
    sitemap: 'https://fariboorzai.com/sitemap.xml',
  };
}