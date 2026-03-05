import { describe, expect, it } from 'vitest';
import {
  addDaysToDate,
  daysBetweenDates,
  formatDatePtBr,
  parseDateInput,
  subtractDates,
  subtractDaysFromDate,
} from '@/lib/tools/date';
import { sortAndDedupeList } from '@/lib/tools/list';
import { removeAccents } from '@/lib/tools/text-accents';
import { convertTextCase } from '@/lib/tools/text-case';
import { countTextStats } from '@/lib/tools/text-counter';

describe('date helpers', () => {
  it('calculates days between dates', () => {
    expect(daysBetweenDates('2026-01-01', '2026-01-31')).toBe(30);
    expect(daysBetweenDates('2026-01-01', '2026-01-31', true)).toBe(31);
    expect(daysBetweenDates('2026-01-31', '2026-01-01')).toBe(30);
  });

  it('adds/subtracts days and formats pt-BR', () => {
    expect(addDaysToDate('2026-03-05', 10)).toBe('2026-03-15');
    expect(subtractDaysFromDate('2026-03-15', 10)).toBe('2026-03-05');
    expect(formatDatePtBr('2026-03-15')).toBe('15/03/2026');
    expect(subtractDates('2026-03-15', '2026-03-05')).toBe(10);
  });

  it('validates invalid date formats and invalid calendar dates', () => {
    expect(() => parseDateInput('15/03/2026')).toThrow('Data inválida. Use o formato YYYY-MM-DD.');
    expect(() => parseDateInput('2026-02-30')).toThrow('Data inválida. Verifique dia, mês e ano.');
  });

  it('handles leap years correctly', () => {
    expect(addDaysToDate('2024-02-28', 1)).toBe('2024-02-29');
    expect(addDaysToDate('2024-02-28', 2)).toBe('2024-03-01');
  });
});

describe('list and text helpers', () => {
  it('sorts and dedupes list', () => {
    const result = sortAndDedupeList('banana\nmaçã\nbanana\nabacaxi', {
      order: 'asc',
      dedupe: true,
      caseSensitive: false,
      numeric: true,
      removeEmpty: true,
    });

    expect(result).toEqual(['abacaxi', 'banana', 'maçã']);
  });

  it('keeps duplicates when dedupe is disabled', () => {
    const result = sortAndDedupeList('banana\nbanana\nabacaxi', {
      order: 'asc',
      dedupe: false,
      caseSensitive: false,
      numeric: true,
      removeEmpty: true,
    });

    expect(result).toEqual(['abacaxi', 'banana', 'banana']);
  });

  it('keeps distinct case variants when caseSensitive is true', () => {
    const result = sortAndDedupeList('Apple\napple\nAPPLE', {
      order: 'asc',
      dedupe: true,
      caseSensitive: true,
      numeric: true,
      removeEmpty: true,
    });

    expect(result).toHaveLength(3);
  });

  it('removes accents and converts text case modes', () => {
    expect(removeAccents('ação rápida')).toBe('acao rapida');
    expect(convertTextCase('um TITULO', 'title')).toBe('Um Titulo');
    expect(convertTextCase('olá. tudo bem?', 'sentence')).toBe('Olá. Tudo bem?');
    expect(convertTextCase('AbC', 'invert')).toBe('aBc');
  });

  it('counts text stats including paragraphs', () => {
    const stats = countTextStats('linha um\nlinha dois\n\nlinha três');
    expect(stats.words).toBe(6);
    expect(stats.lines).toBe(4);
    expect(stats.paragraphs).toBe(2);
    expect(stats.charactersWithoutSpaces).toBeGreaterThan(0);
  });
});
