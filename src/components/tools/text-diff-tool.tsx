'use client';

import { useMemo, useState } from 'react';
import { buildPatch, buildSideBySideDiff } from '@/lib/tools/text-diff';
import { getToolBySlug } from '@/lib/tool-registry';
import { downloadText } from '@/lib/utils/download';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { InputPanel } from '@/components/ui/input-panel';
import { OutputPanel } from '@/components/ui/output-panel';
import { Textarea } from '@/components/ui/textarea';
import { ToolLayout } from '@/components/ui/tool-layout';

const meta = getToolBySlug('text-diff');

export function TextDiffTool() {
  const [left, setLeft] = useState('linha 1\nlinha antiga\nlinha 3');
  const [right, setRight] = useState('linha 1\nlinha nova\nlinha 3\nlinha 4');

  const sideBySide = useMemo(
    () => buildSideBySideDiff(left, right),
    [left, right],
  );
  const patch = useMemo(() => buildPatch(left, right), [left, right]);

  function clear() {
    setLeft('');
    setRight('');
  }

  function sample() {
    setLeft(
      'const total = price * amount;\nconsole.log(total);\nreturn total;',
    );
    setRight(
      'const total = price * qty;\nif (total > 0) {\n  console.log(total);\n}\nreturn total;',
    );
  }

  if (!meta) return null;

  return (
    <ToolLayout
      title={meta.name}
      description={meta.description}
      examples={meta.examples}
    >
      <div className="space-y-4">
        <InputPanel>
          <div className="grid gap-3 lg:grid-cols-2">
            <div>
              <p className="mb-1 text-sm font-medium">Texto A</p>
              <Textarea
                className="min-h-[180px] font-mono"
                value={left}
                onChange={(event) => setLeft(event.target.value)}
              />
            </div>
            <div>
              <p className="mb-1 text-sm font-medium">Texto B</p>
              <Textarea
                className="min-h-[180px] font-mono"
                value={right}
                onChange={(event) => setRight(event.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={sample}>
              Gerar exemplo
            </Button>
            <Button variant="ghost" onClick={clear}>
              Limpar
            </Button>
          </div>
        </InputPanel>

        <OutputPanel>
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="overflow-hidden rounded-lg border border-surface-border bg-surface-muted/60">
              <p className="border-b border-surface-border bg-surface px-3 py-2 text-xs font-semibold uppercase">
                Texto A
              </p>
              <div className="max-h-96 overflow-auto font-mono text-xs leading-6">
                {sideBySide.map((line) => (
                  <div
                    key={`${line.key}-left`}
                    className={cn(
                      'min-h-6 whitespace-pre-wrap px-3',
                      line.leftType === 'removed' &&
                        'bg-rose-200/80 text-rose-900 dark:bg-rose-900/50 dark:text-rose-100',
                    )}
                  >
                    {line.left || ' '}
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-surface-border bg-surface-muted/60">
              <p className="border-b border-surface-border bg-surface px-3 py-2 text-xs font-semibold uppercase">
                Texto B
              </p>
              <div className="max-h-96 overflow-auto font-mono text-xs leading-6">
                {sideBySide.map((line) => (
                  <div
                    key={`${line.key}-right`}
                    className={cn(
                      'min-h-6 whitespace-pre-wrap px-3',
                      line.rightType === 'added' &&
                        'bg-emerald-200/80 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-100',
                    )}
                  >
                    {line.right || ' '}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <CopyButton value={patch} label="Copiar diff" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadText(patch, 'diff.patch')}
            >
              Baixar diff
            </Button>
          </div>
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
