import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      message: 'Redirecionamento local desabilitado. Use o link curto retornado pelo Bitly.',
    },
    { status: 410 },
  );
}
