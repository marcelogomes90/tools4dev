export type CnpjGenerationMode = 'numeric' | 'alphanumeric';

const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const secondWeights = [6, ...firstWeights];
const alphanumericChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const alphaChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function normalizeCnpj(value: string) {
    return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

function charValue(char: string) {
    return char.charCodeAt(0) - 48;
}

function calcDigit(base: string, weights: number[]) {
    const sum = base
        .split('')
        .reduce((acc, char, idx) => acc + charValue(char) * weights[idx], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
}

function randomDigit() {
    return Math.floor(Math.random() * 10);
}

function randomAlphanumericChar() {
    return alphanumericChars[
        Math.floor(Math.random() * alphanumericChars.length)
    ];
}

function randomAlphaChar() {
    return alphaChars[Math.floor(Math.random() * alphaChars.length)];
}

function generateAlphanumericBase() {
    const chars = Array.from({ length: 12 }, () => randomAlphanumericChar());

    if (!chars.some((char) => /[A-Z]/.test(char))) {
        chars[0] = randomAlphaChar();
    }

    return chars.join('');
}

export function isValidCnpj(input: string) {
    const cnpj = normalizeCnpj(input);
    if (cnpj.length !== 14) return false;
    if (!/^[A-Z0-9]{12}\d{2}$/.test(cnpj)) return false;
    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    const first = calcDigit(cnpj.slice(0, 12), firstWeights);
    const second = calcDigit(`${cnpj.slice(0, 12)}${first}`, secondWeights);

    return cnpj === `${cnpj.slice(0, 12)}${first}${second}`;
}

export function formatCnpj(cnpj: string) {
    const normalized = normalizeCnpj(cnpj).slice(0, 14);
    return normalized.replace(
        /^([A-Z0-9]{2})([A-Z0-9]{3})([A-Z0-9]{3})([A-Z0-9]{4})(\d{2})$/,
        '$1.$2.$3/$4-$5',
    );
}

export function generateCnpj(
    masked = true,
    mode: CnpjGenerationMode = 'numeric',
) {
    const base =
        mode === 'alphanumeric'
            ? generateAlphanumericBase()
            : `${Array.from({ length: 8 }, () => randomDigit()).join('')}0001`;
    const first = calcDigit(base, firstWeights);
    const second = calcDigit(`${base}${first}`, secondWeights);
    const cnpj = `${base}${first}${second}`;
    return masked ? formatCnpj(cnpj) : cnpj;
}

export function generateCnpjBatch(
    quantity: number,
    masked = true,
    mode: CnpjGenerationMode = 'numeric',
) {
    const total = Math.min(100, Math.max(1, quantity));
    return Array.from({ length: total }, () => generateCnpj(masked, mode));
}
