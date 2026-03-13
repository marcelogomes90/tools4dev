import { describe, expect, it } from 'vitest';
import { convertCssUnit, formatCssUnitValue } from '@/lib/tools/css-units';

const context = {
    rootFontSize: 16,
    parentFontSize: 20,
    viewportWidth: 1200,
    viewportHeight: 800,
};

describe('css unit converter', () => {
    it('converts px to rem and back', () => {
        expect(convertCssUnit(16, 'px', 'rem', context)).toBe(1);
        expect(convertCssUnit(2, 'rem', 'px', context)).toBe(32);
    });

    it('converts em and percent relative to parent font size', () => {
        expect(convertCssUnit(2, 'em', 'px', context)).toBe(40);
        expect(convertCssUnit(50, '%', 'px', context)).toBe(10);
    });

    it('converts viewport units', () => {
        expect(convertCssUnit(10, 'vw', 'px', context)).toBe(120);
        expect(convertCssUnit(25, 'vh', 'px', context)).toBe(200);
    });

    it('formats values with reasonable precision', () => {
        expect(formatCssUnitValue(1.234567)).toBe('1.2346');
        expect(formatCssUnitValue(10)).toBe('10');
    });
});
