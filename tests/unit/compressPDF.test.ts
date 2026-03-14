import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { compressPDF } from '@/server/services/pdf';

async function buildBloatedPdf() {
    const doc = await PDFDocument.create();
    const page = doc.addPage([595, 842]);

    for (let index = 0; index < 220; index += 1) {
        page.drawText(
            `Linha ${index + 1} - Conteudo repetido para teste de compressao de PDF.`,
            {
                x: 24,
                y: 810 - index * 3,
                size: 8,
            },
        );
    }

    const base = Buffer.from(
        await doc.save({
            useObjectStreams: false,
        }),
    );

    return Buffer.concat([base, Buffer.alloc(base.length * 2, 0x20)]);
}

describe('compressPDF', () => {
    it('reduz o tamanho do PDF com pdf-lib', async () => {
        const input = await buildBloatedPdf();
        const result = await compressPDF(input, { quality: 80 });

        expect(result.success).toBe(true);
        expect(result.method).toBe('pdf-lib');
        expect(result.file.length).toBe(result.compressedSize);
        expect(result.compressedSize).toBeLessThan(result.originalSize);
        expect(result.compressedSize).toBeLessThan(result.originalSize * 0.8);
    });
});

