import { describe, expect, it } from 'vitest';
import sharp from 'sharp';
import {
    compressImage,
    convertImageFormat,
    detectImageFormat,
    resizeImage,
} from '@/server/services/image';

async function buildSampleJpeg() {
    const width = 320;
    const height = 220;
    const raw = Buffer.alloc(width * height * 3);
    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            const offset = (y * width + x) * 3;
            raw[offset] = (x * 7 + y * 3) % 255;
            raw[offset + 1] = (x * 5 + y * 9) % 255;
            raw[offset + 2] = (x * 2 + y * 11) % 255;
        }
    }

    return sharp(raw, { raw: { width, height, channels: 3 } })
        .jpeg({ quality: 95 })
        .toBuffer();
}

async function buildLargeJpeg() {
    return sharp({
        create: {
            width: 1700,
            height: 1700,
            channels: 3,
            background: { r: 255, g: 170, b: 68 },
        },
    })
        .jpeg({ quality: 85 })
        .toBuffer();
}

describe('image compression service', () => {
    it('detecta formato a partir de mime/extensão', () => {
        expect(detectImageFormat('foto.jpg', 'image/jpeg')).toBe('jpeg');
        expect(detectImageFormat('img.webp')).toBe('webp');
        expect(detectImageFormat('arquivo.xyz')).toBeNull();
    });

    it('comprime JPEG no mesmo formato', async () => {
        const input = await buildSampleJpeg();
        const result = await compressImage(input, {
            fileName: 'sample.jpg',
            mimeType: 'image/jpeg',
            quality: 55,
        });

        expect(result.success).toBe(true);
        expect(result.format).toBe('jpeg');
        expect(result.operation).toBe('compress');
        expect(result.compressedSize).toBeLessThan(result.originalSize);
    });

    it('converte JPEG para WEBP', async () => {
        const input = await buildSampleJpeg();
        const result = await convertImageFormat(input, {
            fileName: 'sample.jpg',
            mimeType: 'image/jpeg',
            targetFormat: 'webp',
        });

        expect(result.success).toBe(true);
        expect(result.format).toBe('webp');
        expect(result.operation).toBe('convert');
        expect(result.file.length).toBe(result.compressedSize);
        expect(result.compressedSize).toBeLessThan(result.originalSize);
    });

    it('converte para GIF mesmo com resolução maior', async () => {
        const input = await buildLargeJpeg();
        const result = await convertImageFormat(input, {
            fileName: 'large.jpg',
            mimeType: 'image/jpeg',
            targetFormat: 'gif',
        });

        expect(result.success).toBe(true);
        expect(result.operation).toBe('convert');
        expect(result.format).toBe('gif');
    });

    it('retorna PNG original quando compressão PNG não reduz', async () => {
        const input = await sharp({
            create: {
                width: 256,
                height: 256,
                channels: 3,
                background: { r: 119, g: 204, b: 255 },
            },
        })
            .png({ compressionLevel: 9 })
            .toBuffer();
        const result = await compressImage(input, {
            fileName: 'sample.png',
            mimeType: 'image/png',
            quality: 90,
        });

        expect(result.success).toBe(true);
        expect(result.format).toBe('png');
        expect(result.compressedSize).toBeLessThanOrEqual(result.originalSize);
    });

    it('permite conversão para PNG mesmo quando o arquivo aumenta', async () => {
        const input = await buildSampleJpeg();
        const result = await convertImageFormat(input, {
            fileName: 'sample.jpg',
            mimeType: 'image/jpeg',
            targetFormat: 'png',
        });

        expect(result.success).toBe(true);
        expect(result.operation).toBe('convert');
        expect(result.format).toBe('png');
    });

    it('redimensiona mantendo o formato original', async () => {
        const input = await buildSampleJpeg();
        const result = await resizeImage(input, {
            fileName: 'sample.jpg',
            mimeType: 'image/jpeg',
            width: 160,
            keepAspectRatio: true,
        });

        expect(result.success).toBe(true);
        expect(result.operation).toBe('resize');
        expect(result.format).toBe('jpeg');
        expect(result.width).toBe(160);
        expect(result.height).toBeGreaterThan(0);
    });
});
