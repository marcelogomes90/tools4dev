import { writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { PDFDocument } from 'pdf-lib';

function runQpdf(inputPath: string, outputPath: string, timeoutMs = 20_000) {
    return new Promise<boolean>((resolve) => {
        const child = spawn('qpdf', [
            '--object-streams=generate',
            '--stream-data=compress',
            '--recompress-flate',
            '--compression-level=9',
            '--optimize-images',
            '--oi-min-width=64',
            '--oi-min-height=64',
            '--oi-min-area=4096',
            inputPath,
            outputPath,
        ]);

        const timeout = setTimeout(() => {
            child.kill('SIGTERM');
            resolve(false);
        }, timeoutMs);

        child.on('error', () => {
            clearTimeout(timeout);
            resolve(false);
        });

        child.on('close', (code) => {
            clearTimeout(timeout);
            resolve(code === 0);
        });
    });
}

async function compressWithPdfLib(buffer: Buffer) {
    const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const bytes = await doc.save({
        useObjectStreams: true,
        addDefaultPage: false,
    });
    return Buffer.from(bytes);
}

export async function compressPdf(input: Buffer) {
    const tempId = randomUUID();
    const inputPath = path.join(tmpdir(), `in-${tempId}.pdf`);
    const qpdfOutputPath = path.join(tmpdir(), `out-${tempId}-qpdf.pdf`);

    try {
        let bestBuffer: Buffer | null = null;
        let bestMethod: 'qpdf' | 'pdf-lib' | null = null;
        let bestSize = input.length;

        await writeFile(inputPath, input);

        const qpdfOk = await runQpdf(inputPath, qpdfOutputPath);
        if (qpdfOk) {
            const qpdfOutput = await readFile(qpdfOutputPath);
            if (qpdfOutput.length < bestSize) {
                bestBuffer = qpdfOutput;
                bestMethod = 'qpdf';
                bestSize = qpdfOutput.length;
            }
        }

        const pdfLibOutput = await compressWithPdfLib(input);
        if (pdfLibOutput.length < bestSize) {
            bestBuffer = pdfLibOutput;
            bestMethod = 'pdf-lib';
            bestSize = pdfLibOutput.length;
        }

        if (!bestBuffer || !bestMethod) {
            return {
                ok: false as const,
                message:
                    'A compressão não reduziu o tamanho do PDF. O arquivo original foi preservado.',
            };
        }

        return {
            ok: true as const,
            buffer: bestBuffer,
            method: bestMethod,
        };
    } catch {
        return {
            ok: false as const,
            message: 'Falha ao processar PDF no ambiente atual.',
        };
    } finally {
        await rm(inputPath, { force: true });
        await rm(qpdfOutputPath, { force: true });
    }
}
