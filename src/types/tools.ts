export type ToolCategory =
  | 'Identidade'
  | 'Texto'
  | 'Segurança'
  | 'Encoding'
  | 'DevTools'
  | 'Arquivos'
  | 'Cores';

export interface ToolDefinition {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  keywords: string[];
  path: string;
  examples: string[];
}
