interface FormatJsonOptions {
    indent: 2 | 4;
    sortKeys: boolean;
    minify: boolean;
}

function sortRecursively(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(sortRecursively);

    if (value && typeof value === 'object') {
        const obj = value as Record<string, unknown>;
        return Object.keys(obj)
            .sort((a, b) => a.localeCompare(b))
            .reduce<Record<string, unknown>>((acc, key) => {
                acc[key] = sortRecursively(obj[key]);
                return acc;
            }, {});
    }

    return value;
}

function extractParseHint(error: unknown): string {
    if (!(error instanceof Error)) return 'JSON inválido.';
    const match = error.message.match(/position\s(\d+)/i);
    if (!match) return error.message;
    const position = Number(match[1]);
    return `${error.message}. Erro proximo ao caractere ${position}.`;
}

export function formatJson(input: string, options: FormatJsonOptions) {
    try {
        const parsed = JSON.parse(input);
        const normalized = options.sortKeys ? sortRecursively(parsed) : parsed;
        const output = options.minify
            ? JSON.stringify(normalized)
            : JSON.stringify(normalized, null, options.indent);

        return { ok: true as const, output };
    } catch (error) {
        return { ok: false as const, error: extractParseHint(error) };
    }
}
