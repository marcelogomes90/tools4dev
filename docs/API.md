# API

Todas as rotas validam input com Zod e aplicam rate limit por IP.

## `GET /api/my-ip`

Retorna o IP visto pelo servidor.

### Response 200

```json
{
  "ok": true,
  "ip": "203.0.113.10",
  "forwardedFor": "203.0.113.10",
  "realIp": null
}
```

## `POST /api/hash`

Gera hashes `md5`, `sha1`, `sha256`, `sha512`.

### Body

```json
{
  "text": "hello",
  "encoding": "hex"
}
```

`encoding`: `hex | base64`

### Response 200

```json
{
  "ok": true,
  "result": {
    "md5": "...",
    "sha1": "...",
    "sha256": "...",
    "sha512": "..."
  }
}
```

## `POST /api/jwt/sign`

Assina JWT com `HS256` ou `HS512`.

### Body

```json
{
  "header": { "typ": "JWT" },
  "payload": { "sub": "123" },
  "secret": "my-secret",
  "algorithm": "HS256",
  "expiresIn": "1h"
}
```

### Response 200

```json
{ "ok": true, "token": "..." }
```

## `POST /api/jwt/verify`

Verifica assinatura do token.

### Body

```json
{
  "token": "...",
  "key": "my-secret",
  "algorithms": ["HS256"]
}
```

### Response 200

```json
{ "ok": true, "decoded": { "sub": "123" } }
```

## `POST /api/shorten`

Encurtador local com slug opcional.

### Body

```json
{
  "url": "https://example.com",
  "slug": "custom-slug"
}
```

### Regras

- URL apenas `http/https`
- `slug` opcional (`3..40`, `a-zA-Z0-9_-`)
- sem `slug`, o servidor gera automaticamente um slug alfanumérico de 5 caracteres
- slugs são únicos no banco do shortener (Postgres quando configurado)

### Response 201

```json
{
  "ok": true,
  "slug": "custom-slug",
  "shortUrl": "https://app.exemplo.com/s/custom-slug",
  "expiresAt": null,
  "provider": "postgres"
}
```

`provider` pode retornar `postgres` (quando DB está configurado) ou `local` (fallback JSON).

### Response 409

Slug já existente.

## `POST /api/sql/format`

Formata SQL server-side com `sql-formatter`.

### Body

```json
{
  "sql": "select * from users",
  "language": "postgresql",
  "uppercase": true,
  "indent": 2
}
```

## `POST /api/image/compress`

Comprime/converte imagens via Sharp.

### Multipart fields

- `file` (obrigatório)
- `format`: `png|jpeg|webp|gif`
- `quality`: `30..95`

### Limites

- max 10MB
- tipos aceitos: `image/png`, `image/jpeg`, `image/webp`, `image/gif`

### Response 200

Arquivo binário com headers:

- `Content-Type`
- `Content-Disposition`

## `POST /api/pdf/compress`

Comprime PDF priorizando Ghostscript.
Se Ghostscript não estiver disponível, usa fallback com `pdf-lib`.

### Multipart fields

- `file` (pdf)

### Limites

- mime: `application/pdf`
- max 20MB

### Response 200

Arquivo PDF binário com header adicional:

- `X-Compression-Method: ghostscript | pdf-lib`

## `GET /s/:slug`

Redireciona (`307`) para a URL registrada no banco do shortener.
