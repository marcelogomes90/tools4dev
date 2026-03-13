import { z } from 'zod';

export const hashSchema = z.object({
    text: z
        .string({ required_error: 'O campo texto é obrigatório.' })
        .min(1, { message: 'O campo texto é obrigatório.' })
        .max(100_000, { message: 'O texto excede o limite de 100KB.' }),
    encoding: z.enum(['hex', 'base64']).default('hex'),
});

export const jwtSignSchema = z.object({
    header: z.record(z.unknown()),
    payload: z.record(z.unknown()),
    secret: z
        .string({ required_error: 'A chave secreta é obrigatória.' })
        .min(1, { message: 'A chave secreta é obrigatória.' })
        .max(2048, {
            message: 'A chave secreta excede o limite de 2048 caracteres.',
        }),
    algorithm: z.enum(['HS256', 'HS512'], {
        errorMap: () => ({
            message: 'Algoritmo inválido. Use HS256 ou HS512.',
        }),
    }),
    expiresIn: z.string().max(32).optional(),
});

export const jwtVerifySchema = z.object({
    token: z
        .string({ required_error: 'O token é obrigatório.' })
        .min(1, { message: 'O token é obrigatório.' })
        .max(5000, { message: 'O token excede o tamanho máximo permitido.' }),
    key: z
        .string({ required_error: 'A chave de verificação é obrigatória.' })
        .min(1, { message: 'A chave de verificação é obrigatória.' })
        .max(8192, { message: 'A chave excede o limite de 8192 caracteres.' }),
    algorithms: z
        .array(z.enum(['HS256', 'HS512', 'RS256', 'RS512']))
        .optional(),
});

export const shortenSchema = z.object({
    url: z
        .string({ required_error: 'A URL é obrigatória.' })
        .trim()
        .url({ message: 'URL inválida. Informe uma URL completa.' })
        .refine(
            (value) =>
                value.startsWith('http://') || value.startsWith('https://'),
            {
                message:
                    'Apenas URLs com protocolo http:// ou https:// são permitidas.',
            },
        ),
    slug: z
        .string()
        .trim()
        .min(3, { message: 'O slug deve ter pelo menos 3 caracteres.' })
        .max(40, { message: 'O slug deve ter no máximo 40 caracteres.' })
        .regex(/^[a-zA-Z0-9_-]+$/, {
            message:
                'O slug pode conter apenas letras, números, hífens e underscores.',
        })
        .optional(),
});

export const sqlFormatterSchema = z.object({
    sql: z
        .string({ required_error: 'O campo SQL é obrigatório.' })
        .min(1, { message: 'O campo SQL é obrigatório.' })
        .max(200_000, { message: 'O SQL excede o limite de 200KB.' }),
    language: z
        .enum(['postgresql', 'mysql', 'sqlite'], {
            errorMap: () => ({
                message: 'Dialeto inválido. Use postgresql, mysql ou sqlite.',
            }),
        })
        .default('postgresql'),
    uppercase: z.boolean().default(true),
    indent: z.number().int().min(2).max(8).default(2),
});

export const imageCompressSchema = z.object({
    format: z
        .enum(['png', 'jpeg', 'webp', 'gif'], {
            errorMap: () => ({
                message: 'Formato inválido. Use png, jpeg, webp ou gif.',
            }),
        })
        .default('webp'),
    quality: z
        .number()
        .int()
        .min(30, { message: 'A qualidade mínima é 30.' })
        .max(95, { message: 'A qualidade máxima é 95.' })
        .default(80),
});

export const pdfCompressSchema = z.object({
    fileName: z
        .string({ required_error: 'O nome do arquivo é obrigatório.' })
        .min(1, { message: 'O nome do arquivo é obrigatório.' }),
    mimeType: z.literal('application/pdf', {
        errorMap: () => ({ message: 'O arquivo deve ser um PDF válido.' }),
    }),
    size: z
        .number()
        .int()
        .positive()
        .max(20 * 1024 * 1024, {
            message: 'O arquivo excede o limite de 20MB.',
        }),
});
