'use client';

import { useState } from 'react';
import { addDaysToDate, formatDatePtBr } from '@/lib/tools/date';
import { getToolBySlug } from '@/lib/tool-registry';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { Input } from '@/components/ui/input';
import { InputPanel } from '@/components/ui/input-panel';
import { Label } from '@/components/ui/label';
import { OutputPanel } from '@/components/ui/output-panel';
import { ToolLayout } from '@/components/ui/tool-layout';

const meta = getToolBySlug('add-days-to-date');

export function AddDaysToDateTool() {
  const [date, setDate] = useState('2026-03-05');
  const [amount, setAmount] = useState(30);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  if (!meta) return null;

  function calculate() {
    try {
      const nextDate = addDaysToDate(date, amount);
      setResult(formatDatePtBr(nextDate));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao somar dias.');
      setResult('');
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
            <Label htmlFor="add-days-date">Data base</Label>
            <Input
              id="add-days-date"
              type="date"
              className="min-w-0"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="add-days-amount">Quantidade de dias</Label>
            <Input
              id="add-days-amount"
              type="number"
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value || 0))}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={calculate}>Somar dias</Button>
            <Button
              variant="outline"
              onClick={() => {
                setDate('2026-12-20');
                setAmount(15);
              }}
            >
              Gerar exemplo
            </Button>
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
        </InputPanel>

        <OutputPanel>
          <div className="space-y-2 text-sm">
            <p>{result ? `Nova data: ${result}` : 'Nenhum cálculo executado.'}</p>
            <CopyButton value={result} label="Copiar data" />
          </div>
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
