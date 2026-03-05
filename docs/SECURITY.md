# Segurança

## Medidas aplicadas

- validação de entrada com Zod em todas as rotas API
- rate limit in-memory por IP
- headers de segurança via `next.config.ts`
- validação de protocolo no shortener (`http/https`)
- segredos de JWT sem persistência
- sanitização de Markdown preview com DOMPurify
- limite de tamanho em uploads (imagem/PDF)

## Headers configurados

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Content-Security-Policy` básica

## Arquivos

### Imagens

- formatos permitidos: `png/jpeg/webp/gif`
- limite: 10MB
- processamento server-side com `sharp`

### PDF

- mime obrigatório: `application/pdf`
- limite: 20MB
- timeout no processo do Ghostscript

## JWT

- decode local sem verify (explícito)
- sign/verify no servidor
- sem armazenamento de secret

## Shortener local

- não depende de provider externo
- mapeamento em memória do processo
- sem persistência entre reinícios

## Riscos conhecidos (aceitos)

- rate limit em memória não é distribuído entre múltiplas instâncias
- shortener local em memória perde dados ao reiniciar
- sem WAF/proxy dedicado por padrão
- CSP usa `unsafe-inline` por compatibilidade com Next

## Recomendações para produção

- usar reverse proxy com rate limit adicional
- usar observabilidade (logs centralizados + alertas)
- proteger variáveis de ambiente no provedor de deploy
- adicionar persistência (Redis/DB) para o shortener, se necessário
