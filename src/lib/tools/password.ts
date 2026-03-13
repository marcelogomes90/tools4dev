export interface PasswordOptions {
    length: number;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
    avoidAmbiguous: boolean;
}

const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const UPPER_WITH_AMBIGUOUS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijkmnopqrstuvwxyz';
const LOWER_WITH_AMBIGUOUS = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '23456789';
const NUMBERS_WITH_AMBIGUOUS = '0123456789';
const SYMBOLS = '!@#$%&*()-_=+[]{};:,.?/';

function pickRandom(max: number) {
    const cryptoApi = globalThis.crypto;

    if (cryptoApi?.getRandomValues) {
        const array = new Uint32Array(1);
        cryptoApi.getRandomValues(array);
        return array[0] % max;
    }

    return Math.floor(Math.random() * max);
}

function shuffle(value: string) {
    const chars = value.split('');

    for (let i = chars.length - 1; i > 0; i -= 1) {
        const j = pickRandom(i + 1);
        [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    return chars.join('');
}

export function generatePassword(options: PasswordOptions) {
    const length = Math.min(128, Math.max(4, Math.floor(options.length)));

    const groups: string[] = [];
    if (options.uppercase) {
        groups.push(options.avoidAmbiguous ? UPPER : UPPER_WITH_AMBIGUOUS);
    }
    if (options.lowercase) {
        groups.push(options.avoidAmbiguous ? LOWER : LOWER_WITH_AMBIGUOUS);
    }
    if (options.numbers) {
        groups.push(options.avoidAmbiguous ? NUMBERS : NUMBERS_WITH_AMBIGUOUS);
    }
    if (options.symbols) {
        groups.push(SYMBOLS);
    }

    if (groups.length === 0) {
        throw new Error('Selecione ao menos um grupo de caracteres.');
    }

    const chars: string[] = [];

    for (const group of groups) {
        chars.push(group[pickRandom(group.length)] as string);
    }

    const fullCharset = groups.join('');

    while (chars.length < length) {
        chars.push(fullCharset[pickRandom(fullCharset.length)] as string);
    }

    return shuffle(chars.join(''));
}

export function generatePasswordBatch(
    amount: number,
    options: PasswordOptions,
) {
    const safeAmount = Math.min(100, Math.max(1, Math.floor(amount)));

    return Array.from({ length: safeAmount }, () => generatePassword(options));
}
