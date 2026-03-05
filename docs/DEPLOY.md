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
- `SHORTENER_STORAGE_FILE` (opcional, caminho do storage do shortener)

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
