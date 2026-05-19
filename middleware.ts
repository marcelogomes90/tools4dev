import { NextRequest, NextResponse } from 'next/server';

const canonicalUrl = new URL('https://tools4dev.com.br');

function createNonce() {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    let binary = '';

    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary);
}

function getForwardedProtocol(request: NextRequest) {
    return (
        request.headers.get('x-forwarded-proto') ??
        request.nextUrl.protocol.replace(':', '')
    );
}

function getForwardedHost(request: NextRequest) {
    return (
        request.headers.get('x-forwarded-host') ??
        request.headers.get('host') ??
        request.nextUrl.host
    );
}

function getCanonicalRedirect(request: NextRequest) {
    if (process.env.NODE_ENV !== 'production') return null;

    const protocol = getForwardedProtocol(request);
    const host = getForwardedHost(request);
    const isCanonicalHost = host.toLowerCase() === canonicalUrl.host;
    const isHttps = protocol === 'https';

    if (isCanonicalHost && isHttps) return null;

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.protocol = canonicalUrl.protocol;
    redirectUrl.host = canonicalUrl.host;

    return redirectUrl;
}

export function middleware(request: NextRequest) {
    const canonicalRedirect = getCanonicalRedirect(request);
    if (canonicalRedirect) {
        return NextResponse.redirect(canonicalRedirect, 308);
    }

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
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
