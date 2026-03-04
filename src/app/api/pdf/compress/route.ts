import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/server/rate-limit';
import { getClientIp, tooManyRequests } from '@/server/http';
import { compressPdf } from '@/server/services/pdf';
import { pdfCompressSchema } from '@/server/validators/api';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`pdf:${ip}`, { max: 8, windowMs: 60_000 });
  if (!rate.allowed) return tooManyRequests('Muitas requisicoes de PDF. Tente novamente em instantes.');

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, message: 'Arquivo PDF nao enviado.' }, { status: 400 });
  }

  const metadata = pdfCompressSchema.safeParse({
    fileName: file.name,
    mimeType: file.type,
    size: file.size,
  });

  if (!metadata.success) {
    return NextResponse.json({ ok: false, message: 'Arquivo invalido. Envie PDF de ate 20MB.' }, { status: 400 });
  }

  const input = Buffer.from(await file.arrayBuffer());
  const compressed = await compressPdf(input);

  if (!compressed.ok) {
    return NextResponse.json({ ok: false, message: compressed.message }, { status: 400 });
  }

  return new NextResponse(compressed.buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="compressed.pdf"',
      'X-Compression-Method': compressed.method,
      'Cache-Control': 'no-store',
    },
  });
}
