# PR de hygiene — dfl-iterate (pós-entregas useQuery)

> **Objetivo:** deixar a `main` limpa e consistente **antes** de soltar as tasks de mutation (M2 / M11 / M8).
>
> **Base:** `main` em torno de `9a8c93b` (T10 mergeado). Atualizar com `git fetch && git pull origin main` antes de executar.
>
> **Escopo:** só hygiene / correções de dívida técnica das entregas T mergeadas. **Não** implementar mutations neste PR.
>
> **Como usar este arquivo:** um agente ou mentor deve conseguir executar o PR **somente** a partir daqui, sem consultar o chat anterior.

---

## Contexto rápido

Entregas já na main (READ / useQuery):

| Código | Recurso | Status |
|---|---|---|
| T2 | Preferências | OK (drawer ⚙️) |
| T4 | User stats | OK (badge) |
| T5 | Progresso por lição | OK, mas muta dummy in-place |
| T8 | Ranking | **BUG de UX:** tabela duplicada |
| T10 | Notificações | OK (drawer 🔔) |
| T11 | Feed de atividade | OK, mas tipo fora do barrel |

Ainda em preview mock (não mexer neste PR, salvo se bloquearem build): T1, T3, T6, T7, T9.

---

## Critérios de pronto deste PR

- [ ] Uma única tabela de ranking viva na Home (sem preview estático ao lado)
- [ ] `ActivityEvent` / `ActivityEventType` exportados em `@/types`
- [ ] `getLessonProgress` **não** muta o dummy in-place
- [ ] Barrels `hooks/index.ts` e `services/index.ts` exportam leaderboard + notifications
- [ ] Imports mortos de preview removidos no header slots
- [ ] `npx tsc -p tsconfig.app.json --noEmit` passa (pelo menos nos arquivos tocados; idealmente zero erros novos)
- [ ] `npm run build` passa
- [ ] `npm run lint` sem erros novos
- [ ] Sem implementar `useMutation` / WRITE

**Fora deste PR (registrar, não fazer agora):**

- Corrigir Vitest (`ERR_REQUIRE_ESM` com vitest 4) — ticket separado se CI estiver vermelho
- Adicionar `tsc` no CI (hoje CI só lint + build + test)
- Unificar / remover duplicatas em `src/components/data-layer/types.ts` vs `src/types/*` (grande; opcional fase 2)
- Merge da PR #76 (exemplos ouro de mutation)

---

## Branch / commits sugeridos

```txt
<seu-nome>/chore/data-layer-hygiene
```

Commits pequenos (1 lógico por commit), Conventional Commits:

1. `fix(T8): remove duplicate leaderboard preview, keep live table in slot`
2. `fix(types): export ActivityEvent from @/types barrel`
3. `fix(T5): stop mutating lesson-progress dummy in getLessonProgress`
4. `chore(data-layer): export leaderboard/notifications from barrels + clean dead imports`
5. (opcional) `chore(T2): restore PreviewSectionLabel; polish T11 retry button`

PR título sugerido: `chore: data-layer hygiene before mutations batch`

---

## Item 1 — Unificar ranking (T8) 🔴 obrigatório

### Problema

Existem **duas** renderizações de ranking na Home:

1. `HomePageBottomDataSlots` em `src/components/data-layer/HomePageDataSlots.tsx` → ainda usa `previewLeaderboard` (mock)
2. Bloco em `src/pages/HomePage.tsx` (após `HomePageBottomDataSlots`) → usa `useGetLeaderboard()` (entrega real)

Isso quebra a M8: fellow liga mutation no slot e a tabela viva (ou o preview) não bate.

### Arquivos

| Arquivo | Ação |
|---|---|
| `src/pages/HomePage.tsx` | Remover o bloco de ranking vivo (imports + hook + JSX do `LeaderboardTable` / loading / error) |
| `src/components/data-layer/HomePageDataSlots.tsx` | Em `HomePageBottomDataSlots`, trocar preview por `useGetLeaderboard` + loading/erro/retry |

### Como deve ficar `HomePageBottomDataSlots`

