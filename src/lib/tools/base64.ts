function toUrlSafe(value: string) {
    return value.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromUrlSafe(value: string) {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padding = normalized.length % 4;
    if (padding === 0) return normalized;
    return normalized.padEnd(normalized.length + (4 - padding), '=');
}

function encodeUtf8ToBase64(text: string) {
    if (typeof Buffer !== 'undefined') {
        return Buffer.from(text, 'utf8').toString('base64');
    }

    const bytes = new TextEncoder().encode(text);
    let binary = '';
    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }
    return btoa(binary);
}

function decodeBase64ToUtf8(value: string) {
    if (typeof Buffer !== 'undefined') {
        return Buffer.from(value, 'base64').toString('utf8');
    }

    const binary = atob(value);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}

export function encodeBase64(text: string, urlSafe = false) {
    const encoded = encodeUtf8ToBase64(text);
    return urlSafe ? toUrlSafe(encoded) : encoded;
}

export function decodeBase64(value: string, urlSafe = false) {
    const input = urlSafe ? fromUrlSafe(value) : value;
    return decodeBase64ToUtf8(input);
}
