import { describe, expect, it } from 'vitest';
import { decodeJwtUnsafe } from '@/lib/tools/jwt';

function toBase64Url(value: string) {
    return Buffer.from(value).toString('base64url');
}

describe('jwt decode unsafe', () => {
    it('decodes header and payload', () => {
        const header = toBase64Url('{"alg":"HS256","typ":"JWT"}');
        const payload = toBase64Url('{"sub":"123","name":"Dev"}');
        const token = `${header}.${payload}.signature`;

        const decoded = decodeJwtUnsafe(token);

        expect(decoded.header.alg).toBe('HS256');
        expect(decoded.payload.sub).toBe('123');
        expect(decoded.signature).toBe('signature');
    });

    it('throws on invalid token format', () => {
        expect(() => decodeJwtUnsafe('invalid-token')).toThrow();
    });

    it('throws on token with only one part', () => {
        expect(() => decodeJwtUnsafe('onlyone')).toThrow();
    });

    it('throws on token with only two parts', () => {
        const header = toBase64Url('{"alg":"HS256"}');
        expect(() => decodeJwtUnsafe(`${header}.payload`)).toThrow();
    });

    it('throws on malformed header json', () => {
        const badHeader = Buffer.from('not-json').toString('base64url');
        const payload = toBase64Url('{"sub":"123"}');
        expect(() => decodeJwtUnsafe(`${badHeader}.${payload}.sig`)).toThrow();
    });

    it('decodes payload with numeric claims', () => {
        const now = Math.floor(Date.now() / 1000);
        const header = toBase64Url('{"alg":"HS256","typ":"JWT"}');
        const payload = toBase64Url(
            JSON.stringify({ iat: now, exp: now + 3600, role: 'admin' }),
        );
        const token = `${header}.${payload}.sig`;

        const decoded = decodeJwtUnsafe(token);

        expect(decoded.payload.iat).toBe(now);
        expect(decoded.payload.role).toBe('admin');
    });

    it('handles token with empty signature', () => {
        const header = toBase64Url('{"alg":"HS256","typ":"JWT"}');
        const payload = toBase64Url('{"sub":"1"}');
        const token = `${header}.${payload}.`;

        const decoded = decodeJwtUnsafe(token);

        expect(decoded.signature).toBe('');
    });
});
