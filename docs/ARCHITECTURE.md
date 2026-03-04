# Arquitetura

## Visao geral

`dev-swiss-knife` e um monolito Next.js com App Router.

Principios:

- UI e experiencia em `src/components`
- regras de negocio puras em `src/lib`
- concerns server-side em `src/server`
- endpoints em `src/app/api/*`

## Organizacao de pastas

```txt
src/
  app/
    api/                  # route handlers
    tools/[slug]/page.tsx # pagina dinamica de ferramenta
    page.tsx              # home
  components/
    layout/               # shell, sidebar, topbar, tema
    tools/                # componentes por ferramenta
    ui/                   # componentes base reutilizaveis
  lib/
    tool-registry.ts      # metadados das ferramentas
    tools/                # funcoes puras (cpf, cnpj, regex, etc.)
    utils/                # helpers (cn, download)
  server/
    services/             # integracoes externas e processamento server-only
    validators/           # schemas Zod da API
    rate-limit.ts         # rate limit in-memory
    http.ts               # utilitarios de resposta e ip
  types/
```

## Fluxo de renderizacao das ferramentas

1. usuario abre `/tools/:slug`
2. `src/app/tools/[slug]/page.tsx` valida slug
3. `ToolRenderer` resolve componente da ferramenta
4. componente executa logica local (ou chama API quando necessario)

## Onde a logica deve ficar

- `src/lib/tools/*`: algoritmos e transformacoes puras (testaveis)
- `src/app/api/*`: apenas I/O, validacao, rate limit e orquestracao
- `src/server/services/*`: integracoes externas e codigo Node-specific

## Rotas Node runtime

As rotas abaixo usam `export const runtime = 'nodejs'`:

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
- padroes reutilizaveis por ferramenta:
  - `ToolLayout`
  - `InputPanel`
  - `OutputPanel`
  - `CopyButton`

## Testabilidade

- unit tests para regras puras
- smoke e2e para disponibilidade da app e ferramenta principal

## Escalabilidade

A estrutura permite evolucao para:

- persistencia opcional (futuro)
- novos providers de shortener
- novos processadores de arquivo
- novos grupos de ferramentas sem mexer no shell
