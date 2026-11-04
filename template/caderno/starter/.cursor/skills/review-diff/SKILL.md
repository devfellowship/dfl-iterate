---
name: review-diff
description: >-
  Revisa o diff contra docs/qualidade.md e corrige o que bloqueia, antes de
  abrir o PR. Use também quando pedirem review de um PR. Não aproveite a
  revisão para ampliar escopo.
---

# Review do diff

1. Leia a seção "Diff, antes do PR" de `docs/qualidade.md`.
2. Olhe `git diff` e `git status`. Confira os oito itens.
3. O que falha, você corrige na mesma branch, na camada dona. Depois rode `npm run check`.
4. Texto de interface e nome de variável que já estão claros ficam como estão.

Quando o pedido for review de um PR alheio, não altere o código. Responda com:

```txt
Pontos fortes
- ...

Ajustes antes do merge
- [ ] ...

Sugestões
- ...
```

Ajuste antes do merge é só item da lista que falhou. Sugestão é o resto.

## Qualidade

Não diga que está pronto enquanto um item da seção Diff estiver falho, ou enquanto `npm run check` falhar.
