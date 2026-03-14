import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/server/rate-limit';
import { getClientIp, tooManyRequests } from '@/server/http';
import { compressPDF } from '@/server/services/pdf';
import { pdfCompressSchema } from '@/server/validators/api';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`pdf:${ip}`, { max: 8, windowMs: 60_000 });
    if (!rate.allowed)
        return tooManyRequests(
            'Muitas requisicoes de PDF. Tente novamente em instantes.',
        );

    const formData = await request.formData();
    const file = formData.get('file');
    const quality = Number(formData.get('quality') ?? 80);

    if (!(file instanceof File)) {
        return NextResponse.json(
            { ok: false, message: 'Arquivo PDF não enviado.' },
            { status: 400 },
        );
    }

    const metadata = pdfCompressSchema.safeParse({
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
        quality,
    });

    if (!metadata.success) {
        return NextResponse.json(
            { ok: false, message: 'Arquivo inválido. Envie PDF de até 20MB.' },
            { status: 400 },
        );
    }

    const input = Buffer.from(await file.arrayBuffer());
    const compressed = await compressPDF(input, { quality: metadata.data.quality });

    if (!compressed.success) {
        return NextResponse.json(
            { ok: false, message: compressed.message ?? 'Falha ao comprimir PDF.' },
            { status: 400 },
        );
    }

    return new NextResponse(new Uint8Array(compressed.file), {
        status: 200,
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="compressed.pdf"',
            'X-Compression-Method': compressed.method,
            'X-Original-Size': String(compressed.originalSize),
            'X-Compressed-Size': String(compressed.compressedSize),
            'Cache-Control': 'no-store',
        },
    });
}
