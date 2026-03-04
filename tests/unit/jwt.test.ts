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
});
