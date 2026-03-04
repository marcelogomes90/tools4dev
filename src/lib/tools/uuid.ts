import { ulid } from 'ulid';

export function generateIds(type: 'v4' | 'ulid', amount: number) {
  const total = Math.min(1000, Math.max(1, amount));

  if (type === 'ulid') {
    return Array.from({ length: total }, () => ulid());
  }

  return Array.from({ length: total }, () => crypto.randomUUID());
}
