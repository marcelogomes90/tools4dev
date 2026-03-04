# Seguranca

## Medidas aplicadas

- validacao de entrada com Zod em todas as rotas API
- rate limit in-memory por IP
- headers de seguranca via `next.config.ts`
- validacao de protocolo no shortener (`http/https`)
- segredos de JWT e Bitly sem persistencia
- sanitizacao de Markdown preview com DOMPurify
- limite de tamanho em uploads (imagem/PDF)

## Headers configurados

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Content-Security-Policy` basica

## Arquivos

### Imagens

- formatos permitidos: `png/jpeg/webp/gif`
- limite: 10MB
- processamento server-side com `sharp`

### PDF

- mime obrigatorio: `application/pdf`
- limite: 20MB
- timeout no processo do Ghostscript

## JWT

- decode local sem verify (explicito)
- sign/verify no servidor
- sem armazenamento de secret

## Riscos conhecidos (aceitos)

- rate limit em memoria nao e distribuido entre multiplas instancias
- sem WAF/proxy dedicado por padrao
- CSP usa `unsafe-inline` por compatibilidade com Next

## Recomendacoes para producao

- usar reverse proxy com rate limit adicional
- usar observabilidade (logs centralizados + alertas)
- rotacionar `BITLY_TOKEN` periodicamente
- proteger variaveis de ambiente no provedor de deploy
