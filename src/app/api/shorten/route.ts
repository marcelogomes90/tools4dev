import { NextRequest, NextResponse } from 'next/server';
import { createShortLink } from '@/server/services/shortener';
import { checkRateLimit } from '@/server/rate-limit';
import { getClientIp, tooManyRequests } from '@/server/http';
import { shortenSchema } from '@/server/validators/api';

export const runtime = 'nodejs';

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
        message: 'Payload invalido.',
        errors: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const result = await createShortLink(parsed.data);
    return NextResponse.json({ ok: true, ...result }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Falha ao gerar link curto com Bitly.';
    const status = message.includes('BITLY_TOKEN nao configurado') ? 503 : 400;

    return NextResponse.json(
      {
        ok: false,
        message,
      },
      { status },
    );
  }
}
