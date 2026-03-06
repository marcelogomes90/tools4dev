import type { LucideProps, LucideIcon } from 'lucide-react';
import { createElement } from 'react';
import {
  Binary,
  CalendarDays,
  Diff,
  FileArchive,
  FileCode2,
  FileJson,
  FileSearch,
  FileType2,
  Fingerprint,
  Globe2,
  Hash,
  Heading,
  IdCard,
  ImageIcon,
  KeyRound,
  Link2,
  ListChecks,
  ListOrdered,
  Palette,
  QrCode,
  Regex,
  ScanLine,
  ShieldCheck,
  Signature,
  Sparkles,
  SwatchBook,
  Text,
  TextSearch,
  TimerReset,
  Type,
} from 'lucide-react';

const fallbackToolIcon: LucideIcon = Sparkles;
const fallbackCategoryIcon: LucideIcon = Sparkles;

const categoryIconMap: Record<string, LucideIcon> = {
  Identidade: IdCard,
  Texto: FileType2,
  Datas: CalendarDays,
  Seguranca: ShieldCheck,
  Segurança: ShieldCheck,
  Encoding: Binary,
  DevTools: FileCode2,
  Arquivos: FileArchive,
  Cores: Palette,
};

const toolIconMap: Record<string, LucideIcon> = {
  'cpf-generator': Fingerprint,
  'cnpj-generator': Signature,
  'hash-generator': Hash,
  'uuid-generator': KeyRound,
  'lorem-ipsum': Heading,
  'jwt-tool': ShieldCheck,
  'base64-tool': Binary,
  'link-shortener': Link2,
  'json-formatter': FileJson,
  'sql-formatter': FileSearch,
  'css-unit-converter': SwatchBook,
  'regex-tester': Regex,
  'text-diff': Diff,
  'markdown-viewer': FileType2,
  'color-converter': Palette,
  'image-compressor': ImageIcon,
  'pdf-compressor': FileArchive,
  'name-generator': Text,
  'password-generator': KeyRound,
  'my-ip': Globe2,
  'qr-code-generator': QrCode,
  'remove-accents': Type,
  'text-case-converter': TextSearch,
  'text-counter': ListChecks,
  'days-between-dates': CalendarDays,
  'add-days-to-date': TimerReset,
  'subtract-dates': ScanLine,
  'sort-dedupe-list': ListOrdered,
};

export function getCategoryIcon(category: string): LucideIcon {
  return categoryIconMap[category] ?? fallbackCategoryIcon;
}

export function getToolIcon(slug: string): LucideIcon {
  return toolIconMap[slug] ?? fallbackToolIcon;
}

export function CategoryIcon({
  category,
  ...props
}: { category: string } & LucideProps) {
  return createElement(getCategoryIcon(category), props);
}

export function ToolIcon({
  slug,
  ...props
}: { slug: string } & LucideProps) {
  return createElement(getToolIcon(slug), props);
}
