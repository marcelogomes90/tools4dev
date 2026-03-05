# Shortener Local

## Estado atual

O encurtador desta aplicação opera em modo local:

- cria links curtos no servidor da aplicação
- aceita slug custom opcional
- gera slug automático com 5 caracteres quando não informado
- redireciona via `GET /s/:slug`
- persistência em arquivo local (com fallback em memória)

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
  "provider": "local"
}
```

## Erros comuns

### `Slug já está em uso`

Causa:

- slug custom já cadastrado no processo atual

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
- por padrão, o arquivo é salvo em `${TMPDIR}/tools4dev-shortlinks.json`
- opcional: configure `SHORTENER_STORAGE_FILE` para definir outro caminho
- para produção com múltiplas instâncias, use persistência compartilhada (ex.: Redis/DB)
