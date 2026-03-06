'use client';

import { useCallback, useMemo, useState } from 'react';
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

const DEFAULT_AMOUNT = 5;

const baseDefaultOptions: PasswordOptions = {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  avoidAmbiguous: true,
};

type PasswordToggleKey = Exclude<keyof PasswordOptions, 'length'>;

const optionToggles: Array<{ key: PasswordToggleKey; label: string }> = [
  { key: 'uppercase', label: 'Maiúsculas' },
  { key: 'lowercase', label: 'Minúsculas' },
  { key: 'numbers', label: 'Números' },
  { key: 'symbols', label: 'Símbolos' },
  { key: 'avoidAmbiguous', label: 'Evitar caracteres ambíguos (0/O, 1/l)' },
];

function createDefaultOptions(): PasswordOptions {
  return { ...baseDefaultOptions };
}

export function PasswordGeneratorTool() {
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const [options, setOptions] = useState<PasswordOptions>(createDefaultOptions);
  const [result, setResult] = useState<string[]>([]);
  const [error, setError] = useState('');
  const resultText = useMemo(() => result.join('\n'), [result]);

  const generate = useCallback(() => {
    try {
      setResult(generatePasswordBatch(amount, options));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao gerar senhas.');
      setResult([]);
    }
  }, [amount, options]);

  const clear = useCallback(() => {
    setAmount(DEFAULT_AMOUNT);
    setOptions(createDefaultOptions());
    setResult([]);
    setError('');
  }, []);

  const toggle = useCallback((key: PasswordToggleKey) => {
    setOptions((current) => ({ ...current, [key]: !current[key] }));
  }, []);

  const applyExample = useCallback(() => {
    setOptions({
      ...createDefaultOptions(),
      length: 24,
      symbols: true,
    });
    setAmount(10);
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
            {optionToggles.map((item) => (
              <label
                key={item.key}
                className={`flex items-center gap-2 ${
                  item.key === 'avoidAmbiguous' ? 'sm:col-span-2' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={options[item.key]}
                  onChange={() => toggle(item.key)}
                />
                {item.label}
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={generate}>Gerar</Button>
            <Button variant="outline" onClick={applyExample}>
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
            {result.length ? resultText : 'Nenhuma senha gerada ainda.'}
          </div>
          <div className="flex gap-2">
            <CopyButton value={resultText} label="Copiar lista" />
            <Button
              variant="outline"
              size="sm"
              disabled={result.length === 0}
              onClick={() => downloadText(resultText, 'senhas.txt')}
            >
              Baixar
            </Button>
          </div>
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
