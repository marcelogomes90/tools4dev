import { NextRequest, NextResponse } from 'next/server';
import { resolveShortLink } from '@/server/services/shortener';

export const runtime = 'nodejs';

interface ShortRedirectParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: NextRequest, { params }: ShortRedirectParams) {
  try {
    const { slug } = await params;
    const found = await resolveShortLink(slug);

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
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Falha ao resolver link curto.';

    return NextResponse.json(
      {
        ok: false,
        message,
      },
      { status: 500 },
    );
  }
}
