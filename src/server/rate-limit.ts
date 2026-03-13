interface Entry {
    count: number;
    resetAt: number;
}

interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: number;
    max: number;
}

const store = new Map<string, Entry>();
let requestsSinceCleanup = 0;
const CLEANUP_INTERVAL = 100;

function parsePositiveInt(value: string | undefined, fallback: number) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.max(1, Math.trunc(parsed));
}

function maybeCleanup(now: number) {
    requestsSinceCleanup += 1;
    if (requestsSinceCleanup < CLEANUP_INTERVAL) return;
    requestsSinceCleanup = 0;
    for (const [key, value] of store) {
        if (value.resetAt <= now) store.delete(key);
    }
}

export function checkRateLimit(
    key: string,
    options?: {
        max?: number;
        windowMs?: number;
    },
): RateLimitResult {
    const now = Date.now();
    maybeCleanup(now);

    const max =
        options?.max ?? parsePositiveInt(process.env.RATE_LIMIT_MAX, 120);
    const windowMs =
        options?.windowMs ??
        parsePositiveInt(process.env.RATE_LIMIT_WINDOW_MS, 60_000);
    const current = store.get(key);

    if (!current || current.resetAt <= now) {
        store.set(key, { count: 1, resetAt: now + windowMs });
        return {
            allowed: true,
            remaining: max - 1,
            resetAt: now + windowMs,
            max,
        };
    }

    if (current.count >= max) {
        return {
            allowed: false,
            remaining: 0,
            resetAt: current.resetAt,
            max,
        };
    }

    current.count += 1;

    return {
        allowed: true,
        remaining: Math.max(0, max - current.count),
        resetAt: current.resetAt,
        max,
    };
}

export function rateLimitHeaders(
    result: RateLimitResult,
): Record<string, string> {
    return {
        'X-RateLimit-Limit': String(result.max),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
    };
}
