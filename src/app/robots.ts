import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { getPublicSiteUrl } from '@/lib/seo';

async function resolveSiteUrl() {
    const configuredUrl = getPublicSiteUrl();
    if (configuredUrl) return configuredUrl;

    const requestHeaders = await headers();
    const host =
        requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host');
    if (!host) return undefined;

    const forwardedProto = requestHeaders.get('x-forwarded-proto');
    const protocol =
        forwardedProto ??
        (host.includes('localhost') || host.startsWith('127.0.0.1')
            ? 'http'
            : 'https');

    return `${protocol}://${host}`;
}

export default async function robots(): Promise<MetadataRoute.Robots> {
    const siteUrl = await resolveSiteUrl();

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
