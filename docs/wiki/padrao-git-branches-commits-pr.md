# Padrão Git — Branches, Commits e Pull Requests (DevFellowship)

> **Para quem é:** fellows, mentores e reviewers em qualquer repo do ecossistema DFL (`dfl-iterate`, `dfl-tracks`, etc.).
>
> **Objetivo:** mesmo vocabulário em branch, commit e PR — review mais rápido, histórico legível, menos retrabalho.

---

## Fluxo em 4 passos

```txt
1. git pull na main
2. criar branch no padrão
3. commits pequenos e atômicos
4. abrir PR com título + descrição no template
```

Antes do primeiro commit da task: `git fetch && git pull origin main`.

---

## 1. Padrão de branches

### Formato oficial

```txt
<usuario>/<tipo>/<identificador>-<descricao-curta>
```

| Parte               | Regra                                                    | Exemplo                                    |
| ------------------- | -------------------------------------------------------- | ------------------------------------------ |
| **usuario**         | Seu nome ou identificador (minúsculas, sem espaço)       | `ana`, `maria`, `alexandre`                |
| **tipo**            | Mesmo vocabulário dos commits                            | `feat`, `fix`, `docs`, `chore`, `refactor` |
| **identificador**   | Task do batch **ou** issue da plataforma                 | `T1`, `DEV-170`                            |
| **descricao-curta** | kebab-case, inglês ou português sem acento, 2–5 palavras | `user-profile`, `lesson-progress`          |

### Exemplos válidos

```txt
ana/feat/T1-user-profile
maria/feat/T5-lesson-progress-bar
alexandre/fix/DEV-598-edge-fn-docs
ana/docs/wiki-git-padrao
lucas/chore/deps-vitest-bump
```

### Exemplos a evitar

| ❌ Evitar                         | Por quê                                       |
| --------------------------------- | --------------------------------------------- |
| `minha-branch`                    | Sem usuário, tipo nem contexto                |
| `feat/T1-ana`                     | Tipo antes do usuário — use `ana/feat/T1-...` |
| `ana/feat/T1`                     | Curta demais — falta descrição ou task        |
| `Ana/feat/T1_perfil`              | Maiúsculas e underscore fora do padrão        |
| `ana/feature/nova-funcionalidade` | Use `feat`, não `feature`                     |
| Branch na `main` direto           | Sempre branch + PR                            |

### Regras práticas

- **Uma branch = uma task / um objetivo.** Não misturar T1 + T4 na mesma branch.
- **Rebase ou merge da `main`** antes de abrir PR se a branch ficou velha.
- Nome em **minúsculas**; separador **hífen** (`-`).
- Se a task tiver ID na plataforma, prefira `DEV-123` no nome da branch.

### Batch Camada de Dados (dfl-iterate)

Padrão enxuto para tasks T1–T11:

```txt
<seu-nome>/feat/T{N}-<descricao-curta>
```

Ex.: `maria/feat/T3-announcements`, `lucas/feat/T10-notifications`.

### Saiba mais (branches)

| Recurso                   | Link                                                                                                                                                                                                                 |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Git — o que é uma branch  | [Git Book — Branches in a Nutshell](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell)                                                                                                             |
| Fluxo branch → PR → merge | [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow)                                                                                                                                       |
| Criar e trocar de branch  | [GitHub Docs — Managing branches](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-and-deleting-branches-within-your-repository) |

