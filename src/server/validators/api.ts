import { z } from 'zod';

export const hashSchema = z.object({
  text: z.string().max(100_000),
  encoding: z.enum(['hex', 'base64']).default('hex'),
});

export const jwtSignSchema = z.object({
  header: z.record(z.unknown()),
  payload: z.record(z.unknown()),
  secret: z.string().min(1).max(2048),
  algorithm: z.enum(['HS256', 'HS512']),
  expiresIn: z.string().max(32).optional(),
});

export const jwtVerifySchema = z.object({
  token: z.string().min(1).max(5000),
  key: z.string().min(1).max(8192),
  algorithms: z.array(z.enum(['HS256', 'HS512', 'RS256', 'RS512'])).optional(),
});

export const shortenSchema = z.object({
  url: z
    .string()
    .trim()
    .url('URL inválida.')
    .refine(
      (value) => value.startsWith('http://') || value.startsWith('https://'),
      {
        message: 'Apenas URLs http/https são permitidas.',
      },
    ),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(40)
    .regex(/^[a-zA-Z0-9_-]+$/)
    .optional(),
});

export const sqlFormatterSchema = z.object({
  sql: z.string().min(1).max(200_000),
  language: z.enum(['postgresql', 'mysql', 'sqlite']).default('postgresql'),
  uppercase: z.boolean().default(true),
  indent: z.number().int().min(2).max(8).default(2),
});

export const imageCompressSchema = z.object({
  format: z.enum(['png', 'jpeg', 'webp', 'gif']).default('webp'),
  quality: z.number().int().min(30).max(95).default(80),
});

export const pdfCompressSchema = z.object({
  fileName: z.string().min(1),
  mimeType: z.literal('application/pdf'),
  size: z
    .number()
    .int()
    .positive()
    .max(20 * 1024 * 1024),
});
