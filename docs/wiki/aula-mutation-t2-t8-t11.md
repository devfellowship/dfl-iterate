# Aula — Mutation nos componentes T2, T11 e T8

> **Para quem é:** mentor e reunião ao vivo (trechos de código para projetar).
>
> **Fellow executando a task:** use o [guia de execução M2 / M11 / M8](./guia-execucao-mutations-m2-m11-m8.md). A task na plataforma é o ticket; o guia é o HOW.
>
> **Referências:**
>
> - [React Query Mutations na prática](https://wiki.devfellowship.com/a/react-query-mutations-na-pratica)
> - [PR #76 — Exemplo de uso: React Query Mutations](https://github.com/devfellowship/dfl-iterate/pull/76) (T7 simples + T4 avançado)

---

## Visão geral da aula

Cada aluno já tem `useQuery` no seu componente. A mutation **não substitui** a query — ela **escreve** no service/dummy e, no `onSuccess`, **invalida** a mesma `queryKey` para a query refetchar.

```txt
botão na UI
  → mutate()
      → service write (async)
          → dummy set*()
      → onSuccess: invalidateQueries(mesma queryKey do useGet*)
  → useGet* refetch
  → tela atualiza
```

| Aluno | Task                | Mutation                     | Tipo                     |
| ----- | ------------------- | ---------------------------- | ------------------------ |
| 1     | **T2** Preferências | `updateUserPreferences`      | UPDATE (objeto completo) |
| 2     | **T11** Feed        | `addActivityEvent`           | CREATE                   |
| 3     | **T8** Ranking      | `claimLeaderboardPracticeXp` | UPDATE + recálculo       |

### Checklist igual para os três

1. Dummy mutável (`get` / `set` / `reset`)
2. Função **write** no service (`async`, delay, `Promise`, `throw` em falha)
3. Usar a **mesma** `queryKey` do READ
4. Hook `useMutation` + `invalidateQueries` no `onSuccess`
5. Botão no **container/slot** (não colocar regra de negócio no componente visual)
6. Estados: `isPending` no botão + `isError` com “Tentar de novo” / `reset`

---

## T2 — Preferências de aparência (UPDATE)

### O que já existe (READ)

- Componente: `AppearanceSettingsPanel`
- Dados: `UserPreferences` (`theme`, `soundEffectsEnabled`, `language`)
- UI hoje: só **mostra** valores + texto “Edição em breve”

```ts
// src/components/data-layer/types.ts
export type ThemePreference = "light" | "dark" | "system";

export interface UserPreferences {
  userId: string;
  theme: ThemePreference;
  soundEffectsEnabled: boolean;
  language: "pt-BR" | "en-US";
}
```

### O que vamos fazer (WRITE)

Mutation: **atualizar** preferências (ex.: alternar tema, ligar/desligar sons).

Fluxo:

```txt
botão "Alternar tema" / "Ligar/Desligar sons"
  → monta { ...preferences, theme: 'light' } no slot
  → useUpdateUserPreferences().mutate(nextPreferences)
      → updateUserPreferences(nextPreferences) no service
          → set no dummy
      → invalidateQueries(userPreferences.current)
  → useGetUserPreferences() refetch
  → painel mostra o valor novo
```

### Arquivos a criar / tocar

| Camada     | Arquivo                                                          |
| ---------- | ---------------------------------------------------------------- |
| Dummy      | `src/test-utils/user-preferences.dummy.ts`                       |
| Service    | `src/services/user-preferences.service.ts` (+ export no barrel)  |
| Query key  | `queryKeys.userPreferences.current`                              |
| Hook WRITE | `src/hooks/useUpdateUserPreferences.ts`                          |
| UI         | props `onToggleTheme` / `onToggleSound` + `isUpdating` no painel |
| Slot       | drawer T2 em `HomePageHeaderDataSlots`                           |

### Trechos — como fica

#### 1) Dummy mutável

```ts
// src/test-utils/user-preferences.dummy.ts
import type { UserPreferences } from "@/types";

const INITIAL: UserPreferences = {
  userId: "user-1",
  theme: "dark",
  soundEffectsEnabled: true,
  language: "pt-BR",
};

let data: UserPreferences = { ...INITIAL };

export function getUserPreferencesData(): UserPreferences {
  return { ...data };
}

export function setUserPreferencesData(next: UserPreferences): void {
  data = { ...next };
}

export function resetUserPreferencesData(): void {
  data = { ...INITIAL };
}
```

#### 2) Service (READ + WRITE)

```ts
// src/services/user-preferences.service.ts
import {
  getUserPreferencesData,
  setUserPreferencesData,
} from "@/test-utils/user-preferences.dummy";
import type { UserPreferences } from "@/types";

const SIMULATED_LATENCY_MS = 300;

const simulateNetworkDelay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

export async function getUserPreferences(): Promise<UserPreferences> {
  await simulateNetworkDelay();
  return getUserPreferencesData();
}

/**
 * UPDATE — recebe o objeto completo já montado.
 * Quem chama (o slot) faz o spread do atual e muda só o campo desejado.
 */
export async function updateUserPreferences(
  nextPreferences: UserPreferences,
): Promise<UserPreferences> {
  await simulateNetworkDelay();

  if (!nextPreferences.userId) {
    throw new Error("User preferences require a userId");
  }

  setUserPreferencesData(nextPreferences);
  return getUserPreferencesData();
}
```

> **Por que sem `Partial`?** Na aula, fica mais fácil de ler: “mando o objeto inteiro de preferências”. O merge (`...preferences`, campo novo) acontece no **slot**, onde o aluno já tem o `data` do `useGet*`.

#### 3) Query key

```ts
// em src/lib/queryKeys.ts
userPreferences: {
  current: ['user-preferences', 'current'] as const,
},
```

#### 4) Hook de mutation

```ts
// src/hooks/useUpdateUserPreferences.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserPreferences } from "@/services";
import { queryKeys } from "@/lib/queryKeys";
import type { UserPreferences } from "@/types";

export function useUpdateUserPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nextPreferences: UserPreferences) =>
      updateUserPreferences(nextPreferences),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.userPreferences.current,
      });
    },
  });
}
```

#### 5) UI fina (callbacks por props)

```tsx
// trecho em AppearanceSettingsPanel.tsx
export interface AppearanceSettingsPanelProps {
  preferences: UserPreferences;
  className?: string;
  onToggleTheme?: () => void;
  onToggleSound?: () => void;
  isUpdating?: boolean;
}

// no rodapé, no lugar de "Edição em breve":
{
  onToggleTheme ? (
    <button type="button" disabled={isUpdating} onClick={onToggleTheme}>
      {isUpdating ? "Salvando…" : "Alternar tema"}
    </button>
  ) : null;
}

{
  onToggleSound ? (
    <button type="button" disabled={isUpdating} onClick={onToggleSound}>
      {isUpdating ? "Salvando…" : "Ligar/Desligar sons"}
    </button>
  ) : null;
}
```

#### 6) Slot (liga query + mutation)

```tsx
// trecho no container do drawer T2
const {
  data: preferences,
  isPending,
  isError,
  refetch,
} = useGetUserPreferences();
const {
  mutate: updatePreferences,
  isPending: isUpdating,
  isError: isUpdateError,
  reset: resetUpdate,
} = useUpdateUserPreferences();

// ... loading / error do GET ...

<AppearanceSettingsPanel
  preferences={preferences}
  isUpdating={isUpdating}
  onToggleTheme={() => {
    resetUpdate();
    updatePreferences({
      ...preferences,
      theme: preferences.theme === "dark" ? "light" : "dark",
    });
  }}
  onToggleSound={() => {
    resetUpdate();
    updatePreferences({
      ...preferences,
      soundEffectsEnabled: !preferences.soundEffectsEnabled,
    });
  }}
/>;

{
  isUpdateError ? <p>Não foi possível salvar. Tente de novo.</p> : null;
}
```

### Frase para entendimento

> “Você já lê com `useGetUserPreferences`. No clique, monta o objeto novo com `...preferences` + o campo alterado, manda no `mutate`, e no `onSuccess` invalida a **mesma** queryKey.”

---

## T11 — Feed de atividade recente (CREATE)

### O que já existe (READ)

- Componente: `RecentActivityFeed`
- Dados: lista de `ActivityEvent` (`id`, `type`, `label`, `occurredAt`)
- UI hoje: timeline só de leitura

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

### O que vamos fazer (WRITE)

Mutation: **criar** um evento novo no topo do feed.

Fluxo:

```txt
botão "Registrar atividade"
  → useAddActivityEvent().mutate({ type, label })
      → addActivityEvent(...) no service
          → gera id + occurredAt, prepend no dummy
      → invalidateQueries(recentActivity.list)
  → useGetRecentActivity() refetch
  → item novo aparece no topo
```

Opcional (se sobrar tempo): **DELETE** — botão “Limpar feed” ou “Remover” no item.

### Arquivos a criar / tocar

| Camada     | Arquivo                                              |
| ---------- | ---------------------------------------------------- |
| Dummy      | `src/test-utils/recent-activity.dummy.ts`            |
| Service    | `src/services/recent-activity.service.ts`            |
| Query key  | `queryKeys.recentActivity.list` (ou `.all`)          |
| Hook WRITE | `src/hooks/useAddActivityEvent.ts`                   |
| UI         | prop `onAddEvent` / `isAdding` (ou botão só no slot) |
| Slot       | seção T11 em `HomePageTopDataSlots`                  |

### Trechos — como fica

#### 1) Dummy mutável (array)

```ts
// src/test-utils/recent-activity.dummy.ts
import type { ActivityEvent } from "@/types";

const INITIAL: ActivityEvent[] = [
  {
    id: "evt-1",
    type: "lesson_completed",
    label: "Você completou a activity act-05",
    occurredAt: "2026-05-27T18:30:00.000Z",
  },
  {
    id: "evt-2",
    type: "achievement_unlocked",
    label: "Conquista desbloqueada: Sequência de fogo",
    occurredAt: "2026-05-25T09:00:00.000Z",
  },
  {
    id: "evt-3",
    type: "streak_milestone",
    label: "Streak de 3 dias alcançado",
    occurredAt: "2026-05-25T09:00:00.000Z",
  },
];

let data: ActivityEvent[] = INITIAL.map((e) => ({ ...e }));

export function getRecentActivityData(): ActivityEvent[] {
  return data.map((e) => ({ ...e }));
}

export function setRecentActivityData(next: ActivityEvent[]): void {
  data = next.map((e) => ({ ...e }));
}

export function resetRecentActivityData(): void {
  data = INITIAL.map((e) => ({ ...e }));
}
```

#### 2) Service (READ + CREATE)

```ts
// src/services/recent-activity.service.ts
import {
  getRecentActivityData,
  setRecentActivityData,
} from "@/test-utils/recent-activity.dummy";
import type { ActivityEvent, ActivityEventType } from "@/types";

const SIMULATED_LATENCY_MS = 300;

const simulateNetworkDelay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

export async function getRecentActivity(): Promise<ActivityEvent[]> {
  await simulateNetworkDelay();
  return getRecentActivityData();
}

export async function addActivityEvent(input: {
  type: ActivityEventType;
  label: string;
}): Promise<ActivityEvent> {
  await simulateNetworkDelay();

  if (!input.label.trim()) {
    throw new Error("Activity label is required");
  }

  const created: ActivityEvent = {
    id: `evt-${Date.now()}`,
    type: input.type,
    label: input.label.trim(),
    occurredAt: new Date().toISOString(),
  };

  const current = getRecentActivityData();
  setRecentActivityData([created, ...current]);
  return created;
}
```

#### 3) Query key

```ts
recentActivity: {
  list: ['recent-activity'] as const,
},
```

#### 4) Hook de mutation

```ts
// src/hooks/useAddActivityEvent.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addActivityEvent } from "@/services";
import { queryKeys } from "@/lib/queryKeys";
import type { ActivityEventType } from "@/types";

export function useAddActivityEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { type: ActivityEventType; label: string }) =>
      addActivityEvent(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.recentActivity.list,
      });
    },
  });
}
```

#### 5) Slot (botão + feed)

Para a aula, o botão pode ficar **no slot** (mais simples). Não precisa de formulário complexo — fixe o tipo.

```tsx
const { data: events, isPending, isError, refetch } = useGetRecentActivity();
const {
  mutate: addEvent,
  isPending: isAdding,
  isError: isAddError,
  reset: resetAdd,
} = useAddActivityEvent();

// ... loading / error do GET ...

<button
  type="button"
  disabled={isAdding}
  onClick={() => {
    resetAdd();
    addEvent({
      type: 'lesson_completed',
      label: 'Você registrou uma nova prática na aula',
    });
  }}
>
  {isAdding ? 'Registrando…' : 'Registrar atividade'}
</button>

<RecentActivityFeed events={events ?? []} />
```

#### 6) Opcional — DELETE (limpar feed)

```ts
// no service
export async function clearRecentActivity(): Promise<void> {
  await simulateNetworkDelay();
  setRecentActivityData([]);
}

// no hook
useMutation({
  mutationFn: clearRecentActivity,
  onSuccess: () => {
    void queryClient.invalidateQueries({
      queryKey: queryKeys.recentActivity.list,
    });
  },
});
```

### Frase para entendimento

> “Mutation não substitui a query — ela altera o dado e pede pra query buscar de novo. No feed, o CREATE coloca um item novo no topo.”

---

## T8 — Tabela de ranking (UPDATE + recálculo)

### O que já existe (READ)

- Componente: `LeaderboardTable`
- Dados: lista de `LeaderboardEntry` (`rank`, `totalXp`, `isCurrentUser`, …)
- UI hoje: tabela só de leitura

```ts
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl: string;
  totalXp: number;
  isCurrentUser: boolean;
}
```

### O que vamos fazer (WRITE)

**Não** editar `rank` à mão. A mutation realista:

1. Soma XP no usuário atual (`isCurrentUser`)
2. Reordena por `totalXp`
3. Recalcula `rank`
4. Invalida a query do ranking

Fluxo:

```txt
botão "+XP no ranking"
  → useClaimLeaderboardXp().mutate(25)
      → claimLeaderboardPracticeXp(25) no service
          → acha isCurrentUser → soma XP → sort → recalcula rank
      → invalidateQueries(leaderboard.list)
  → useGetLeaderboard() refetch
  → posição / XP do "você" mudam
```

> Isso espelha o **T4** da PR #76 (XP + estado derivado no service).

### Arquivos a criar / tocar

| Camada     | Arquivo                                                 |
| ---------- | ------------------------------------------------------- |
| Dummy      | `src/test-utils/leaderboard.dummy.ts`                   |
| Service    | `src/services/leaderboard.service.ts`                   |
| Query key  | `queryKeys.leaderboard.list`                            |
| Hook WRITE | `src/hooks/useClaimLeaderboardXp.ts`                    |
| UI         | prop `onClaimXp` / `isClaiming` **ou** botão só no slot |
| Slot       | seção T8 em `HomePageBottomDataSlots`                   |

### Trechos — como fica

#### 1) Dummy mutável

```ts
// src/test-utils/leaderboard.dummy.ts
import type { LeaderboardEntry } from "@/types";

const INITIAL: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: "user-42",
    displayName: "Carlos Dev",
    avatarUrl: "https://i.pravatar.cc/64?u=user-42",
    totalXp: 3200,
    isCurrentUser: false,
  },
  {
    rank: 2,
    userId: "user-17",
    displayName: "Beatriz Code",
    avatarUrl: "https://i.pravatar.cc/64?u=user-17",
    totalXp: 2850,
    isCurrentUser: false,
  },
  {
    rank: 3,
    userId: "user-1",
    displayName: "Ana Fellow",
    avatarUrl: "https://i.pravatar.cc/64?u=user-1",
    totalXp: 1240,
    isCurrentUser: true,
  },
  {
    rank: 4,
    userId: "user-88",
    displayName: "Diego React",
    avatarUrl: "https://i.pravatar.cc/64?u=user-88",
    totalXp: 980,
    isCurrentUser: false,
  },
];

let data: LeaderboardEntry[] = INITIAL.map((e) => ({ ...e }));

export function getLeaderboardData(): LeaderboardEntry[] {
  return data.map((e) => ({ ...e }));
}

export function setLeaderboardData(next: LeaderboardEntry[]): void {
  data = next.map((e) => ({ ...e }));
}

export function resetLeaderboardData(): void {
  data = INITIAL.map((e) => ({ ...e }));
}
```

#### 2) Service (READ + WRITE com recálculo)

```ts
// src/services/leaderboard.service.ts
import {
  getLeaderboardData,
  setLeaderboardData,
} from "@/test-utils/leaderboard.dummy";
import type { LeaderboardEntry } from "@/types";

const SIMULATED_LATENCY_MS = 300;
const DEFAULT_PRACTICE_XP = 25;

const simulateNetworkDelay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

/** Ordena por XP (maior primeiro) e redefine rank = 1, 2, 3... */
function recalculateRanks(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  const sortedByXp = [...entries].sort((a, b) => {
    return b.totalXp - a.totalXp;
  });

  const withNewRanks = sortedByXp.map((entry, index) => {
    return {
      ...entry,
      rank: index + 1,
    };
  });

  return withNewRanks;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  await simulateNetworkDelay();
  return getLeaderboardData();
}

export async function claimLeaderboardPracticeXp(
  amount: number = DEFAULT_PRACTICE_XP,
): Promise<LeaderboardEntry[]> {
  await simulateNetworkDelay();

  if (amount <= 0) {
    throw new Error(`Invalid practice XP amount: ${amount}`);
  }

  const current = getLeaderboardData();
  const me = current.find((entry) => entry.isCurrentUser);
  if (!me) {
    throw new Error("Current user not found in leaderboard");
  }

  const withUpdatedXp = current.map((entry) => {
    if (!entry.isCurrentUser) {
      return entry;
    }

    return {
      ...entry,
      totalXp: entry.totalXp + amount,
    };
  });

  const next = recalculateRanks(withUpdatedXp);
  setLeaderboardData(next);
  return getLeaderboardData();
}
```

#### 3) Query key

```ts
leaderboard: {
  list: ['leaderboard'] as const,
},
```

#### 4) Hook de mutation

```ts
// src/hooks/useClaimLeaderboardXp.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { claimLeaderboardPracticeXp } from "@/services";
import { queryKeys } from "@/lib/queryKeys";

export function useClaimLeaderboardXp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount?: number) => claimLeaderboardPracticeXp(amount),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.leaderboard.list,
      });
    },
  });
}
```

#### 5) Slot

```tsx
const { data: entries, isPending, isError, refetch } = useGetLeaderboard();
const {
  mutate: claimXp,
  isPending: isClaiming,
  isError: isClaimError,
  reset: resetClaim,
} = useClaimLeaderboardXp();

// ... loading / error do GET ...

<button
  type="button"
  disabled={isClaiming}
  onClick={() => {
    resetClaim();
    claimXp(25);
  }}
>
  {isClaiming ? '…' : '+XP no ranking'}
</button>

<LeaderboardTable entries={entries ?? []} />
```

### Frase para entendimento

> “Aqui a mutation não mexe no rank direto; ela muda o XP e o **service** recalcula a lista. A UI só dispara e reflete.”

### Opção B (conceito avançado)

Se o aluno também tiver T4 (`claimPracticeXp`), no `onSuccess` dele pode invalidar **também** o ranking:

```ts
onSuccess: () => {
  void queryClient.invalidateQueries({ queryKey: queryKeys.userStats.current });
  void queryClient.invalidateQueries({ queryKey: queryKeys.leaderboard.list });
},
```

Isso ensina _uma mutation → várias queries_. Para hoje, prefira a **Opção A** (botão no próprio T8), que é self-contained.

---

## Erros comuns

| Sintoma                           | Causa provável                    | Correção                           |
| --------------------------------- | --------------------------------- | ---------------------------------- |
| Clicou e nada mudou               | Dummy ainda imutável / sem `set*` | Usar getter/setter no dummy        |
| Mudou uma vez e “grudou”          | Esqueceu `invalidateQueries`      | Invalidar a mesma key do `useGet*` |
| Erro de TypeScript na key         | Key string solta diferente do GET | Centralizar em `queryKeys`         |
| Botão não desabilita              | Não passou `isPending`            | Ligar `disabled={isPending}`       |
| Regra de negócio no `.tsx` visual | `setState` calculando rank/tema   | Mover para o **service**           |

---

## Done quando

- [ ] Dummy mutável + service write
- [ ] `useMutation` + `invalidateQueries` no `onSuccess`
- [ ] Botão com loading
- [ ] Após o clique, a UI do `useGet*` atualiza sem reload
- [ ] `npx tsc --noEmit` e lint ok no que o aluno tocou
