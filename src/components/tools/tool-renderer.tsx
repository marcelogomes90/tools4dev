'use client';

import { ComponentType } from 'react';
import { Base64Tool } from './base64-tool';
import { CnpjTool } from './cnpj-tool';
import { ColorConverterTool } from './color-converter-tool';
import { CpfTool } from './cpf-tool';
import { HashTool } from './hash-tool';
import { ImageCompressorTool } from './image-compressor-tool';
import { JsonFormatterTool } from './json-formatter-tool';
import { JwtTool } from './jwt-tool';
import { LinkShortenerTool } from './link-shortener-tool';
import { LoremTool } from './lorem-tool';
import { MarkdownViewerTool } from './markdown-viewer-tool';
import { PdfCompressorTool } from './pdf-compressor-tool';
import { RegexTesterTool } from './regex-tester-tool';
import { SqlFormatterTool } from './sql-formatter-tool';
import { TextDiffTool } from './text-diff-tool';
import { UuidTool } from './uuid-tool';

interface ToolRendererProps {
  slug: string;
}

const map: Record<string, ComponentType> = {
  'cpf-generator': CpfTool,
  'cnpj-generator': CnpjTool,
  'hash-generator': HashTool,
  'uuid-generator': UuidTool,
  'lorem-ipsum': LoremTool,
  'jwt-tool': JwtTool,
  'base64-tool': Base64Tool,
  'link-shortener': LinkShortenerTool,
  'json-formatter': JsonFormatterTool,
  'sql-formatter': SqlFormatterTool,
  'regex-tester': RegexTesterTool,
  'text-diff': TextDiffTool,
  'markdown-viewer': MarkdownViewerTool,
  'color-converter': ColorConverterTool,
  'image-compressor': ImageCompressorTool,
  'pdf-compressor': PdfCompressorTool,
};

export function ToolRenderer({ slug }: ToolRendererProps) {
  const ToolComponent = map[slug];

  if (!ToolComponent) {
    return (
      <div className="rounded-xl border border-dashed border-surface-border p-6 text-sm">
        Ferramenta nao encontrada para o slug informado.
      </div>
    );
  }

  return <ToolComponent />;
}
