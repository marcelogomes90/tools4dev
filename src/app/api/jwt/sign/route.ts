import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { checkRateLimit } from '@/server/rate-limit';
import { getClientIp, tooManyRequests } from '@/server/http';
import { jwtSignSchema } from '@/server/validators/api';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`jwt-sign:${ip}`, { max: 60, windowMs: 60_000 });
  if (!rate.allowed) return tooManyRequests();

  const body = await request.json().catch(() => null);
  const parsed = jwtSignSchema.safeParse(body);

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

  try {
    const { payload, secret, algorithm, header, expiresIn } = parsed.data;
    const jwtHeader: jwt.JwtHeader = {
      alg: algorithm,
      ...(header as Partial<jwt.JwtHeader>),
    };

    const signOptions: jwt.SignOptions = {
      algorithm,
      header: jwtHeader,
    };

    if (expiresIn) {
      signOptions.expiresIn = expiresIn as jwt.SignOptions['expiresIn'];
    }

    const token = jwt.sign(payload, secret, signOptions);

    return NextResponse.json({ ok: true, token });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message:
          'Não foi possível assinar o token. Verifique payload/header e configurações.',
      },
      { status: 400 },
    );
  }
}
