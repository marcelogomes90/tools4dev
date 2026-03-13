import { NextRequest, NextResponse } from 'next/server';
import { createShortLink } from '@/server/services/shortener';
import { checkRateLimit } from '@/server/rate-limit';
import { getClientIp, tooManyRequests } from '@/server/http';
import { shortenSchema } from '@/server/validators/api';

export const runtime = 'nodejs';

function resolveShortenerError(error: unknown) {
    if (!(error instanceof Error)) {
        return {
            status: 500,
            message: 'Falha ao gerar link curto.',
        };
    }

    const maybeErrno = error as NodeJS.ErrnoException;
    if (
        maybeErrno.code === 'ENOTFOUND' &&
        error.message.includes('.supabase.co')
    ) {
        return {
            status: 500,
            message:
                'Host do Postgres não resolvido. Use modo HTTP (SHORTENER_USE_SUPABASE_HTTP=true) ou POSTGRES_URL/POSTGRES_PRISMA_URL da integração Supabase+Vercel.',
        };
    }

    if (error.message.includes('Slug já está em uso')) {
        return {
            status: 409,
            message: error.message,
        };
    }

    return {
        status: 500,
        message: error.message || 'Falha ao gerar link curto.',
    };
}

function isLoopbackHost(url: string) {
    try {
        const hostname = new URL(url).hostname;
        return (
            hostname === 'localhost' ||
            hostname === '127.0.0.1' ||
            hostname === '::1'
        );
    } catch {
        return false;
    }
}

function resolveBaseUrl(request: NextRequest) {
    const host =
        request.headers.get('x-forwarded-host') ?? request.headers.get('host');
    const proto = request.headers.get('x-forwarded-proto') ?? 'http';
    const requestOrigin = host ? `${proto}://${host}` : request.nextUrl.origin;

    const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
    if (envUrl) {
        if (
            process.env.NODE_ENV === 'production' &&
            isLoopbackHost(envUrl) &&
            !isLoopbackHost(requestOrigin)
        ) {
            return requestOrigin;
        }

        return envUrl;
    }

    return requestOrigin;
}

export async function POST(request: NextRequest) {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`shorten:${ip}`, { max: 40, windowMs: 60_000 });
    if (!rate.allowed) return tooManyRequests();

    const body = await request.json().catch(() => null);
    const parsed = shortenSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            {
                ok: false,
                message: 'Payload inválido.',
                errors: parsed.error.flatten(),
            },
            { status: 400 },
        );
    }

    try {
        const result = await createShortLink(
            parsed.data,
            resolveBaseUrl(request),
        );
        return NextResponse.json({ ok: true, ...result }, { status: 201 });
    } catch (error) {
        const { status, message } = resolveShortenerError(error);

        return NextResponse.json(
            {
                ok: false,
                message,
            },
            { status },
        );
    }
}
