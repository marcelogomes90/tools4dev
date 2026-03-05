# Arquitetura

## Visão geral

`tools4dev` é um monolito Next.js com App Router.

Princípios:

- UI e experiência em `src/components`
- regras de negócio puras em `src/lib`
- concerns server-side em `src/server`
- endpoints em `src/app/api/*`

## Organização de pastas

```txt
src/
  app/
    api/                  # route handlers
    tools/[slug]/page.tsx # página dinâmica de ferramenta
    page.tsx              # home
  components/
    layout/               # shell, sidebar, topbar, tema
    tools/                # componentes por ferramenta
    ui/                   # componentes base reutilizáveis
  lib/
    tool-registry.ts      # metadados das ferramentas
    tools/                # funções puras (cpf, cnpj, regex, etc.)
    utils/                # helpers (cn, download)
  server/
    services/             # integrações externas e processamento server-only
    validators/           # schemas Zod da API
    rate-limit.ts         # rate limit in-memory
    http.ts               # utilitários de resposta e ip
  types/
```

## Fluxo de renderização das ferramentas

1. usuário abre `/tools/:slug`
2. `src/app/tools/[slug]/page.tsx` valida slug
3. `ToolRenderer` resolve componente da ferramenta
4. componente executa lógica local (ou chama API quando necessário)

## Onde a lógica deve ficar

- `src/lib/tools/*`: algoritmos e transformações puras (testáveis)
- `src/app/api/*`: apenas I/O, validação, rate limit e orquestração
- `src/server/services/*`: integrações externas e código Node-specific

## Rotas Node runtime

As rotas abaixo usam `export const runtime = 'nodejs'`:

- `/api/my-ip`
- `/api/hash`
- `/api/jwt/sign`
- `/api/jwt/verify`
- `/api/shorten`
- `/api/sql/format`
- `/api/image/compress`
- `/api/pdf/compress`

## UI

- shell com sidebar por categoria
- home centralizada
- modo claro/escuro com toggle
- padrões reutilizáveis por ferramenta:
  - `ToolLayout`
  - `InputPanel`
  - `OutputPanel`
  - `CopyButton`

## Testabilidade

- unit tests para regras puras
- smoke e2e para disponibilidade da app e ferramenta principal
- cobertura específica para shortener local e utilitários de data/texto

## Escalabilidade

A estrutura permite evolução para:

- storage compartilhado para o shortener (ex.: Postgres/Redis)
- novos processadores de arquivo
- novos grupos de ferramentas sem mexer no shell
