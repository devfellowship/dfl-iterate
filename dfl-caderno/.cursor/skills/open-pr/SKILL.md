---
name: open-pr
description: >-
  Abre o pull request com título Conventional Commits e o corpo do template
  (Summary, What was done, How to verify). Use depois de review-diff limpo.
  Você escreve o texto. Não peça para o fellow redigir.
---

# Abrir o PR

1. `review-diff` já passou e `npm run check` está limpo. Se não passou, volte para lá.
2. Traga a `main` para a branch se ela ficou para trás.
3. Título: `tipo(escopo): assunto no imperativo`, sem ponto final. Exemplo: `feat(entries): add list query and service`.
4. Corpo no formato de `.github/PULL_REQUEST_TEMPLATE.md`. Marque em How to verify só o que esta mudança cobre.
5. Você preenche Summary e What was done a partir do diff. Não peça redação ao fellow.
6. A `main` não recebe push direto.

## Qualidade

A seção Pull request de `docs/qualidade.md` passa inteira. Entregue a URL do PR.