> O padrão `<usuario>/<tipo>/...` é convenção **DevFellowship** (facilita saber quem é o dono da branch). Os tipos (`feat`, `fix`, …) seguem o mesmo vocabulário de [Conventional Commits](https://www.conventionalcommits.org/).

---

## 2. Padrão de commits

Seguimos **[Conventional Commits](https://www.conventionalcommits.org/)** — especificação aberta para mensagens legíveis e histórico automatizável (changelog, semver). Já usado em `AGENTS.md` e nos PRs do ecossistema DFL.

### Formato

```txt
<tipo>(<escopo-opcional>): <assunto no imperativo>
```

| Campo       | Regra                                      |
| ----------- | ------------------------------------------ |
| **tipo**    | O que mudou (ver tabela abaixo)            |
| **escopo**  | Módulo afetado — opcional, mas recomendado |
| **assunto** | Imperativo, curto, **sem ponto final**     |

### Tipos permitidos

| Tipo       | Quando usar                               |
| ---------- | ----------------------------------------- |
| `feat`     | Nova funcionalidade ou fatia de task      |
| `fix`      | Correção de bug                           |
| `refactor` | Mudança interna sem alterar comportamento |
| `docs`     | Só documentação                           |
| `test`     | Só testes                                 |
| `chore`    | Manutenção (deps, config, scripts)        |
| `ci`       | Pipelines e GitHub Actions                |

### Exemplos bons

```txt
feat(data-layer): add useGetUserProfile hook and service
feat(home): integrate T1 profile slot in header
fix(lesson-progress): calculate percent in service
docs(wiki): add git branches and PR guide
chore(deps): bump vitest to 4.1.0
```

### Exemplos ruins

| ❌ Commit            | ✅ Melhor                                           |
| -------------------- | --------------------------------------------------- |
| `fixed stuff`        | `fix(home): handle lesson load error state`         |
| `WIP`                | Não commitar WIP na PR final; use commit descritivo |
| `feat: tudo`         | Commits atômicos por camada ou etapa                |
| `Added UserProfile.` | `feat(types): add UserProfile interface`            |

### Commits atômicos (regra de ouro)

**Um commit = uma ideia.** Para tasks de camada de dados, sequência natural:

```txt
feat(types): add UserProfile interface
feat(test-utils): add user profile dummy
feat(services): add getUserProfile with simulated latency
feat(hooks): add useGetUserProfile query
feat(home): wire T1 profile slot with loading and error states
```

Não é obrigatório ser 5 commits — mas **evite** um único commit gigante com type + dummy + service + hook + UI se puder separar em 2–3 commits legíveis.

### Corpo do commit (opcional)

Use quando o _porquê_ não cabe no título:

```txt
feat(services): filter expired announcements in getAnnouncements

Removes items past expiresAt before returning to the UI.
Empty array after filter is valid — not an error.
```

### Saiba mais (commits)

| Recurso                                                | Link                                                                                                                                                            |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Conventional Commits** (especificação oficial)       | [conventionalcommits.org](https://www.conventionalcommits.org/)                                                                                                 |
| Versão 1.0.0 da spec (tipos e escopo)                  | [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)                                                                                   |
| Como escrever boa mensagem (imperativo, corpo, porquê) | [How to Write a Git Commit Message — Chris Beams](https://cbea.ms/git-commit/)                                                                                  |
| Commits atômicos (uma ideia por commit)                | [GitHub — Commit often](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/creating-a-pull-request/creating-a-pull-request#commit-often) |

**Dica:** use o vocabulário da spec (`feat`, `fix`, `docs`…) no **commit** e no **tipo** da branch — fica fácil ligar branch → commits → PR.

---

## 3. Padrão de Pull Request

### Quando abrir

- Escopo da task **completo** (ou fatia acordada com mentor).
- `npx tsc --noEmit` e `npm run lint` passando.
- Teste manual do fluxo loading → sucesso → erro (quando aplicável).

### Título da PR

```txt
<tipo>(<escopo>): <descrição curta em inglês ou português>
```

Ou, para tasks nomeadas do batch:

```txt
feat(T1): integrate user profile in HomePage header
feat(T5): add lesson progress bar per LessonCard
```

**Regras:**

- Espelhe o **último commit principal** ou o tema da task.
- Evite títulos genéricos: `update`, `changes`, `fix pr comments` (use isso só em follow-up se necessário).
- Máximo ~72 caracteres quando possível.

### Descrição da PR — template oficial

Copie, preencha as três seções abaixo.

```markdown
## Summary

O que você entregou e por quê (2–4 linhas). Conecte com o objetivo da task.

## Issue

`{id-da-task-na-plataforma}`

> Onde achar: abra a task na plataforma → modal **Update Task** → o ID (UUID) aparece **logo abaixo do título**, antes do campo "Task name". Copie e cole aqui.

## What was done

- [ ] …
- [ ] …
- [ ] …
```

**Antes de abrir a PR** (não precisa ir na descrição): rode `npx tsc --noEmit` e `npm run lint`, e teste loading → sucesso → erro na tela.

> Template automático do GitHub: `.github/PULL_REQUEST_TEMPLATE.md` (mesmo formato).

### Saiba mais (pull requests)

| Recurso                             | Link                                                                                                                                                                                    |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| O que é uma PR e por que usamos     | [GitHub — About pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)         |
| Como abrir uma PR passo a passo     | [GitHub — Creating a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) |
| Boas práticas de descrição e review | [GitHub — Best practices for pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/best-practices-for-pull-requests)                 |
| Template de PR neste repo           | `.github/PULL_REQUEST_TEMPLATE.md`                                                                                                                                                      |

---

### Exemplo preenchido (T1)

**Título:** `feat(T1): integrate user profile in HomePage header`

**Descrição:**

```markdown
## Summary

Implementei a fatia de dados do perfil do usuário (type → dummy → service → `useGetUserProfile`) e conectei ao header da HomePage, substituindo o mock por loading, erro com retry e sucesso.

## Issue

`216911f8-287f-4f5b-be70-8141dba1xxxx`

## What was done

- [x] `UserProfile` + dummy + `getUserProfile`
- [x] `queryKeys.userProfile.current` + `useGetUserProfile`
- [x] Slot T1 em `HomePageHeaderDataSlots.tsx` com `isPending` e `isError` + `refetch`
```

---

## 4. Checklist antes de pedir review

- [ ] Branch nomeada no padrão `<usuario>/<tipo>/<id>-<descricao>`
- [ ] Commits legíveis (não só `wip` / `fix`)
- [ ] PR aponta para `main` (ou branch base indicada pelo mentor)
- [ ] Descrição com **Summary**, **Issue** (ID da task na plataforma) e **What was done**
- [ ] `tsc` + `lint` ok
- [ ] Escopo **só** da sua task (sem refatoração colateral)
- [ ] Sem secrets, `.env`, ou dummy importado na UI

Review detalhado: [`rubrica-e-template-pr.md`](./rubrica-e-template-pr.md).

---

## 5. Erros comuns

| Sintoma                               | Causa provável                        | Correção                                           |
| ------------------------------------- | ------------------------------------- | -------------------------------------------------- |
| PR com 40 arquivos fora do escopo     | Branch velha ou `main` não atualizada | `git pull origin main` e branch nova se necessário |
| Review pede “cadê o erro?”            | `isError` omitido silenciosamente     | Mensagem + `refetch()` na integração               |
| Conflito em `HomePageHeaderDataSlots` | Vários fellows no mesmo arquivo       | Coordenar merge; PRs menores e sequenciais         |
| CI vermelho só no PR                  | Lint/tsc não rodou local              | Rodar validação antes de push                      |
| Título da PR “Update HomePage”        | Título genérico                       | `feat(T1): integrate user profile in header`       |

---

## 6. Referências

### Wiki e repositório (DevFellowship)

| Documento                                                                        | Conteúdo                                  |
| -------------------------------------------------------------------------------- | ----------------------------------------- |
| [`rubrica-e-template-pr.md`](./rubrica-e-template-pr.md)                         | Rubrica de review + comentário de mentor  |
| [`comece-por-aqui.md`](./comece-por-aqui.md)                                     | Entrada do batch Camada de Dados          |
| [`padrao-ouro-tasks-camada-de-dados.md`](./padrao-ouro-tasks-camada-de-dados.md) | Fluxo type → dummy → service → hook       |
| `AGENTS.md` (raiz do repo)                                                       | Regras para agentes e commits atômicos    |
| `.github/PULL_REQUEST_TEMPLATE.md`                                               | Template automático ao abrir PR no GitHub |

### Aprender mais (externo)

| Tema                 | Recurso                                                                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Commits**          | [Conventional Commits](https://www.conventionalcommits.org/)                                                                                                                    |
| **Commits**          | [How to Write a Git Commit Message](https://cbea.ms/git-commit/)                                                                                                                |
| **Branches & fluxo** | [Git Book — Branching](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell)                                                                                     |
| **Branches & fluxo** | [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow)                                                                                                  |
| **Pull requests**    | [GitHub — About pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) |
| **Pull requests**    | [GitHub — Best practices for pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/best-practices-for-pull-requests)         |
| **Git (geral)**      | [Pro Git Book](https://git-scm.com/book/en/v2)                                                                                                                                  |

---

_Padrão DevFellowship — branches, commits e PRs alinhados ao fluxo de fellows e ao template do repositório._
