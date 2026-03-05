# Supabase

## Objetivo

Configurar o encurtador para usar o Postgres do Supabase e funcionar entre máquinas/instâncias.

## Variáveis de ambiente

Defina no deploy:

- `NEXT_PUBLIC_APP_URL=https://seu-dominio.com`
- `POSTGRES_URL=postgresql://...` (gerada automaticamente na integração Supabase + Vercel)

Opcional:

- `SUPABASE_DB_URL=postgresql://...`
- `SHORTENER_DATABASE_URL=postgresql://...` (tem prioridade sobre `SUPABASE_DB_URL`)
- `SHORTENER_DATABASE_TABLE=public.short_links`

Se `SHORTENER_DATABASE_URL`, `SUPABASE_DB_URL` e `POSTGRES_URL` não estiverem definidas, o serviço tenta `DATABASE_URL`.  
Sem nenhuma URL de banco, cai no fallback JSON local.

### Cenário comum no Vercel

Se só `POSTGRES_USER`, `POSTGRES_HOST` e `POSTGRES_DATABASE` estiverem preenchidas, o shortener ainda precisa de:

- `POSTGRES_PASSWORD`

Com esses 4 valores (+ `POSTGRES_PORT` opcional), o serviço monta a URL automaticamente.

### Erro de certificado TLS

Se aparecer `self-signed certificate in certificate chain`:

1. use preferencialmente `POSTGRES_URL`/`POSTGRES_PRISMA_URL` da integração (já vem com TLS correto);
2. confirme que a URL de conexão contém `sslmode=require`;
3. se o erro persistir, defina `SHORTENER_DATABASE_SSL_NO_VERIFY=true` apenas como mitigação temporária.

Use esse fallback apenas quando necessário e remova depois de corrigir a cadeia TLS.

## String de conexão Supabase

No painel Supabase:

1. `Project Settings`
2. `Database`
3. `Connection string`
4. Copie a URI (`postgresql://...`)

Recomendado usar com `sslmode=require`.

## Tabela

O serviço cria automaticamente a tabela se não existir:

```sql
CREATE TABLE IF NOT EXISTS public.short_links (
  slug TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  hits BIGINT NOT NULL DEFAULT 0
);
```

## Teste rápido

Crie link:

```bash
curl -X POST https://seu-dominio.com/api/shorten \
  -H "content-type: application/json" \
  -d '{"url":"https://example.com","slug":"teste-supabase"}'
```

Abra:

```bash
https://seu-dominio.com/s/teste-supabase
```
