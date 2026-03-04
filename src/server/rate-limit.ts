interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();

function cleanup(now: number) {
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
) {
  const now = Date.now();
  cleanup(now);

  const max = options?.max ?? Number(process.env.RATE_LIMIT_MAX ?? 120);
  const windowMs = options?.windowMs ?? Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return {
      allowed: true,
      remaining: max - 1,
      resetAt: now + windowMs,
    };
  }

  if (current.count >= max) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: current.resetAt,
    };
  }

  current.count += 1;

  return {
    allowed: true,
    remaining: Math.max(0, max - current.count),
    resetAt: current.resetAt,
  };
}
