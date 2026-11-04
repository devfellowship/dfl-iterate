# Plano — perfil (exemplo ouro, já aceito)

Este plano já foi implementado no starter. Serve de formato. Não reimplemente.

## Tabelas

`profiles` (pronta no schema):

| Coluna | Tipo | Nota |
|---|---|---|
| `id` | `uuid` | igual a `auth.uid()`, nasce no trigger de signup |
| `name` | `text` | |
| `theme` | `text` | `light` ou `dark` |

Quem lê e escreve: só o dono.

## Rotas

- `/settings` — ler e atualizar nome e tema
- `/login` — criar conta, entrar, sair

## Arquivos

- `src/types/profile.ts`
- `src/services/profile.service.ts`
- `src/lib/queryKeys.ts` — `profile.current`
- `src/hooks/useGetProfile.ts`
- `src/hooks/useUpdateProfile.ts`
- `src/pages/SettingsPage.tsx`

## Query keys e mutations

- Leitura: `queryKeys.profile.current`
- `useUpdateProfile` invalida `queryKeys.profile.current`

## Fora de escopo

- Foto de avatar
- Mais de um idioma

Aceito. Implementado no starter.
