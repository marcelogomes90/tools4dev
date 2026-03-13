import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { toolDefinitions } from '@/lib/tool-registry';
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = await resolveSiteUrl();
    if (!siteUrl) return [];

    const now = new Date();

    return [
        {
            url: siteUrl,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1,
        },
        ...toolDefinitions.map((tool) => ({
            url: `${siteUrl}${tool.path}`,
            lastModified: now,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        })),
    ];
}
