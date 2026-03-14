import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/server/rate-limit';
import {
    compressImage,
    convertImageFormat,
    detectImageFormat,
    getMimeTypeForImageFormat,
    resizeImage,
} from '@/server/services/image';
import { getClientIp, tooManyRequests } from '@/server/http';
import { imageProcessSchema } from '@/server/validators/api';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const IMAGE_PROCESS_TIMEOUT_MS = 30_000;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
    return new Promise<T>((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('IMAGE_PROCESS_TIMEOUT'));
        }, timeoutMs);

        promise
            .then((value) => {
                clearTimeout(timeout);
                resolve(value);
            })
            .catch((error) => {
                clearTimeout(timeout);
                reject(error);
            });
    });
}

export async function POST(request: NextRequest) {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`img:${ip}`, { max: 15, windowMs: 60_000 });
    if (!rate.allowed) return tooManyRequests();

    const formData = await request.formData();
    const file = formData.get('file');
    const options = imageProcessSchema.safeParse({
        operation: String(formData.get('operation') ?? 'compress'),
        format: formData.get('format')
            ? String(formData.get('format'))
            : undefined,
        quality: formData.get('quality')
            ? Number(formData.get('quality'))
            : undefined,
        width: formData.get('width')
            ? Number(formData.get('width'))
            : undefined,
        height: formData.get('height')
            ? Number(formData.get('height'))
            : undefined,
        keepAspectRatio:
            String(formData.get('keepAspectRatio') ?? 'true') === 'true',
    });

    if (!(file instanceof File)) {
        return NextResponse.json(
            { ok: false, message: 'Arquivo não enviado.' },
            { status: 400 },
        );
    }

    if (!options.success) {
        return NextResponse.json(
            {
                ok: false,
                message: 'Opções inválidas para compressão de imagem.',
            },
            { status: 400 },
        );
    }

    if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
            { ok: false, message: 'Arquivo excede o limite de 5MB.' },
            { status: 413 },
        );
    }

    const sourceFormat = detectImageFormat(file.name, file.type);
    if (!sourceFormat) {
        return NextResponse.json(
            {
                ok: false,
                message: 'Tipo não suportado. Use png/jpeg/webp/gif.',
            },
            { status: 400 },
        );
    }

    try {
        const inputBuffer = Buffer.from(await file.arrayBuffer());
        const { operation, quality, format, width, height, keepAspectRatio } =
            options.data;
        const result = await withTimeout(
            operation === 'resize'
                ? resizeImage(inputBuffer, {
                      fileName: file.name,
                      mimeType: file.type,
                      width,
                      height,
                      keepAspectRatio,
                  })
                : operation === 'convert'
                  ? convertImageFormat(inputBuffer, {
                        fileName: file.name,
                        mimeType: file.type,
                        targetFormat: format ?? sourceFormat,
                    })
                  : compressImage(inputBuffer, {
                        fileName: file.name,
                        mimeType: file.type,
                        quality: quality ?? 80,
                    }),
            IMAGE_PROCESS_TIMEOUT_MS,
        );

        if (!result.success) {
            return NextResponse.json(
                {
                    ok: false,
                    message: result.message ?? 'Falha ao processar imagem.',
                },
                { status: 400 },
            );
        }

        return new NextResponse(new Uint8Array(result.file), {
            status: 200,
            headers: {
                'Content-Type': getMimeTypeForImageFormat(result.format),
                'Content-Disposition': `attachment; filename="compressed.${result.format}"`,
                'X-Original-Size': String(result.originalSize),
                'X-Compressed-Size': String(result.compressedSize),
                'X-Image-Operation': result.operation,
                'X-Image-Format': result.format,
                'X-Image-Note': result.message ?? '',
                'X-Image-Width': String(result.width ?? ''),
                'X-Image-Height': String(result.height ?? ''),
                'Cache-Control': 'no-store',
            },
        });
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === 'IMAGE_PROCESS_TIMEOUT'
        ) {
            return NextResponse.json(
                {
                    ok: false,
                    message:
                        'Processamento excedeu 30 segundos. Tente reduzir a resolução, usar qualidade menor ou converter para WEBP/JPEG.',
                },
                { status: 408 },
            );
        }

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
