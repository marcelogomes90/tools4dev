# Supabase

## Objetivo

Configurar o encurtador para funcionar em produção mesmo quando o host Postgres direto do Supabase é IPv6-only.

## Modos suportados

### 1) HTTP (recomendado para Vercel + IPv4)

Usa PostgREST (`/rest/v1`) via HTTPS.

Variáveis:

- `SHORTENER_USE_SUPABASE_HTTP=true`
- `SUPABASE_URL=https://<project-ref>.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY=<service-role-key>`
- opcional: `SHORTENER_DATABASE_TABLE=public.short_links`

Vantagem:

- evita conexão TCP direta no banco (sem problema de IPv6/IPv4 do host `db.*`).

### 2) Postgres direto

Usa `pg` com connection string.

Variáveis (uma URL já basta):

- `SHORTENER_DATABASE_URL`
- `SUPABASE_DB_URL`
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `DATABASE_URL`

Ou montagem por partes:

- `POSTGRES_USER` + `POSTGRES_HOST` + `POSTGRES_DATABASE` + `POSTGRES_PASSWORD` (+ `POSTGRES_PORT` opcional)

## Tabela

No modo HTTP, a tabela deve existir. Rode no SQL Editor do Supabase:

```sql
CREATE TABLE IF NOT EXISTS public.short_links (
  slug TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  hits BIGINT NOT NULL DEFAULT 0
);
```

## Vercel (passo a passo)

1. Em `Project Settings` -> `Environment Variables`, adicione:
   - `SHORTENER_USE_SUPABASE_HTTP=true`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL=https://seu-dominio.com`
2. Faça redeploy.
3. Teste:

```bash
curl -X POST https://seu-dominio.com/api/shorten \
  -H "content-type: application/json" \
  -d '{"url":"https://example.com","slug":"teste-supabase-http"}'
```
