'use client';

import { useCallback, useMemo, useState } from 'react';
import { getToolBySlug } from '@/lib/tool-registry';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { Input } from '@/components/ui/input';
import { InputPanel } from '@/components/ui/input-panel';
import { Label } from '@/components/ui/label';
import { OutputPanel } from '@/components/ui/output-panel';
import { ToolLayout } from '@/components/ui/tool-layout';

const meta = getToolBySlug('link-shortener');
const sampleUrl = 'https://nextjs.org/docs';
const sampleSlug = 'docs-next';

interface ShortenResponse {
    ok: boolean;
    message?: string;
    shortUrl?: string;
    slug?: string;
    provider?: string;
    expiresAt?: string | null;
}

export function LinkShortenerTool() {
    const [url, setUrl] = useState('');
    const [slug, setSlug] = useState('');
    const [result, setResult] = useState<ShortenResponse | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const trimmedUrl = useMemo(() => url.trim(), [url]);
    const trimmedSlug = useMemo(() => slug.trim(), [slug]);

    const outputMessage = useMemo(() => {
        if (error) return error;
        if (result?.message) return result.message;
        return 'Nenhum link curto gerado.';
    }, [error, result?.message]);

    const shorten = useCallback(async () => {
        setLoading(true);
        setResult(null);
        setError('');

        try {
            const payload = {
                url: trimmedUrl,
                slug: trimmedSlug || undefined,
            };

            const response = await fetch('/api/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = (await response.json()) as ShortenResponse;
            if (!response.ok || !data.ok) {
                setError(data.message ?? 'Falha ao encurtar URL.');
                return;
            }

            setResult(data);
        } catch {
            setError('Falha de rede ao chamar o encurtador.');
        } finally {
            setLoading(false);
        }
    }, [trimmedSlug, trimmedUrl]);

    const clear = useCallback(() => {
        setUrl('');
        setSlug('');
        setResult(null);
        setError('');
    }, []);

    const sample = useCallback(() => {
        setUrl(sampleUrl);
        setSlug(sampleSlug);
    }, []);

    if (!meta) return null;

    return (
        <ToolLayout
            title={meta.name}
            description={meta.description}
            examples={meta.examples}
        >
            <div className="grid gap-4 lg:grid-cols-2">
                <InputPanel>
                    <div>
                        <Label htmlFor="shorten-url">
                            URL de destino (http/https)
                        </Label>
                        <Input
                            id="shorten-url"
                            placeholder="https://example.com/path"
                            value={url}
                            onChange={(event) => setUrl(event.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="shorten-slug">
                            Slug customizado (opcional)
                        </Label>
                        <Input
                            id="shorten-slug"
                            placeholder="meu-link"
                            value={slug}
                            onChange={(event) => setSlug(event.target.value)}
                        />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                        Links curtos são gerados localmente e redirecionam por
                        `/s/:slug`.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            onClick={shorten}
                            disabled={loading || !trimmedUrl}
                        >
                            {loading ? 'Gerando...' : 'Encurtar'}
                        </Button>
                        <Button variant="outline" onClick={sample}>
                            Gerar exemplo
                        </Button>
                        <Button variant="ghost" onClick={clear}>
                            Limpar
                        </Button>
                    </div>
                </InputPanel>

                <OutputPanel>
                    {result?.ok ? (
                        <div className="space-y-3 text-sm">
                            <p>
                                <strong>URL curta:</strong> {result.shortUrl}
                            </p>
                            <p>
                                <strong>Slug:</strong> {result.slug}
                            </p>
                            <p>
                                <strong>Provider:</strong> {result.provider}
                            </p>
                            <div className="flex gap-2">
                                <CopyButton value={result.shortUrl ?? ''} />
                                {result.shortUrl && (
                                    <a
                                        href={result.shortUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex h-8 items-center justify-center rounded-xl border border-surface-border bg-surface px-3 text-xs font-medium transition hover:border-surface-accent/50 hover:bg-surface-muted"
                                    >
                                        Abrir
                                    </a>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                            <p>{outputMessage}</p>
                        </div>
                    )}
                </OutputPanel>
            </div>
        </ToolLayout>
    );
}
