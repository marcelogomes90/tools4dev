'use client';

import { useState } from 'react';
import { generateIds } from '@/lib/tools/uuid';
import { downloadText } from '@/lib/utils/download';
import { getToolBySlug } from '@/lib/tool-registry';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { InputPanel } from '@/components/ui/input-panel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OutputPanel } from '@/components/ui/output-panel';
import { Select } from '@/components/ui/select';
import { ToolLayout } from '@/components/ui/tool-layout';

const meta = getToolBySlug('uuid-generator');

export function UuidTool() {
  const [type, setType] = useState<'v4' | 'ulid'>('v4');
  const [amount, setAmount] = useState(10);
  const [result, setResult] = useState<string[]>([]);

  if (!meta) return null;

  function clear() {
    setType('v4');
    setAmount(10);
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
            <Label htmlFor="uuid-type">Formato</Label>
            <Select
              id="uuid-type"
              value={type}
              onChange={(event) => setType(event.target.value as 'v4' | 'ulid')}
            >
              <option value="v4">UUID v4</option>
              <option value="ulid">ULID</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="uuid-amount">Quantidade (1..1000)</Label>
            <Input
              id="uuid-amount"
              type="number"
              min={1}
              max={1000}
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value || 1))}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setResult(generateIds(type, amount))}>
              Gerar
            </Button>
            <Button
              variant="outline"
              onClick={() => setResult(generateIds('v4', 25))}
            >
              Gerar exemplo
            </Button>
            <Button variant="ghost" onClick={clear}>
              Limpar
            </Button>
          </div>
        </InputPanel>

        <OutputPanel>
          <div className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg border border-surface-border bg-surface-muted p-3 font-mono text-xs">
            {result.length ? result.join('\n') : 'Nenhum identificador gerado.'}
          </div>
          <div className="flex gap-2">
            <CopyButton value={result.join('\n')} label="Copiar lista" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadText(result.join('\n'), `ids-${type}.txt`)}
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
