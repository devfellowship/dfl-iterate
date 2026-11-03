# Padrões de Naming e Estrutura de Arquivos

## Quando usar este documento

Use ao nomear arquivos, funções, hooks, services e chaves de query/feedback.

Objetivo: manter o projeto previsível para qualquer fellow ou mentor.

## Resumo em 5 pontos

- Nome claro vence nome curto.
- Hook sempre com prefixo `use`.
- Service sempre em `xxx.service.ts`.
- Query key sempre no factory central.
- Estrutura previsível acelera review e manutenção.

---

## Estrutura base esperada

```txt
src/
  hooks/
    useXxx.ts
  services/
    xxx.service.ts
  lib/
    queryKeys.ts
  test-utils/
    xxx.dummy.ts
  pages/
  components/
```

---

## Convenção de nomes por camada

### Hooks

- Formato: `useXxx`
- Arquivo: `useXxx.ts`

Exemplos corretos:

- `useLessons`
- `useLesson`
- `useActivitiesByLesson`

Exemplos a evitar:

- `getLessonsHook`
- `lessonHook`
- `hookUseLessons`

---

### Services

- Formato de arquivo: `xxx.service.ts`
- Nome de função: verbo + recurso

Exemplos:

- `getLessons`
- `getLessonById`
- `getActivitiesByLessonId`

---

### Query keys

- Tudo centralizado em `src/lib/queryKeys.ts`.
- Padrão comum:
  - `all`
  - `byId(id)`
  - `byLesson(lessonId)`
  - `list(limit)`
  - `current`

Exemplo:

```ts
lessons: {
  all: ['lessons'] as const,
  byId: (id: string) => ['lessons', id] as const,
}
```

---

### Dummy data

- Arquivo: `xxx.dummy.ts`
- Nome de export:
  - coleção: `xxxData`
  - item único: `xxxData` (objeto)
- Manter dados pequenos, claros e tipados.

---

### Feedback keys (projeto atual)

No projeto, as chaves de feedback seguem:

`<activity-type-em-kebab>-<outcome>`

Exemplos:

- `fill-the-blanks-success`
- `break-and-fix-hint`
- `quality-review-approve`

---

## Padrão de imports

Preferir aliases do projeto:

```ts
import { queryKeys } from "@/lib/queryKeys";
import { getLessons } from "@/services";
```

Evitar caminhos relativos longos e frágeis:

```ts
import { queryKeys } from "../../../lib/queryKeys"; // evitar
```

---

## Padrão de export (barrels)

Sempre que criar hook/service novo:

- atualizar `src/hooks/index.ts` para exportar hook;
- atualizar `src/services/index.ts` para exportar service (se aplicável).

Isso facilita consumo padronizado.

---

## Checklist de naming antes da PR

- [ ] Nome do hook com `use`?
- [ ] Nome do service com verbo claro?
- [ ] Arquivo do service com sufixo `.service.ts`?
- [ ] Query key adicionada no factory central?
- [ ] Sem string solta de key no hook?
- [ ] Arquivos em pastas corretas?
