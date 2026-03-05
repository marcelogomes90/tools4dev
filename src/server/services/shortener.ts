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
  var __devSwissShortLinks: Map<string, ShortLinkRecord> | undefined;
}

function getStore() {
  if (!globalThis.__devSwissShortLinks) {
    globalThis.__devSwissShortLinks = new Map<string, ShortLinkRecord>();
  }

  return globalThis.__devSwissShortLinks;
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
  const store = getStore();
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

  return {
    slug,
    shortUrl: withBaseUrl(baseUrl, slug),
    expiresAt: null,
    provider: 'local' as const,
  };
}

export function resolveShortLink(slug: string) {
  const store = getStore();
  const normalized = normalizeSlug(slug);
  const item = store.get(normalized);

  if (!item) return null;

  item.hits += 1;
  store.set(normalized, item);

  return item;
}
