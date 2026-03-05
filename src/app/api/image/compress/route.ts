import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { checkRateLimit } from '@/server/rate-limit';
import { getClientIp, tooManyRequests } from '@/server/http';
import { imageCompressSchema } from '@/server/validators/api';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const allowedTypes = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
]);

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`img:${ip}`, { max: 15, windowMs: 60_000 });
  if (!rate.allowed) return tooManyRequests();

  const formData = await request.formData();
  const file = formData.get('file');
  const options = imageCompressSchema.safeParse({
    format: String(formData.get('format') ?? 'webp'),
    quality: Number(formData.get('quality') ?? 80),
  });

  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, message: 'Arquivo não enviado.' },
      { status: 400 },
    );
  }

  if (!options.success) {
    return NextResponse.json(
      { ok: false, message: 'Opções inválidas para compressão de imagem.' },
      { status: 400 },
    );
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json(
      { ok: false, message: 'Tipo não suportado. Use png/jpeg/webp/gif.' },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { ok: false, message: 'Arquivo excede 10MB.' },
      { status: 400 },
    );
  }

  try {
    const inputBuffer = Buffer.from(await file.arrayBuffer());
    const transformer = sharp(inputBuffer, { animated: true });
    const { format, quality } = options.data;
    const safeQuality = Math.min(95, Math.max(30, quality));

    const outputBuffer =
      format === 'webp'
        ? await transformer.clone().webp({ quality: safeQuality }).toBuffer()
        : format === 'jpeg'
          ? await transformer
              .clone()
              .jpeg({ quality: safeQuality, mozjpeg: true })
              .toBuffer()
          : format === 'png'
            ? await transformer
                .clone()
                .png({
                  compressionLevel: 9,
                  quality: safeQuality,
                  palette: true,
                })
                .toBuffer()
            : await transformer
                .clone()
                .gif({ effort: 7, colours: 256 })
                .toBuffer();

    const contentTypeMap: Record<string, string> = {
      png: 'image/png',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
      gif: 'image/gif',
    };
    const extension = format;

    return new NextResponse(new Uint8Array(outputBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentTypeMap[format],
        'Content-Disposition': `attachment; filename="compressed.${extension}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message:
          'Falha ao processar imagem. Verifique arquivo e formato selecionado.',
      },
      { status: 400 },
    );
  }
}
