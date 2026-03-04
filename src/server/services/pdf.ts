import { writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { PDFDocument } from 'pdf-lib';

function runGhostscript(
  inputPath: string,
  outputPath: string,
  timeoutMs = 30000,
) {
  return new Promise<boolean>((resolve) => {
    const child = spawn('gs', [
      '-sDEVICE=pdfwrite',
      '-dCompatibilityLevel=1.4',
      '-dPDFSETTINGS=/ebook',
      '-dNOPAUSE',
      '-dBATCH',
      '-dQUIET',
      `-sOutputFile=${outputPath}`,
      inputPath,
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

async function fallbackPdfLib(buffer: Buffer) {
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
  const outputPath = path.join(tmpdir(), `out-${tempId}.pdf`);

  try {
    await writeFile(inputPath, input);
    const gsOk = await runGhostscript(inputPath, outputPath, 40000);

    if (gsOk) {
      const output = await readFile(outputPath);
      return {
        ok: true as const,
        buffer: output,
        method: 'ghostscript' as const,
      };
    }

    const fallback = await fallbackPdfLib(input);

    if (fallback.length >= input.length) {
      return {
        ok: false as const,
        message:
          'Feature requires system dependency for melhor compressao (ghostscript). Fallback nao reduziu o arquivo.',
      };
    }

    return {
      ok: true as const,
      buffer: fallback,
      method: 'pdf-lib' as const,
    };
  } catch {
    return {
      ok: false as const,
      message:
        'Feature requires system dependency ou PDF nao suportado no fallback atual. Tente instalar ghostscript.',
    };
  } finally {
    await rm(inputPath, { force: true });
    await rm(outputPath, { force: true });
  }
}
