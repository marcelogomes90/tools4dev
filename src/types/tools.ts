export type ToolCategory =
    | 'Identidade'
    | 'Texto'
    | 'Datas'
    | 'Segurança'
    | 'Encoding'
    | 'DevTools'
    | 'Arquivos'
    | 'Cores';

export interface ToolDefinition {
    slug: string;
    name: string;
    description: string;
    category: ToolCategory | ToolCategory[];
    keywords: string[];
    path: string;
    examples: string[];
}
