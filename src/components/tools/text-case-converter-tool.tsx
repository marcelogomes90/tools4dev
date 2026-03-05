'use client';

import { useState } from 'react';
import { CaseMode, convertTextCase } from '@/lib/tools/text-case';
import { getToolBySlug } from '@/lib/tool-registry';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { InputPanel } from '@/components/ui/input-panel';
import { OutputPanel } from '@/components/ui/output-panel';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ToolLayout } from '@/components/ui/tool-layout';

const meta = getToolBySlug('text-case-converter');

export function TextCaseConverterTool() {
  const [input, setInput] = useState('tools4dev, uma caixa de ferramentas útil.');
  const [mode, setMode] = useState<CaseMode>('title');
  const [output, setOutput] = useState('');

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
            className="min-h-[260px]"
            placeholder="Digite o texto"
          />
          <div>
            <label className="mb-1 block text-sm font-medium">Modo</label>
            <Select
              value={mode}
              onChange={(event) => setMode(event.target.value as CaseMode)}
            >
              <option value="upper">MAIÚSCULAS</option>
              <option value="lower">minúsculas</option>
              <option value="title">Título</option>
              <option value="sentence">Sentença</option>
              <option value="invert">Inverter</option>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setOutput(convertTextCase(input, mode))}>
              Converter
            </Button>
            <Button
              variant="outline"
              onClick={() => setInput('o mercado ABRIU e FECHOU cedo hoje.')}
            >
              Gerar exemplo
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setInput('');
                setOutput('');
              }}
            >
              Limpar
            </Button>
          </div>
        </InputPanel>

        <OutputPanel>
          <Textarea
            readOnly
            value={output}
            className="min-h-[260px]"
            placeholder="Resultado convertido"
          />
          <CopyButton value={output} />
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
