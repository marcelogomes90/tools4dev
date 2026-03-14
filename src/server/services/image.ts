import sharp from 'sharp';
import { ImageCompressionResult, ImageFormat } from '@/types/compression';

const MIME_BY_FORMAT: Record<ImageFormat, string> = {
    png: 'image/png',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    gif: 'image/gif',
};

const FORMAT_BY_MIME: Record<string, ImageFormat> = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/webp': 'webp',
    'image/gif': 'gif',
};

const FORMAT_BY_EXTENSION: Record<string, ImageFormat> = {
    png: 'png',
    jpg: 'jpeg',
    jpeg: 'jpeg',
    webp: 'webp',
    gif: 'gif',
};

function clampQuality(quality = 80) {
    return Math.min(100, Math.max(1, Math.trunc(quality)));
}

function baseTransformer(input: Buffer) {
    return sharp(input, { animated: true, failOn: 'none' }).rotate();
}

function resultWithError(
    input: Buffer,
    originalSize: number,
    format: ImageFormat,
    operation: ImageCompressionResult['operation'],
    message: string,
): ImageCompressionResult {
    return {
        success: false,
        originalSize,
        compressedSize: originalSize,
        format,
        file: input,
        operation,
        message,
    };
}

async function getImageMetadata(input: Buffer) {
    const metadata = await sharp(input, { animated: true, failOn: 'none' })
        .rotate()
        .metadata();
    if (!metadata.width || !metadata.height) {
        return null;
    }

    return {
        width: metadata.width,
        height: metadata.height,
    };
}

async function encodeToFormat(
    input: Buffer,
    format: ImageFormat,
    options?: {
        quality?: number;
        preserveQuality?: boolean;
        width?: number;
        height?: number;
        keepAspectRatio?: boolean;
    },
) {
    let pipeline = baseTransformer(input);

    if (options?.width || options?.height) {
        pipeline = pipeline.resize({
            width: options.width,
            height: options.height,
            fit: options.keepAspectRatio === false ? 'fill' : 'inside',
        });
    }

    if (format === 'jpeg') {
        pipeline = pipeline.jpeg({
            quality: options?.preserveQuality
                ? 92
                : clampQuality(options?.quality ?? 80),
            mozjpeg: true,
        });
    } else if (format === 'webp') {
        pipeline = pipeline.webp({
            quality: options?.preserveQuality
                ? 92
                : clampQuality(options?.quality ?? 80),
            effort: 4,
        });
    } else if (format === 'png') {
        pipeline = pipeline.png({
            compressionLevel: 9,
            palette: options?.preserveQuality ? false : true,
            quality: options?.preserveQuality
                ? undefined
                : clampQuality(options?.quality ?? 80),
        });
    } else {
        pipeline = pipeline.gif({
            effort: 7,
            colours: 256,
        });
    }

    return pipeline.toBuffer();
}

export function getMimeTypeForImageFormat(format: ImageFormat) {
    return MIME_BY_FORMAT[format];
}

export function detectImageFormat(
    fileName: string,
    mimeType?: string,
): ImageFormat | null {
    if (mimeType && FORMAT_BY_MIME[mimeType]) {
        return FORMAT_BY_MIME[mimeType];
    }

    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension) return null;
    return FORMAT_BY_EXTENSION[extension] ?? null;
}

interface BaseImageOptions {
    fileName: string;
    mimeType?: string;
    quality?: number;
}

interface ConvertImageOptions extends BaseImageOptions {
    targetFormat: ImageFormat;
}

interface ResizeImageOptions extends BaseImageOptions {
    width?: number;
    height?: number;
    keepAspectRatio?: boolean;
}

function calculateResizeDimensions(
    sourceWidth: number,
    sourceHeight: number,
    width?: number,
    height?: number,
    keepAspectRatio = true,
) {
    if (!width && !height) return null;

    let outputWidth = width ?? sourceWidth;
    let outputHeight = height ?? sourceHeight;

    if (keepAspectRatio) {
        if (width && height) {
            const scale = Math.min(width / sourceWidth, height / sourceHeight);
            outputWidth = Math.max(1, Math.round(sourceWidth * scale));
            outputHeight = Math.max(1, Math.round(sourceHeight * scale));
        } else if (width) {
            outputWidth = width;
            outputHeight = Math.max(
                1,
                Math.round(sourceHeight * (width / sourceWidth)),
            );
        } else if (height) {
            outputHeight = height;
            outputWidth = Math.max(
                1,
                Math.round(sourceWidth * (height / sourceHeight)),
            );
        }
    }

    return {
        width: Math.max(1, Math.round(outputWidth)),
        height: Math.max(1, Math.round(outputHeight)),
    };
}

