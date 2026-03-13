import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { Pool, type PoolConfig } from 'pg';

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

interface SupabaseHttpStore {
    baseUrl: string;
    schema: string;
    serviceRoleKey: string;
    table: string;
}

interface SupabaseRow {
    created_at: string;
    hits: number | string;
    slug: string;
    url: string;
}

declare global {
    var __tools4devShortLinks: Map<string, ShortLinkRecord> | undefined;
    var __tools4devShortLinksPostgres: PostgresStore | undefined;
    var __tools4devShortLinksSupabaseHttp: SupabaseHttpStore | undefined;
}

const STORE_FILE_ENV = 'SHORTENER_STORAGE_FILE';
const STORE_FILE_DEFAULT = join(tmpdir(), 'tools4dev-shortlinks.json');
const SLUG_CHARSET = 'abcdefghijklmnopqrstuvwxyz0123456789';
const SLUG_LENGTH = 5;
const MAX_SLUG_GENERATION_TRIES = 10;
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
const DATABASE_SSL_NO_VERIFY_ENV = 'SHORTENER_DATABASE_SSL_NO_VERIFY';
const DATABASE_TABLE_ENV = 'SHORTENER_DATABASE_TABLE';
const DATABASE_TABLE_DEFAULT = 'short_links';
const SUPABASE_URL_ENV = 'SUPABASE_URL';
const SUPABASE_PUBLIC_URL_ENV = 'NEXT_PUBLIC_SUPABASE_URL';
const SUPABASE_SERVICE_ROLE_KEY_ENV = 'SUPABASE_SERVICE_ROLE_KEY';
const SUPABASE_HTTP_MODE_ENV = 'SHORTENER_USE_SUPABASE_HTTP';

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

    const vercelPostgresPrismaUrl =
        process.env[VERCEL_POSTGRES_PRISMA_URL_ENV]?.trim();
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

function parseBooleanEnv(name: string): boolean | null {
    const raw = process.env[name]?.trim().toLowerCase();
    if (!raw) return null;
    switch (raw) {
        case '1':
        case 'true':
        case 'yes':
        case 'on':
            return true;
        case '0':
        case 'false':
        case 'no':
        case 'off':
            return false;
        default:
            return null;
    }
}

function resolveSslConfig(
    connectionString: string,
): PoolConfig['ssl'] | undefined {
    const noVerify = parseBooleanEnv(DATABASE_SSL_NO_VERIFY_ENV);
    if (noVerify === true) {
        return { rejectUnauthorized: false };
    }

    if (noVerify === false) {
        return undefined;
    }

    try {
        const sslMode = new URL(connectionString).searchParams
            .get('sslmode')
            ?.toLowerCase();
        if (sslMode === 'no-verify') {
            return { rejectUnauthorized: false };
        }
    } catch {
        // No-op: invalid URL format should be handled by pg during connection.
    }

    return undefined;
}

function shouldUseSupabaseHttp() {
    return parseBooleanEnv(SUPABASE_HTTP_MODE_ENV) === true;
}

function getSupabaseUrl() {
    const serverUrl = process.env[SUPABASE_URL_ENV]?.trim();
    if (serverUrl) return serverUrl;

    const publicUrl = process.env[SUPABASE_PUBLIC_URL_ENV]?.trim();
    return publicUrl || '';
}

function getDatabaseTable() {
    const configured = process.env[DATABASE_TABLE_ENV]?.trim();
    return configured || DATABASE_TABLE_DEFAULT;
}

function isSafeIdentifier(value: string) {
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value);
}

function parseTableReference(value: string) {
    const parts = value
        .split('.')
        .map((part) => part.trim())
        .filter(Boolean);

    if (parts.length === 1) {
        const [table] = parts;
        if (!table || !isSafeIdentifier(table)) {
            throw new Error('SHORTENER_DATABASE_TABLE inválido.');
        }

        return {
            schema: null as string | null,
            table,
        };
    }

    if (parts.length === 2) {
        const [schema, table] = parts;
        if (
            !schema ||
            !table ||
            !isSafeIdentifier(schema) ||
            !isSafeIdentifier(table)
        ) {
            throw new Error('SHORTENER_DATABASE_TABLE inválido.');
        }

        return {
            schema,
            table,
        };
    }

    throw new Error('SHORTENER_DATABASE_TABLE inválido.');
}

function quoteIdentifier(value: string) {
    if (!isSafeIdentifier(value)) {
        throw new Error('SHORTENER_DATABASE_TABLE inválido.');
    }

    return `"${value}"`;
}

function quoteTableName(value: string) {
    const reference = parseTableReference(value);
    if (!reference.schema) return quoteIdentifier(reference.table);
    return `${quoteIdentifier(reference.schema)}.${quoteIdentifier(reference.table)}`;
}

