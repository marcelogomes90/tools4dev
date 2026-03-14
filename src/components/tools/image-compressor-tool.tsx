'use client';

import { ImagePlus } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
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
const MAX_IMAGE_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_FILE_SIZE_LABEL = '5MB';

type ImageFormat = 'png' | 'jpeg' | 'webp' | 'gif';
type ImageMode = 'resize' | 'convert' | 'compress';

interface SourceDimensions {
    width: number;
    height: number;
}

function modeLabel(mode: ImageMode) {
    if (mode === 'resize') return 'Redimensionar';
    if (mode === 'convert') return 'Converter';
    return 'Comprimir';
}

function normalizePositiveInteger(value: string) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) return '';
    return String(Math.trunc(parsed));
}

function clampNumber(value: string, min: number, max: number, fallback: number) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.max(min, Math.min(max, Math.trunc(parsed)));
}

function formatFileSize(bytes: number) {
    return `${(bytes / 1024).toFixed(1)}KB`;
}

function formatLabel(format: string) {
    return format.toUpperCase();
}

function getSourceFormat(file: File): ImageFormat | null {
    if (file.type === 'image/png') return 'png';
    if (file.type === 'image/jpeg') return 'jpeg';
    if (file.type === 'image/webp') return 'webp';
    if (file.type === 'image/gif') return 'gif';
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'png') return 'png';
    if (extension === 'jpg' || extension === 'jpeg') return 'jpeg';
    if (extension === 'webp') return 'webp';
    if (extension === 'gif') return 'gif';
    return null;
}