Padrão (espelhar T4/T10):

```tsx
export function HomePageBottomDataSlots() {
  const {
    data: leaderboardEntries,
    isPending,
    isError,
    refetch,
  } = useGetLeaderboard();

  return (
    <section className="max-w-4xl mx-auto mt-12" data-slot="T8">
      <PreviewSectionLabel taskId="T8" />
      {isPending ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          Carregando ranking…
        </p>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 py-6">
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar o ranking.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Tentar de novo
          </Button>
        </div>
      ) : (
        <LeaderboardTable entries={leaderboardEntries ?? []} />
      )}
    </section>
  );
}
```

### Em `HomePage.tsx` remover

- Import de `LeaderboardTable`
- Import de `useGetLeaderboard`
- Imports só usados pelo ranking (`Loader2`, `RefreshCw` se sobrarem sem uso)
- O `useGetLeaderboard()` no body do componente
- O `<motion.div>` inteiro que renderiza loading/erro/`LeaderboardTable` do ranking

Manter: `HomePageBottomDataSlots` onde já está (após o grid de lições).

### Remover do bottom slot

- Import de `previewLeaderboard` se não for mais usado no arquivo
- Uso de `previewLeaderboard` no JSX

### Critério

- Home mostra **uma** tabela de ranking
- Essa tabela vem de `useGetLeaderboard` / `queryKeys.leaderboard.list()`
- Slot continua `data-slot="T8"`

### Hooks / paths atuais (não renomear neste PR, só consumir)

- Hook: `useGetLeaderboard` em `src/hooks/useGetLeaderBoardTable.ts`
- Service: `getLeaderboard` em `src/services/leaderboard.service.ts`
- Query key: `queryKeys.leaderboard.list()` → `['leaderboard', 'list']`

---

## Item 2 — Exportar `ActivityEvent` no barrel `@/types` 🔴 obrigatório

### Problema

Arquivos importam de `@/types`:

- `src/services/activity-events.service.ts`
- `src/test-utils/activity-events.dummy.ts`
- `src/components/data-layer/RecentActivityFeed.tsx`
- `src/components/data-layer/preview.mock.ts`

Mas `src/types/index.ts` **não** reexporta `ActivityEvent` / `ActivityEventType`.

`vite build` passa; `tsc -p tsconfig.app.json --noEmit` falha com:

```txt
Module '"@/types"' has no exported member 'ActivityEvent'.
```

### Arquivo canônico do tipo

`src/types/ActivityEvent.ts` — já existe:

```ts
export type ActivityEventType =
  | "lesson_completed"
  | "achievement_unlocked"
  | "streak_milestone";

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  label: string;
  occurredAt: string;
}
```

### Fix

Em `src/types/index.ts`, adicionar (junto dos outros `export *`):

```ts
export * from './ActivityEvent';
```

Já existe `export * from './Notification'`. Preferir o mesmo estilo.

Opcional no mesmo commit: exportar também os outros tipos de data-layer que já têm arquivo dedicado e ainda não estão no barrel (se ainda faltarem):

- `UserPreferences.ts`
- `UserStats.ts`
- `LeaderboardEntry.ts`
- `LessonProgress.ts`

Verificar o que **já** está / não está em `index.ts` e só adicionar o que falta. **Obrigatório mínimo:** `ActivityEvent`.

### Critério

```bash
npx tsc -p tsconfig.app.json --noEmit
```

Não deve mais listar erro de `ActivityEvent` nos arquivos acima.

---

## Item 3 — Parar de mutar dummy no T5 🟡 obrigatório

### Problema

Em `src/services/lessons.service.ts`, `getLessonProgress`:

```ts
const lesson = lessonsProgress.find((l) => l.lessonId === lessonId);
// ...
lesson.percent = Math.round(...); // muta o objeto do dummy
return lesson;
```

Cada GET altera `lessonsProgressData` in-place. Ruim para mutations futuras e para previsibilidade.

### Fix

Retornar objeto **novo**, sem alterar o array:

