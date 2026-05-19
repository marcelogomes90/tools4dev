import { describe, expect, it } from 'vitest';
import { generateCpf, isValidCpf } from '@/lib/tools/cpf';
import { formatCnpj, generateCnpj, isValidCnpj } from '@/lib/tools/cnpj';

describe('CPF/CNPJ validators', () => {
    it('validates known CPF values', () => {
        expect(isValidCpf('529.982.247-25')).toBe(true);
        expect(isValidCpf('123.456.789-00')).toBe(false);
    });

    it('generates valid CPF values', () => {
        const cpf = generateCpf(false);
        expect(isValidCpf(cpf)).toBe(true);
    });

    it('validates known CNPJ values', () => {
        expect(isValidCnpj('04.252.011/0001-10')).toBe(true);
        expect(isValidCnpj('11.111.111/1111-11')).toBe(false);
    });

    it('validates alphanumeric CNPJ values', () => {
        expect(isValidCnpj('12.ABC.345/01DE-35')).toBe(true);
        expect(isValidCnpj('12.abc.345/01de-35')).toBe(true);
        expect(isValidCnpj('12.ABC.345/01DE-34')).toBe(false);
    });

    it('requires numeric verifier digits for alphanumeric CNPJ values', () => {
        expect(isValidCnpj('12.ABC.345/01DE-A5')).toBe(false);
        expect(isValidCnpj('12.ABC.345/01DE-3A')).toBe(false);
    });

    it('formats alphanumeric CNPJ values', () => {
        expect(formatCnpj('12abc34501de35')).toBe('12.ABC.345/01DE-35');
    });

    it('generates valid CNPJ values', () => {
        const cnpj = generateCnpj(false);
        expect(isValidCnpj(cnpj)).toBe(true);
    });

    it('generates valid alphanumeric CNPJ values', () => {
        const cnpj = generateCnpj(false, 'alphanumeric');
        expect(isValidCnpj(cnpj)).toBe(true);
        expect(cnpj).toMatch(/^[A-Z0-9]{12}\d{2}$/);
        expect(cnpj).toMatch(/[A-Z]/);
    });
});
