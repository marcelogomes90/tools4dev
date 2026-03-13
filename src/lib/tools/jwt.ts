interface JwtParts {
    header: Record<string, unknown>;
    payload: Record<string, unknown>;
    signature: string;
}

function decodeBase64UrlToUtf8(value: string) {
    const base = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base.padEnd(Math.ceil(base.length / 4) * 4, '=');

    if (typeof Buffer !== 'undefined') {
        return Buffer.from(padded, 'base64').toString('utf8');
    }

    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}

function decodePart(part: string) {
    const text = decodeBase64UrlToUtf8(part);
    return JSON.parse(text) as Record<string, unknown>;
}

export function decodeJwtUnsafe(token: string): JwtParts {
    const parts = token.split('.');
    if (parts.length < 2) {
        throw new Error(
            'Token JWT inválido: formato esperado header.payload.signature',
        );
    }

    return {
        header: decodePart(parts[0]),
        payload: decodePart(parts[1]),
        signature: parts[2] ?? '',
    };
}

export function parseJsonInput(value: string) {
    try {
        const parsed = JSON.parse(value) as Record<string, unknown>;
        if (
            typeof parsed !== 'object' ||
            parsed === null ||
            Array.isArray(parsed)
        ) {
            throw new Error('JSON deve ser um objeto.');
        }
        return parsed;
    } catch {
        throw new Error(
            'JSON inválido. Revise sintaxe de chaves, aspas e vírgulas.',
        );
    }
}
