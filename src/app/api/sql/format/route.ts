import { NextRequest, NextResponse } from 'next/server';
import { format } from 'sql-formatter';
import { checkRateLimit } from '@/server/rate-limit';
import { getClientIp, tooManyRequests } from '@/server/http';
import { sqlFormatterSchema } from '@/server/validators/api';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`sql:${ip}`, { max: 80, windowMs: 60_000 });
    if (!rate.allowed) return tooManyRequests();

    const body = await request.json().catch(() => null);
    const parsed = sqlFormatterSchema.safeParse(body);

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
        const { sql, language, uppercase, indent } = parsed.data;
        const formatted = format(sql, {
            language,
            tabWidth: indent,
            keywordCase: uppercase ? 'upper' : 'preserve',
        });

        return NextResponse.json({ ok: true, formatted });
    } catch {
        return NextResponse.json(
            {
                ok: false,
                message: 'Erro ao formatar SQL. Revise query e dialect.',
            },
            { status: 400 },
        );
    }
}
