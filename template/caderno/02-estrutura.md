# Estrutura do template

Camadas horizontais, as mesmas do batch: type, service, query key, hook, página.
Pasta por feature ficaria para outro curso. Aqui a prova é justamente achar
o arquivo certo em cada camada.

## Árvore

```txt
dfl-caderno/
├── .cursor/skills/          # git-flow, plan-feature, schema-rls,
│                            # new-service, new-query-hook, new-mutation-hook,
│                            # wire-page, review-diff, open-pr, debug, handoff
├── .github/
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/ci.yml       # npm run check, sem secret
├── docs/
│   ├── usando-a-ia.md
│   ├── plans/
│   │   └── profile.md       # plano ouro, já aceito, só de exemplo
│   └── handoff.md           # não vem no template; a skill cria
├── public/
├── src/
│   ├── main.tsx
│   ├── routes.tsx
│   ├── components/
│   │   ├── layout/          # AppShell, RequireAuth
│   │   └── ui/              # EmptyState, ErrorState, Spinner
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── SettingsPage.tsx
│   │   ├── EntriesPage.tsx          # casca
│   │   └── EntryDetailPage.tsx      # casca
│   ├── hooks/
│   │   ├── index.ts
│   │   ├── useSession.ts
│   │   ├── useGetProfile.ts
│   │   └── useUpdateProfile.ts
│   ├── services/
│   │   ├── index.ts
│   │   ├── profile.service.ts
│   │   └── profile.service.test.ts  # exemplo do mapper
│   ├── types/
│   │   ├── profile.ts
│   │   └── index.ts
│   ├── consts/
│   │   └── routes.ts
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── queryClient.ts
│   │   └── queryKeys.ts
│   └── providers/
│       ├── AuthProvider.tsx
│       └── AppProviders.tsx
├── supabase/
│   └── schema.sql             # profiles, trigger de signup, RLS. Sem usuário falso
├── .env.example
├── AGENTS.md
└── README.md
```

## Por que estes acréscimos

- `consts/routes.ts` — path deixa de ser string solta, no mesmo espírito da query key.
- `providers/AppProviders.tsx` — QueryClient e Auth num lugar só, como um app real sobe.
- `lib/queryClient.ts` separado do client do Supabase — cada um tem um dono.
- `components/ui` com pending, erro e empty — a página da prova usa, em vez de reinventar.
- `components/layout/RequireAuth.tsx` — rota logada pronta. A prova não é configurar o router.
- Trigger em `auth.users` cria `profiles`. Sem seed de usuário: a linha só existe depois do signup, porque `profiles.id` aponta para `auth.users`.
- `npm run check` e o CI rodam sem chave. `supabase.ts` avisa se o env falta e não quebra o import. O client de verdade só nasce quando a URL e a anon key existem.
- CI no template (`.github/workflows/ci.yml`) executa `npm run check` em todo PR. O fellow vê o mesmo sinal que vai ver no trabalho.
- Cascas de `EntriesPage` e `EntryDetailPage` — o `npm run dev` abre, a rota existe, o trabalho do fellow é a lista.
- Um teste do mapper do perfil — mostra função pura testável. Não vira critério da prova.
- Barrels `hooks/index.ts` e `services/index.ts` — igual ao iterate.

## Convenções que a prova cobra

- Hook de leitura: `useGetEntries`, `useGetTasks`.
- Hook de escrita: `useCreateEntry`, `useUpdateEntry`, `useDeleteEntry`, `useCreateTask`, `useToggleTask`.
- Service: `entries.service.ts`, `tasks.service.ts`. Sem React.
- Query key, no formato do iterate:

```ts
export const queryKeys = {
  profile: {
    current: ['profile', 'current'] as const,
  },
  entries: {
    all: ['entries'] as const,
    byId: (id: string) => ['entries', id] as const,
  },
  tasks: {
    byEntry: (entryId: string) => ['tasks', { entryId }] as const,
  },
} as const;
```

- Mutation de task invalida `queryKeys.tasks.byEntry(entryId)`.
- Mutation de entrada invalida `queryKeys.entries.all` e, no detalhe, `queryKeys.entries.byId(id)`.
- Mapper snake_case → camelCase no service. `studied_on` vira `studiedOn`.

## O que não entra

Monorepo, Next, pasta `src/features`, Zod em toda borda, tipos gerados pelo
Supabase, Storybook, Playwright. O batch não ensinou isso. O template que
cobrar isso avalia outra matéria.
