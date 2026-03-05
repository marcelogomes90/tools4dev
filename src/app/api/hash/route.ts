import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/server/rate-limit';
import { getClientIp, tooManyRequests } from '@/server/http';
import { hashSchema } from '@/server/validators/api';

export const runtime = 'nodejs';

const algorithms = ['md5', 'sha1', 'sha256', 'sha512'] as const;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`hash:${ip}`);
  if (!rate.allowed) return tooManyRequests();

  const body = await request.json().catch(() => null);
  const parsed = hashSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Payload inválido.',
        errors: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const { text, encoding } = parsed.data;

  const result = algorithms.reduce<Record<string, string>>((acc, algorithm) => {
    acc[algorithm] = createHash(algorithm)
      .update(text, 'utf8')
      .digest(encoding);
    return acc;
  }, {});

  return NextResponse.json({ ok: true, result });
}
