---
name: git-flow
description: >-
  Atualiza a main e abre a branch no padrão <usuario>/<tipo>/<descricao>.
  Use ao começar uma feature, um fix ou um chore, e antes do primeiro commit
  de uma tarefa. Não use para implementar código.
---

# Git flow

Abra a branch e pare. Não edite produto nesta skill.

1. Confira `git status`. Mudança sem commit fica guardada ou commitada na branch atual antes do checkout. Não descarte trabalho do fellow.
2. `git checkout main` e `git pull origin main`.
3. O prefixo é o que já aparece nas branches deste clone (`ana/feat/...`). Se não houver nenhuma, pergunte o prefixo uma vez.
4. Crie `<usuario>/<tipo>/<descricao-curta>`, em minúsculas e hífen. Tipos: `feat`, `fix`, `chore`, `refactor`, `docs`. Exemplo: `ana/feat/entries-list`.
5. Uma branch, um objetivo.

## Qualidade

Confira a seção Git de `docs/qualidade.md`.

- A `main` não recebe commit nem force push.
- `.env` não entra no stage.

Diga a branch criada e pare.
