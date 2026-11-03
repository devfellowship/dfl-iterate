# Comece por aqui — Batch de Camada de Dados (dfl-iterate)

Bem-vindo(a)!  
Este é o ponto de entrada para executar as tasks do batch com o padrão do projeto.

## Objetivo deste batch

Aprender e aplicar o fluxo oficial de dados:

```txt
type → dummy → service → queryKey → useGet* → integração (substituir mock)
```

O **visual já está pronto** em `src/components/data-layer/`. Você liga os dados.

---

## Ordem de leitura recomendada (não pule)

1. [**O que esperamos até a reunião**](./o-que-esperamos-ate-a-reuniao.md)
2. [**Padrão ouro — Tasks de Camada de Dados**](./padrao-ouro-tasks-camada-de-dados.md)
3. [**Contratos JSON**](./contratos-json-tasks-camada-de-dados.md) (sua task)
4. [**Issues T1–T11**](./issues-batch-camada-de-dados.md) (referência expandida)
5. [**Tasks para a plataforma**](./tasks-plataforma-camada-de-dados.md) (copiar name / points / description)
6. [**Receita prática**](./receita-pratica.md)
7. [**Padrão Git — branches, commits e PR**](./padrao-git-branches-commits-pr.md)
8. [**Rubrica + template PR**](./rubrica-e-template-pr.md)

---

## Antes de começar sua task

1. `git fetch && git pull` na `main` (componentes + preview mock).
2. Leia a issue completa e o contrato JSON da sua task.
3. Abra os arquivos-modelo:
   - `src/services/lessons.service.ts`
   - `src/lib/queryKeys.ts`
   - `src/components/data-layer/HomePageHeaderDataSlots.tsx` (T1, T2, T4, T6, T10)
   - `src/components/data-layer/HomePageDataSlots.tsx` (T3, T7, T8, T9, T11)
4. Crie branch no padrão: `<seu-nome>/feat/T{N}-<descricao>` — ver [`padrao-git-branches-commits-pr.md`](./padrao-git-branches-commits-pr.md).

---

## Onde cada task integra

| Task                | Arquivo que você edita                  |
| ------------------- | --------------------------------------- |
| T1, T2, T4, T6, T10 | `HomePageHeaderDataSlots.tsx`           |
| T3, T7, T8, T9, T11 | `HomePageDataSlots.tsx`                 |
| T5                  | `HomePage.tsx` (dentro de `LessonCard`) |

Preview com mock hoje → você troca por `useGet*` + `isPending` / `isError`.

---

## Regras de ouro

- Hooks: **`useGet*`** (Escola A) — 1 arquivo por ação CRUD.
- Service: `async`, sem React, `throw new Error(...)` em falha.
- Query key: sempre via `queryKeys.ts`.
- **Não** importar dummy nos slots ou páginas.
- **Não** colocar React Query em `src/components/data-layer/`.

---

## Checklist rápido

- [ ] Type em `src/types/index.ts`
- [ ] Dummy em `src/test-utils/`
- [ ] Service em `src/services/`
- [ ] Query key + `useGet*`
- [ ] Mock substituído no slot correto
- [ ] `isPending` e `isError` tratados (`isError` → mensagem + **Tentar de novo**, nunca omitir silenciosamente)
- [ ] `npx tsc --noEmit` + `npm run lint`

---

## Se travar

1. Revise [**Receita prática**](./receita-pratica.md).
2. Confira o contrato JSON da sua task.
3. Peça ajuda com: hook, service, slot de integração, saída do `tsc`.

Bom trabalho!
