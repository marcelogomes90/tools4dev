'use client';

import { useState } from 'react';
import { getToolBySlug } from '@/lib/tool-registry';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { Input } from '@/components/ui/input';
import { InputPanel } from '@/components/ui/input-panel';
import { Label } from '@/components/ui/label';
import { OutputPanel } from '@/components/ui/output-panel';
import { ToolLayout } from '@/components/ui/tool-layout';

const meta = getToolBySlug('link-shortener');

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
  const [loading, setLoading] = useState(false);

  if (!meta) return null;

  async function shorten() {
    setLoading(true);
    setResult(null);

    const payload = {
      url,
      slug: slug || undefined,
    };

    const response = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as ShortenResponse;
    setResult(data);
    setLoading(false);
  }

  function clear() {
    setUrl('');
    setSlug('');
    setResult(null);
  }

  function sample() {
    setUrl('https://nextjs.org/docs');
    setSlug('docs-next');
  }

  return (
    <ToolLayout title={meta.name} description={meta.description} examples={meta.examples}>
      <div className="grid gap-4 lg:grid-cols-2">
        <InputPanel>
          <div>
            <Label htmlFor="shorten-url">URL destino (http/https)</Label>
            <Input
              id="shorten-url"
              placeholder="https://example.com/path"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="shorten-slug">Slug custom no Bitly (opcional)</Label>
            <Input id="shorten-slug" placeholder="meu-link" value={slug} onChange={(event) => setSlug(event.target.value)} />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Esta ferramenta usa somente Bitly. Configure `BITLY_TOKEN` no ambiente para habilitar.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={shorten} disabled={loading || !url}>
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
              <CopyButton value={result.shortUrl ?? ''} />
            </div>
          ) : (
            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <p>{result?.message ?? 'Nenhum link curto gerado.'}</p>
            </div>
          )}
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
