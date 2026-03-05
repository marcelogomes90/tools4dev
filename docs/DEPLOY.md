# Deploy

## Checklist

1. definir variáveis de ambiente
2. instalar dependências
3. buildar a aplicação
4. subir processo `next start`
5. validar endpoints críticos

## Variáveis necessárias

- `NEXT_PUBLIC_APP_URL` (recomendada, para URLs curtas absolutas)
- `RATE_LIMIT_WINDOW_MS` (opcional)
- `RATE_LIMIT_MAX` (opcional)
- `SHORTENER_DATABASE_URL` (opcional, URL dedicada Postgres para shortener)
- `SUPABASE_DB_URL` (opcional, atalho para URL Postgres do Supabase)
- `SHORTENER_DATABASE_TABLE` (opcional, tabela do shortener; aceita `schema.tabela`)
- `SHORTENER_USE_SUPABASE_HTTP` (opcional, ativa shortener via API HTTP do Supabase)
- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (obrigatórios no modo HTTP)
- `POSTGRES_URL` (auto-detectado do Vercel/Supabase Integration)
- `POSTGRES_PRISMA_URL` (fallback auto-detectado)
- `POSTGRES_URL_NON_POOLING` (fallback auto-detectado)
- `DATABASE_URL` (fallback do shortener se `SHORTENER_DATABASE_URL` não existir)
- `POSTGRES_USER` + `POSTGRES_HOST` + `POSTGRES_DATABASE` + `POSTGRES_PASSWORD` (+ `POSTGRES_PORT` opcional) para montagem automática da URL
- `SHORTENER_DATABASE_SSL_NO_VERIFY` (opcional e temporário, para ambiente com erro de certificado TLS)
- `SHORTENER_STORAGE_FILE` (opcional, fallback JSON local sem Postgres)

## Build e start

```bash
yarn install --frozen-lockfile
yarn build
yarn start
```

## Ghostscript (opcional, recomendado)

Para melhor compressão de PDF, instale `ghostscript` no host.

Sem `ghostscript`, a API usa fallback `pdf-lib` e pode não reduzir alguns arquivos.

## Health checks sugeridos

- `GET /` responde 200
- `GET /api/my-ip` responde 200
- `POST /api/hash` responde 200 com payload válido
- `POST /api/shorten` responde 201 com payload válido

## Observabilidade recomendada

- logs de erro por rota
- métrica de latência por endpoint
- alertas para aumento de `429` e erros `5xx`
