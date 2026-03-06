import type { ToolDefinition } from '@/types/tools';

export const SITE_NAME = 'tools4dev';
export const SITE_DESCRIPTION =
  'Suite de ferramentas para desenvolvimento: formatadores, geradores, segurança, utilitários de texto e arquivos.';
const BASE_KEYWORDS = [
  'ferramentas para desenvolvedores',
  'devtools online',
  'ferramentas online grátis',
  'formatador json',
  'formatador sql',
  'gerador de senha',
  'testador regex',
  'ferramenta jwt',
  'compressor pdf',
  'compressor de imagem',
];

function normalizeUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed.replace(/\/+$/, '');
  }

  return `https://${trimmed}`.replace(/\/+$/, '');
}

export function getSiteUrl() {
  const fromEnv =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    '';

  const normalized = normalizeUrl(fromEnv);
  if (normalized) return normalized;

  return 'http://localhost:3000';
}

function dedupeKeywords(values: string[]) {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const value of values) {
    const normalized = value.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    output.push(value.trim());
  }

  return output;
}

export function getHomeSeoKeywords() {
  return BASE_KEYWORDS;
}

export function getToolSeoTitle(tool: ToolDefinition) {
  return `${tool.name} Online Grátis`;
}

export function getToolSeoDescription(tool: ToolDefinition) {
  return `${tool.description} Ferramenta online grátis, rápida e sem instalação para usar direto no navegador.`;
}

export function getToolSeoKeywords(tool: ToolDefinition) {
  const name = tool.name.toLowerCase();
  const slugText = tool.slug.replace(/-/g, ' ');
  const categories = (Array.isArray(tool.category) ? tool.category : [tool.category]).map((category) =>
    `${category.toLowerCase()} para desenvolvedor`,
  );

  return dedupeKeywords([
    ...tool.keywords,
    `${tool.name} online`,
    `${tool.name} grátis`,
    `${tool.name} gratuito`,
    `${name} online`,
    `${slugText} online`,
    `ferramenta ${slugText}`,
    ...categories,
    ...BASE_KEYWORDS,
  ]);
}
