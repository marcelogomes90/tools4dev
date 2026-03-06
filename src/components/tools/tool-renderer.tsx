'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

interface ToolRendererProps {
  slug: string;
}

const map: Record<string, ComponentType> = {
  'cpf-generator': dynamic(() =>
    import('./cpf-tool').then((module) => module.CpfTool),
  ),
  'cnpj-generator': dynamic(() =>
    import('./cnpj-tool').then((module) => module.CnpjTool),
  ),
  'hash-generator': dynamic(() =>
    import('./hash-tool').then((module) => module.HashTool),
  ),
  'uuid-generator': dynamic(() =>
    import('./uuid-tool').then((module) => module.UuidTool),
  ),
  'lorem-ipsum': dynamic(() =>
    import('./lorem-tool').then((module) => module.LoremTool),
  ),
  'jwt-tool': dynamic(() =>
    import('./jwt-tool').then((module) => module.JwtTool),
  ),
  'base64-tool': dynamic(() =>
    import('./base64-tool').then((module) => module.Base64Tool),
  ),
  'link-shortener': dynamic(() =>
    import('./link-shortener-tool').then((module) => module.LinkShortenerTool),
  ),
  'json-formatter': dynamic(() =>
    import('./json-formatter-tool').then((module) => module.JsonFormatterTool),
  ),
  'sql-formatter': dynamic(() =>
    import('./sql-formatter-tool').then((module) => module.SqlFormatterTool),
  ),
  'css-unit-converter': dynamic(() =>
    import('./css-unit-converter-tool').then(
      (module) => module.CssUnitConverterTool,
    ),
  ),
  'regex-tester': dynamic(() =>
    import('./regex-tester-tool').then((module) => module.RegexTesterTool),
  ),
  'text-diff': dynamic(() =>
    import('./text-diff-tool').then((module) => module.TextDiffTool),
  ),
  'markdown-viewer': dynamic(() =>
    import('./markdown-viewer-tool').then((module) => module.MarkdownViewerTool),
  ),
  'color-converter': dynamic(() =>
    import('./color-converter-tool').then(
      (module) => module.ColorConverterTool,
    ),
  ),
  'image-compressor': dynamic(() =>
    import('./image-compressor-tool').then(
      (module) => module.ImageCompressorTool,
    ),
  ),
  'pdf-compressor': dynamic(() =>
    import('./pdf-compressor-tool').then((module) => module.PdfCompressorTool),
  ),
  'name-generator': dynamic(() =>
    import('./name-generator-tool').then((module) => module.NameGeneratorTool),
  ),
  'password-generator': dynamic(() =>
    import('./password-generator-tool').then(
      (module) => module.PasswordGeneratorTool,
    ),
  ),
  'my-ip': dynamic(() =>
    import('./my-ip-tool').then((module) => module.MyIpTool),
  ),
  'qr-code-generator': dynamic(() =>
    import('./qr-code-generator-tool').then(
      (module) => module.QrCodeGeneratorTool,
    ),
  ),
  'remove-accents': dynamic(() =>
    import('./remove-accents-tool').then((module) => module.RemoveAccentsTool),
  ),
  'text-case-converter': dynamic(() =>
    import('./text-case-converter-tool').then(
      (module) => module.TextCaseConverterTool,
    ),
  ),
  'text-counter': dynamic(() =>
    import('./text-counter-tool').then((module) => module.TextCounterTool),
  ),
  'days-between-dates': dynamic(() =>
    import('./days-between-dates-tool').then(
      (module) => module.DaysBetweenDatesTool,
    ),
  ),
  'add-days-to-date': dynamic(() =>
    import('./add-days-to-date-tool').then((module) => module.AddDaysToDateTool),
  ),
  'subtract-dates': dynamic(() =>
    import('./subtract-dates-tool').then((module) => module.SubtractDatesTool),
  ),
  'sort-dedupe-list': dynamic(() =>
    import('./sort-dedupe-list-tool').then((module) => module.SortDedupeListTool),
  ),
};

export function ToolRenderer({ slug }: ToolRendererProps) {
  const ToolComponent = map[slug];

  if (!ToolComponent) {
    return (
      <div className="rounded-xl border border-dashed border-surface-border p-6 text-sm">
        Ferramenta não encontrada para o slug informado.
      </div>
    );
  }

  return <ToolComponent />;
}
