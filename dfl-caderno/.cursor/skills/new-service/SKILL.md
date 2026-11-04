---
name: new-service
description: >-
  Cria o service async de uma entidade que já está num plano aceito. Use ao
  adicionar entries.service.ts ou tasks.service.ts. Imite profile.service.ts.
  Não crie hook nem página nesta skill.
---

# Service

1. Confirme que a entidade está num plano aceito. Sem aceite, volte para `plan-feature`.
2. Leia `src/services/profile.service.ts` e imite a forma.
3. Crie `src/services/<entidade>.service.ts`:
   - sem import de React
   - funções `async`
   - mapper snake_case → camelCase no mesmo arquivo
   - `throw new Error(...)` quando o Supabase devolver `error`
   - dono via `supabase.auth.getUser()`, nunca por argumento vindo da página
   - colunas nomeadas no `select`, iguais ao mapper
4. Exporte no barrel `src/services/index.ts` se ele já reexporta os services.

Não crie hook, página nem query key nesta skill. A key entra em `new-query-hook`.

## Qualidade

A seção Service de `docs/qualidade.md` passa inteira antes de encerrar.
