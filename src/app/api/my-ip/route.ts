import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/server/rate-limit';
import { getClientIp, tooManyRequests } from '@/server/http';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`my-ip:${ip}`, { max: 60, windowMs: 60_000 });

    if (!rate.allowed) return tooManyRequests();

    return NextResponse.json({
        ok: true,
        ip,
        forwardedFor: request.headers.get('x-forwarded-for'),
        realIp: request.headers.get('x-real-ip'),
    });
}
