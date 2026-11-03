# Padrão de Activity (vertical) — resumo rápido

Este resumo existe para não confundir dois conceitos:
- **Hook de lógica de activity** (vertical)
- **Hook de dados com React Query** (horizontal)

As tasks de dados focam no horizontal, mas você ainda precisa respeitar o vertical quando tocar em activities.

---

## Regra central do padrão vertical

Cada activity deve seguir:

- **Componente fino**: renderiza UI e chama callbacks
- **Hook de lógica**: guarda estado/regra da activity

### Fluxo

`Activity Component -> Activity Hook -> callbacks para LessonPage`

---

## Contrato esperado

### Hook de activity
Formato recomendado:
```ts
useXxx(activity, callbacks)
```

Onde:
- `activity` = dados da activity atual
- `callbacks` = funções como `onSubmit`, `onApprove`, etc.

### Componente de activity
- Não concentrar regra complexa no componente
- Consumir estado/handlers vindos do hook
- Encaminhar resultado para `LessonPage`

---

## Reset de estado ao trocar activity

No hook de activity, quando `activity.id` muda:
- resetar estado interno (`useEffect`)
- evitar “vazamento” da tentativa anterior

---

## Regra de tentativa do aluno

O padrão do projeto permite:
- erro -> feedback
- nova tentativa
- sem “game over” na primeira falha

---

## Onde validar acerto/erro

- O acerto deve vir do **dado da activity** (`isCorrect`, `correctAnswer`, etc.)
- Evitar validação por “string mágica” na página

---

## Responsabilidade da LessonPage

A `LessonPage`:
- recebe resultado da activity (`isCorrect`)
- decide feedback/modal/progressão
- coordena fluxo da lição

---

## Vertical vs Horizontal (diferença rápida)

| Eixo | Objetivo | Exemplo |
|---|---|---|
| Vertical | Comportamento de uma activity | `useFillTheBlanks` |
| Horizontal | Busca e fluxo de dados | `useLessons` + service |

Você pode usar os dois no mesmo projeto, mas cada um no seu papel.
