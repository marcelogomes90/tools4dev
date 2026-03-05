import { NextRequest, NextResponse } from 'next/server';
import { createShortLink } from '@/server/services/shortener';
import { checkRateLimit } from '@/server/rate-limit';
import { getClientIp, tooManyRequests } from '@/server/http';
import { shortenSchema } from '@/server/validators/api';

export const runtime = 'nodejs';

function resolveBaseUrl(request: NextRequest) {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (envUrl) return envUrl;

  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') ?? 'http';

  if (host) return `${proto}://${host}`;
  return request.nextUrl.origin;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`shorten:${ip}`, { max: 40, windowMs: 60_000 });
  if (!rate.allowed) return tooManyRequests();

  const body = await request.json().catch(() => null);
  const parsed = shortenSchema.safeParse(body);

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
    const result = createShortLink(parsed.data, resolveBaseUrl(request));
    return NextResponse.json({ ok: true, ...result }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha ao gerar link curto.';
    const status = message.includes('Slug já está em uso') ? 409 : 400;

    return NextResponse.json(
      {
        ok: false,
        message,
      },
      { status },
    );
  }
}
