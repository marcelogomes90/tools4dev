'use client';

import { useState } from 'react';
import QRCode from 'qrcode';
import { getToolBySlug } from '@/lib/tool-registry';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { Input } from '@/components/ui/input';
import { InputPanel } from '@/components/ui/input-panel';
import { Label } from '@/components/ui/label';
import { OutputPanel } from '@/components/ui/output-panel';
import { ToolLayout } from '@/components/ui/tool-layout';

const meta = getToolBySlug('qr-code-generator');

export function QrCodeGeneratorTool() {
  const [text, setText] = useState('https://github.com/marcelogomes90/dev-swiss-knife');
  const [size, setSize] = useState(280);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!meta) return null;

  async function generateQr() {
    setLoading(true);
    setError('');

    try {
      const safeSize = Math.min(1000, Math.max(100, Math.floor(size)));
      const dataUrl = await QRCode.toDataURL(text, {
        width: safeSize,
        margin: 1,
      });

      setQrDataUrl(dataUrl);
    } catch {
      setQrDataUrl('');
      setError('Falha ao gerar QR Code. Verifique o texto e tente novamente.');
    } finally {
      setLoading(false);
    }
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
            <Label htmlFor="qr-text">Texto ou URL</Label>
            <Input
              id="qr-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="https://exemplo.com"
            />
          </div>
          <div>
            <Label htmlFor="qr-size">Tamanho (100..1000)</Label>
            <Input
              id="qr-size"
              type="number"
              min={100}
              max={1000}
              value={size}
              onChange={(event) => setSize(Number(event.target.value || 100))}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={generateQr} disabled={!text.trim() || loading}>
              {loading ? 'Gerando...' : 'Gerar QR Code'}
            </Button>
            <Button variant="outline" onClick={() => setText('Dev Swiss Knife')}>
              Gerar exemplo
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setQrDataUrl('');
                setError('');
              }}
            >
              Limpar
            </Button>
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
        </InputPanel>

        <OutputPanel>
          {qrDataUrl ? (
            <div className="space-y-3">
              <div className="flex justify-center rounded-lg border border-surface-border bg-surface-muted p-3">
                <img
                  src={qrDataUrl}
                  alt="QR Code gerado"
                  width={Math.min(320, Math.max(140, size))}
                  height={Math.min(320, Math.max(140, size))}
                />
              </div>
              <div className="flex gap-2">
                <CopyButton value={qrDataUrl} label="Copiar Data URL" />
                <a
                  href={qrDataUrl}
                  download="qrcode.png"
                  className="inline-flex h-8 items-center justify-center rounded-xl border border-surface-border bg-surface px-3 text-xs font-medium transition hover:border-surface-accent/50 hover:bg-surface-muted"
                >
                  Baixar imagem
                </a>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Nenhum QR Code gerado.
            </p>
          )}
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
