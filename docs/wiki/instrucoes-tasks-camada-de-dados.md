# Instruções — Tasks T1–T11 (Camada de Dados)

> **Para quem é:** fellows que **já dominam** componentes, hooks e estrutura do React — e estão implementando as tasks de **services + React Query** no `dfl-iterate`.
>
> **Fellow que acabou de entrar?** Comece em [`onboarding-fellows-novos.md`](./onboarding-fellows-novos.md).

---

## O que você está fazendo agora

```txt
type → dummy → service → queryKey → useGet* → integração (substituir mock nos *DataSlots*)
```

O visual já existe em `src/components/data-layer/`. Você implementa a **camada de dados** e conecta nos slots indicados.

---

## Leitura obrigatória (nesta ordem)

### 1. Git, branch, commit e PR — **leia antes de abrir sua PR**

📌 **[`padrao-git-branches-commits-pr.md`](./padrao-git-branches-commits-pr.md)**

Este é o documento mais importante **desta fase**. Ele define:

| Tópico | Padrão |
|---|---|
| **Branch** | `<seu-nome>/feat/T{N}-<descricao>` |
| **Commit** | [Conventional Commits](https://www.conventionalcommits.org/) — ex.: `feat(services): add getUserProfile` |
| **PR — título** | `feat(T1): integrate user profile in HomePage header` |
| **PR — descrição** | `Summary` + `Issue` (ID da task na plataforma) + `What was done` |

**Issue na PR:** copie o **UUID** da task no modal **Update Task** — logo abaixo do título, antes de "Task name".

### 2. Fluxo da sua task

| # | Documento | Para quê |
|---|---|---|
| 2 | [`comece-por-aqui.md`](./comece-por-aqui.md) | Mapa geral do batch |
| 3 | [`o-que-esperamos-ate-a-reuniao.md`](./o-que-esperamos-ate-a-reuniao.md) | `useState` vs React Query, `queryKey`, erros |
| 4 | [`padrao-ouro-tasks-camada-de-dados.md`](./padrao-ouro-tasks-camada-de-dados.md) | Regras completas |
| 5 | [`contratos-json-tasks-camada-de-dados.md`](./contratos-json-tasks-camada-de-dados.md) | JSON da **sua** task |
| 6 | [`receita-pratica.md`](./receita-pratica.md) | Passo a passo ao codar |
| 7 | [`rubrica-e-template-pr.md`](./rubrica-e-template-pr.md) | O que o mentor avalia no review |

---

## Antes de codar

```bash
git fetch && git pull origin main
```

Crie a branch:

```txt
<seu-nome>/feat/T{N}-<descricao-curta>
```

Ex.: `ana/feat/T1-user-profile`

---

## Onde integrar (sua task)

| Tasks | Arquivo |
|---|---|
| T1, T2, T4, T6, T10 | `src/components/data-layer/HomePageHeaderDataSlots.tsx` |
| T3, T7, T8, T9, T11 | `src/components/data-layer/HomePageDataSlots.tsx` |
| T5 | `src/pages/HomePage.tsx` (`LessonCard`) |

Referência de código existente:

- `src/services/lessons.service.ts`
- `src/hooks/useLessons.ts` (legado — copie a **estrutura**, nomeie `useGet*`)
- `src/lib/queryKeys.ts`

---

## Regras que o review vai cobrar

- Hook: **`useGet*`** — 1 arquivo por ação
- Service: `async`, sem React, `throw new Error(...)` em falha
- Query key: sempre via `queryKeys.ts`
- **Não** importar dummy nos slots/páginas
- **Não** React Query dentro de `src/components/data-layer/`
- **`isError` explícito** — mensagem + **Tentar de novo** (`refetch()`), nunca omitir silenciosamente

---

## Antes de abrir a PR

- [ ] `npx tsc --noEmit`
- [ ] `npm run lint`
- [ ] Testei loading → sucesso → erro na tela
- [ ] Branch no padrão `<nome>/feat/T{N}-...`
- [ ] Commits legíveis (Conventional Commits)
- [ ] Descrição da PR com **Summary**, **Issue** (UUID) e **What was done**

Template completo: [`padrao-git-branches-commits-pr.md`](./padrao-git-branches-commits-pr.md) §3.

---

## Conflitos de merge (coordenar)

| Arquivo | Tasks que compartilham |
|---|---|
| `HomePageHeaderDataSlots.tsx` | T1, T2, T4, T6, T10 |
| `HomePageDataSlots.tsx` | T3, T7, T8, T9, T11 |

Combine ordem de merge com o mentor ou abra PRs em sequência.

---

## Se travar

1. [`receita-pratica.md`](./receita-pratica.md)
2. Contrato JSON da sua task
3. [`padrao-git-branches-commits-pr.md`](./padrao-git-branches-commits-pr.md) — se a dúvida for branch/commit/PR
4. Peça ajuda com: service, hook, slot, saída do `tsc`

Bom trabalho!