```ts
export async function getLessonProgress(lessonId: string): Promise<LessonProgress> {
  await simulateNetworkDelay();
  const lessonsProgress = lessonsProgressData;
  const lesson = lessonsProgress.find((l) => l.lessonId === lessonId);
  if (!lesson) {
    throw new Error(`Lesson progress not found: ${lessonId}`);
  }

  const percent = Math.round(
    (lesson.completedActivities / lesson.totalActivities) * 100,
  );

  return {
    ...lesson,
    percent,
  };
}
```

### Dummy

`src/test-utils/lesson-progress.dummy.ts` — `percent: null` no estado inicial está ok (campo derivado no service).

### Tipo

- Canônico: `src/types/LessonProgress.ts` → `percent: number | null`
- `LessonProgressBar` usa `progress.percent` na width — após o GET, `percent` será `number`. Ok.

### Critério

- Dummy original permanece com `percent: null` após vários GETs (não “gruda” o percent calculado)
- UI da barra continua mostrando % correto

---

## Item 4 — Completar barrels 🟡 obrigatório

### `src/services/index.ts`

Hoje exporta (aprox.): lessons, activities, activity-events, user-stats, user-preferences.

**Adicionar:**

```ts
export * from './leaderboard.service';
export * from './notifications.service';
```

### `src/hooks/index.ts`

Hoje exporta (entre outros): useLessons, useLessonProgressBarById, useGetRecentActivity, useGetUserStats, useGetUserPreferences.

**Adicionar:**

```ts
export { useGetLeaderboard } from './useGetLeaderBoardTable';
export { useGetNotifications } from './useGetNotifications';
```

### Depois

Preferir imports via barrel nos arquivos que o Item 1 tocar:

```ts
import { useGetLeaderboard } from '@/hooks';
```

em vez de path direto do arquivo do hook (quando fizer sentido).

### Critério

- `from '@/services'` resolve `getLeaderboard` e `getNotifications`
- `from '@/hooks'` resolve `useGetLeaderboard` e `useGetNotifications`

---

## Item 5 — Limpar imports mortos no header 🟢 obrigatório (rápido)

### Arquivo

`src/components/data-layer/HomePageHeaderDataSlots.tsx`

### Remover do import de `preview.mock` se não usados

Hoje importa e **não usa** (verificar no momento da execução):

- `previewUserPreferences`
- `previewNotifications`

Manter o que ainda for usado (ex.: `previewAchievements`, `previewUserProfile` se T1/T6 ainda forem mock).

### Critério

- Sem imports não usados nesse arquivo
- Lint limpo nesse arquivo

---

## Item 6 — Polimento opcional (mesmo PR se couber) 🟢 opcional

### 6a. T2 — `PreviewSectionLabel`

No drawer de preferências (slot T2), T6/T10 têm `<PreviewSectionLabel taskId="..." />`; T2 não.

Adicionar:

```tsx
<PreviewSectionLabel taskId="T2" />
```

acima do `AppearanceSettingsPanel` (quando dados ok / ou no topo do conteúdo do drawer).

### 6b. T11 — botão de retry com design system

Em `HomePageTopDataSlots`, o retry do feed usa `<button>` cru. Trocar por `Button` de `@devfellowship/components` (como T4/T10), texto “Tentar de novo”.

### 6c. Naming LeaderBoard vs Leaderboard

**Não renomear arquivo** `useGetLeaderBoardTable.ts` neste PR (evita churn em PRs abertas). Só documentar:

- Export correto: `useGetLeaderboard`
- Arquivo legado: `useGetLeaderBoardTable.ts`
- Futuro: rename em PR dedicado se quiser

---

## Item 7 — Fora de escopo (não fazer neste PR)

Documentado para não “sumir” do radar:

| Item | Por quê separado |
|---|---|
| Vitest `ERR_REQUIRE_ESM` (`html-encoding-sniffer` / `@exodus/bytes`) | CI pode estar vermelho no step Test; precisa investigação de deps / vitest 4 |
| Adicionar `tsc` no workflow `.github/workflows/ci.yml` | Decisão de pipeline; hoje só lint + build + test |
| Deduplicar `src/components/data-layer/types.ts` vs `src/types/*` | Refactor amplo; vários componentes ainda importam `./types` |
| Merge PR #76 (gold mutations) | Feature / docs de teaching, não hygiene |
| Tornar dummies mutáveis (`get`/`set`) | É escopo das **tasks de mutation**, não deste PR |
| Implementar M2 / M11 / M8 | Batch seguinte |

