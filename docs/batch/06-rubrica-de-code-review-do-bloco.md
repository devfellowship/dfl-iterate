# Rubrica de Code Review — Bloco 3

## Quando usar este documento

- Mentores: para revisar PRs com critério consistente.
- Fellows: para autoavaliar antes de abrir PR.

## Resumo em 5 pontos

- Avaliação foca mais em arquitetura e clareza do que "tricks".
- Erros bloqueadores precisam ser corrigidos antes do merge.
- Ajustes não bloqueadores podem virar follow-up.
- PR pequena e focada acelera aprovação.
- Checklist final evita retrabalho.

---

## Rubrica (0 ou 1 por critério)

Pontuação sugerida: 10 critérios, máximo 10 pontos.

### 1) Arquitetura do fluxo de dados (1 ponto)
- [ ] Usa `component -> hook -> service` corretamente.

### 2) Query keys centralizadas (1 ponto)
- [ ] Hook usa `queryKeys` do factory.

### 3) Service no padrão (1 ponto)
- [ ] `async`, sem React, com retorno tipado.

### 4) Tratamento de erro semântico (1 ponto)
- [ ] Service usa `throw new Error(...)` quando recurso não existe.

### 5) Estados de UI (1 ponto)
- [ ] Componente trata `isPending` e `isError`.

### 6) Estado vazio (1 ponto)
- [ ] Se aplicável, trata empty state de forma explícita.

### 7) Tipagem e legibilidade (1 ponto)
- [ ] Sem `any` desnecessário; nomes claros.

### 8) Naming e estrutura (1 ponto)
- [ ] Nome de hook/service/pasta conforme padrão.

### 9) Impacto controlado (1 ponto)
- [ ] Mudança focada no escopo da task.

### 10) Qualidade de entrega (1 ponto)
- [ ] `tsc` e `lint` sem novos erros.

---

## Erros bloqueadores (não pode mergear)

- Import direto de dummy no componente/página.
- Query key hardcoded/string solta no hook.
- Ausência de tratamento de loading/erro.
- Service com lógica de React (`useState`, JSX, etc.).
- Quebra de build/typecheck.
- Mudança fora de escopo sem alinhamento.

---

## Ajustes não bloqueadores (pode mergear com follow-up)

- texto de UX pode melhorar;
- organização de pequenos blocos de JSX;
- comentário extra de contexto no JSDoc;
- naming bom, mas melhoravel.

---

## Modelo de feedback do mentor

### Modelo curto

```md
## Review

✅ Pontos fortes
- Arquitetura bem separada (hook -> service).
- Tratamento de erro com refetch ficou bom.

🔧 Ajustes necessários antes de merge
- [ ] Mover query key hardcoded para `queryKeys.ts`.
- [ ] Tratar `isPending` na página.

🧭 Sugestão de melhoria (não bloqueante)
- Extrair bloco de erro para componente reutilizável.
```

### Modelo de aprovacao

```md
## Review

PR aprovada. Fluxo no padrão ouro do bloco:
- query key centralizada;
- service async sem React;
- UI com loading/erro/sucesso;
- tipagem e escopo bons.
```

---

## Definition of Done (DoD) para este bloco

Uma PR está pronta para merge quando:
- atende critérios bloqueadores;
- passa em checagens de qualidade;
- implementa o objetivo da task sem efeito colateral indevido;
- está compreensível para outro fellow.

---

## Auto-check do fellow antes de pedir review

- [ ] Rodei `npx tsc --noEmit`
- [ ] Rodei `npm run lint`
- [ ] Revi imports e removi dead code
- [ ] Comparei meu hook com `useLessons` (estrutura parecida)
- [ ] Escrevi descrição da PR explicando "o que" e "por que"

