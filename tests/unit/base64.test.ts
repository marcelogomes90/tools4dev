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
});
