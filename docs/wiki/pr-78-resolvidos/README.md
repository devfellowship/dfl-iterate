# PR #78 — arquivos resolvidos (colar no GitHub Conflict Editor)

> Use no UI **“Resolve conflicts”** da PR #78.
> Em cada arquivo conflitante: **selecione tudo → apague → cole o conteúdo correspondente abaixo** → Mark as resolved.
>
> Pasta com os arquivos prontos: `docs/wiki/pr-78-resolvidos/`

## Ordem sugerida

1. `src/test-utils/user-preferences.dummy.ts` ← `06-user-preferences.dummy.ts`
2. `src/services/user-preferences.service.ts` ← `05-user-preferences.service.ts`
3. `src/lib/queryKeys.ts` ← `03-queryKeys.ts`
4. `src/services/index.ts` ← `04-services-index.ts`
5. `src/hooks/index.ts` ← `02-hooks-index.ts`
6. `src/components/data-layer/HomePageHeaderDataSlots.tsx` ← `01-HomePageHeaderDataSlots.tsx`

## O que cada um preserva

| Arquivo | Main (outros) | Gabi (M2) |
|---|---|---|
| Header slots | T1, T4, T10 vivos | toggles + `useUpdateUserPreferences` |
| hooks/index | todos os `useGet*` | + `useUpdateUserPreferences` |
| queryKeys | todas as keys | + fix sintaxe quebrada do `leaderboard` |
| services/index | todos os services | preferences (já existia) |
| preferences.service | GET | + `updateUserPreferences` + getter |
| preferences.dummy | dados iniciais | store mutável get/set/reset |

## Atenção

- `AppearanceSettingsPanel.tsx` **não** está na lista de conflitos — o merge automático já puxou a versão com toggles da Gabi. Não precisa colar nada nele.
- `useUpdateUserPreferences.ts` também já entra como arquivo novo sem conflito.
- Em `queryKeys.leaderboard.list()` ficou `['leaderboard']` (como o #77 pretendia; a main estava com sintaxe inválida).