function isSupabaseRow(value: unknown): value is SupabaseRow {
    if (!value || typeof value !== 'object') return false;

    const maybe = value as Record<string, unknown>;
    return (
        typeof maybe.slug === 'string' &&
        typeof maybe.url === 'string' &&
        typeof maybe.created_at === 'string' &&
        (typeof maybe.hits === 'number' || typeof maybe.hits === 'string')
    );
}

function createSupabaseHeaders(
    store: SupabaseHttpStore,
    options?: { includeContentType?: boolean },
) {
    const headers: Record<string, string> = {
        Accept: 'application/json',
        apikey: store.serviceRoleKey,
        Authorization: `Bearer ${store.serviceRoleKey}`,
        'Accept-Profile': store.schema,
    };

    if (options?.includeContentType) {
        headers['Content-Type'] = 'application/json';
        headers['Content-Profile'] = store.schema;
    }

    return headers;
}

async function readSupabaseError(response: Response) {
    const raw = await response.text().catch(() => '');

    if (raw) {
        try {
            const parsed = JSON.parse(raw) as {
                error?: string;
                message?: string;
            };
            const message = parsed.message || parsed.error;
            if (message) return `Supabase HTTP ${response.status}: ${message}`;
        } catch {
            return `Supabase HTTP ${response.status}: ${raw}`;
        }
    }

    return `Supabase HTTP ${response.status}: erro ao acessar API`;
}

