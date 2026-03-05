'use client';

import { useMemo, useState } from 'react';
import { countTextStats } from '@/lib/tools/text-counter';
import { getToolBySlug } from '@/lib/tool-registry';
import { Button } from '@/components/ui/button';
import { InputPanel } from '@/components/ui/input-panel';
import { OutputPanel } from '@/components/ui/output-panel';
import { Textarea } from '@/components/ui/textarea';
import { ToolLayout } from '@/components/ui/tool-layout';

const meta = getToolBySlug('text-counter');

export function TextCounterTool() {
  const [input, setInput] = useState('Digite seu texto aqui para contar palavras e caracteres.');
  const stats = useMemo(() => countTextStats(input), [input]);

  if (!meta) return null;

  return (
    <ToolLayout
      title={meta.name}
      description={meta.description}
      examples={meta.examples}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <InputPanel>
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="min-h-[280px]"
            placeholder="Cole ou digite o texto"
          />
          <div className="flex justify-end">
            <Button variant="ghost" onClick={() => setInput('')}>
              Limpar
            </Button>
          </div>
        </InputPanel>

        <OutputPanel>
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="rounded-lg border border-surface-border bg-surface-muted p-3">
              <p className="text-xs text-slate-600 dark:text-slate-400">Palavras</p>
              <p className="text-2xl font-semibold">{stats.words}</p>
            </div>
            <div className="rounded-lg border border-surface-border bg-surface-muted p-3">
              <p className="text-xs text-slate-600 dark:text-slate-400">Caracteres (c/ espaço)</p>
              <p className="text-2xl font-semibold">{stats.charactersWithSpaces}</p>
            </div>
            <div className="rounded-lg border border-surface-border bg-surface-muted p-3">
              <p className="text-xs text-slate-600 dark:text-slate-400">Caracteres (s/ espaço)</p>
              <p className="text-2xl font-semibold">{stats.charactersWithoutSpaces}</p>
            </div>
            <div className="rounded-lg border border-surface-border bg-surface-muted p-3">
              <p className="text-xs text-slate-600 dark:text-slate-400">Linhas</p>
              <p className="text-2xl font-semibold">{stats.lines}</p>
            </div>
          </div>
          <div className="rounded-lg border border-surface-border bg-surface-muted p-3 text-sm">
            <p>
              <strong>Parágrafos:</strong> {stats.paragraphs}
            </p>
          </div>
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
