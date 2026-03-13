import { fakerEN, fakerPT_BR } from '@faker-js/faker';

type NameLocale = 'pt-BR' | 'en';

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, Math.floor(value)));
}

function fakerFromLocale(locale: NameLocale) {
    return locale === 'pt-BR' ? fakerPT_BR : fakerEN;
}

function generateOne(locale: NameLocale, withMiddleName: boolean) {
    const faker = fakerFromLocale(locale);

    const first = faker.person.firstName();
    const last = faker.person.lastName();

    if (!withMiddleName) {
        return `${first} ${last}`;
    }

    const middle = faker.person.lastName();
    return `${first} ${middle} ${last}`;
}

export function generateNames(
    amount: number,
    withMiddleName: boolean,
    locale: NameLocale = 'pt-BR',
) {
    const safeAmount = clamp(amount, 1, 200);

    return Array.from({ length: safeAmount }, () =>
        generateOne(locale, withMiddleName),
    );
}