function toShortLinkRecord(
    row: SupabaseRow,
    hitsOverride?: number,
): ShortLinkRecord {
    const hits = Number.isFinite(Number(row.hits))
        ? Math.max(0, Math.trunc(Number(row.hits)))
        : 0;

    return {
        slug: normalizeSlug(row.slug),
        url: row.url,
        createdAt: row.created_at,
        hits: hitsOverride ?? hits,
    };
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

    const ssl = resolveSslConfig(connectionString);
    const pool = ssl
        ? new Pool({ connectionString, ssl })
        : new Pool({ connectionString });
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

function getSupabaseHttpStore(): SupabaseHttpStore | null {
    if (!shouldUseSupabaseHttp()) return null;

    const baseUrl = getSupabaseUrl();
    const serviceRoleKey =
        process.env[SUPABASE_SERVICE_ROLE_KEY_ENV]?.trim() || '';
    if (!baseUrl || !serviceRoleKey) {
        throw new Error(
            'Modo Supabase HTTP requer SUPABASE_URL (ou NEXT_PUBLIC_SUPABASE_URL) e SUPABASE_SERVICE_ROLE_KEY.',
        );
    }

    const normalizedBaseUrl = baseUrl.replace(/\/$/, '');
    const reference = parseTableReference(getDatabaseTable());
    const schema = reference.schema ?? 'public';
    const table = reference.table;
    const existing = globalThis.__tools4devShortLinksSupabaseHttp;

    if (
        existing &&
        existing.baseUrl === normalizedBaseUrl &&
        existing.serviceRoleKey === serviceRoleKey &&
        existing.schema === schema &&
        existing.table === table
    ) {
        return existing;
    }

    const store: SupabaseHttpStore = {
        baseUrl: normalizedBaseUrl,
        schema,
        serviceRoleKey,
        table,
    };
    globalThis.__tools4devShortLinksSupabaseHttp = store;
    return store;
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
            hits: Number.isFinite(item.hits)
                ? Math.max(0, Math.trunc(item.hits))
                : 0,
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

function getJsonStore() {
    if (globalThis.__tools4devShortLinks) {
        return globalThis.__tools4devShortLinks;
    }

    try {
        globalThis.__tools4devShortLinks = loadStoreFromDisk();
    } catch {
        globalThis.__tools4devShortLinks = new Map<string, ShortLinkRecord>();
    }

    return globalThis.__tools4devShortLinks;
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
    let output = '';

    for (let i = 0; i < length; i += 1) {
        output +=
            SLUG_CHARSET[Math.floor(Math.random() * SLUG_CHARSET.length)] ??
            'x';
    }

    return output;
}

function createAutoSlug(store: Map<string, ShortLinkRecord>) {
    for (let tries = 0; tries < MAX_SLUG_GENERATION_TRIES; tries += 1) {
        const candidate = randomSlug(SLUG_LENGTH);
        if (!store.has(candidate)) return candidate;
    }

    throw new Error('Falha ao gerar slug único. Tente novamente.');
}

function withBaseUrl(baseUrl: string, slug: string) {
    const normalizedBase = baseUrl.replace(/\/$/, '');
    return `${normalizedBase}/s/${slug}`;
}

function createShortLinkResponse(
    provider: 'supabase-http' | 'postgres' | 'local',
    slug: string,
    baseUrl: string,
) {
    return {
        slug,
        shortUrl: withBaseUrl(baseUrl, slug),
        expiresAt: null,
        provider,
    };
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

async function insertSupabaseRecord(
    store: SupabaseHttpStore,
    slug: string,
    url: string,
): Promise<boolean> {
    const endpoint = new URL(`${store.baseUrl}/rest/v1/${store.table}`);
    endpoint.searchParams.set('on_conflict', 'slug');

    const response = await fetch(endpoint.toString(), {
        method: 'POST',
        headers: {
            ...createSupabaseHeaders(store, { includeContentType: true }),
            Prefer: 'resolution=ignore-duplicates,return=representation',
        },
        body: JSON.stringify([{ slug, url }]),
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error(await readSupabaseError(response));
    }

    const rows = (await response.json()) as unknown;
    return Array.isArray(rows) && rows.length > 0;
}

async function resolveSupabaseRecord(
    store: SupabaseHttpStore,
    slug: string,
): Promise<ShortLinkRecord | null> {
    const selectUrl = new URL(`${store.baseUrl}/rest/v1/${store.table}`);
    selectUrl.searchParams.set('select', 'slug,url,created_at,hits');
    selectUrl.searchParams.set('slug', `eq.${slug}`);
    selectUrl.searchParams.set('limit', '1');

    const selectResponse = await fetch(selectUrl.toString(), {
        method: 'GET',
        headers: createSupabaseHeaders(store),
        cache: 'no-store',
    });

    if (!selectResponse.ok) {
        throw new Error(await readSupabaseError(selectResponse));
    }

    const rows = (await selectResponse.json()) as unknown;
    if (!Array.isArray(rows) || rows.length === 0 || !isSupabaseRow(rows[0])) {
        return null;
    }

    const current = toShortLinkRecord(rows[0]);
    const nextHits = current.hits + 1;

    const updateUrl = new URL(`${store.baseUrl}/rest/v1/${store.table}`);
    updateUrl.searchParams.set('slug', `eq.${slug}`);

    const updateResponse = await fetch(updateUrl.toString(), {
        method: 'PATCH',
        headers: {
            ...createSupabaseHeaders(store, { includeContentType: true }),
            Prefer: 'return=minimal',
        },
        body: JSON.stringify({ hits: nextHits }),
        cache: 'no-store',
    });

    if (!updateResponse.ok) {
        throw new Error(await readSupabaseError(updateResponse));
    }

    return {
        ...current,
        hits: nextHits,
    };
}

async function createWithExternalStore(options: {
    requestedSlug: string;
    inputUrl: string;
    baseUrl: string;
    provider: 'supabase-http' | 'postgres';
    insert: (slug: string, url: string) => Promise<boolean>;
}) {
    const { requestedSlug, inputUrl, baseUrl, provider, insert } = options;

    if (requestedSlug) {
        const inserted = await insert(requestedSlug, inputUrl);
        if (!inserted) {
            throw new Error('Slug já está em uso. Escolha outro.');
        }

        return createShortLinkResponse(provider, requestedSlug, baseUrl);
    }

    for (let tries = 0; tries < MAX_SLUG_GENERATION_TRIES; tries += 1) {
        const candidate = randomSlug(SLUG_LENGTH);
        const inserted = await insert(candidate, inputUrl);

        if (!inserted) continue;

        return createShortLinkResponse(provider, candidate, baseUrl);
    }

    throw new Error('Falha ao gerar slug único. Tente novamente.');
}

export async function createShortLink(
    input: ShortLinkCreateInput,
    baseUrl: string,
) {
    const requestedSlug = input.slug ? normalizeSlug(input.slug) : '';
    const supabaseStore = getSupabaseHttpStore();

    if (supabaseStore) {
        return createWithExternalStore({
            requestedSlug,
            inputUrl: input.url,
            baseUrl,
            provider: 'supabase-http',
            insert: (slug, url) =>
                insertSupabaseRecord(supabaseStore, slug, url),
        });
    }

    const postgresStore = await getPostgresStore();

    if (postgresStore) {
        return createWithExternalStore({
            requestedSlug,
            inputUrl: input.url,
            baseUrl,
            provider: 'postgres',
            insert: (slug, url) =>
                insertPostgresRecord(postgresStore, slug, url),
        });
    }

    const store = getJsonStore();
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

    return createShortLinkResponse('local', slug, baseUrl);
}

export async function resolveShortLink(slug: string) {
    const normalizedSlug = normalizeSlug(slug);
    const supabaseStore = getSupabaseHttpStore();

    if (supabaseStore) {
        return resolveSupabaseRecord(supabaseStore, normalizedSlug);
    }

    const postgresStore = await getPostgresStore();

    if (postgresStore) {
        return resolvePostgresRecord(postgresStore, normalizedSlug);
    }

    const store = getJsonStore();
    const item = store.get(normalizedSlug);

    if (!item) return null;

    item.hits += 1;
    store.set(normalizedSlug, item);
    persistJsonStore(store);

    return item;
}
