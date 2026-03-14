import { PDFDocument } from 'pdf-lib';
import { PdfCompressionResult } from '@/types/compression';

export interface CompressPDFOptions {
    quality?: number;
}

function clampQuality(quality = 80) {
    return Math.min(100, Math.max(1, Math.trunc(quality)));
}

export async function compressPDF(
    input: Buffer,
    options: CompressPDFOptions = {},
): Promise<PdfCompressionResult> {
    const originalSize = input.length;
    const quality = clampQuality(options.quality);

    if (originalSize === 0) {
        return {
            success: false,
            originalSize: 0,
            compressedSize: 0,
            file: input,
            method: 'pdf-lib',
            message: 'Arquivo PDF vazio.',
        };
    }

    try {
        const source = await PDFDocument.load(input, {
            ignoreEncryption: true,
            updateMetadata: false,
        });
        const target = await PDFDocument.create({ updateMetadata: false });
        const pageIndexes = source.getPageIndices();
        const pages = await target.copyPages(source, pageIndexes);
        for (const page of pages) {
            target.addPage(page);
        }

        target.setProducer('tools4dev');
        target.setCreator('tools4dev');

        const compressedBytes = await target.save({
            useObjectStreams: true,
            addDefaultPage: false,
            updateFieldAppearances: quality >= 70,
            objectsPerTick: quality >= 70 ? 64 : 24,
        });
        const file = Buffer.from(compressedBytes);
        const compressedSize = file.length;

        if (compressedSize >= originalSize) {
            return {
                success: false,
                originalSize,
                compressedSize: originalSize,
                file: input,
                method: 'pdf-lib',
                message:
                    'A compressão não reduziu o tamanho do PDF. O arquivo original foi preservado.',
            };
        }

        return {
            success: true,
            originalSize,
            compressedSize,
            file,
            method: 'pdf-lib',
        };
    } catch {
        return {
            success: false,
            originalSize,
            compressedSize: originalSize,
            file: input,
            method: 'pdf-lib',
            message: 'Falha ao processar PDF no ambiente atual.',
        };
    }
}

