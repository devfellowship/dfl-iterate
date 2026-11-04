---
name: new-mutation-hook
description: >-
  Cria useMutation que grava pelo service e invalida a query key do GET já
  existente. Use para criar, editar, apagar entrada e para criar ou marcar
  task. Não invente query key nova.
---

# Hook de mutation

1. Leia o hook de GET da entidade e anote a key. A mutation invalida essa key, não uma nova.
2. Imite `useUpdateProfile`.
3. `useMutation` chama a função de escrita do service.
4. No sucesso:
   - task invalida `queryKeys.tasks.byEntry(entryId)`
   - entry invalida `queryKeys.entries.all` e, quando o detalhe existe, `queryKeys.entries.byId(id)`
5. Nomes: `useCreateEntry`, `useUpdateEntry`, `useDeleteEntry`, `useCreateTask`, `useToggleTask`.

Não altere a página nesta skill.

## Qualidade

A seção Hook de mutation de `docs/qualidade.md` passa inteira. Se a `invalidateQueries` aponta para uma key que o GET não usa, troque pela key do GET.
