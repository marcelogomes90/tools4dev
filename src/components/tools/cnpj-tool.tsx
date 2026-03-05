'use client';

import { useState } from 'react';
import { generateCnpjBatch, isValidCnpj } from '@/lib/tools/cnpj';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputPanel } from '@/components/ui/input-panel';
import { OutputPanel } from '@/components/ui/output-panel';
import { CopyButton } from '@/components/ui/copy-button';
import { ToolLayout } from '@/components/ui/tool-layout';
import { getToolBySlug } from '@/lib/tool-registry';
import { downloadText } from '@/lib/utils/download';

const meta = getToolBySlug('cnpj-generator');

export function CnpjTool() {
  const [quantity, setQuantity] = useState(1);
  const [masked, setMasked] = useState(true);
  const [inputToValidate, setInputToValidate] = useState('');
  const [result, setResult] = useState<string[]>([]);

  if (!meta) return null;

  const validation = inputToValidate ? isValidCnpj(inputToValidate) : null;

  function generateExample() {
    setQuantity(5);
    setMasked(true);
    setInputToValidate('04.252.011/0001-10');
    setResult(generateCnpjBatch(5, true));
  }

  function clear() {
    setQuantity(1);
    setMasked(true);
    setInputToValidate('');
    setResult([]);
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
            <Label htmlFor="cnpj-quantity">Quantidade (1..100)</Label>
            <Input
              id="cnpj-quantity"
              type="number"
              min={1}
              max={100}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value || 1))}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={masked}
              onChange={(event) => setMasked(event.target.checked)}
            />
            Gerar com máscara
          </label>
          <div>
            <Label htmlFor="cnpj-validate">Validar CNPJ</Label>
            <Input
              id="cnpj-validate"
              placeholder="Digite CNPJ com ou sem máscara"
              value={inputToValidate}
              onChange={(event) => setInputToValidate(event.target.value)}
            />
            {validation !== null && (
              <p
                className={`mt-1 text-xs ${validation ? 'text-emerald-600' : 'text-rose-600'}`}
              >
                {validation ? 'CNPJ válido.' : 'CNPJ inválido.'}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setResult(generateCnpjBatch(quantity, masked))}
            >
              Gerar
            </Button>
            <Button variant="outline" onClick={generateExample}>
              Gerar exemplo
            </Button>
            <Button variant="ghost" onClick={clear}>
              Limpar
            </Button>
          </div>
        </InputPanel>

        <OutputPanel>
          <div className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg border border-surface-border bg-surface-muted p-3 text-sm">
            {result.length ? result.join('\n') : 'Nenhum CNPJ gerado ainda.'}
          </div>
          <div className="flex gap-2">
            <CopyButton value={result.join('\n')} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadText(result.join('\n'), 'cnpjs.txt')}
              disabled={result.length === 0}
            >
              Baixar
            </Button>
          </div>
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
