# tools4dev

Aplicação web em Next.js com 28 ferramentas para tarefas comuns de desenvolvimento.

## Stack

- Next.js 16 (App Router)
- React + TypeScript
- TailwindCSS
- Zod
- Sharp / pdf-lib
- Vitest + Playwright
- ESLint + Prettier

## Requisitos

- Node.js 22+
- Yarn 1.22+
- `qpdf` opcional (melhora compressão de PDF)

## Como rodar

```bash
yarn install
cp .env.example .env.local
yarn dev
```

App local: `http://localhost:3000`

## Build de produção

```bash
yarn build
yarn start
```

## Scripts

- `yarn dev`: ambiente local
- `yarn build`: build de produção
- `yarn start`: inicia build
- `yarn lint`: lint
- `yarn lint:fix`: lint com correção
- `yarn typecheck`: valida tipos TS
- `yarn format`: formata código
- `yarn format:check`: valida formatação
- `yarn test`: testes unitários
- `yarn test:watch`: unitário em watch
- `yarn test:e2e:install`: instala Chromium do Playwright
- `yarn test:e2e:install:deps`: instala Chromium + deps de SO
- `yarn test:e2e`: testes e2e
- `yarn test:e2e:ui`: e2e com interface

## Estrutura

```txt
src/
  app/          rotas e APIs
  components/   layout, UI e ferramentas
  lib/          regras de negócio puras
  server/       serviços server-side
  types/        tipos compartilhados
tests/
  unit/         Vitest
  e2e/          Playwright
```

## Endpoints principais

- `GET /api/my-ip`
- `POST /api/hash`
- `POST /api/jwt/sign`
- `POST /api/jwt/verify`
- `POST /api/shorten`
- `POST /api/sql/format`
- `POST /api/image/compress`
- `POST /api/pdf/compress`
- `GET /s/:slug`
