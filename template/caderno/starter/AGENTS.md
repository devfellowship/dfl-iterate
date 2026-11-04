# AGENTS.md — Caderno de bordo

Lei deste repositório. Skills em `.cursor/skills/` detalham um passo. A lista
canônica de qualidade está em `docs/qualidade.md`. Se uma skill e esse arquivo
divergirem, vale `docs/qualidade.md`. Este arquivo manda na arquitetura e no
fluxo quando os dois falarem com a skill.

O fellow pede o resultado como no dia a dia ("cria a lista de entradas",
"revisa o PR", "continua do handoff"). Você executa branch, código,
`npm run check` e o texto do PR. Ele lê o diff. Não peça para ele redigir
plano, commit ou descrição de PR.

## Arquitetura

```txt
página → hook (useQuery / useMutation) → service async → Supabase
```

- Tipos em `src/types/`. Consts em `src/consts/`. Query keys só em `src/lib/queryKeys.ts`. Paths só em `src/consts/routes.ts`.
- O client do Supabase mora em `src/lib/supabase.ts`. Service é o único lugar que o importa.
- Página e componente importam hook. Não importam service nem o client.
- Service sem React: `async`, mapper snake_case → camelCase, `throw new Error(...)` quando o Supabase devolver `error`.
- O id do dono sai de `supabase.auth.getUser()` dentro do service.
- Mutation invalida a query key do GET da mesma entidade.
- Toda lista trata `isPending`, `isError` (mensagem + "Tentar de novo") e empty.
- Identificadores em inglês. Texto de interface em português.
- A fatia ouro é o perfil: `profile.service.ts`, `useGetProfile`, `useUpdateProfile`, `queryKeys.profile`. Feature nova imita esses arquivos.
- Domínio da prova: `entries` e `tasks` (`entry_id`). `profiles` já vem pronta.

Fora de escopo: storage, realtime, edge functions, i18n, paginação infinita,
update otimista, tipos gerados pelo CLI do Supabase.

## Segurança

- No Vite entra só `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`. A chave `service_role` não vai para o client, para o Git nem para o texto do PR.
- `.env` fica de fora do commit. O exemplo versionado é `.env.example`.
- Tabela nova nasce com `enable row level security` e policies de select, insert, update e delete. `USING` e `WITH CHECK` usam `auth.uid()`. Em `tasks`, a policy também exige que a entry pai seja do mesmo usuário. Apagar entry usa `on delete cascade` nas tasks.
- `profiles` nasce num trigger `after insert` em `auth.users`. Não invente seed com usuário fixo.
- `supabase/schema.sql` é a fonte da tabela. SQL idempotente (`if not exists`).
- Interface com o escape padrão do React, sem `dangerouslySetInnerHTML`.

## Git

Você opera o git.

1. `git pull` na `main` e abra `<usuario>/<tipo>/<descricao-curta>`. Tipos: `feat`, `fix`, `chore`, `refactor`, `docs`. Exemplo: `ana/feat/entries-list`.
2. Uma branch, um objetivo. Commits no Conventional Commits, imperativo, sem ponto final: `feat(entries): add list query and service`.
3. Vários commits na mesma branch cabem (schema, service, página).
4. Antes do PR, traga a `main` para a branch se ela tiver ficado para trás.
5. A `main` não recebe commit direto nem force push.

O prefixo `<usuario>` é o que já aparece nas branches desse clone. Se ainda
não houver nenhuma, pergunte o prefixo uma vez e reutilize.

## Plano e aceite

Entidade ou tabela nova: grave `docs/plans/<slug>.md` (tabela, colunas, rotas,
arquivos, query keys, mutations, fora de escopo) e pare. Implemente só depois
de um aceite explícito do fellow: "aceito", "pode executar" ou "ok, executa".
Entries e tasks cabem no mesmo plano e no mesmo aceite.

Se ele mudar o plano, regrave o arquivo e espere de novo. Correção dentro do
que já foi aceito segue direto, sem plano novo.

## Handoff

Quando o fellow for abrir outro chat, ou quando a conversa estiver longa e a
fatia atual já tiver um próximo passo claro, regrave `docs/handoff.md` (um
arquivo só, no máximo ~60 linhas, sem código):

- branch, objetivo, plano (caminho + se está aceito)
- feito, falta, próximo passo em uma frase
- lista curta de arquivos para o próximo chat abrir

No chat novo, se pedirem para continuar, leia `docs/handoff.md` e esses
arquivos e faça o próximo passo. Não varra o repositório.

## Contexto

- Leia a fatia ouro e os arquivos que o pedido cita.
- Entidade que já está em `queryKeys.ts` se estende. Não crie uma segunda key para o mesmo dado.
- Um objetivo por turno. Diff mínimo. Não reescreva arquivo que já está no padrão.
- Erro de `tsc`, lint ou Supabase: leia a mensagem, corrija a camada dona e rode `npm run check` de novo.

## Antes de dizer que terminou

Olhe o diff e corrija o que falhar. Só então escreva o PR.

1. Caminho página → hook → service.
2. Query key no factory. Path em `consts/routes.ts`.
3. Service `async`, sem React, com `throw` no erro. Dono via `getUser()`.
4. `isPending` e `isError` com ação. Empty quando a lista vem vazia.
5. Tipagem sem `any` desnecessário.
6. Mudança dentro do que foi aceito.
7. `npm run check` limpo.
8. Tabela nova com RLS e `auth.uid()`. `.env` fora do stage. Nenhuma `service_role`.

O corpo do PR leva Summary, What was done e How to verify (criar conta, criar
uma entrada com tasks, refresh, ver no Table Editor, entrar com outra conta e
ver a lista vazia). Você preenche. Quando pedirem review de um PR, responda
com pontos fortes, ajustes antes do merge e sugestões soltas.

## Skills

| Situação | Skill |
|---|---|
| Abrir branch | `git-flow` |
| Entidade nova | `plan-feature` (para no aceite), depois `schema-rls` |
| Service, GET, mutation, página | `new-service`, `new-query-hook`, `new-mutation-hook`, `wire-page` |
| Diff e PR | `review-diff`, `open-pr` |
| Erro de check ou do Supabase | `debug` |
| Trocar de chat | `handoff` |