export async function compressImage(
    input: Buffer,
    options: BaseImageOptions,
): Promise<ImageCompressionResult> {
    const originalSize = input.length;
    const sourceFormat = detectImageFormat(options.fileName, options.mimeType);

    if (!sourceFormat) {
        return resultWithError(
            input,
            originalSize,
            'jpeg',
            'compress',
            'Formato não suportado. Use arquivos PNG, JPEG, WEBP ou GIF.',
        );
    }

    try {
        const metadata = await getImageMetadata(input);
        if (!metadata) {
            return resultWithError(
                input,
                originalSize,
                sourceFormat,
                'compress',
                'Não foi possível ler os metadados da imagem.',
            );
        }

        const output = await encodeToFormat(input, sourceFormat, {
            quality: options.quality,
            preserveQuality: false,
        });

        if (output.length >= originalSize) {
            if (sourceFormat === 'png') {
                return {
                    success: true,
                    originalSize,
                    compressedSize: originalSize,
                    format: sourceFormat,
                    file: input,
                    operation: 'compress',
                    width: metadata.width,
                    height: metadata.height,
                    message:
                        'PNG já está otimizado. O arquivo original foi retornado no mesmo formato.',
                };
            }

            return resultWithError(
                input,
                originalSize,
                sourceFormat,
                'compress',
                'A compressão não reduziu o tamanho da imagem. O arquivo original foi preservado.',
            );
        }

        return {
            success: true,
            originalSize,
            compressedSize: output.length,
            format: sourceFormat,
            file: output,
            operation: 'compress',
            width: metadata.width,
            height: metadata.height,
        };
    } catch {
        return resultWithError(
            input,
            originalSize,
            sourceFormat,
            'compress',
            'Falha ao processar imagem. Verifique arquivo e formato selecionado.',
        );
    }
}

export async function convertImageFormat(
    input: Buffer,
    options: ConvertImageOptions,
): Promise<ImageCompressionResult> {
    const originalSize = input.length;
    const sourceFormat = detectImageFormat(options.fileName, options.mimeType);

    if (!sourceFormat) {
        return resultWithError(
            input,
            originalSize,
            options.targetFormat,
            'convert',
            'Formato de entrada não suportado. Use PNG, JPEG, WEBP ou GIF.',
        );
    }

    try {
        const metadata = await getImageMetadata(input);
        if (!metadata) {
            return resultWithError(
                input,
                originalSize,
                options.targetFormat,
                'convert',
                'Não foi possível ler os metadados da imagem.',
            );
        }

        const output = await encodeToFormat(input, options.targetFormat, {
            preserveQuality: true,
        });

        const note =
            output.length >= originalSize
                ? 'Conversão concluída, mas o arquivo final ficou maior que o original.'
                : undefined;

        return {
            success: true,
            originalSize,
            compressedSize: output.length,
            format: options.targetFormat,
            file: output,
            operation: 'convert',
            width: metadata.width,
            height: metadata.height,
            message: note,
        };
    } catch {
        return resultWithError(
            input,
            originalSize,
            options.targetFormat,
            'convert',
            'Falha ao processar imagem. Verifique arquivo e formato selecionado.',
        );
    }
}

export async function resizeImage(
    input: Buffer,
    options: ResizeImageOptions,
): Promise<ImageCompressionResult> {
    const originalSize = input.length;
    const sourceFormat = detectImageFormat(options.fileName, options.mimeType);

    if (!sourceFormat) {
        return resultWithError(
            input,
            originalSize,
            'jpeg',
            'resize',
            'Formato não suportado. Use arquivos PNG, JPEG, WEBP ou GIF.',
        );
    }

    try {
        const metadata = await getImageMetadata(input);
        if (!metadata) {
            return resultWithError(
                input,
                originalSize,
                sourceFormat,
                'resize',
                'Não foi possível ler os metadados da imagem.',
            );
        }

        const targetSize = calculateResizeDimensions(
            metadata.width,
            metadata.height,
            options.width,
            options.height,
            options.keepAspectRatio ?? true,
        );

        if (!targetSize) {
            return resultWithError(
                input,
                originalSize,
                sourceFormat,
                'resize',
                'Informe largura ou altura para redimensionar.',
            );
        }

        const output = await encodeToFormat(input, sourceFormat, {
            width: targetSize.width,
            height: targetSize.height,
            keepAspectRatio: options.keepAspectRatio ?? true,
            preserveQuality: true,
        });

        return {
            success: true,
            originalSize,
            compressedSize: output.length,
            format: sourceFormat,
            file: output,
            operation: 'resize',
            width: targetSize.width,
            height: targetSize.height,
            message: `Imagem redimensionada para ${targetSize.width}x${targetSize.height} no formato original (${sourceFormat.toUpperCase()}).`,
        };
    } catch {
        return resultWithError(
            input,
            originalSize,
            sourceFormat,
            'resize',
            'Falha ao redimensionar imagem. Verifique arquivo e parâmetros informados.',
        );
    }
}
