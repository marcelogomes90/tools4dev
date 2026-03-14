# tools4dev

Aplicação web em Next.js com ferramentas para tarefas comuns de desenvolvimento, incluindo compressão de PDF e imagem.

## Stack

- Next.js 16 (App Router)
- React + TypeScript
- TailwindCSS
- Zod
- `pdf-lib` (PDF)
- `sharp` (imagem)
- Vitest + Playwright
- ESLint + Prettier

## Requisitos

- Node.js 20+ (recomendado 22 LTS)
- npm 10+ ou Yarn 1.22+

## Como rodar

```bash
# npm
npm install
cp .env.example .env.local
npm run dev

# ou yarn
yarn install
cp .env.example .env.local
yarn dev
```

App local: `http://localhost:3000`

## Build de produção

```bash
yarn run build
yarn run start
```

## Scripts

- `npm run dev` / `yarn dev`: ambiente local
- `npm run build` / `yarn build`: build de produção
- `npm run start` / `yarn start`: inicia build
- `npm run lint` / `yarn lint`: lint
- `npm run lint:fix` / `yarn lint:fix`: lint com correção
- `npm run typecheck` / `yarn typecheck`: valida tipos TS
- `npm run format` / `yarn format`: formata código
- `npm run format:check` / `yarn format:check`: valida formatação
- `npm test` / `yarn test`: testes unitários
- `npm run test:e2e` / `yarn test:e2e`: testes e2e

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
