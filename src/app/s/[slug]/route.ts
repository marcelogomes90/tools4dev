import { NextRequest, NextResponse } from 'next/server';
import { resolveShortLink } from '@/server/services/shortener';

export const runtime = 'nodejs';

interface ShortRedirectParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: NextRequest, { params }: ShortRedirectParams) {
  const { slug } = await params;
  const found = resolveShortLink(slug);

  if (!found) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Slug não encontrado.',
      },
      { status: 404 },
    );
  }

  return NextResponse.redirect(found.url, { status: 307 });
}
