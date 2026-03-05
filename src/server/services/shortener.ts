import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

interface ShortLinkCreateInput {
  url: string;
  slug?: string;
}

interface ShortLinkRecord {
  slug: string;
  url: string;
  createdAt: string;
  hits: number;
}

declare global {
  var __tools4devShortLinks: Map<string, ShortLinkRecord> | undefined;
}

const STORE_FILE_ENV = 'SHORTENER_STORAGE_FILE';
const STORE_FILE_DEFAULT = join(tmpdir(), 'tools4dev-shortlinks.json');

function getStoreFilePath() {
  const configured = process.env[STORE_FILE_ENV]?.trim();
  return configured || STORE_FILE_DEFAULT;
}

function getMemoryStore() {
  if (!globalThis.__tools4devShortLinks) {
    globalThis.__tools4devShortLinks = new Map<string, ShortLinkRecord>();
  }

  return globalThis.__tools4devShortLinks;
}

function isRecord(value: unknown): value is ShortLinkRecord {
  if (!value || typeof value !== 'object') return false;

  const maybe = value as Record<string, unknown>;
  return (
    typeof maybe.slug === 'string' &&
    typeof maybe.url === 'string' &&
    typeof maybe.createdAt === 'string' &&
    typeof maybe.hits === 'number'
  );
}

function loadStoreFromDisk() {
  const filePath = getStoreFilePath();
  const raw = readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(raw) as { items?: unknown };
  const items = Array.isArray(parsed.items) ? parsed.items : [];
  const map = new Map<string, ShortLinkRecord>();

  for (const item of items) {
    if (!isRecord(item)) continue;

    const normalizedSlug = normalizeSlug(item.slug);
    map.set(normalizedSlug, {
      slug: normalizedSlug,
      url: item.url,
      createdAt: item.createdAt,
      hits: Number.isFinite(item.hits) ? Math.max(0, Math.trunc(item.hits)) : 0,
    });
  }

  return map;
}

function persistStoreToDisk(store: Map<string, ShortLinkRecord>) {
  const filePath = getStoreFilePath();
  const directory = dirname(filePath);
  const tempFile = `${filePath}.${process.pid}.${Date.now()}.tmp`;

  mkdirSync(directory, { recursive: true });
  writeFileSync(
    tempFile,
    JSON.stringify(
      {
        items: Array.from(store.values()),
      },
      null,
      2,
    ),
    'utf8',
  );
  renameSync(tempFile, filePath);
}

function loadStore() {
  try {
    return loadStoreFromDisk();
  } catch {
    return getMemoryStore();
  }
}

function persistStore(store: Map<string, ShortLinkRecord>) {
  try {
    persistStoreToDisk(store);
  } catch {
    globalThis.__tools4devShortLinks = new Map(store);
  }
}

function normalizeSlug(value: string) {
  return value.trim().toLowerCase();
}

function randomSlug(length = 5) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let output = '';

  for (let i = 0; i < length; i += 1) {
    output += charset[Math.floor(Math.random() * charset.length)] ?? 'x';
  }

  return output.toLowerCase();
}

function createAutoSlug(store: Map<string, ShortLinkRecord>) {
  for (let tries = 0; tries < 10; tries += 1) {
    const candidate = randomSlug(5);
    if (!store.has(candidate)) return candidate;
  }

  throw new Error('Falha ao gerar slug único. Tente novamente.');
}

function withBaseUrl(baseUrl: string, slug: string) {
  const normalizedBase = baseUrl.replace(/\/$/, '');
  return `${normalizedBase}/s/${slug}`;
}

export function createShortLink(input: ShortLinkCreateInput, baseUrl: string) {
  const store = loadStore();
  const requestedSlug = input.slug ? normalizeSlug(input.slug) : '';
  const slug = requestedSlug || createAutoSlug(store);

  if (store.has(slug)) {
    throw new Error('Slug já está em uso. Escolha outro.');
  }

  store.set(slug, {
    slug,
    url: input.url,
    createdAt: new Date().toISOString(),
    hits: 0,
  });
  persistStore(store);

  return {
    slug,
    shortUrl: withBaseUrl(baseUrl, slug),
    expiresAt: null,
    provider: 'local' as const,
  };
}

export function resolveShortLink(slug: string) {
  const store = loadStore();
  const normalized = normalizeSlug(slug);
  const item = store.get(normalized);

  if (!item) return null;

  item.hits += 1;
  store.set(normalized, item);
  persistStore(store);

  return item;
}
