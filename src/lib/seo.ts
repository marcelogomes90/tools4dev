import type { ToolDefinition } from '@/types/tools';

export const SITE_NAME = 'tools4dev';
export const SITE_DESCRIPTION =
  'Suite de ferramentas para desenvolvimento: formatadores, geradores, segurança, utilitários de texto e arquivos.';
const SITE_URL_ENV_KEYS = [
  'NEXT_PUBLIC_APP_URL',
  'SITE_URL',
  'APP_URL',
  'VERCEL_PROJECT_PRODUCTION_URL',
  'VERCEL_URL',
] as const;
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
const HOME_LONG_TAIL_KEYWORDS = [
  'ferramentas online para programadores',
  'ferramentas para desenvolvedores web',
  'devtools online sem instalar',
  'ferramentas de programação grátis no navegador',
  'utilitários para desenvolvimento frontend e backend',
  'formatador json online grátis',
  'formatador sql online grátis',
  'gerador de senha forte online',
  'testador regex online',
  'decodificador jwt online',
  'conversor base64 online',
  'compressor de pdf online',
  'compressor de imagem online',
];
const TOOL_LONG_TAIL_KEYWORDS: Record<string, string[]> = {
  'cpf-generator': [
    'gerador de cpf válido online',
    'validar cpf online grátis',
    'gerar cpf com máscara',
  ],
  'cnpj-generator': [
    'gerador de cnpj válido online',
    'validar cnpj online grátis',
    'gerar cnpj com máscara',
  ],
  'hash-generator': [
    'gerar hash sha256 online',
    'gerar hash md5 online',
    'checksum hash online',
  ],
  'jwt-tool': [
    'decodificar jwt online',
    'validar token jwt online',
    'gerar jwt hs256 online',
  ],
  'base64-tool': [
    'codificar base64 online',
    'decodificar base64 online',
    'base64 utf-8 online',
  ],
  'json-formatter': [
    'formatar json online grátis',
    'validar json online',
    'minificar json online',
  ],
  'sql-formatter': [
    'formatar sql online grátis',
    'beautify sql online',
    'formatar query sql online',
  ],
  'regex-tester': [
    'testar regex online com grupos',
    'testador de expressão regular online',
    'regex tester com flags',
  ],
  'password-generator': [
    'gerador de senha segura online',
    'criar senha forte aleatória',
    'gerar senha com caracteres especiais',
  ],
  'uuid-generator': [
    'gerador de uuid v4 online',
    'gerar ulid online',
    'gerar ids únicos em lote',
  ],
  'link-shortener': [
    'encurtar url online grátis',
    'gerador de link curto',
    'short url com slug personalizado',
  ],
  'pdf-compressor': [
    'comprimir pdf online grátis',
    'reduzir tamanho de pdf online',
    'otimizar arquivo pdf',
  ],
  'image-compressor': [
    'comprimir imagem online grátis',
    'reduzir tamanho de imagem sem perder qualidade',
    'converter imagem para webp online',
  ],
  'color-converter': [
    'converter hex para rgb online',
    'converter rgb para hsl online',
    'conversor de cores css',
  ],
};
const TOOL_SEO_DESCRIPTION_OVERRIDES: Record<string, string> = {
  'cpf-generator':
    'Gere e valide CPF válido online com ou sem máscara para testes de cadastro, QA e homologação.',
  'cnpj-generator':
    'Gere e valide CNPJ válido online com ou sem máscara para fluxos de cadastro de empresas.',
  'hash-generator':
    'Gere hash MD5, SHA1, SHA256 e SHA512 online para checksum, integridade de arquivos e validação rápida.',
  'uuid-generator':
    'Gere UUID v4 e ULID online em lote para IDs únicos em bancos de dados, APIs e sistemas distribuídos.',
  'lorem-ipsum':
    'Gere Lorem Ipsum online com palavras, frases e parágrafos para prototipação e preenchimento de conteúdo.',
  'jwt-tool':
    'Decodifique, valide, assine e verifique tokens JWT online para debug de autenticação e APIs.',
  'base64-tool':
    'Codifique e decodifique Base64 online com suporte a UTF-8 e URL-safe para integrações e payloads.',
  'link-shortener':
    'Encurte URLs online com slug personalizado e redirecionamento rápido para compartilhamento de links.',
  'json-formatter':
    'Formate, valide, minifique e ordene JSON online para depurar payloads de API com leitura clara.',
  'sql-formatter':
    'Formate SQL online com dialetos configuráveis para melhorar leitura de queries e revisão de código.',
  'css-unit-converter':
    'Converta unidades CSS online entre px, rem, em, %, vw e vh para ajustes responsivos precisos.',
  'regex-tester':
    'Teste regex online com grupos, flags e destaque de matches para validar padrões rapidamente.',
  'text-diff':
    'Compare dois textos online com diff inline e lado a lado para revisar alterações com precisão.',
  'markdown-viewer':
    'Visualize Markdown online com renderização segura e highlight de código para documentação e README.',
  'color-converter':
    'Converta cores online entre HEX, RGB, HSL e HSV para design de interface e desenvolvimento CSS.',
  'image-compressor':
    'Comprima e converta imagens online para reduzir PNG, JPG e WebP mantendo boa qualidade.',
  'pdf-compressor':
    'Comprima PDF online para reduzir tamanho de arquivo e facilitar upload, envio e armazenamento.',
  'name-generator':
    'Gere nomes aleatórios online para testes, seed de dados, mockups e cenários de desenvolvimento.',
  'password-generator':
    'Gere senha forte online com regras de tamanho e caracteres para reforçar segurança de contas.',
  'my-ip':
    'Descubra seu IP público online e visualize headers para diagnóstico de proxy, CDN e infraestrutura.',
  'qr-code-generator':
    'Gere QR Code online a partir de texto ou URL para compartilhar links e informações rapidamente.',
  'remove-accents':
    'Remova acentos e diacríticos online para normalizar texto, criar slug e processar dados.',
  'text-case-converter':
    'Converta texto online para maiúsculas, minúsculas, título e outros formatos de case.',
  'text-counter':
    'Conte palavras, caracteres, linhas e parágrafos online para revisão de texto e limites de conteúdo.',
  'days-between-dates':
    'Calcule a diferença de dias entre datas online para prazos, cronogramas e planejamento.',
  'add-days-to-date':
    'Some dias a uma data online para calcular vencimentos, prazos e datas futuras.',
  'subtract-dates':
    'Subtraia dias de uma data online para calcular datas anteriores e ajustar cronogramas.',
  'sort-dedupe-list':
    'Ordene listas e remova duplicados online para limpar dados de texto com rapidez.',
};
const TOOL_SEO_DESCRIPTION_SUFFIX =
  'Ferramenta online grátis, sem instalação, direto no navegador.';
