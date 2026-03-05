'use client';

import { useState } from 'react';
import {
  PasswordOptions,
  generatePasswordBatch,
} from '@/lib/tools/password';
import { downloadText } from '@/lib/utils/download';
import { getToolBySlug } from '@/lib/tool-registry';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { Input } from '@/components/ui/input';
import { InputPanel } from '@/components/ui/input-panel';
import { Label } from '@/components/ui/label';
import { OutputPanel } from '@/components/ui/output-panel';
import { ToolLayout } from '@/components/ui/tool-layout';

const meta = getToolBySlug('password-generator');

const defaultOptions: PasswordOptions = {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  avoidAmbiguous: true,
};

export function PasswordGeneratorTool() {
  const [amount, setAmount] = useState(5);
  const [options, setOptions] = useState<PasswordOptions>(defaultOptions);
  const [result, setResult] = useState<string[]>([]);
  const [error, setError] = useState('');

  if (!meta) return null;

  function generate() {
    try {
      setResult(generatePasswordBatch(amount, options));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao gerar senhas.');
      setResult([]);
    }
  }

  function clear() {
    setAmount(5);
    setOptions(defaultOptions);
    setResult([]);
    setError('');
  }

  function toggle<K extends keyof PasswordOptions>(key: K) {
    setOptions((current) => ({ ...current, [key]: !current[key] }));
  }

  return (
    <ToolLayout
      title={meta.name}
      description={meta.description}
      examples={meta.examples}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <InputPanel>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="password-length">Tamanho (4..128)</Label>
              <Input
                id="password-length"
                type="number"
                min={4}
                max={128}
                value={options.length}
                onChange={(event) =>
                  setOptions((current) => ({
                    ...current,
                    length: Number(event.target.value || 4),
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="password-amount">Quantidade (1..100)</Label>
              <Input
                id="password-amount"
                type="number"
                min={1}
                max={100}
                value={amount}
                onChange={(event) => setAmount(Number(event.target.value || 1))}
              />
            </div>
          </div>
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.uppercase}
                onChange={() => toggle('uppercase')}
              />
              Maiúsculas
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.lowercase}
                onChange={() => toggle('lowercase')}
              />
              Minúsculas
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.numbers}
                onChange={() => toggle('numbers')}
              />
              Números
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.symbols}
                onChange={() => toggle('symbols')}
              />
              Símbolos
            </label>
            <label className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                checked={options.avoidAmbiguous}
                onChange={() => toggle('avoidAmbiguous')}
              />
              Evitar caracteres ambíguos (0/O, 1/l)
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={generate}>Gerar</Button>
            <Button
              variant="outline"
              onClick={() => {
                setOptions({
                  ...defaultOptions,
                  length: 24,
                  symbols: true,
                });
                setAmount(10);
              }}
            >
              Gerar exemplo
            </Button>
            <Button variant="ghost" onClick={clear}>
              Limpar
            </Button>
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
        </InputPanel>

        <OutputPanel>
          <div className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg border border-surface-border bg-surface-muted p-3 font-mono text-xs">
            {result.length ? result.join('\n') : 'Nenhuma senha gerada ainda.'}
          </div>
          <div className="flex gap-2">
            <CopyButton value={result.join('\n')} label="Copiar lista" />
            <Button
              variant="outline"
              size="sm"
              disabled={result.length === 0}
              onClick={() => downloadText(result.join('\n'), 'senhas.txt')}
            >
              Baixar
            </Button>
          </div>
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
