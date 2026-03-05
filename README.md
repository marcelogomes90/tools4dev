# dev-swiss-knife

Monolito em Next.js (App Router) com 27 ferramentas para produtividade de desenvolvimento.

O projeto foi estruturado para ser:

- modular
- testável
- seguro por padrão
- pronto para deploy

## Destaques

- 27 ferramentas em uma única aplicação
- App Router + TypeScript
- validação com Zod em todas as rotas API
- rate limit simples por IP (in-memory)
- Node runtime nas rotas que usam libs Node
- tema light/dark com toggle
- testes unitários (Vitest) e smoke e2e (Playwright)
- encurtador local com redirecionamento em `/s/:slug`

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
  app/            # Rotas de página e route handlers (/api)
  components/     # UI reutilizável e componentes das ferramentas
  lib/            # Funções puras por domínio
  server/         # Serviços e utilitários server-only
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
8. Encurtador de links (local)
9. Formatador de JSON
10. Formatador de SQL
11. Testador de Regex
12. Comparação de texto (diff)
13. Visualizador Markdown
14. Conversor de cor
15. Compressão de imagens
16. Compressão de PDFs
17. Gerador de nomes
18. Gerador de senhas
19. Meu IP
20. Gerador de QR Code
21. Remover acentos
22. Conversor de maiúsculas e minúsculas
23. Contador de palavras e caracteres
24. Contador de dias entre datas
25. Somar dias em data
26. Subtrair dias em data
27. Ordenar e desduplicar lista

## Requisitos

- Node.js 20+
- Yarn 1.22+
- para compressão de PDF de melhor qualidade: `ghostscript` (`gs`) no host

## Como rodar (Yarn)

```bash
yarn install
yarn dev
```

App em `http://localhost:3000`.

## Build e produção

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

Variáveis:

- `NEXT_PUBLIC_APP_URL` (URL pública da aplicação)
- `RATE_LIMIT_WINDOW_MS` (padrão: `60000`)
- `RATE_LIMIT_MAX` (padrão: `120`)

## Endpoints principais

- `GET /api/my-ip`
- `POST /api/hash`
- `POST /api/jwt/sign`
- `POST /api/jwt/verify`
- `POST /api/shorten`
- `POST /api/sql/format`
- `POST /api/image/compress`
- `POST /api/pdf/compress`
- `GET /s/:slug` (redireciona para URL curta criada localmente)

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

## Segurança e limites

- validação Zod em rotas API
- rate limit in-memory por IP
- headers de segurança em `next.config.ts`
- JWT secrets não são persistidos
- shortener aceita apenas URL `http/https`
- uploads com limite:
  - imagem: 10MB (`png/jpeg/webp/gif`)
  - PDF: 20MB

## Documentação completa

- [Arquitetura](docs/ARCHITECTURE.md)
- [API](docs/API.md)
- [Shortener local](docs/SHORTENER.md)
- [Segurança](docs/SECURITY.md)
- [Testes](docs/TESTING.md)
- [Deploy](docs/DEPLOY.md)
