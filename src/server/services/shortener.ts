import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { Pool } from 'pg';

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

interface PostgresStore {
  connectionString: string;
  pool: Pool;
  schemaReady: Promise<void>;
  tableName: string;
}

interface PostgresRow {
  slug: string;
  url: string;
  created_at: Date | string;
  hits: number | string;
}

declare global {
  var __tools4devShortLinks: Map<string, ShortLinkRecord> | undefined;
  var __tools4devShortLinksPostgres: PostgresStore | undefined;
}

const STORE_FILE_ENV = 'SHORTENER_STORAGE_FILE';
const STORE_FILE_DEFAULT = join(tmpdir(), 'tools4dev-shortlinks.json');
const DATABASE_URL_ENV = 'SHORTENER_DATABASE_URL';
const SUPABASE_DATABASE_URL_ENV = 'SUPABASE_DB_URL';
const VERCEL_POSTGRES_URL_ENV = 'POSTGRES_URL';
const VERCEL_POSTGRES_PRISMA_URL_ENV = 'POSTGRES_PRISMA_URL';
const VERCEL_POSTGRES_NON_POOLING_URL_ENV = 'POSTGRES_URL_NON_POOLING';
const VERCEL_POSTGRES_USER_ENV = 'POSTGRES_USER';
const VERCEL_POSTGRES_HOST_ENV = 'POSTGRES_HOST';
const VERCEL_POSTGRES_DATABASE_ENV = 'POSTGRES_DATABASE';
const VERCEL_POSTGRES_PASSWORD_ENV = 'POSTGRES_PASSWORD';
const VERCEL_POSTGRES_PORT_ENV = 'POSTGRES_PORT';
const DATABASE_TABLE_ENV = 'SHORTENER_DATABASE_TABLE';
const DATABASE_TABLE_DEFAULT = 'short_links';

function getStoreFilePath() {
  const configured = process.env[STORE_FILE_ENV]?.trim();
  return configured || STORE_FILE_DEFAULT;
}

function getDatabaseUrl() {
  const shortenerUrl = process.env[DATABASE_URL_ENV]?.trim();
  if (shortenerUrl) return shortenerUrl;

  const supabaseUrl = process.env[SUPABASE_DATABASE_URL_ENV]?.trim();
  if (supabaseUrl) return supabaseUrl;

  const vercelPostgresUrl = process.env[VERCEL_POSTGRES_URL_ENV]?.trim();
  if (vercelPostgresUrl) return vercelPostgresUrl;

  const vercelPostgresPrismaUrl = process.env[VERCEL_POSTGRES_PRISMA_URL_ENV]?.trim();
  if (vercelPostgresPrismaUrl) return vercelPostgresPrismaUrl;

  const genericUrl = process.env.DATABASE_URL?.trim();
  if (genericUrl) return genericUrl;

  const vercelPostgresNonPoolingUrl =
    process.env[VERCEL_POSTGRES_NON_POOLING_URL_ENV]?.trim();
  if (vercelPostgresNonPoolingUrl) return vercelPostgresNonPoolingUrl;

  return buildDatabaseUrlFromParts();
}

function buildDatabaseUrlFromParts() {
  const user = process.env[VERCEL_POSTGRES_USER_ENV]?.trim();
  const host = process.env[VERCEL_POSTGRES_HOST_ENV]?.trim();
  const database = process.env[VERCEL_POSTGRES_DATABASE_ENV]?.trim();
  const password = process.env[VERCEL_POSTGRES_PASSWORD_ENV]?.trim();

  if (!user || !host || !database || !password) return '';

  const configuredPort = process.env[VERCEL_POSTGRES_PORT_ENV]?.trim();
  const port = configuredPort || '5432';
  const hasHostPort = host.includes(':');
  const hostWithPort = hasHostPort ? host : `${host}:${port}`;
  const encodedUser = encodeURIComponent(user);
  const encodedPassword = encodeURIComponent(password);
  const encodedDatabase = encodeURIComponent(database);

  return `postgresql://${encodedUser}:${encodedPassword}@${hostWithPort}/${encodedDatabase}?sslmode=require`;
}

function getDatabaseTable() {
  const configured = process.env[DATABASE_TABLE_ENV]?.trim();
  return configured || DATABASE_TABLE_DEFAULT;
}

function quoteIdentifier(value: string) {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) {
    throw new Error('SHORTENER_DATABASE_TABLE inválido.');
  }

  return `"${value}"`;
}

function quoteTableName(value: string) {
  const parts = value.split('.').map((part) => part.trim()).filter(Boolean);
  if (parts.length === 0 || parts.length > 2) {
    throw new Error('SHORTENER_DATABASE_TABLE inválido.');
  }

  return parts.map((part) => quoteIdentifier(part)).join('.');
}

