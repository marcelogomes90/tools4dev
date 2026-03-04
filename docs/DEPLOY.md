# Deploy

## Checklist

1. definir variaveis de ambiente
2. instalar dependencias
3. buildar a aplicacao
4. subir processo `next start`
5. validar endpoints criticos

## Variaveis necessarias

- `BITLY_TOKEN` (obrigatoria para encurtador)
- `NEXT_PUBLIC_APP_URL` (recomendada)
- `RATE_LIMIT_WINDOW_MS` (opcional)
- `RATE_LIMIT_MAX` (opcional)

## Build e start

```bash
yarn install --frozen-lockfile
yarn build
yarn start
```

## Ghostscript (opcional, recomendado)

Para melhor compressao de PDF, instale `ghostscript` no host.

Sem `ghostscript`, a API usa fallback `pdf-lib` e pode nao reduzir alguns arquivos.

## Health checks sugeridos

- `GET /` responde 200
- `POST /api/hash` responde 200 com payload valido
- `POST /api/shorten` responde 201 com `BITLY_TOKEN` valido

## Observabilidade recomendada

- logs de erro por rota
- metrica de latencia por endpoint
- alertas para aumento de `429` e erros `5xx`
