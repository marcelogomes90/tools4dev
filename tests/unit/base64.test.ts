import { describe, expect, it } from 'vitest';
import { decodeBase64, encodeBase64 } from '@/lib/tools/base64';

describe('base64 utf8', () => {
    it('encodes and decodes utf8 text', () => {
        const value = 'Olá, tools4dev';
        const encoded = encodeBase64(value);
        const decoded = decodeBase64(encoded);

        expect(decoded).toBe(value);
    });

    it('handles url-safe mode', () => {
        const value = 'https://example.com/path?q=1&name=marcelo';
        const encoded = encodeBase64(value, true);
        const decoded = decodeBase64(encoded, true);

        expect(encoded.includes('+')).toBe(false);
        expect(encoded.includes('/')).toBe(false);
        expect(decoded).toBe(value);
    });

    it('encodes and decodes empty string', () => {
        const encoded = encodeBase64('');
        const decoded = decodeBase64(encoded);
        expect(decoded).toBe('');
    });

    it('encodes and decodes emojis and multibyte characters', () => {
        const value = '🚀 Hello 世界 — tools4dev';
        const encoded = encodeBase64(value);
        const decoded = decodeBase64(encoded);
        expect(decoded).toBe(value);
    });

    it('encodes and decodes special html characters', () => {
        const value = '<script>alert("xss")</script>';
        const encoded = encodeBase64(value);
        const decoded = decodeBase64(encoded);
        expect(decoded).toBe(value);
    });

    it('url-safe encoding has no padding characters', () => {
        const value = 'test';
        const encoded = encodeBase64(value, true);
        expect(encoded.includes('=')).toBe(false);
    });

    it('url-safe encoding has no + or / characters', () => {
        // Use a value that would produce + or / in standard base64
        const value = 'Many chars: >>>???===+++';
        const encoded = encodeBase64(value, true);
        expect(encoded.includes('+')).toBe(false);
        expect(encoded.includes('/')).toBe(false);
    });
});