const TOOL_SEO_DESCRIPTION_MAX_LENGTH = 160;
const TOOL_SEO_DESCRIPTION_SOFT_CUT = 159;
const TOOL_SEO_DESCRIPTION_MIN_WORD_CUT = 140;

function normalizeUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed.replace(/\/+$/, '');
  }

  return `https://${trimmed}`.replace(/\/+$/, '');
}

function readSiteUrlFromEnv() {
  for (const key of SITE_URL_ENV_KEYS) {
    const value = process.env[key];
    if (value?.trim()) return value;
  }

  return '';
}

export function getConfiguredSiteUrl() {
  const normalized = normalizeUrl(readSiteUrlFromEnv());
  return normalized || undefined;
}

export function getPublicSiteUrl() {
  const configured = getConfiguredSiteUrl();
  if (configured) return configured;

  if (process.env.NODE_ENV !== 'production') {
    return 'http://localhost:3000';
  }

  return undefined;
}

export function getSiteUrl() {
  return getPublicSiteUrl() ?? 'http://localhost:3000';
}

export function toAbsoluteSiteUrl(path: string) {
  const siteUrl = getPublicSiteUrl();
  if (!siteUrl) return undefined;

  return new URL(path, `${siteUrl}/`).toString();
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

function ensureTrailingPeriod(text: string) {
  const normalized = text.trim();
  if (!normalized) return '';
  return /[.!?]$/.test(normalized) ? normalized : `${normalized}.`;
}

function clampMetaDescription(text: string) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= TOOL_SEO_DESCRIPTION_MAX_LENGTH) {
    return normalized;
  }

  const provisional = normalized.slice(0, TOOL_SEO_DESCRIPTION_SOFT_CUT);
  const lastWhitespace = provisional.lastIndexOf(' ');
  const cutPosition =
    lastWhitespace >= TOOL_SEO_DESCRIPTION_MIN_WORD_CUT
      ? lastWhitespace
      : TOOL_SEO_DESCRIPTION_SOFT_CUT;

  return `${provisional.slice(0, cutPosition).trimEnd()}...`;
}

export function getHomeSeoKeywords() {
  return dedupeKeywords([...BASE_KEYWORDS, ...HOME_LONG_TAIL_KEYWORDS]);
}

export function getToolSeoTitle(tool: ToolDefinition) {
  return `${tool.name} Online Grátis`;
}

export function getToolSeoDescription(tool: ToolDefinition) {
  const override = TOOL_SEO_DESCRIPTION_OVERRIDES[tool.slug];
  const baseText = ensureTrailingPeriod(override ?? tool.description);
  return clampMetaDescription(`${baseText} ${TOOL_SEO_DESCRIPTION_SUFFIX}`);
}

export function getToolSeoKeywords(tool: ToolDefinition) {
  const name = tool.name.toLowerCase();
  const slugText = tool.slug.replace(/-/g, ' ');
  const keywordLongTail = tool.keywords.flatMap((keyword) => [
    `${keyword} online grátis`,
    `${keyword} para desenvolvedor`,
  ]);
  const categories = (Array.isArray(tool.category) ? tool.category : [tool.category]).map((category) =>
    `${category.toLowerCase()} para desenvolvedor`,
  );
  const categoryLongTail = (Array.isArray(tool.category) ? tool.category : [tool.category]).map((category) =>
    `ferramenta de ${category.toLowerCase()} online`,
  );
  const customLongTail = TOOL_LONG_TAIL_KEYWORDS[tool.slug] ?? [];

  return dedupeKeywords([
    ...tool.keywords,
    `${tool.name} online`,
    `${tool.name} grátis`,
    `${tool.name} gratuito`,
    `${name} online`,
    `${slugText} online`,
    `ferramenta ${slugText}`,
    `${tool.name} sem instalar`,
    `${tool.name} no navegador`,
    `site para ${slugText}`,
    ...keywordLongTail,
    ...categories,
    ...categoryLongTail,
    ...customLongTail,
    ...HOME_LONG_TAIL_KEYWORDS,
    ...BASE_KEYWORDS,
  ]);
}