---

## Checklist de execução (ordem sugerida)

1. `git fetch && git pull origin main`
2. Criar branch `chore/data-layer-hygiene` (ou com prefixo do autor)
3. **Item 2** — export `ActivityEvent` (rápido, desbloqueia tsc)
4. **Item 3** — fix `getLessonProgress` imutável
5. **Item 4** — barrels
6. **Item 1** — unificar T8 (maior diff visual)
7. **Item 5** — limpar imports
8. **Item 6** — opcional
9. Validar:

```bash
npx tsc -p tsconfig.app.json --noEmit
npm run lint
npm run build
```

10. Smoke manual na Home:

- [ ] Uma só tabela de ranking, com loading → dados
- [ ] Drawer ⚙️ preferências
- [ ] Badge de stats
- [ ] Feed de atividade
- [ ] Sino de notificações
- [ ] Barra de progresso nos cards de lição

11. Abrir PR com Summary + checklist deste arquivo

---

## Mapa de arquivos tocados (checklist)

| Arquivo | Itens |
|---|---|
| `src/types/index.ts` | 2 |
| `src/services/lessons.service.ts` | 3 |
| `src/services/index.ts` | 4 |
| `src/hooks/index.ts` | 4 |
| `src/pages/HomePage.tsx` | 1 |
| `src/components/data-layer/HomePageDataSlots.tsx` | 1, 6b |
| `src/components/data-layer/HomePageHeaderDataSlots.tsx` | 5, 6a |

Arquivos **somente leitura** (referência, não precisa editar se o fix for só nos acima):

- `src/hooks/useGetLeaderBoardTable.ts`
- `src/services/leaderboard.service.ts`
- `src/lib/queryKeys.ts`
- `src/types/ActivityEvent.ts`
- `src/types/LessonProgress.ts`
- `src/test-utils/lesson-progress.dummy.ts`
- `src/test-utils/leaderboard.dummy.ts`

---

## Query keys reais na main (não alterar neste PR)

```ts
activityEvents.recent()           // ['activityEvents', 'recent']
userPreferences.current         // ['user-preferences', 'current']
lessonProgress.byLesson(id)       // ['lessonProgress', id]
userStats.current                 // ['userStats', 'current']
leaderboard.list()                // ['leaderboard', 'list']
notifications.all                 // ['notifications']
```

Manter exatamente assim para as tasks de mutation futuras.

---

## Template de descrição da PR

```markdown
## Summary

- Unifica o ranking T8 em um único slot vivo (remove preview duplicado na Home)
- Exporta `ActivityEvent` no barrel `@/types` (corrige falha do tsc)
- Evita mutação in-place do dummy em `getLessonProgress`
- Completa barrels de hooks/services e limpa imports mortos no header

## Test plan

- [ ] Home: uma só tabela de ranking com loading/erro/retry
- [ ] Preferências, stats, feed, notificações e progresso de lição intactos
- [ ] `npx tsc -p tsconfig.app.json --noEmit`
- [ ] `npm run lint`
- [ ] `npm run build`
```

---

## Relação com o batch de mutations

Depois deste PR mergeado:

| Task mutation | Pré-requisito na main |
|---|---|
| M2 | T2 (já ok) + hygiene |
| M11 | T11 (já ok) + Item 2 |
| M8 | T8 unificado (Item 1) — **bloqueante** |

Docs do batch (não commit obrigatório neste PR):

- `docs/wiki/guia-execucao-mutations-m2-m11-m8.md`
- `docs/wiki/tasks-plataforma-mutations.md`

Se o Item 1 mudar o local do botão da M8, o guia já diz “tabela viva / slot T8” — após unificar, o slot `HomePageBottomDataSlots` é o lugar certo.
