export interface TextStats {
    charactersWithSpaces: number;
    charactersWithoutSpaces: number;
    words: number;
    lines: number;
    paragraphs: number;
}

export function countTextStats(value: string): TextStats {
    const trimmed = value.trim();

    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const lines = value.length ? value.split(/\r?\n/).length : 0;
    const paragraphs = trimmed
        ? value
              .split(/\r?\n\s*\r?\n/g)
              .map((item) => item.trim())
              .filter(Boolean).length
        : 0;

    return {
        charactersWithSpaces: value.length,
        charactersWithoutSpaces: value.replace(/\s/g, '').length,
        words,
        lines,
        paragraphs,
    };
}
