# Shortener Local

## Estado atual

O encurtador desta aplicação opera em modo local:

- cria links curtos no servidor da aplicação
- aceita slug custom opcional
- gera slug automático com 5 caracteres quando não informado
- redireciona via `GET /s/:slug`
- persistência em Postgres (fallback JSON local sem DB)

## Payload suportado

`POST /api/shorten`

```json
{
  "url": "https://example.com/path",
  "slug": "minha-url"
}
```

## Resposta de sucesso

```json
{
  "ok": true,
  "slug": "minha-url",
  "shortUrl": "http://localhost:3000/s/minha-url",
  "provider": "postgres"
}
```

`provider` pode retornar `postgres` ou `local` (fallback JSON sem DB).

## Erros comuns

### `Slug já está em uso`

Causa:

- slug custom já cadastrado no banco do shortener

Ação:

- enviar outro slug
- ou remover o slug custom para gerar automaticamente

### `URL inválida` / `Apenas URLs http/https...`

Causa:

- URL fora do formato esperado ou protocolo não suportado

Ação:

- enviar URL com `http://` ou `https://`

## Observação de segurança

- validação de URL e slug ocorre no servidor
- não há chamadas para APIs de terceiros
- configure uma URL de DB (`SHORTENER_DATABASE_URL`, `SUPABASE_DB_URL`, `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING` ou `DATABASE_URL`)
- se não houver URL, o serviço também tenta montar por `POSTGRES_USER/HOST/DATABASE/PASSWORD` (+ `POSTGRES_PORT`)
- opcional: `SHORTENER_DATABASE_TABLE` para customizar a tabela (`schema.tabela` suportado)
- sem URL de DB, o serviço usa fallback JSON local (`SHORTENER_STORAGE_FILE`)
- em produção com múltiplas instâncias, use Postgres compartilhado entre todas as instâncias
