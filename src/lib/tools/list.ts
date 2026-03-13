export interface SortListOptions {
    order: 'asc' | 'desc';
    dedupe: boolean;
    caseSensitive: boolean;
    numeric: boolean;
    removeEmpty: boolean;
}

function normalizeInput(input: string) {
    return input.split(/\r?\n|,/).map((item) => item.trim());
}

export function sortAndDedupeList(input: string, options: SortListOptions) {
    const source = normalizeInput(input);
    const items = options.removeEmpty ? source.filter(Boolean) : source;

    let unique = [...items];

    if (options.dedupe) {
        const seen = new Set<string>();
        unique = [];

        for (const item of items) {
            const key = options.caseSensitive ? item : item.toLowerCase();
            if (seen.has(key)) continue;
            seen.add(key);
            unique.push(item);
        }
    }

    const collator = new Intl.Collator('pt-BR', {
        sensitivity: options.caseSensitive ? 'variant' : 'base',
        numeric: options.numeric,
    });

    unique.sort((a, b) => {
        const value = collator.compare(a, b);
        return options.order === 'asc' ? value : -value;
    });

    return unique;
}
