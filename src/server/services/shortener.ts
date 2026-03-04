interface BitlyCreateInput {
  url: string;
  slug?: string;
}

interface BitlySuccess {
  link?: string;
  id?: string;
}

interface BitlyError {
  message?: string;
  description?: string;
}

function extractSlugFromLink(link: string) {
  const parts = link.split('/').filter(Boolean);
  return parts[parts.length - 1] ?? '';
}

async function parseBitlyError(response: Response) {
  const payload = (await response.json().catch(() => null)) as BitlyError | null;

  if (payload?.description) return payload.description;
  if (payload?.message) return payload.message;

  if (response.status === 401 || response.status === 403) {
    return 'BITLY_TOKEN invalido ou sem permissao para criar links.';
  }

  if (response.status === 429) {
    return 'Limite da API Bitly atingido. Tente novamente em instantes.';
  }

  return 'Bitly nao conseguiu processar esta solicitacao.';
}

async function createDefaultBitlyLink(url: string, token: string) {
  const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ long_url: url }),
  });

  if (!response.ok) {
    throw new Error(await parseBitlyError(response));
  }

  return (await response.json()) as BitlySuccess;
}

async function createCustomBitlyLink(url: string, slug: string, token: string) {
  const response = await fetch('https://api-ssl.bitly.com/v4/bitlinks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      long_url: url,
      domain: 'bit.ly',
      keyword: slug,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseBitlyError(response));
  }

  return (await response.json()) as BitlySuccess;
}

export async function createShortLink(input: BitlyCreateInput) {
  const token = process.env.BITLY_TOKEN;

  if (!token) {
    throw new Error('BITLY_TOKEN nao configurado. Defina a variavel de ambiente para usar o encurtador.');
  }

  const bitlyData = input.slug
    ? await createCustomBitlyLink(input.url, input.slug, token)
    : await createDefaultBitlyLink(input.url, token);

  if (!bitlyData.link) {
    throw new Error('Bitly nao retornou URL curta valida.');
  }

  return {
    slug: extractSlugFromLink(bitlyData.link),
    shortUrl: bitlyData.link,
    expiresAt: null,
    provider: 'bitly' as const,
  };
}
