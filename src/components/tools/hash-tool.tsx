'use client';

import { useState } from 'react';
import { getToolBySlug } from '@/lib/tool-registry';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { InputPanel } from '@/components/ui/input-panel';
import { Label } from '@/components/ui/label';
import { OutputPanel } from '@/components/ui/output-panel';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ToolLayout } from '@/components/ui/tool-layout';

const meta = getToolBySlug('hash-generator');

interface HashResult {
  md5: string;
  sha1: string;
  sha256: string;
  sha512: string;
}

export function HashTool() {
  const [text, setText] = useState('');
  const [encoding, setEncoding] = useState<'hex' | 'base64'>('hex');
  const [result, setResult] = useState<HashResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!meta) return null;

  async function generate() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, encoding }),
      });

      const data = (await response.json()) as
        | { ok: true; result: HashResult }
        | { ok: false; message: string };

      if (!response.ok || !data.ok) {
        setError(data.ok ? 'Erro ao gerar hash.' : data.message);
        setResult(null);
        return;
      }

      setResult(data.result);
    } catch {
      setError('Falha de rede ao gerar hashes.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  function clear() {
    setText('');
    setResult(null);
    setError('');
  }

  return (
    <ToolLayout title={meta.name} description={meta.description} examples={meta.examples}>
      <div className="grid gap-4 lg:grid-cols-2">
        <InputPanel>
          <div>
            <Label htmlFor="hash-text">Texto</Label>
            <Textarea
              id="hash-text"
              placeholder="Digite o texto para gerar hash"
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="hash-encoding">Encoding</Label>
            <Select
              id="hash-encoding"
              value={encoding}
              onChange={(event) => setEncoding(event.target.value as 'hex' | 'base64')}
            >
              <option value="hex">Hex</option>
              <option value="base64">Base64</option>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={generate} disabled={loading || text.length === 0}>
              {loading ? 'Gerando...' : 'Gerar'}
            </Button>
            <Button variant="outline" onClick={() => setText('hello world')}>
              Gerar exemplo
            </Button>
            <Button variant="ghost" onClick={clear}>
              Limpar
            </Button>
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
        </InputPanel>

        <OutputPanel>
          {result ? (
            <div className="space-y-3 text-sm">
              {Object.entries(result).map(([algorithm, value]) => (
                <div key={algorithm} className="rounded-lg border border-surface-border bg-surface-muted p-3">
                  <p className="font-semibold uppercase">{algorithm}</p>
                  <p className="mt-1 break-all font-mono text-xs">{value}</p>
                  <CopyButton value={value} className="mt-2" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-400">Nenhum hash gerado.</p>
          )}
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
