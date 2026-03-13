import { describe, expect, it } from 'vitest';
import { convertTextCase } from '@/lib/tools/text-case';

describe('convertTextCase', () => {
    describe('upper', () => {
        it('converts to uppercase', () => {
            expect(convertTextCase('hello world', 'upper')).toBe('HELLO WORLD');
        });

        it('handles accented characters', () => {
            expect(convertTextCase('olá, tudo bem?', 'upper')).toBe(
                'OLÁ, TUDO BEM?',
            );
        });
    });

    describe('lower', () => {
        it('converts to lowercase', () => {
            expect(convertTextCase('HELLO WORLD', 'lower')).toBe('hello world');
        });

        it('handles mixed case', () => {
            expect(convertTextCase('HeLLo WoRLd', 'lower')).toBe('hello world');
        });
    });

    describe('title', () => {
        it('capitalizes each word', () => {
            expect(convertTextCase('hello world', 'title')).toBe('Hello World');
        });

        it('preserves whitespace', () => {
            expect(convertTextCase('  hello   world  ', 'title')).toBe(
                '  Hello   World  ',
            );
        });

        it('handles hyphenated words', () => {
            expect(convertTextCase('well-known fact', 'title')).toBe(
                'Well-Known Fact',
            );
        });
    });

    describe('sentence', () => {
        it('capitalizes first letter of each sentence', () => {
            const input = 'hello world. how are you? i am fine!';
            const result = convertTextCase(input, 'sentence');
            expect(result).toMatch(/^Hello/);
            expect(result).toMatch(/\? I am fine/i);
        });

        it('lowercases the rest', () => {
            const result = convertTextCase('HELLO WORLD.', 'sentence');
            expect(result).toBe('Hello world.');
        });
    });

    describe('invert', () => {
        it('inverts case of each character', () => {
            expect(convertTextCase('Hello World', 'invert')).toBe(
                'hELLO wORLD',
            );
        });

        it('leaves non-letter characters unchanged', () => {
            expect(convertTextCase('abc 123 !@#', 'invert')).toBe(
                'ABC 123 !@#',
            );
        });

        it('handles all-lowercase', () => {
            expect(convertTextCase('hello', 'invert')).toBe('HELLO');
        });
    });

    describe('edge cases', () => {
        it('handles empty string', () => {
            expect(convertTextCase('', 'upper')).toBe('');
            expect(convertTextCase('', 'lower')).toBe('');
            expect(convertTextCase('', 'title')).toBe('');
        });

        it('handles single character', () => {
            expect(convertTextCase('a', 'upper')).toBe('A');
            expect(convertTextCase('A', 'lower')).toBe('a');
        });
    });
});