export function ImageCompressorTool() {
    const [mode, setMode] = useState<ImageMode>('resize');
    const [file, setFile] = useState<File | null>(null);
    const [sourceDimensions, setSourceDimensions] =
        useState<SourceDimensions | null>(null);

    const [compressQuality, setCompressQuality] = useState(78);
    const [convertFormat, setConvertFormat] = useState<ImageFormat>('webp');

    const [resizeWidth, setResizeWidth] = useState('');
    const [resizeHeight, setResizeHeight] = useState('');
    const [resizeKeepAspectRatio, setResizeKeepAspectRatio] = useState(true);
    const manualAspectRatioRef = useRef<number | null>(null);

    const [resultUrl, setResultUrl] = useState('');
    const [downloadName, setDownloadName] = useState('image-output');
    const [stats, setStats] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    useEffect(() => {
        return () => {
            if (resultUrl) URL.revokeObjectURL(resultUrl);
        };
    }, [resultUrl]);

    useEffect(() => {
        if (!loading) {
            setElapsedSeconds(0);
            return;
        }

        const timer = window.setInterval(() => {
            setElapsedSeconds((previous) => previous + 1);
        }, 1000);

        return () => window.clearInterval(timer);
    }, [loading]);

    useEffect(() => {
        if (!file) {
            setSourceDimensions(null);
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        const image = new window.Image();
        image.onload = () => {
            setSourceDimensions({
                width: image.naturalWidth,
                height: image.naturalHeight,
            });
            URL.revokeObjectURL(objectUrl);
        };
        image.onerror = () => {
            setSourceDimensions(null);
            URL.revokeObjectURL(objectUrl);
        };
        image.src = objectUrl;
    }, [file]);

    const modeHint = useMemo(() => {
        if (mode === 'resize') {
            return 'Redimensiona mantendo o formato original.';
        }
        if (mode === 'convert') {
            return 'Converte para outro formato mantendo a qualidade de saída padrão.';
        }
        return 'Comprime mantendo o formato original com controle de qualidade.';
    }, [mode]);

    function clearOutput() {
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        setResultUrl('');
        setStats('');
        setError('');
    }

    function clearAll() {
        setFile(null);
        setSourceDimensions(null);
        setResizeWidth('');
        setResizeHeight('');
        setResizeKeepAspectRatio(true);
        manualAspectRatioRef.current = null;
        setConvertFormat('webp');
        setCompressQuality(78);
        clearOutput();
    }

    function handleImageFileChange(nextFile: File | null) {
        clearOutput();
        setSourceDimensions(null);

        if (!nextFile) {
            setFile(null);
            return;
        }

        if (nextFile.size > MAX_IMAGE_FILE_SIZE_BYTES) {
            setFile(null);
            setError(
                `A imagem excede o limite de ${MAX_IMAGE_FILE_SIZE_LABEL}.`,
            );
            return;
        }

        setFile(nextFile);
    }

    function changeMode(nextMode: ImageMode) {
        if (nextMode === mode) return;
        clearAll();
        setMode(nextMode);
    }

    function toPositiveNumber(value: string) {
        const parsed = Number(value);
        if (!Number.isFinite(parsed) || parsed <= 0) return null;
        return parsed;
    }

    function rememberAspectRatio(widthValue: string, heightValue: string) {
        const numericWidth = toPositiveNumber(widthValue);
        const numericHeight = toPositiveNumber(heightValue);
        if (!numericWidth || !numericHeight) return;
        manualAspectRatioRef.current = numericWidth / numericHeight;
    }

    function getAspectRatio() {
        if (sourceDimensions) {
            return sourceDimensions.width / sourceDimensions.height;
        }

        const numericWidth = toPositiveNumber(resizeWidth);
        const numericHeight = toPositiveNumber(resizeHeight);
        if (numericWidth && numericHeight) {
            return numericWidth / numericHeight;
        }

        if (manualAspectRatioRef.current && manualAspectRatioRef.current > 0) {
            return manualAspectRatioRef.current;
        }

        return 1;
    }

    function fillProportionalHeight(widthValue: string) {
        if (!resizeKeepAspectRatio) return;
        const numericWidth = toPositiveNumber(widthValue);
        if (!numericWidth) {
            setResizeHeight('');
            return;
        }

        const aspectRatio = getAspectRatio();
        const proportionalHeight = Math.max(
            1,
            Math.round(numericWidth / aspectRatio),
        );
        setResizeHeight(String(proportionalHeight));
        rememberAspectRatio(String(numericWidth), String(proportionalHeight));
    }

    function fillProportionalWidth(heightValue: string) {
        if (!resizeKeepAspectRatio) return;
        const numericHeight = toPositiveNumber(heightValue);
        if (!numericHeight) {
            setResizeWidth('');
            return;
        }

        const aspectRatio = getAspectRatio();
        const proportionalWidth = Math.max(
            1,
            Math.round(numericHeight * aspectRatio),
        );
        setResizeWidth(String(proportionalWidth));
        rememberAspectRatio(String(proportionalWidth), String(numericHeight));
    }

    function handleResizeWidthChange(value: string) {
        setResizeWidth(value);
        if (resizeKeepAspectRatio) {
            fillProportionalHeight(value);
            return;
        }
        rememberAspectRatio(value, resizeHeight);
    }

    function handleResizeHeightChange(value: string) {
        setResizeHeight(value);
        if (resizeKeepAspectRatio) {
            fillProportionalWidth(value);
            return;
        }
        rememberAspectRatio(resizeWidth, value);
    }

    function toggleKeepAspectRatio(checked: boolean) {
        setResizeKeepAspectRatio(checked);
        if (!checked) {
            rememberAspectRatio(resizeWidth, resizeHeight);
            return;
        }

        if (resizeWidth) {
            fillProportionalHeight(resizeWidth);
            return;
        }
        if (resizeHeight) {
            fillProportionalWidth(resizeHeight);
        }
    }

    useEffect(() => {
        if (!resizeKeepAspectRatio || !sourceDimensions) return;
        if (resizeWidth && !resizeHeight) {
            const numericWidth = Number(resizeWidth);
            if (!Number.isFinite(numericWidth) || numericWidth <= 0) return;
            const proportionalHeight = Math.max(
                1,
                Math.round(
                    numericWidth *
                        (sourceDimensions.height / sourceDimensions.width),
                ),
            );
            setResizeHeight(String(proportionalHeight));
            manualAspectRatioRef.current = numericWidth / proportionalHeight;
            return;
        }
        if (resizeHeight && !resizeWidth) {
            const numericHeight = Number(resizeHeight);
            if (!Number.isFinite(numericHeight) || numericHeight <= 0) return;
            const proportionalWidth = Math.max(
                1,
                Math.round(
                    numericHeight *
                        (sourceDimensions.width / sourceDimensions.height),
                ),
            );
            setResizeWidth(String(proportionalWidth));
            manualAspectRatioRef.current = proportionalWidth / numericHeight;
        }
    }, [sourceDimensions, resizeKeepAspectRatio, resizeWidth, resizeHeight]);

    async function processImage() {
        if (!file) return;

        clearOutput();
        if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
            setError(`A imagem excede o limite de ${MAX_IMAGE_FILE_SIZE_LABEL}.`);
            return;
        }
        setLoading(true);
        let timeoutId: number | undefined;

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('operation', mode);

            if (mode === 'compress') {
                formData.append('quality', String(compressQuality));
            } else if (mode === 'convert') {
                formData.append('format', convertFormat);
            } else {
                const normalizedWidth = normalizePositiveInteger(resizeWidth);
                const normalizedHeight = normalizePositiveInteger(resizeHeight);

                if (!normalizedWidth && !normalizedHeight) {
                    setError('Informe largura ou altura para redimensionar.');
                    setLoading(false);
                    return;
                }

                if (normalizedWidth) formData.append('width', normalizedWidth);
                if (normalizedHeight)
                    formData.append('height', normalizedHeight);
                formData.append(
                    'keepAspectRatio',
                    resizeKeepAspectRatio ? 'true' : 'false',
                );
            }

            const controller = new AbortController();
            timeoutId = window.setTimeout(() => controller.abort(), 35_000);

            const response = await fetch('/api/image/compress', {
                method: 'POST',
                body: formData,
                signal: controller.signal,
            });

            if (!response.ok) {
                if (response.status === 413) {
                    setError(
                        `A imagem excede o limite de ${MAX_IMAGE_FILE_SIZE_LABEL}.`,
                    );
                    return;
                }

                const data = (await response.json().catch(() => null)) as {
                    message?: string;
                } | null;
                setError(data?.message ?? 'Falha ao processar imagem.');
                return;
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            if (resultUrl) URL.revokeObjectURL(resultUrl);

            const operation =
                (response.headers.get('X-Image-Operation') as ImageMode) ||
                mode;
            const outputFormat =
                (response.headers.get('X-Image-Format') as ImageFormat) ||
                convertFormat;
            const outputWidth = Number(
                response.headers.get('X-Image-Width') ?? 0,
            );
            const outputHeight = Number(
                response.headers.get('X-Image-Height') ?? 0,
            );
            const originalSize = Number(
                response.headers.get('X-Original-Size') ?? file.size,
            );
            const compressedSize = Number(
                response.headers.get('X-Compressed-Size') ?? blob.size,
            );
            const sourceFormat = getSourceFormat(file);

            setResultUrl(url);
            setDownloadName(`image-${operation}.${outputFormat}`);
            if (operation === 'resize') {
                const fromSize = sourceDimensions
                    ? `${sourceDimensions.width}x${sourceDimensions.height}`
                    : 'origem';
                const toSize =
                    outputWidth > 0 && outputHeight > 0
                        ? `${outputWidth}x${outputHeight}`
                        : 'destino';
                setStats(
                    `Imagem redimensionada de ${fromSize} para ${toSize}. Tamanho do arquivo: ${formatFileSize(compressedSize)}.`,
                );
            } else if (operation === 'convert') {
                const fromFormat = sourceFormat
                    ? formatLabel(sourceFormat)
                    : 'ORIGINAL';
                setStats(
                    `Imagem convertida de ${fromFormat} para ${formatLabel(outputFormat)}. Tamanho do arquivo: ${formatFileSize(compressedSize)}.`,
                );
            } else {
                setStats(
                    `Tamanho anterior: ${formatFileSize(originalSize)}. Tamanho comprimido: ${formatFileSize(compressedSize)}.`,
                );
            }
        } catch (caughtError) {
            if (
                caughtError instanceof DOMException &&
                caughtError.name === 'AbortError'
            ) {
                setError(
                    'A requisição excedeu 35 segundos. Reduza resolução, use qualidade menor ou prefira WEBP/JPEG.',
                );
            } else {
                setError('Falha de rede ao processar imagem.');
            }
        } finally {
            if (typeof timeoutId === 'number') window.clearTimeout(timeoutId);
            setLoading(false);
        }
    }

    if (!meta) return null;

    return (
        <ToolLayout
            title={meta.name}
            description={meta.description}
            examples={meta.examples}
        >
            <div className="space-y-4">
                <div className="inline-flex rounded-xl border border-surface-border bg-surface-muted p-1">
                    <button
                        type="button"
                        onClick={() => changeMode('resize')}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                            mode === 'resize'
                                ? 'bg-surface text-surface-foreground'
                                : 'text-slate-600 dark:text-slate-300'
                        }`}
                    >
                        Redimensionar
                    </button>
                    <button
                        type="button"
                        onClick={() => changeMode('convert')}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                            mode === 'convert'
                                ? 'bg-surface text-surface-foreground'
                                : 'text-slate-600 dark:text-slate-300'
                        }`}
                    >
                        Converter
                    </button>
                    <button
                        type="button"
                        onClick={() => changeMode('compress')}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                            mode === 'compress'
                                ? 'bg-surface text-surface-foreground'
                                : 'text-slate-600 dark:text-slate-300'
                        }`}
                    >
                        Comprimir
                    </button>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <InputPanel title={`Entrada - ${modeLabel(mode)}`}>
                        <div>
                            <Label htmlFor={FILE_INPUT_ID}>
                                Arquivo (png/jpeg/webp/gif, máx {MAX_IMAGE_FILE_SIZE_LABEL})
                            </Label>
                            <input
                                id={FILE_INPUT_ID}
                                type="file"
                                className="sr-only"
                                accept="image/png,image/jpeg,image/webp,image/gif"
                                onChange={(event) =>
                                    handleImageFileChange(
                                        event.target.files?.[0] ?? null,
                                    )
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
                                    {file
                                        ? `${file.name} (${(file.size / 1024).toFixed(1)}KB)`
                                        : 'Sem arquivo selecionado'}
                                </span>
                                {sourceDimensions && (
                                    <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        Resolução original:{' '}
                                        {sourceDimensions.width}x
                                        {sourceDimensions.height}
                                    </span>
                                )}
                            </label>
                            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                                Limite de upload: {MAX_IMAGE_FILE_SIZE_LABEL}.
                            </p>
                        </div>

                        {mode === 'resize' && (
                            <>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <Label htmlFor="img-resize-width">
                                            Largura (px)
                                        </Label>
                                        <Input
                                            id="img-resize-width"
                                            type="number"
                                            min={1}
                                            max={5000}
                                            value={resizeWidth}
                                            onChange={(event) =>
                                                handleResizeWidthChange(
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Ex: 1280"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="img-resize-height">
                                            Altura (px)
                                        </Label>
                                        <Input
                                            id="img-resize-height"
                                            type="number"
                                            min={1}
                                            max={5000}
                                            value={resizeHeight}
                                            onChange={(event) =>
                                                handleResizeHeightChange(
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Ex: 720"
                                        />
                                    </div>
                                </div>
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={resizeKeepAspectRatio}
                                        onChange={(event) =>
                                            toggleKeepAspectRatio(
                                                event.target.checked,
                                            )
                                        }
                                    />
                                    Manter proporção
                                </label>
                            </>
                        )}

                        {mode === 'convert' && (
                            <div>
                                <Label htmlFor="img-convert-format">
                                    Formato de saída
                                </Label>
                                <Select
                                    id="img-convert-format"
                                    value={convertFormat}
                                    onChange={(event) =>
                                        setConvertFormat(
                                            event.target.value as ImageFormat,
                                        )
                                    }
                                >
                                    <option value="png">PNG</option>
                                    <option value="jpeg">JPEG</option>
                                    <option value="webp">WEBP</option>
                                    <option value="gif">GIF</option>
                                </Select>
                            </div>
                        )}

                        {mode === 'compress' && (
                            <div>
                                <Label htmlFor="img-compress-quality">
                                    Qualidade (1..100)
                                </Label>
                                <Input
                                    id="img-compress-quality"
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={compressQuality}
                                    onChange={(event) =>
                                        setCompressQuality(
                                            clampNumber(
                                                event.target.value,
                                                1,
                                                100,
                                                78,
                                            ),
                                        )
                                    }
                                />
                            </div>
                        )}

                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            {modeHint}
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <Button
                                onClick={processImage}
                                disabled={!file || loading}
                            >
                                {loading
                                    ? 'Processando...'
                                    : mode === 'resize'
                                      ? 'Redimensionar'
                                      : mode === 'convert'
                                        ? 'Converter'
                                        : 'Comprimir'}
                            </Button>
                            <Button variant="ghost" onClick={clearAll}>
                                Limpar
                            </Button>
                        </div>
                        {loading && (
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                Processando há {elapsedSeconds}s...
                            </p>
                        )}
                        {error && <p className="text-sm text-rose-600">{error}</p>}
                    </InputPanel>

                    <OutputPanel title="Resultado">
                        {resultUrl ? (
                            <div className="space-y-3 text-sm">
                                <img
                                    src={resultUrl}
                                    alt="Resultado de processamento da imagem"
                                    className="mx-auto max-h-72 rounded-xl border border-surface-border object-contain"
                                />
                                <p className="text-center">{stats}</p>
                                <div className="flex justify-center">
                                    <a
                                        href={resultUrl}
                                        download={downloadName}
                                        className="inline-flex h-9 items-center rounded-xl border border-surface-border bg-surface px-4 text-xs font-medium hover:bg-surface-muted"
                                    >
                                        Baixar arquivo processado
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
            </div>
        </ToolLayout>
    );
}
