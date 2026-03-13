import { describe, expect, it } from 'vitest';
import { generateCpf, isValidCpf } from '@/lib/tools/cpf';
import { generateCnpj, isValidCnpj } from '@/lib/tools/cnpj';

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

    it('generates valid CNPJ values', () => {
        const cnpj = generateCnpj(false);
        expect(isValidCnpj(cnpj)).toBe(true);
    });
});
