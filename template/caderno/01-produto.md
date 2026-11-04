# Produto e prova

## O que é

Um diário de estudo. O fellow entra, anota uma sessão (`entry`) e os itens
dessa sessão (`tasks`). O dado fica no Supabase dele e some da tela de outra
conta. Serve como prova e, depois, como caderno de verdade.

## Rotas

| Rota | Quem faz | O que mostra |
|---|---|---|
| `/login` | starter | Login e logout, sessão já ligada |
| `/` | fellow | Lista das próprias entradas |
| `/entries/:id` | fellow | Detalhe, tasks, marcar feita, apagar |
| `/settings` | starter | Nome e tema (`light` / `dark`), fatia ouro |

Paths ficam em `src/consts/routes.ts`.

## Tabelas

| Tabela | Colunas | Dono |
|---|---|---|
| `profiles` | `id` (= `auth.uid()`), `name`, `theme` | starter, em `supabase/schema.sql` |
| `entries` | `id`, `user_id`, `title`, `studied_on`, `summary`, `status` (`draft` / `published`) | fellow |
| `tasks` | `id`, `entry_id`, `user_id`, `title`, `done` | fellow |

`status` no banco em inglês. Rótulo na tela em português (rascunho / publicado).

RLS em todas: `user_id = auth.uid()`. O id do dono sai de `supabase.auth.getUser()`
dentro do service. A página não manda `user_id`.

## O que o starter já traz

- Vite, React, TypeScript, React Router, TanStack Query, Tailwind, alias `@/`.
- Client do Supabase, `QueryClient`, `AuthProvider`, rota protegida.
- Perfil de ponta a ponta: type, service, `queryKeys.profile`, `useGetProfile`, `useUpdateProfile`, página de ajustes.
- Estados reutilizáveis: pending, erro com "Tentar de novo", empty.
- `supabase/schema.sql` (profiles + RLS) e `supabase/seed.sql`.
- `.env.example` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
- `npm run check`: `tsc`, lint e busca por `service_role` no que está staged.
- Um teste do mapper do perfil, como exemplo de função pura. A prova não pede teste novo.
- `.github/PULL_REQUEST_TEMPLATE.md` com Summary, What was done e How to verify.
- `AGENTS.md` e as skills em `.cursor/skills/`.
- README com o ritual: criar o projeto, desligar a confirmação de e-mail, colar o schema no SQL Editor, preencher `.env`, `npm install`, `npm run dev`.

Páginas de entradas existem como casca, com a rota registrada, para o app abrir.
O fellow troca a casca pela lista de verdade.

## O que o fellow constrói

- Schema de `entries` e `tasks` (idempotente) dentro de `supabase/schema.sql`.
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
