# Produto e prova

## O que é

Um diário de estudo. O fellow entra, anota uma sessão (`entry`) e os itens
dessa sessão (`tasks`). O dado fica no Supabase dele e some da tela de outra
conta. Serve como prova e, depois, como caderno de verdade.

## Rotas

| Rota | Quem faz | O que mostra |
|---|---|---|
| `/login` | starter | Criar conta, entrar e sair. Sessão já ligada |
| `/` | fellow | Lista das próprias entradas |
| `/entries/:id` | fellow | Detalhe, tasks, marcar feita, apagar |
| `/settings` | starter | Nome e tema (`light` / `dark`), fatia ouro |

Paths ficam em `src/consts/routes.ts`.

## Tabelas

| Tabela | Colunas | Dono |
|---|---|---|
| `profiles` | `id` (= `auth.uid()`), `name`, `theme` | starter. Um trigger em `auth.users` cria a linha no signup |
| `entries` | `id`, `user_id`, `title`, `studied_on`, `summary`, `status` (`draft` / `published`) | fellow |
| `tasks` | `id`, `entry_id`, `user_id`, `title`, `done`. `entry_id` com `on delete cascade` | fellow |

`status` no banco em inglês. Rótulo na tela em português (rascunho / publicado).

RLS em todas, com policy de select, insert, update e delete. `USING` e
`WITH CHECK` comparam `user_id` a `auth.uid()`. Em `tasks`, a policy também
exige que a `entry` pai seja do mesmo usuário. O id do dono sai de
`supabase.auth.getUser()` dentro do service. A página não manda `user_id`.

Não há `seed.sql` com usuário falso: `profiles.id` referencia `auth.users`,
e a linha nasce no trigger. O que o README chama de ritual continua valendo
(confirmar e-mail desligado, senão o signup não entra).

## O que o starter já traz

- Vite, React, TypeScript, React Router, TanStack Query, Tailwind, alias `@/`.
- Client do Supabase, `QueryClient`, `AuthProvider`, rota protegida.
- Perfil de ponta a ponta: type, service, `queryKeys.profile`, `useGetProfile` (só com sessão), `useUpdateProfile`, página de ajustes. O tema salvo é aplicado no `documentElement`, para o refresh da demo pintar a tela e não só o banco.
- Estados reutilizáveis: pending, erro com "Tentar de novo", empty.
- `supabase/schema.sql` com `profiles`, RLS e o trigger de signup.
- `.env.example` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
- `npm run check`: `tsc`, lint e busca por `service_role` no que está staged.
- Um teste do mapper do perfil, como exemplo de função pura. A prova não pede teste novo.
- `.github/PULL_REQUEST_TEMPLATE.md` com Summary, What was done e How to verify.
- `AGENTS.md` e as skills em `.cursor/skills/`.
- README com o ritual: criar o projeto, desligar a confirmação de e-mail, colar o schema no SQL Editor, preencher `.env`, `npm install`, `npm run dev`.

Páginas de entradas existem como casca, com a rota registrada, para o app abrir.
O fellow troca a casca pela lista de verdade.

## O que o fellow constrói

- Um plano só, "caderno", cobrindo `entries` e `tasks`. Um aceite. Schema das duas tabelas em `supabase/schema.sql`.
- Types, services, query keys, hooks de GET e de mutation, páginas.
- Lista, criar, editar, apagar entrada.
- Na entrada: criar task e marcar `done`.
- Empty, loading e erro com retry.
- Segunda conta no mesmo projeto não vê as linhas da primeira.

Fora da prova: storage, realtime, edge functions, i18n, paginação infinita,
update otimista, tipos gerados pelo CLI do Supabase.

## Demo (a IA descreve isto no PR)

1. Criar conta e entrar.
2. Criar uma entrada com duas tasks e marcar uma como feita.
3. Dar refresh e ver as linhas no Table Editor.
4. Entrar com outra conta e ver a lista vazia.
5. Em `/settings`, trocar o tema e ver o valor sobreviver ao refresh.

## Rubrica

A de sempre, 0 ou 1, olhando o diff. A IA se confere nisto antes de abrir o PR.
O mentor revisa como no dia a dia.

1. Página → hook → service.
2. Query key no factory.
3. Service `async`, sem React.
4. `throw new Error(...)` no erro do Supabase.
5. UI trata `isPending`.
6. UI trata `isError` com ação.
7. Tipagem sem `any` desnecessário.
8. Naming e pastas no padrão.
9. Mudança no escopo do que foi aceito.
10. `npm run check` limpo.

Bloqueia também: `service_role` no client ou no Git, `.env` commitado, tabela
nova sem RLS, `user_id` vindo da página.
