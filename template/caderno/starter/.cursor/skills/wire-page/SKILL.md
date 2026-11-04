---
name: wire-page
description: >-
  Liga a página ao hook, com pending, erro com tentar de novo e empty. Use ao
  implementar EntriesPage ou EntryDetailPage. A página não importa service nem
  o client do Supabase.
---

# Página

1. Leia `SettingsPage` e os componentes em `src/components/ui` (pending, erro, empty).
2. A página importa o hook. Não importa service nem `@/lib/supabase`.
3. Links e `navigate` usam `src/consts/routes.ts`.
4. Três estados, sempre:
   - `isPending` → indicador de carregamento
   - `isError` → mensagem e botão "Tentar de novo" que chama `refetch`
   - lista vazia → empty state em português
5. Texto da interface em português. Identificadores em inglês.

Não busque dado novo aqui. Se falta um GET ou uma mutation, pare e use a skill do hook.

## Qualidade

A seção Página de `docs/qualidade.md` passa inteira.
