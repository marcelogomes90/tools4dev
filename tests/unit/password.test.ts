import { describe, expect, it } from 'vitest';
import { generatePassword, generatePasswordBatch } from '@/lib/tools/password';

describe('password generator', () => {
    it('generates password with expected length and charset groups', () => {
        const password = generatePassword({
            length: 20,
            uppercase: true,
            lowercase: true,
            numbers: true,
            symbols: true,
            avoidAmbiguous: true,
        });

        expect(password).toHaveLength(20);
        expect(/[A-Z]/.test(password)).toBe(true);
        expect(/[a-z]/.test(password)).toBe(true);
        expect(/[0-9]/.test(password)).toBe(true);
        expect(/[!@#$%&*()\-_=+\[\]{};:,.?/]/.test(password)).toBe(true);
    });

    it('throws when no character group is selected', () => {
        expect(() =>
            generatePassword({
                length: 16,
                uppercase: false,
                lowercase: false,
                numbers: false,
                symbols: false,
                avoidAmbiguous: true,
            }),
        ).toThrow('Selecione ao menos um grupo de caracteres.');
    });

    it('clamps generated length between 4 and 128', () => {
        const small = generatePassword({
            length: 1,
            uppercase: true,
            lowercase: false,
            numbers: false,
            symbols: false,
            avoidAmbiguous: true,
        });
        const large = generatePassword({
            length: 999,
            uppercase: false,
            lowercase: true,
            numbers: false,
            symbols: false,
            avoidAmbiguous: true,
        });

        expect(small.length).toBe(4);
        expect(large.length).toBe(128);
    });

    it('respects avoidAmbiguous for number-only passwords', () => {
        const value = generatePassword({
            length: 64,
            uppercase: false,
            lowercase: false,
            numbers: true,
            symbols: false,
            avoidAmbiguous: true,
        });

        expect(/[01]/.test(value)).toBe(false);
        expect(/^[23456789]+$/.test(value)).toBe(true);
    });

    it('generates batch with amount clamped between 1 and 100', () => {
        const min = generatePasswordBatch(0, {
            length: 12,
            uppercase: true,
            lowercase: true,
            numbers: true,
            symbols: false,
            avoidAmbiguous: false,
        });

        const max = generatePasswordBatch(999, {
            length: 12,
            uppercase: true,
            lowercase: true,
            numbers: true,
            symbols: false,
            avoidAmbiguous: false,
        });

        expect(min).toHaveLength(1);
        expect(max).toHaveLength(100);
        expect(max.every((item) => item.length === 12)).toBe(true);
    });
});
