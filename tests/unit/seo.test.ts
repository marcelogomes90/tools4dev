import { afterEach, describe, expect, it, vi } from 'vitest';
import { getToolBySlug } from '@/lib/tool-registry';
import {
    CANONICAL_SITE_URL,
    getPublicSiteUrl,
    getToolSeoDescription,
    getToolSeoKeywords,
    toAbsoluteSiteUrl,
} from '@/lib/seo';

describe('seo helpers', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('uses localhost in development when public URL is not configured', () => {
        vi.stubEnv('NODE_ENV', 'development');
        vi.stubEnv('NEXT_PUBLIC_APP_URL', '');
        vi.stubEnv('SITE_URL', '');
        vi.stubEnv('APP_URL', '');

        expect(getPublicSiteUrl()).toBe('http://localhost:3000');
    });

    it('uses canonical production URL when public URL is not configured', () => {
        vi.stubEnv('NODE_ENV', 'production');
        vi.stubEnv('NEXT_PUBLIC_APP_URL', '');
        vi.stubEnv('SITE_URL', '');
        vi.stubEnv('APP_URL', '');

        expect(getPublicSiteUrl()).toBe(CANONICAL_SITE_URL);
        expect(toAbsoluteSiteUrl('/tools/cnpj-generator')).toBe(
            `${CANONICAL_SITE_URL}/tools/cnpj-generator`,
        );
    });

    it('canonicalizes configured apex public URLs', () => {
        vi.stubEnv('NODE_ENV', 'development');
        vi.stubEnv('NEXT_PUBLIC_APP_URL', 'tools4dev.com.br/');

        expect(CANONICAL_SITE_URL).toBe('https://www.tools4dev.com.br');
        expect(getPublicSiteUrl()).toBe(CANONICAL_SITE_URL);
    });

    it('ignores loopback public URL in production', () => {
        vi.stubEnv('NODE_ENV', 'production');
        vi.stubEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000');

        expect(getPublicSiteUrl()).toBe(CANONICAL_SITE_URL);
    });

    it('includes alphanumeric CNPJ SEO terms', () => {
        const tool = getToolBySlug('cnpj-generator');
        expect(tool).toBeDefined();
        if (!tool) return;

        expect(getToolSeoDescription(tool).toLowerCase()).toContain(
            'alfanumérico',
        );
        expect(getToolSeoKeywords(tool)).toContain(
            'validar cnpj alfanumérico',
        );
    });
});
