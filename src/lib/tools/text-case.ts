export type CaseMode = 'upper' | 'lower' | 'title' | 'sentence' | 'invert';

function capitalizeWord(word: string) {
    if (!word) return '';
    return `${word[0]?.toUpperCase() ?? ''}${word.slice(1).toLowerCase()}`;
}

export function convertTextCase(value: string, mode: CaseMode) {
    if (mode === 'upper') return value.toUpperCase();
    if (mode === 'lower') return value.toLowerCase();

    if (mode === 'title') {
        return value
            .split(/(\s+)/)
            .map((chunk) => {
                if (/^\s+$/.test(chunk)) return chunk;
                return chunk.split('-').map(capitalizeWord).join('-');
            })
            .join('');
    }

    if (mode === 'sentence') {
        const normalized = value.toLowerCase();
        return normalized.replace(
            /(^\s*[a-zà-ÿ])|([.!?]\s+[a-zà-ÿ])/gim,
            (part) => part.toUpperCase(),
        );
    }

    return value
        .split('')
        .map((char) => {
            const upper = char.toUpperCase();
            const lower = char.toLowerCase();
            if (char === upper && char !== lower) return lower;
            if (char === lower && char !== upper) return upper;
            return char;
        })
        .join('');
}