async function ensureSchema(pool: Pool, tableName: string) {
  const table = quoteTableName(tableName);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${table} (
      slug TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      hits BIGINT NOT NULL DEFAULT 0
    );
  `);
}

async function getPostgresStore(): Promise<PostgresStore | null> {
  const connectionString = getDatabaseUrl();
  if (!connectionString) return null;

  const tableName = getDatabaseTable();
  const existing = globalThis.__tools4devShortLinksPostgres;

  if (
    existing &&
    existing.connectionString === connectionString &&
    existing.tableName === tableName
  ) {
    return existing;
  }

  const pool = new Pool({ connectionString });
  const schemaReady = ensureSchema(pool, tableName);
  const store: PostgresStore = {
    connectionString,
    pool,
    schemaReady,
    tableName,
  };

  globalThis.__tools4devShortLinksPostgres = store;
  return store;
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

function loadJsonStore() {
  try {
    return loadStoreFromDisk();
  } catch {
    return getMemoryStore();
  }
}

function persistJsonStore(store: Map<string, ShortLinkRecord>) {
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

function fromPostgresRow(row: PostgresRow): ShortLinkRecord {
  const createdAt =
    row.created_at instanceof Date
      ? row.created_at.toISOString()
      : new Date(row.created_at).toISOString();
  const hits = Number.isFinite(Number(row.hits))
    ? Math.max(0, Math.trunc(Number(row.hits)))
    : 0;

  return {
    slug: normalizeSlug(row.slug),
    url: row.url,
    createdAt,
    hits,
  };
}

async function insertPostgresRecord(
  store: PostgresStore,
  slug: string,
  url: string,
): Promise<boolean> {
  await store.schemaReady;
  const table = quoteTableName(store.tableName);

  const result = await store.pool.query<{ slug: string }>(
    `
      INSERT INTO ${table} (slug, url, created_at, hits)
      VALUES ($1, $2, NOW(), 0)
      ON CONFLICT (slug) DO NOTHING
      RETURNING slug
    `,
    [slug, url],
  );

  return (result.rowCount ?? 0) > 0;
}

async function resolvePostgresRecord(
  store: PostgresStore,
  slug: string,
): Promise<ShortLinkRecord | null> {
  await store.schemaReady;
  const table = quoteTableName(store.tableName);

  const result = await store.pool.query<PostgresRow>(
    `
      WITH updated AS (
        UPDATE ${table}
        SET hits = hits + 1
        WHERE slug = $1
        RETURNING slug, url, created_at, hits
      )
      SELECT slug, url, created_at, hits
      FROM updated
    `,
    [slug],
  );

  const row = result.rows[0];
  if (!row) return null;

  return fromPostgresRow(row);
}

export async function createShortLink(input: ShortLinkCreateInput, baseUrl: string) {
  const requestedSlug = input.slug ? normalizeSlug(input.slug) : '';
  const postgresStore = await getPostgresStore();

  if (postgresStore) {
    if (requestedSlug) {
      const inserted = await insertPostgresRecord(postgresStore, requestedSlug, input.url);
      if (!inserted) {
        throw new Error('Slug já está em uso. Escolha outro.');
      }

      return {
        slug: requestedSlug,
        shortUrl: withBaseUrl(baseUrl, requestedSlug),
        expiresAt: null,
        provider: 'postgres' as const,
      };
    }

    for (let tries = 0; tries < 10; tries += 1) {
      const candidate = randomSlug(5);
      const inserted = await insertPostgresRecord(postgresStore, candidate, input.url);

      if (!inserted) continue;

      return {
        slug: candidate,
        shortUrl: withBaseUrl(baseUrl, candidate),
        expiresAt: null,
        provider: 'postgres' as const,
      };
    }

    throw new Error('Falha ao gerar slug único. Tente novamente.');
  }

  const store = loadJsonStore();
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
  persistJsonStore(store);

  return {
    slug,
    shortUrl: withBaseUrl(baseUrl, slug),
    expiresAt: null,
    provider: 'local' as const,
  };
}

export async function resolveShortLink(slug: string) {
  const normalizedSlug = normalizeSlug(slug);
  const postgresStore = await getPostgresStore();

  if (postgresStore) {
    return resolvePostgresRecord(postgresStore, normalizedSlug);
  }

  const store = loadJsonStore();
  const item = store.get(normalizedSlug);

  if (!item) return null;

  item.hits += 1;
  store.set(normalizedSlug, item);
  persistJsonStore(store);

  return item;
}
