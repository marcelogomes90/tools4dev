import { describe, expect, it } from 'vitest';
import {
  addDaysToDate,
  daysBetweenDates,
  formatDatePtBr,
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
  });

  it('adds/subtracts days and formats pt-BR', () => {
    expect(addDaysToDate('2026-03-05', 10)).toBe('2026-03-15');
    expect(subtractDaysFromDate('2026-03-15', 10)).toBe('2026-03-05');
    expect(formatDatePtBr('2026-03-15')).toBe('15/03/2026');
    expect(subtractDates('2026-03-15', '2026-03-05')).toBe(10);
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

  it('removes accents and converts case', () => {
    expect(removeAccents('ação rápida')).toBe('acao rapida');
    expect(convertTextCase('um TITULO', 'title')).toBe('Um Titulo');
  });

  it('counts text stats', () => {
    const stats = countTextStats('linha um\nlinha dois');
    expect(stats.words).toBe(4);
    expect(stats.lines).toBe(2);
    expect(stats.charactersWithoutSpaces).toBeGreaterThan(0);
  });
});
