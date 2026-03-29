import { NextRequest, NextResponse } from 'next/server';

function createNonce() {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    let binary = '';

    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary);
}

export function middleware(request: NextRequest) {
    const nonce = createNonce();

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-nonce', nonce);

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    const scriptSrc = [
        "'self'",
        `'nonce-${nonce}'`,
        "'strict-dynamic'",
        'https:',
        'http:',
    ];

    if (process.env.NODE_ENV !== 'production') {
        scriptSrc.push("'unsafe-eval'");
    }

    const csp = [
        "default-src 'self'",
        "img-src 'self' data: blob: https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net",
        "style-src 'self' 'unsafe-inline'",
        `script-src ${scriptSrc.join(' ')}`,
        "connect-src 'self' https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net",
        "font-src 'self' data:",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "object-src 'none'",
    ].join('; ');

    response.headers.set('Content-Security-Policy', csp);
    response.headers.set('x-nonce', nonce);

    return response;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
