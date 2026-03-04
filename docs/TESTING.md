# Testes

## Stack de testes

- Unit: Vitest
- E2E smoke: Playwright

## Unit tests atuais

- `tests/unit/cpf-cnpj.test.ts`
  - validacao de documentos conhecidos
  - geracao valida de CPF/CNPJ
- `tests/unit/base64.test.ts`
  - encode/decode UTF-8
  - modo URL-safe
- `tests/unit/jwt.test.ts`
  - decode de header/payload
  - erro para formato invalido

## E2E smoke atual

- `tests/e2e/smoke.spec.ts`
  - home abre
  - formatador de JSON funciona

## Comandos

```bash
yarn test
yarn test:e2e
yarn typecheck
yarn lint
```

## Observacoes

- o Playwright sobe `yarn dev --hostname 127.0.0.1 --port 3000`
- em ambientes que bloqueiam bind de porta, o e2e falha por restricao do ambiente

## Proximos testes recomendados

1. cobertura de rotas API (`/api/shorten`, `/api/image/compress`, `/api/pdf/compress`)
2. testes de erro para JWT sign/verify
3. smoke para regex/diff/markdown
4. teste de limites (payload grande e uploads grandes)
