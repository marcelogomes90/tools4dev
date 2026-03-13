'use client';

import { ImagePlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getToolBySlug } from '@/lib/tool-registry';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputPanel } from '@/components/ui/input-panel';
import { Label } from '@/components/ui/label';
import { OutputPanel } from '@/components/ui/output-panel';
import { Select } from '@/components/ui/select';
import { ToolLayout } from '@/components/ui/tool-layout';

const meta = getToolBySlug('image-compressor');
const FILE_INPUT_ID = 'img-file-upload';

export function ImageCompressorTool() {
    const [file, setFile] = useState<File | null>(null);
    const [format, setFormat] = useState<'png' | 'jpeg' | 'webp' | 'gif'>(
        'webp',
    );
    const [quality, setQuality] = useState(80);
    const [resultUrl, setResultUrl] = useState('');
    const [stats, setStats] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('format', format);
            formData.append('quality', String(quality));

            const response = await fetch('/api/image/compress', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const data = (await response.json().catch(() => null)) as {
                    message?: string;
                } | null;
                setError(data?.message ?? 'Falha ao comprimir imagem.');
                return;
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            if (resultUrl) URL.revokeObjectURL(resultUrl);

            const reduction = Math.max(
                0,
                ((file.size - blob.size) / file.size) * 100,
            );
            setResultUrl(url);
            setStats(
                `Original: ${(file.size / 1024).toFixed(1)}KB | Comprimido: ${(blob.size / 1024).toFixed(1)}KB | Reducao: ${reduction.toFixed(1)}%`,
            );
        } catch {
            setError('Falha de rede ao comprimir imagem.');
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

    function sample() {
        setFormat('webp');
        setQuality(75);
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
                            Arquivo (png/jpeg/webp/gif, max 10MB)
                        </Label>
                        <input
                            id={FILE_INPUT_ID}
                            type="file"
                            className="sr-only"
                            accept="image/png,image/jpeg,image/webp,image/gif"
                            onChange={(event) =>
                                setFile(event.target.files?.[0] ?? null)
                            }
                        />
                        <label
                            htmlFor={FILE_INPUT_ID}
                            className="mt-1 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-surface-border bg-surface/75 px-4 text-center transition hover:border-surface-accent/70 hover:bg-surface-muted/70"
                        >
                            <ImagePlus className="mb-2 h-5 w-5" />
                            <span className="text-sm font-medium">
                                Clique para selecionar imagem
                            </span>
                            <span className="mt-1 w-full break-all text-xs text-slate-600 dark:text-slate-400">
                                {file ? file.name : 'Sem arquivo selecionado'}
                            </span>
                        </label>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <Label>Formato de saida</Label>
                            <Select
                                value={format}
                                onChange={(event) =>
                                    setFormat(
                                        event.target.value as
                                            | 'png'
                                            | 'jpeg'
                                            | 'webp'
                                            | 'gif',
                                    )
                                }
                            >
                                <option value="png">PNG</option>
                                <option value="jpeg">JPEG</option>
                                <option value="webp">WEBP</option>
                                <option value="gif">GIF</option>
                            </Select>
                        </div>
                        <div>
                            <Label>Qualidade (30..95)</Label>
                            <Input
                                type="number"
                                min={30}
                                max={95}
                                value={quality}
                                onChange={(event) => {
                                    const parsed = Number(event.target.value);
                                    if (Number.isNaN(parsed)) {
                                        setQuality(80);
                                        return;
                                    }
                                    setQuality(
                                        Math.max(30, Math.min(95, parsed)),
                                    );
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <Button onClick={compress} disabled={!file || loading}>
                            {loading ? 'Processando...' : 'Comprimir'}
                        </Button>
                        <Button variant="outline" onClick={sample}>
                            Gerar exemplo
                        </Button>
                        <Button variant="ghost" onClick={clear}>
                            Limpar
                        </Button>
                    </div>
                    {error && <p className="text-sm text-rose-600">{error}</p>}
                </InputPanel>

                <OutputPanel>
                    {resultUrl ? (
                        <div className="space-y-3 text-sm">
                            <img
                                src={resultUrl}
                                alt="Imagem comprimida"
                                className="mx-auto max-h-72 rounded-xl border border-surface-border object-contain"
                            />
                            <p className="text-center">{stats}</p>
                            <div className="flex justify-center">
                                <a
                                    href={resultUrl}
                                    download={`compressed.${format}`}
                                    className="inline-flex h-9 items-center rounded-xl border border-surface-border bg-surface px-4 text-xs font-medium hover:bg-surface-muted"
                                >
                                    Baixar
                                </a>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Nenhum arquivo processado.
                        </p>
                    )}
                </OutputPanel>
            </div>
        </ToolLayout>
    );
}
