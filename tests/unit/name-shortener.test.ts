import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { generateNames } from '@/lib/tools/name';
import { createShortLink, resolveShortLink } from '@/server/services/shortener';

declare global {
  var __tools4devShortLinks: Map<
    string,
    { slug: string; url: string; createdAt: string; hits: number }
  > | undefined;
}

describe('name generator', () => {
  it('clamps amount from 1 to 200', () => {
    expect(generateNames(0, false, 'pt-BR')).toHaveLength(1);
    expect(generateNames(999, false, 'en')).toHaveLength(200);
  });

  it('generates full names with and without middle name', () => {
    const basic = generateNames(10, false, 'pt-BR');
    const middle = generateNames(10, true, 'pt-BR');

    expect(basic.every((name) => name.trim().length > 3)).toBe(true);
    expect(middle.every((name) => name.split(/\s+/).length >= 3)).toBe(true);
  });
});

describe('shortener service', () => {
  let tempDir = '';
  let storeFile = '';

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'tools4dev-shortener-test-'));
    storeFile = join(tempDir, 'short-links.json');
    process.env.SHORTENER_STORAGE_FILE = storeFile;
    globalThis.__tools4devShortLinks = new Map();
  });

  afterEach(() => {
    delete process.env.SHORTENER_STORAGE_FILE;
    globalThis.__tools4devShortLinks = undefined;
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('creates short link with normalized custom slug', () => {
    const result = createShortLink(
      { url: 'https://example.com', slug: ' Meu-Slug ' },
      'https://dev.example.com/',
    );

    expect(result.slug).toBe('meu-slug');
    expect(result.shortUrl).toBe('https://dev.example.com/s/meu-slug');
    expect(result.provider).toBe('local');
  });

  it('creates random slug with 5 chars when none is provided', () => {
    const result = createShortLink({ url: 'https://example.com/a' }, 'https://dev.example.com');

    expect(result.slug).toMatch(/^[a-z0-9]{5}$/);
    expect(result.shortUrl.endsWith(`/s/${result.slug}`)).toBe(true);
  });

  it('rejects duplicate slugs', () => {
    createShortLink({ url: 'https://example.com/1', slug: 'dup' }, 'https://dev.example.com');

    expect(() =>
      createShortLink({ url: 'https://example.com/2', slug: 'dup' }, 'https://dev.example.com'),
    ).toThrow('Slug já está em uso. Escolha outro.');
  });

  it('resolves slug case-insensitively and increments hit counter', () => {
    createShortLink({ url: 'https://example.com/target', slug: 'mySlug' }, 'https://dev.example.com');

    const first = resolveShortLink('myslug');
    const second = resolveShortLink('MYSLUG');

    expect(first?.url).toBe('https://example.com/target');
    expect(second?.hits).toBe(2);
  });

  it('returns null for unknown slugs', () => {
    expect(resolveShortLink('inexistente')).toBeNull();
  });

  it('persists links in storage file and resolves after memory reset', () => {
    const created = createShortLink(
      { url: 'https://example.com/persisted', slug: 'persistido' },
      'https://dev.example.com',
    );

    globalThis.__tools4devShortLinks = undefined;

    const resolved = resolveShortLink(created.slug);
    expect(resolved?.url).toBe('https://example.com/persisted');
    expect(resolved?.hits).toBe(1);
  });
});
