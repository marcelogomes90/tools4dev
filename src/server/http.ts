import { NextRequest, NextResponse } from 'next/server';

export function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded
      .split(',')
      .map((part) => part.trim())
      .find(Boolean);
    if (first) return first;
  }

  return request.headers.get('x-real-ip') ?? '0.0.0.0';
}

export function badRequest(message: string, details?: unknown) {
  return NextResponse.json({ ok: false, message, details }, { status: 400 });
}

export function tooManyRequests(
  message = 'Rate limit excedido. Tente novamente em instantes.',
) {
  return NextResponse.json({ ok: false, message }, { status: 429 });
}

export function internalError(
  message = 'Erro interno ao processar requisição.',
) {
  return NextResponse.json({ ok: false, message }, { status: 500 });
}
