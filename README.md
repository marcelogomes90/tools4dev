# dev-swiss-knife

Monolito em Next.js (App Router) com 16 ferramentas utilitarias para devs, arquitetura modular, validacao com Zod, protecao basica contra abuso e testes unitarios/e2e.

## Stack

- Next.js (App Router) + TypeScript
- TailwindCSS
- Zod
- Vitest (unit)
- Playwright (e2e smoke)
- Node runtime nas rotas que exigem libs Node (`sharp`, `sql-formatter`, JWT sign/verify e PDF)

## Estrutura

```txt
src/
  app/            # Routes, pages e route handlers
  components/     # UI reutilizavel e componentes de ferramentas
  lib/            # Funcoes puras por ferramenta
  server/         # Servicos, validadores e rate-limit
  types/          # Tipos compartilhados
```

## Ferramentas implementadas

1. Gerador de CPF
2. Gerador de CNPJ
3. Hash Generator (md5/sha1/sha256/sha512)
4. UUID/ULID Generator
5. Lorem Ipsum
6. JWT Encoder/Decoder (decode local, sign/verify server)
7. Base64 encode/decode
8. Encurtador de links (Bitly only)
9. Formatador de JSON
10. Formatador de SQL
11. Testador de Regex
12. Comparacao de texto (diff)
13. Visualizador Markdown
14. Conversor de cor
15. Compressao de imagens
16. Compressao de PDFs

## Como rodar

```bash
npm install
npm run dev
```

App em `http://localhost:3000`.

## Build e start

```bash
npm run build
npm run start
```

## Testes

```bash
npm run test
npm run test:e2e
```

## Ambiente

Copie `.env.example` para `.env.local` e ajuste se necessario.

Variaveis:

- `BITLY_TOKEN`: obrigatorio para encurtador de links
- `NEXT_PUBLIC_APP_URL`: base publica da aplicacao
- `RATE_LIMIT_WINDOW_MS`: janela do rate limit global (padrao 60000)
- `RATE_LIMIT_MAX`: maximo de requests por janela (padrao 120)

## Encurtador de links (Bitly)

A aplicacao esta em modo Bitly-only para encurtamento.

- Endpoint: `POST /api/shorten`
- Payload: `{ "url": "https://...", "slug": "opcional" }`
- Requisitos:
  - `BITLY_TOKEN` valido
  - URL com protocolo `http/https`

Obs: o endpoint local `GET /s/:slug` foi desabilitado e retorna `410`, pois o redirecionamento e feito pelo proprio Bitly.

## Endpoints principais

- `POST /api/hash`
- `POST /api/jwt/sign`
- `POST /api/jwt/verify`
- `POST /api/shorten`
- `POST /api/sql/format`
- `POST /api/image/compress`
- `POST /api/pdf/compress`

## Seguranca e limites

- Validacao de entrada com Zod nas rotas API
- Rate limit em memoria por IP
- Limites de upload:
  - imagem: 10MB, tipos `png/jpeg/webp/gif`
  - pdf: 20MB, timeout e fallback
- URL shortener aceita apenas `http/https`
- Secrets de JWT nao sao persistidos
- Headers basicos de seguranca em `next.config.ts`

## Compressao de PDF: limitacoes

A rota tenta primeiro Ghostscript (`gs`) para melhor compressao. Se a dependencia de sistema nao estiver disponivel, usa fallback com `pdf-lib`.

Quando nenhum metodo for suficiente, a API retorna erro explicito indicando dependencia de sistema.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run format`
- `npm run test`
- `npm run test:e2e`
