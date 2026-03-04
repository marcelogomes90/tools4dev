import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { checkRateLimit } from '@/server/rate-limit';
import { getClientIp, tooManyRequests } from '@/server/http';
import { jwtVerifySchema } from '@/server/validators/api';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`jwt-verify:${ip}`, { max: 60, windowMs: 60_000 });
  if (!rate.allowed) return tooManyRequests();

  const body = await request.json().catch(() => null);
  const parsed = jwtVerifySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: 'Payload invalido.', errors: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const { token, key, algorithms } = parsed.data;
    const decoded = jwt.verify(
      token,
      key,
      algorithms?.length ? { algorithms: algorithms as jwt.Algorithm[] } : undefined,
    );
    return NextResponse.json({ ok: true, decoded });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Token invalido ou assinatura nao confere.',
      },
      { status: 400 },
    );
  }
}
