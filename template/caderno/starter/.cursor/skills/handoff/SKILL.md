---
name: handoff
description: >-
  Regrava docs/handoff.md para continuar o trabalho num chat novo, sem levar
  o histórico. Use quando o fellow for abrir outro chat ou quando a conversa
  estiver longa e o próximo passo já estiver claro. Não comece feature nova.
---

# Handoff

Regrave `docs/handoff.md`. Um arquivo só. No máximo 60 linhas. Sem código, sem colar diff.

```md
# Handoff

- **Branch:** ana/feat/entries-list
- **Objetivo:** lista de entradas com criar e apagar
- **Plano:** docs/plans/caderno.md — aceito
- **Feito:** schema de entries; entries.service.ts
- **Falta:** hooks; EntriesPage; review; PR
- **Próximo passo:** criar useGetEntries, useCreateEntry e useDeleteEntry imitando o perfil
- **Abrir só:**
  - docs/plans/caderno.md
  - src/services/entries.service.ts
  - src/hooks/useGetProfile.ts
  - src/lib/queryKeys.ts
```

O próximo passo é uma frase e uma skill. A lista "Abrir só" tem os arquivos que essa frase precisa, mais o plano.

No fim, entregue este prompt:

```txt
Continua o caderno a partir de docs/handoff.md.
Faz só o próximo passo.
```

## Qualidade

A seção Handoff de `docs/qualidade.md` passa inteira. Se passar de 60 linhas, corte. Não implemente o próximo passo nesta skill.
