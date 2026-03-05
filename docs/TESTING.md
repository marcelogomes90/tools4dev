# Testes

## Stack de testes

- Unit: Vitest
- E2E smoke: Playwright

## Unit tests atuais

- `tests/unit/cpf-cnpj.test.ts`
  - validação de documentos conhecidos
  - geração válida de CPF/CNPJ
- `tests/unit/base64.test.ts`
  - encode/decode UTF-8
  - modo URL-safe
- `tests/unit/jwt.test.ts`
  - decode de header/payload
  - erro para formato inválido
- `tests/unit/password.test.ts`
  - geração com regras de segurança
  - geração em lote
- `tests/unit/date-list-text.test.ts`
  - operações de data
  - ordenação/desduplicação de lista
  - transformações de texto

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

## Observações

- o Playwright sobe `yarn dev --hostname 127.0.0.1 --port 3000`
- em ambientes que bloqueiam bind de porta, o e2e falha por restrição do ambiente

## Próximos testes recomendados

1. cobertura de rotas API (`/api/shorten`, `/api/image/compress`, `/api/pdf/compress`)
2. testes de erro para JWT sign/verify
3. smoke para regex/diff/markdown
4. teste de limites (payload grande e uploads grandes)
