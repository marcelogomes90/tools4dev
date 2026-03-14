'use client';

import { FileUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getToolBySlug } from '@/lib/tool-registry';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputPanel } from '@/components/ui/input-panel';
import { Label } from '@/components/ui/label';
import { OutputPanel } from '@/components/ui/output-panel';
import { ToolLayout } from '@/components/ui/tool-layout';

const meta = getToolBySlug('pdf-compressor');
const FILE_INPUT_ID = 'pdf-file-upload';

export function PdfCompressorTool() {
    const [file, setFile] = useState<File | null>(null);
    const [resultUrl, setResultUrl] = useState('');
    const [stats, setStats] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [quality, setQuality] = useState(80);

    useEffect(() => {
        return () => {
            if (resultUrl) URL.revokeObjectURL(resultUrl);
        };
    }, [resultUrl]);

    if (!meta) return null;

    async function compress() {
        if (!file) return;

        setLoading(true);
        setError('');
        setStats('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('quality', String(quality));

        try {
            const response = await fetch('/api/pdf/compress', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const data = (await response.json().catch(() => null)) as {
                    message?: string;
                } | null;
                setError(data?.message ?? 'Falha ao comprimir PDF.');
                return;
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const method =
                response.headers.get('X-Compression-Method') ?? 'unknown';
            if (resultUrl) URL.revokeObjectURL(resultUrl);

            setResultUrl(url);
            const originalSize = Number(
                response.headers.get('X-Original-Size') ?? file.size,
            );
            const compressedSize = Number(
                response.headers.get('X-Compressed-Size') ?? blob.size,
            );
            const reduction =
                originalSize > 0
                    ? ((originalSize - compressedSize) / originalSize) * 100
                    : 0;
            setStats(
                `Metodo: ${method} | Original: ${(originalSize / 1024).toFixed(1)}KB | Comprimido: ${(compressedSize / 1024).toFixed(1)}KB | Reducao: ${Math.max(0, reduction).toFixed(1)}%`,
            );
        } catch {
            setError('Falha de rede ao comprimir PDF.');
        } finally {
            setLoading(false);
        }
    }

    function clear() {
        setFile(null);
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        setResultUrl('');
        setStats('');
        setError('');
    }

    return (
        <ToolLayout
            title={meta.name}
            description={meta.description}
            examples={meta.examples}
        >
            <div className="grid gap-4 lg:grid-cols-2">
                <InputPanel>
                    <div>
                        <Label htmlFor={FILE_INPUT_ID}>
                            Arquivo PDF (max 20MB)
                        </Label>
                        <input
                            id={FILE_INPUT_ID}
                            type="file"
                            className="sr-only"
                            accept="application/pdf"
                            onChange={(event) =>
                                setFile(event.target.files?.[0] ?? null)
                            }
                        />
                        <label
                            htmlFor={FILE_INPUT_ID}
                            className="mt-1 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-surface-border bg-surface/75 px-4 text-center transition hover:border-surface-accent/70 hover:bg-surface-muted/70"
                        >
                            <FileUp className="mb-2 h-5 w-5" />
                            <span className="text-sm font-medium">
                                Clique para selecionar PDF
                            </span>
                            <span className="mt-1 w-full break-all text-xs text-slate-600 dark:text-slate-400">
                                {file ? file.name : 'Sem arquivo selecionado'}
                            </span>
                        </label>
                    </div>
                    <div>
                        <Label htmlFor="pdf-quality">Qualidade (1..100)</Label>
                        <Input
                            id="pdf-quality"
                            type="number"
                            min={1}
                            max={100}
                            value={quality}
                            onChange={(event) => {
                                const parsed = Number(event.target.value);
                                if (Number.isNaN(parsed)) {
                                    setQuality(80);
                                    return;
                                }
                                setQuality(Math.max(1, Math.min(100, parsed)));
                            }}
                        />
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <Button onClick={compress} disabled={!file || loading}>
                            {loading ? 'Processando...' : 'Comprimir'}
                        </Button>
                        <Button variant="ghost" onClick={clear}>
                            Limpar
                        </Button>
                    </div>
                    {error && <p className="text-sm text-rose-600">{error}</p>}
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                        Compressão feita com pdf-lib (Node.js puro, sem
                        dependências nativas).
                    </p>
                </InputPanel>

                <OutputPanel>
                    {resultUrl ? (
                        <div className="space-y-3 text-sm">
                            <p className="break-all text-center">{stats}</p>
                            <div className="flex justify-center">
                                <a
                                    href={resultUrl}
                                    download="compressed.pdf"
                                    className="inline-flex h-9 items-center rounded-xl border border-surface-border bg-surface px-4 text-xs font-medium hover:bg-surface-muted"
                                >
                                    Baixar PDF comprimido
                                </a>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Nenhum PDF processado.
                        </p>
                    )}
                </OutputPanel>
            </div>
        </ToolLayout>
    );
}
