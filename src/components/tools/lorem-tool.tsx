'use client';

import { useState } from 'react';
import { generateLorem } from '@/lib/tools/lorem';
import { downloadText } from '@/lib/utils/download';
import { getToolBySlug } from '@/lib/tool-registry';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { Input } from '@/components/ui/input';
import { InputPanel } from '@/components/ui/input-panel';
import { Label } from '@/components/ui/label';
import { OutputPanel } from '@/components/ui/output-panel';
import { Select } from '@/components/ui/select';
import { ToolLayout } from '@/components/ui/tool-layout';

const meta = getToolBySlug('lorem-ipsum');

export function LoremTool() {
  const [mode, setMode] = useState<'words' | 'sentences' | 'paragraphs'>(
    'paragraphs',
  );
  const [quantity, setQuantity] = useState(3);
  const [language, setLanguage] = useState<'classic' | 'pt' | 'en'>('classic');
  const [result, setResult] = useState('');

  if (!meta) return null;

  function generate() {
    setResult(generateLorem(mode, quantity, language));
  }

  function sample() {
    setMode('sentences');
    setQuantity(5);
    setLanguage('pt');
    setResult(generateLorem('sentences', 5, 'pt'));
  }

  function clear() {
    setResult('');
    setMode('paragraphs');
    setQuantity(3);
    setLanguage('classic');
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
            <Label htmlFor="lorem-mode">Modo</Label>
            <Select
              id="lorem-mode"
              value={mode}
              onChange={(event) =>
                setMode(
                  event.target.value as 'words' | 'sentences' | 'paragraphs',
                )
              }
            >
              <option value="words">Palavras</option>
              <option value="sentences">Frases</option>
              <option value="paragraphs">Paragrafos</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="lorem-quantity">Quantidade</Label>
            <Input
              id="lorem-quantity"
              type="number"
              min={1}
              max={200}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value || 1))}
            />
          </div>
          <div>
            <Label htmlFor="lorem-lang">Idioma</Label>
            <Select
              id="lorem-lang"
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value as 'classic' | 'pt' | 'en')
              }
            >
              <option value="classic">Lorem classico</option>
              <option value="pt">Portugues</option>
              <option value="en">English</option>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={generate}>Gerar</Button>
            <Button variant="outline" onClick={sample}>
              Gerar exemplo
            </Button>
            <Button variant="ghost" onClick={clear}>
              Limpar
            </Button>
          </div>
        </InputPanel>

        <OutputPanel>
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg border border-surface-border bg-surface-muted p-3 text-sm">
            {result || 'Nenhum texto gerado.'}
          </pre>
          <div className="flex gap-2">
            <CopyButton value={result} />
            <Button
              variant="outline"
              size="sm"
              disabled={!result}
              onClick={() => downloadText(result, 'lorem.txt')}
            >
              Baixar
            </Button>
          </div>
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
