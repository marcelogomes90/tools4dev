import type { MetadataRoute } from 'next';
import { getPublicSiteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
    const siteUrl = getPublicSiteUrl();

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/s/'],
        },
        ...(siteUrl
            ? {
                  sitemap: `${siteUrl}/sitemap.xml`,
                  host: siteUrl,
              }
            : {}),
    };
}
