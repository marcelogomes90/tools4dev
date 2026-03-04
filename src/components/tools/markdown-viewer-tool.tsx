'use client';

import hljs from 'highlight.js';
import { marked } from 'marked';
import { useEffect, useRef, useState } from 'react';
import { getToolBySlug } from '@/lib/tool-registry';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { InputPanel } from '@/components/ui/input-panel';
import { OutputPanel } from '@/components/ui/output-panel';
import { Textarea } from '@/components/ui/textarea';
import { ToolLayout } from '@/components/ui/tool-layout';

const meta = getToolBySlug('markdown-viewer');

marked.setOptions({
  gfm: true,
  breaks: false,
});

export function MarkdownViewerTool() {
  const [markdown, setMarkdown] = useState('# Hello Dev\n\n```ts\nconst msg = "Swiss knife";\nconsole.log(msg);\n```');
  const [html, setHtml] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);

  if (!meta) return null;

  useEffect(() => {
    let active = true;

    async function render() {
      const raw = marked.parse(markdown) as string;
      const domPurifyModule = await import('dompurify');
      if (!active) return;
      setHtml(domPurifyModule.default.sanitize(raw));
    }

    render();
    return () => {
      active = false;
    };
  }, [markdown]);

  useEffect(() => {
    if (!previewRef.current) return;
    previewRef.current.querySelectorAll('pre code').forEach((element) => {
      hljs.highlightElement(element as HTMLElement);
    });
  }, [html]);

  function clear() {
    setMarkdown('');
  }

  function sample() {
    setMarkdown(
      '# Titulo H1\n## Titulo H2\n### Titulo H3\n\n- Topico 1\n- Topico 2\n\n1. Item numerado\n2. Segundo item\n\n```sql\nselect * from users;\n```',
    );
  }

  return (
    <ToolLayout title={meta.name} description={meta.description} examples={meta.examples}>
      <div className="grid gap-4 lg:grid-cols-2">
        <InputPanel>
          <Textarea
            className="min-h-[360px] font-mono"
            value={markdown}
            onChange={(event) => setMarkdown(event.target.value)}
            placeholder="Digite markdown"
          />
          <div className="flex gap-2">
            <Button onClick={sample}>Gerar exemplo</Button>
            <Button variant="ghost" onClick={clear}>
              Limpar
            </Button>
          </div>
        </InputPanel>

        <OutputPanel>
          <div
            ref={previewRef}
            className="markdown-preview min-h-[360px] overflow-auto rounded-lg border border-surface-border bg-surface-muted p-4"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <CopyButton value={markdown} label="Copiar markdown" />
        </OutputPanel>
      </div>
    </ToolLayout>
  );
}
