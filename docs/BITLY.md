# Bitly (Bitly-only mode)

## Estado atual

O encurtador desta aplicacao opera em modo **Bitly-only**:

- cria links via API v4 da Bitly
- aceita slug custom opcional
- sem persistencia local

## Variavel obrigatoria

No `.env.local`:

```bash
BITLY_TOKEN=seu_token_bitly
```

Depois reinicie o servidor (`yarn dev`).

## Como obter token

Use a pagina de token/API da sua conta Bitly.

Referencias oficiais:

- https://dev.bitly.com/docs/getting-started/authentication/
- https://support.bitly.com/hc/en-us/articles/360001927171-How-do-I-generate-an-OAuth-access-token-for-the-Bitly-API

## Payload suportado

`POST /api/shorten`

```json
{
  "url": "https://example.com/path",
  "slug": "minha-url"
}
```

## Erros comuns

### `BITLY_TOKEN nao configurado`

Causa:

- token ausente em `.env.local`

Acao:

- definir `BITLY_TOKEN`
- reiniciar `yarn dev`

### `BITLY_TOKEN invalido ou sem permissao`

Causa:

- token expirado, revogado ou sem escopo/permissao

Acao:

- gerar novo token
- atualizar `.env.local`

### `Limite da API Bitly atingido`

Causa:

- rate limiting da API Bitly

Acao:

- aguardar janela da Bitly
- reduzir volume de chamadas

### `Timeout ao chamar Bitly`

Causa:

- indisponibilidade momentanea ou latencia alta

Acao:

- repetir operacao
- validar conectividade da maquina

## Observacao de seguranca

- token nunca deve ir para cliente/browser
- token fica apenas em variavel de ambiente server-side
- nao registrar token em logs
