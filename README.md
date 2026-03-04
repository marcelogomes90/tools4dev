# dev-swiss-knife

Monolito em Next.js (App Router) com 16 ferramentas para produtividade de desenvolvimento.

O projeto foi estruturado para ser:

- modular
- testavel
- seguro por padrao
- pronto para deploy

## Destaques

- 16 ferramentas em uma unica aplicacao
- App Router + TypeScript
- validacao com Zod em todas as rotas API
- rate limit simples por IP (in-memory)
- Node runtime nas rotas que usam libs Node
- tema light/dark com toggle
- testes unitarios (Vitest) e smoke e2e (Playwright)
- shortener em modo **Bitly-only**

## Stack

- Next.js 16 (App Router)
- React + TypeScript
- TailwindCSS
- Zod
- jsonwebtoken
- sharp
- sql-formatter
- pdf-lib (+ Ghostscript opcional no host)
- Vitest
- Playwright
- ESLint + Prettier

## Estrutura

```txt
src/
  app/            # Rotas de pagina e route handlers (/api)
  components/     # UI reutilizavel e componentes das ferramentas
  lib/            # Funcoes puras por dominio
  server/         # Servicos e utilitarios server-only
  types/          # Tipos compartilhados

tests/
  unit/           # Vitest
  e2e/            # Playwright smoke
```

## Ferramentas implementadas

1. Gerador de CPF
2. Gerador de CNPJ
3. Hash generator (md5/sha1/sha256/sha512)
4. UUID/ULID generator
5. Lorem Ipsum
6. JWT encoder/decoder (decode local + sign/verify server)
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

## Requisitos

- Node.js 20+
- Yarn 1.22+
- para compressao de PDF de melhor qualidade: `ghostscript` (`gs`) no host

## Como rodar (Yarn)

```bash
yarn install
yarn dev
```

App em `http://localhost:3000`.

## Build e producao

```bash
yarn build
yarn start
```

> O script de build usa `next build --webpack` para maior estabilidade no ambiente atual.

## Ambiente

Copie `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Variaveis:

- `BITLY_TOKEN` (obrigatoria para o encurtador)
- `NEXT_PUBLIC_APP_URL` (url publica da aplicacao)
- `RATE_LIMIT_WINDOW_MS` (padrao: `60000`)
- `RATE_LIMIT_MAX` (padrao: `120`)

### Bitly token (resumo rapido)

1. Crie/login na conta Bitly.
2. Gere um token de API na configuracao da conta.
3. Defina em `.env.local`:

```bash
BITLY_TOKEN=seu_token_aqui
```

4. Reinicie `yarn dev`.

Documentacao oficial (Bitly):

- https://dev.bitly.com/docs/getting-started/authentication/
- https://support.bitly.com/hc/en-us/articles/360001927171-How-do-I-generate-an-OAuth-access-token-for-the-Bitly-API

## Endpoints principais

- `POST /api/hash`
- `POST /api/jwt/sign`
- `POST /api/jwt/verify`
- `POST /api/shorten`
- `POST /api/sql/format`
- `POST /api/image/compress`
- `POST /api/pdf/compress`
- `GET /s/:slug` (desabilitado em modo Bitly-only, retorna `410`)

## Testes

```bash
yarn test          # unit
yarn test:e2e      # smoke e2e
yarn typecheck
yarn lint
```

## Scripts

- `yarn dev`
- `yarn build`
- `yarn start`
- `yarn lint`
- `yarn lint:fix`
- `yarn typecheck`
- `yarn format`
- `yarn format:check`
- `yarn test`
- `yarn test:watch`
- `yarn test:e2e`
- `yarn test:e2e:ui`

## Seguranca e limites

- validacao Zod em rotas API
- rate limit in-memory por IP
- headers de seguranca em `next.config.ts`
- JWT secrets nao sao persistidos
- shortener aceita apenas URL `http/https`
- uploads com limite:
  - imagem: 10MB (`png/jpeg/webp/gif`)
  - PDF: 20MB

## Documentacao completa

- [Arquitetura](docs/ARCHITECTURE.md)
- [API](docs/API.md)
- [Bitly](docs/BITLY.md)
- [Seguranca](docs/SECURITY.md)
- [Testes](docs/TESTING.md)
- [Deploy](docs/DEPLOY.md)
