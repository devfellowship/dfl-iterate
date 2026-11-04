# Qualidade

Lista canônica. Cada skill repete só a seção dela. Se uma skill e este arquivo
divergirem, vale este arquivo.

Um item falho se corrige antes de seguir para a próxima skill. A IA não pede
para o fellow preencher isto à mão.

## Plano

- Um arquivo `docs/plans/<slug>.md` por feature. Entries e tasks ficam juntas.
- Tem tabelas e colunas com tipo, rotas, arquivos a criar, query keys, mutations e qual key cada mutation invalida.
- Diz quem pode ler a linha (o dono, via `auth.uid()`).
- Tem "fora de escopo" com pelo menos dois itens.
- Não traz código.
- Termina com "Aguardando aceite". A implementação não começa sem o aceite.

## Schema

- SQL idempotente (`create table if not exists`, `drop policy if exists` antes de criar).
- `enable row level security` na tabela nova.
- Quatro policies: select, insert, update, delete. `USING` e `WITH CHECK` com `auth.uid()`.
- `tasks.entry_id` referencia `entries` com `on delete cascade`, e a policy de task exige que a entry pai seja do mesmo usuário.
- `profiles` e o trigger de signup não são reescritos.
- Nenhum insert de usuário fixo.

## Service

- Arquivo em `src/services/`, sem import de React.
- Funções `async`. Mapper snake_case → camelCase no mesmo arquivo.
- Erro do Supabase vira `throw new Error(...)`.
- O dono vem de `supabase.auth.getUser()`. A função não recebe `userId` da página.
- A query pede as colunas pelo nome. Sem `select('*')` solto quando o mapper já lista os campos.

## Hook de leitura

- Antes de criar, lista o que já existe em `src/types/`, `src/services/`, `src/lib/queryKeys.ts` e `src/hooks/`.
- A key sai de `queryKeys`. String solta não passa.
- Key que já existe é estendida, não duplicada.
- `useQuery` com `queryKey` e `queryFn`. `useGetProfile` só busca com sessão (`enabled`).
- Entidade que não está num plano aceito: para e pergunta.

## Hook de mutation

- `useMutation` chama o service e invalida a key do GET da mesma entidade.
- Task invalida `queryKeys.tasks.byEntry(entryId)`.
- Entry invalida `queryKeys.entries.all` e, no detalhe, `queryKeys.entries.byId(id)`.
- Não cria uma key nova para "a versão atualizada".

## Página

- Importa hook. Não importa service nem `@/lib/supabase`.
- Path vem de `src/consts/routes.ts`.
- Trata `isPending`, `isError` com "Tentar de novo" (`refetch`) e empty quando a lista vem vazia.
- Texto da interface em português.

## Diff, antes do PR

1. Página → hook → service.
2. Query key no factory. Path em `consts/routes.ts`.
3. Service `async`, sem React, com `throw`. Dono via `getUser()`.
4. `isPending`, `isError` com ação, empty na lista.
5. Sem `any` desnecessário.
6. Diff dentro do plano aceito.
7. `npm run check` limpo.
8. RLS nas tabelas novas. `.env` fora do stage. Nenhuma `service_role`.

## Pull request

- Título: `tipo(escopo): assunto no imperativo`, sem ponto final.
- Corpo com Summary, What was done e How to verify.
- How to verify marca só o que esta mudança cobre do roteiro: criar conta, criar entrada com tasks, refresh, Table Editor, outra conta com lista vazia, tema que sobrevive ao refresh.

## Git

- `git pull` na `main` antes de abrir `<usuario>/<tipo>/<descricao-curta>`.
- Uma branch, um objetivo. Commit Conventional Commits.
- `main` sem commit direto e sem force push.
- `.env` não entra no stage.

## Debug

- A mensagem de erro entra na resposta, com a camada dona (type, service, hook, página, schema).
- Uma correção nessa camada. `npm run check` de novo.
- A correção não muda coluna, rota ou escopo do plano aceito. Se precisar mudar, volta para o plano e espera aceite.

## Handoff

- Um arquivo, `docs/handoff.md`, no máximo 60 linhas, sem código.
- Tem branch, objetivo, se o plano está aceito, feito, falta, próximo passo em uma frase e a lista curta de arquivos para abrir.
- O próximo chat faz só esse próximo passo.
