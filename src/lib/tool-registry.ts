import { ToolCategory, ToolDefinition } from '@/types/tools';

export const toolDefinitions: ToolDefinition[] = [
    {
        slug: 'cpf-generator',
        name: 'Gerador de CPF',
        description: 'Gera e valida CPFs com ou sem formatação.',
        category: 'Identidade',
        keywords: ['cpf', 'documento', 'validar', 'gerar'],
        path: '/tools/cpf-generator',
        examples: ['123.456.789-09', '52998224725'],
    },
    {
        slug: 'cnpj-generator',
        name: 'Gerador de CNPJ',
        description: 'Gera e valida CNPJs com ou sem formatação.',
        category: 'Identidade',
        keywords: ['cnpj', 'empresa', 'validar', 'gerar'],
        path: '/tools/cnpj-generator',
        examples: ['12.345.678/0001-90', '11222333000181'],
    },
    {
        slug: 'hash-generator',
        name: 'Hash Generator',
        description:
            'Gera hashes MD5, SHA-1, SHA-256 e SHA-512 a partir de qualquer texto.',
        category: 'Segurança',
        keywords: ['hash', 'sha256', 'md5', 'checksum'],
        path: '/tools/hash-generator',
        examples: ['hello world'],
    },
    {
        slug: 'uuid-generator',
        name: 'UUID / ULID Generator',
        description: 'Gera UUID v4 e ULID em lote.',
        category: 'DevTools',
        keywords: ['uuid', 'ulid', 'id', 'gerador'],
        path: '/tools/uuid-generator',
        examples: ['10 IDs'],
    },
    {
        slug: 'lorem-ipsum',
        name: 'Lorem Ipsum',
        description: 'Gera palavras, frases e parágrafos.',
        category: 'Texto',
        keywords: ['lorem', 'texto', 'mock', 'conteúdo'],
        path: '/tools/lorem-ipsum',
        examples: ['5 parágrafos'],
    },
    {
        slug: 'jwt-tool',
        name: 'JWT Encoder/Decoder',
        description:
            'Assina, verifica e decodifica tokens JWT com suporte a HS256 e HS512.',
        category: 'Segurança',
        keywords: ['jwt', 'token', 'auth', 'hs256'],
        path: '/tools/jwt-tool',
        examples: ['eyJhbGciOiJIUzI1NiJ9...'],
    },
    {
        slug: 'base64-tool',
        name: 'Base64 Encode/Decode',
        description:
            'Codifica e decodifica texto em Base64 com suporte a modo URL-safe.',
        category: 'Encoding',
        keywords: ['base64', 'utf-8', 'url-safe'],
        path: '/tools/base64-tool',
        examples: ['SGVsbG8='],
    },
    {
        slug: 'link-shortener',
        name: 'Encurtador de Links',
        description:
            'Encurta URLs com slug personalizado e redirecionamento automático.',
        category: 'DevTools',
        keywords: ['shortener', 'url', 'slug', 'redirect'],
        path: '/tools/link-shortener',
        examples: ['https://example.com'],
    },
    {
        slug: 'json-formatter',
        name: 'Formatador de JSON',
        description: 'Valida, formata, minifica e ordena chaves.',
        category: 'DevTools',
        keywords: ['json', 'formatter', 'parse', 'minify'],
        path: '/tools/json-formatter',
        examples: ['{"a":1,"b":2}'],
    },
    {
        slug: 'sql-formatter',
        name: 'Formatador de SQL',
        description:
            'Formata consultas SQL com suporte a PostgreSQL, MySQL e SQLite.',
        category: 'DevTools',
        keywords: ['sql', 'formatter', 'postgres', 'mysql'],
        path: '/tools/sql-formatter',
        examples: ['select * from users'],
    },
    {
        slug: 'css-unit-converter',
        name: 'Conversor de Unidades CSS',
        description: 'Converte unidades CSS como px, rem, em, %, vw e vh.',
        category: 'DevTools',
        keywords: ['css', 'units', 'px', 'rem'],
        path: '/tools/css-unit-converter',
        examples: ['16px -> 1rem'],
    },
    {
        slug: 'regex-tester',
        name: 'Testador de Regex',
        description:
            'Testa expressões regulares em tempo real com highlight de grupos.',
        category: 'DevTools',
        keywords: ['regex', 'match', 'groups', 'flags'],
        path: '/tools/regex-tester',
        examples: ['/(foo|bar)/gi'],
    },
    {
        slug: 'text-diff',
        name: 'Comparação de Texto',
        description: 'Diff inline e lado a lado com cópia.',
        category: 'Texto',
        keywords: ['diff', 'compare', 'texto', 'patch'],
        path: '/tools/text-diff',
        examples: ['versão A vs B'],
    },
    {
        slug: 'markdown-viewer',
        name: 'Visualizador Markdown',
        description: 'Preview seguro com highlight de código.',
        category: 'Texto',
        keywords: ['markdown', 'preview', 'md', 'xss'],
        path: '/tools/markdown-viewer',
        examples: ['# Título'],
    },
    {
        slug: 'color-converter',
        name: 'Conversor de Cor',
        description: 'Converte HEX, RGB, HSL e HSV.',
        category: 'Cores',
        keywords: ['hex', 'rgb', 'hsl', 'hsv'],
        path: '/tools/color-converter',
        examples: ['#ff9900'],
    },
    {
        slug: 'image-compressor',
        name: 'Editor de Imagens',
        description:
            'Redimensione, converta e comprima imagens PNG, JPEG, WebP e GIF.',
        category: 'Arquivos',
        keywords: ['image', 'compress', 'jimp', 'webp'],
        path: '/tools/image-compressor',
        examples: ['Redimensionar 1920x1080', 'PNG para WEBP'],
    },
    {
        slug: 'pdf-compressor',
        name: 'Compressão de PDFs',
        description:
            'Reduz o tamanho de arquivos PDF mantendo a qualidade visual.',
        category: 'Arquivos',
        keywords: ['pdf', 'compress', 'pdf-lib', 'optimize'],
        path: '/tools/pdf-compressor',
        examples: ['Arquivo de 5MB'],
    },
    {
        slug: 'name-generator',
        name: 'Gerador de Nomes',
        description: 'Gera listas de nomes aleatórios para testes e mockups.',
        category: 'Texto',
        keywords: ['nomes', 'mock', 'teste', 'gerador'],
        path: '/tools/name-generator',
        examples: ['20 nomes brasileiros'],
    },
    {
        slug: 'password-generator',
        name: 'Gerador de Senhas',
        description: 'Gera senhas fortes com regras configuráveis.',
        category: 'Segurança',
        keywords: ['senha', 'password', 'security', 'random'],
        path: '/tools/password-generator',
        examples: ['16 caracteres'],
    },
    {
        slug: 'my-ip',
        name: 'Meu IP',
        description: 'Exibe seu endereço IP público visto pelo servidor.',
        category: 'DevTools',
        keywords: ['ip', 'network', 'proxy', 'headers'],
        path: '/tools/my-ip',
        examples: ['x-forwarded-for'],
    },
    {
        slug: 'qr-code-generator',
        name: 'Gerador de QR Code',
        description: 'Gera QR Code a partir de texto ou URL.',
        category: 'DevTools',
        keywords: ['qr', 'qrcode', 'url', 'texto'],
        path: '/tools/qr-code-generator',
        examples: ['https://example.com'],
    },
    {
        slug: 'remove-accents',
        name: 'Remover Acentos',
        description: 'Remove acentuação e diacríticos de um texto.',
        category: 'Texto',
        keywords: ['acentos', 'diacríticos', 'normalize', 'texto'],
        path: '/tools/remove-accents',
        examples: ['ação -> acao'],
    },
    {
        slug: 'text-case-converter',
        name: 'Conversor de Maiúsculas e Minúsculas',
        description: 'Converte o texto para diferentes estilos de caixa.',
        category: 'Texto',
        keywords: ['case', 'uppercase', 'lowercase', 'title'],
        path: '/tools/text-case-converter',
        examples: ['Título, sentença, inverter'],
    },
    {
        slug: 'text-counter',
        name: 'Contador de Palavras e Caracteres',
        description: 'Conta palavras, linhas, parágrafos e caracteres.',
        category: 'Texto',
        keywords: ['contador', 'palavras', 'caracteres', 'linhas'],
        path: '/tools/text-counter',
        examples: ['1000 palavras'],
    },
    {
        slug: 'days-between-dates',
        name: 'Contador de Dias entre Datas',
        description: 'Calcula a diferença em dias entre duas datas.',
        category: 'Datas',
        keywords: ['datas', 'diferença', 'dias', 'calcular'],
        path: '/tools/days-between-dates',
        examples: ['2026-01-01 até 2026-03-01'],
    },
    {
        slug: 'add-days-to-date',
        name: 'Somar Dias em Data',
        description: 'Soma uma quantidade de dias a uma data base.',
        category: 'Datas',
        keywords: ['datas', 'somar', 'prazo', 'vencimento'],
        path: '/tools/add-days-to-date',
        examples: ['+30 dias'],
    },
    {
        slug: 'subtract-dates',
        name: 'Subtrair Dias em Data',
        description: 'Subtrai uma quantidade de dias de uma data base.',
        category: 'Datas',
        keywords: ['datas', 'subtrair', 'dias', 'prazo'],
        path: '/tools/subtract-dates',
        examples: ['-15 dias'],
    },
    {
        slug: 'sort-dedupe-list',
        name: 'Ordenar e Desduplicar Lista',
        description: 'Ordena itens e remove duplicatas de listas de texto.',
        category: 'Texto',
        keywords: ['sort', 'dedupe', 'lista', 'ordenar'],
        path: '/tools/sort-dedupe-list',
        examples: ['banana, maçã, banana'],
    },
];

export const categories = [
    'Identidade',
    'Texto',
    'Datas',
    'Segurança',
    'Encoding',
    'DevTools',
    'Arquivos',
    'Cores',
] as const;

export function getToolCategories(tool: ToolDefinition): ToolCategory[] {
    if (Array.isArray(tool.category)) {
        return Array.from(new Set(tool.category));
    }

    return [tool.category];
}

export const toolsBySlug = new Map(
    toolDefinitions.map((tool) => [tool.slug, tool] as const),
);

export const toolsByPath = new Map(
    toolDefinitions.map((tool) => [tool.path, tool] as const),
);

export const toolsByCategory = categories.map((category) => ({
    category,
    tools: toolDefinitions.filter((tool) =>
        getToolCategories(tool).includes(category),
    ),
}));

export function getToolBySlug(slug: string) {
    return toolsBySlug.get(slug);
}
