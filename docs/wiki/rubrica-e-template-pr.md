# Rubrica de Review + Template de PR (Batch)

> **Branches, commits e título de PR:** [`padrao-git-branches-commits-pr.md`](./padrao-git-branches-commits-pr.md)

Use esta rubrica antes de pedir review e durante o review entre pares.

## Rubrica (0 ou 1 por critério)

1. Arquitetura correta (`component -> hook -> service`)
2. Query key no factory (`queryKeys.ts`)
3. Service `async`, sem React
4. Erro semântico com `throw new Error(...)`
5. UI trata `isPending`
6. UI trata `isError` com ação
7. Tipagem clara (sem `any` desnecessário)
8. Naming e estrutura no padrão
9. Mudança focada no escopo da task
10. `tsc` + `lint` sem novos erros

Pontuação máxima: 10.

---

## Erros bloqueadores (não mergear)

- Dummy importado direto na página/componente
- Query key hardcoded/string solta
- Sem tratamento de loading/erro
- Service com lógica de React
- Build/typecheck quebrado
- Mudança fora de escopo sem alinhamento

---

## Não bloqueadores (pode melhorar depois)

- Texto de UX pode melhorar
- Trechos de JSX poderiam ser extraídos
- Comentários/javadocs podem ficar mais claros
- Naming bom, mas refinável

---

## Template de descrição de PR (copiar e colar)

> Formato oficial e exemplo: [`padrao-git-branches-commits-pr.md`](./padrao-git-branches-commits-pr.md) §3.

```md
## Summary
O que você entregou e por quê (2–4 linhas).

## Issue
`{id-da-task-na-plataforma}`

## What was done
- [ ] Item 1
- [ ] Item 2
- [ ] Item 3
```

---

## Modelo de comentário de review (mentor)

```md
✅ Pontos fortes
- ...
- ...

🔧 Ajustes antes do merge
- [ ] ...
- [ ] ...

🧭 Sugestões não bloqueantes
- ...
```
