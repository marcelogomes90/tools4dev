import { describe, expect, it } from 'vitest';
import { generatePassword, generatePasswordBatch } from '@/lib/tools/password';

describe('password generator', () => {
  it('generates password with expected length', () => {
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
  });

  it('generates batches', () => {
    const list = generatePasswordBatch(5, {
      length: 12,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
      avoidAmbiguous: false,
    });

    expect(list).toHaveLength(5);
    expect(list.every((item) => item.length === 12)).toBe(true);
  });
});
