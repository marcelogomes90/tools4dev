import { describe, expect, it } from 'vitest';
import {
    hexToRgb,
    hslToRgb,
    hsvToRgb,
    isHexColor,
    rgbToHex,
    rgbToHsl,
    rgbToHsv,
} from '@/lib/tools/color';

describe('isHexColor', () => {
    it('accepts valid 6-digit hex with #', () => {
        expect(isHexColor('#FF5733')).toBe(true);
    });

    it('accepts valid 6-digit hex without #', () => {
        expect(isHexColor('FF5733')).toBe(true);
    });

    it('accepts lowercase hex', () => {
        expect(isHexColor('#ff5733')).toBe(true);
    });

    it('rejects 3-digit hex', () => {
        expect(isHexColor('#FFF')).toBe(false);
    });

    it('rejects non-hex characters', () => {
        expect(isHexColor('#GGHHII')).toBe(false);
    });

    it('rejects empty string', () => {
        expect(isHexColor('')).toBe(false);
    });
});

describe('hexToRgb', () => {
    it('converts black', () => {
        expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('converts white', () => {
        expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
    });

    it('converts red', () => {
        expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('converts without # prefix', () => {
        expect(hexToRgb('00FF00')).toEqual({ r: 0, g: 255, b: 0 });
    });

    it('throws on invalid hex', () => {
        expect(() => hexToRgb('#ZZZ000')).toThrow();
    });
});

describe('rgbToHex', () => {
    it('converts black', () => {
        expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
    });

    it('converts white', () => {
        expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#FFFFFF');
    });

    it('converts intermediate color', () => {
        expect(rgbToHex({ r: 100, g: 150, b: 200 })).toBe('#6496C8');
    });

    it('clamps values above 255', () => {
        const hex = rgbToHex({ r: 300, g: 0, b: 0 });
        expect(hex).toBe('#FF0000');
    });
});

describe('hex ↔ rgb round-trip', () => {
    it('round-trips correctly', () => {
        const original = '#A1B2C3';
        const rgb = hexToRgb(original);
        const back = rgbToHex(rgb);
        expect(back).toBe(original);
    });
});

describe('rgb ↔ hsl round-trip', () => {
    it('round-trips red', () => {
        const rgb = { r: 255, g: 0, b: 0 };
        const hsl = rgbToHsl(rgb);
        const back = hslToRgb(hsl);
        expect(back.r).toBeCloseTo(255, -1);
        expect(back.g).toBeCloseTo(0, -1);
        expect(back.b).toBeCloseTo(0, -1);
    });

    it('white has saturation 0', () => {
        const hsl = rgbToHsl({ r: 255, g: 255, b: 255 });
        expect(hsl.s).toBe(0);
        expect(hsl.l).toBe(100);
    });

    it('black has lightness 0', () => {
        const hsl = rgbToHsl({ r: 0, g: 0, b: 0 });
        expect(hsl.s).toBe(0);
        expect(hsl.l).toBe(0);
    });
});

describe('rgb ↔ hsv round-trip', () => {
    it('round-trips blue', () => {
        const rgb = { r: 0, g: 0, b: 255 };
        const hsv = rgbToHsv(rgb);
        const back = hsvToRgb(hsv);
        expect(back.b).toBeCloseTo(255, -1);
        expect(back.r).toBeCloseTo(0, -1);
    });
});
