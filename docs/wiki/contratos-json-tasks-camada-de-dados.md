# Contratos JSON — Tasks de Camada de Dados (Batch Fellows)

> **Complemento de:** [`padrao-ouro-tasks-camada-de-dados.md`](./padrao-ouro-tasks-camada-de-dados.md)
>
> Este arquivo é o que o **mentor cola na issue** (Fase 0) e o que o **fellow usa** para criar type, dummy, service e hook.
>
> **Convenção de hooks:** Escola A — `useGet*`, 1 arquivo por ação CRUD.

---

## Índice

- [Como usar este documento](#como-usar-este-documento)
- [T1 — UserProfile](#t1--userprofile)
- [T2 — UserPreferences](#t2--userpreferences)
- [T3 — Announcements](#t3--announcements)
- [T4 — UserStats](#t4--userstats)
- [T5 — LessonProgress](#t5--lessonprogress)
- [T6 — UserAchievements](#t6--userachievements)
- [T7 — DailyChallenge](#t7--dailychallenge)
- [T8 — Leaderboard](#t8--leaderboard)
- [T9 — LearningResume](#t9--learningresume)
- [T10 — Notifications](#t10--notifications)
- [T11 — ActivityEvents](#t11--activityevents)
- [Mapa Supabase consolidado](#mapa-supabase-consolidado)

---

## Como usar este documento

Para cada task, a issue deve conter:

1. **Contrato JSON** (mentor entrega — copiar da seção abaixo)
2. **Checklist de entregáveis** (do template em `padrao-ouro-tasks-camada-de-dados.md` §6)
3. **O fellow implementa:** `types` → `test-utils/*.dummy.ts` → `services/*.service.ts` → `queryKeys` → `hooks/useGet*.ts` → **substituir mock** nos arquivos `*DataSlots.tsx` (ver [`issues-batch-camada-de-dados.md`](./issues-batch-camada-de-dados.md) ou [`tasks-plataforma-camada-de-dados.md`](./tasks-plataforma-camada-de-dados.md))

**Regras transversais:**

| Regra | Valor |
|---|---|
| Latência simulada | `300ms` (mesmo padrão de `lessons.service.ts`) |
| User id mock | `user-1` (usuário logado fictício) |
| Lesson id existente | `lesson-1` (ver `lessons.dummy.ts`) |
| Recurso não encontrado | `throw new Error('...')` |
| Lista vazia legítima | retornar `[]` (não é erro) |

---

## T1 — UserProfile

| Campo | Valor |
|---|---|
| **Componente** | `UserProfileCard` |
| **Tabela Supabase (futuro)** | `profiles` |
| **Service** | `getUserProfile(): Promise<UserProfile>` |
| **Hook** | `useGetUserProfile()` |
| **Query key** | `queryKeys.userProfile.current` → `['user-profile', 'current']` |
| **Integração** | Header da `HomePage` — `HomePageHeaderDataSlots.tsx` |
| **Erro na UI** | Compacto + **Tentar de novo** (`refetch`) no header |

### Contrato JSON (mentor entrega)

```json
{
  "id": "user-1",
  "name": "Ana Fellow",
  "email": "ana.fellow@devfellowship.dev",
  "age": 24,
  "avatarUrl": "https://i.pravatar.cc/64?u=user-1"
}
```

### TypeScript

```ts
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  avatarUrl: string;
}
```

### Arquivos esperados

| Arquivo | Export principal |
|---|---|
| `src/types/index.ts` | `UserProfile` |
| `src/test-utils/user-profile.dummy.ts` | `userProfileData` |
| `src/services/user-profile.service.ts` | `getUserProfile` |
| `src/hooks/useGetUserProfile.ts` | `useGetUserProfile` |
| `src/components/data-layer/UserProfileCard.tsx` | **fornecido pelo mentor** — fellow integra |

### Dummy sugerido (referência para o fellow)

```ts
export const userProfileData: UserProfile = {
  id: 'user-1',
  name: 'Ana Fellow',
  email: 'ana.fellow@devfellowship.dev',
  age: 24,
  avatarUrl: 'https://i.pravatar.cc/64?u=user-1',
};
```

### Service — comportamento

- `getUserProfile()` → retorna `userProfileData`
- Se dummy ausente → `throw new Error('User profile not found')`

### Supabase (futuro)

```sql
-- referência conceitual (migrations em dfl-schema)
-- profiles: id, name, email, age, avatar_url
```

---

## T2 — UserPreferences

| Campo | Valor |
|---|---|
| **Componente** | `AppearanceSettingsPanel` |
| **Tabela Supabase (futuro)** | `user_preferences` |
| **Service** | `getUserPreferences(): Promise<UserPreferences>` |
| **Hook** | `useGetUserPreferences()` |
| **Query key** | `queryKeys.userPreferences.current` → `['user-preferences', 'current']` |
| **Integração** | Header da `HomePage` — `HomePageHeaderDataSlots.tsx` (drawer ⚙️) |
| **Erro na UI** | Mensagem + **Tentar de novo** dentro do drawer |

### Contrato JSON (mentor entrega)

```json
{
  "userId": "user-1",
  "theme": "dark",
  "soundEffectsEnabled": true,
  "language": "pt-BR"
}
```

### TypeScript

```ts
export type ThemePreference = 'light' | 'dark' | 'system';

export interface UserPreferences {
  userId: string;
  theme: ThemePreference;
  soundEffectsEnabled: boolean;
  language: 'pt-BR' | 'en-US';
}
```

### Arquivos esperados

| Arquivo | Export principal |
|---|---|
| `src/test-utils/user-preferences.dummy.ts` | `userPreferencesData` |
| `src/services/user-preferences.service.ts` | `getUserPreferences` |
| `src/hooks/useGetUserPreferences.ts` | `useGetUserPreferences` |
| `src/components/data-layer/AppearanceSettingsPanel.tsx` | **fornecido pelo mentor** — fellow integra em `HomePageHeaderDataSlots.tsx` |

### UI — labels legíveis (exemplo)

| Campo | Exibição |
|---|---|
| `theme: 'dark'` | Tema: Escuro |
| `soundEffectsEnabled: true` | Sons: Ativados |
| `language: 'pt-BR'` | Idioma: Português (BR) |

> Neste batch: **somente leitura**. Toggles podem aparecer desabilitados com nota “edição em breve”.

### Service — comportamento

- `getUserPreferences()` → retorna registro do `user-1`
- Se não existir → `throw new Error('User preferences not found')`

---

## T3 — Announcements

| Campo | Valor |
|---|---|
| **Componente** | `AnnouncementList` |
| **Tabela Supabase (futuro)** | `announcements` |
| **Service** | `getAnnouncements(): Promise<Announcement[]>` |
| **Hook** | `useGetAnnouncements()` |
| **Query key** | `queryKeys.announcements.active` → `['announcements', 'active']` |
| **Integração** | `HomePage` — seção “Avisos” |
| **Erro na UI** | Explícito + botão “Tentar de novo” (`refetch`) |

### Contrato JSON (mentor entrega — array)

```json
[
  {
    "id": "ann-1",
    "title": "Manutenção programada",
    "body": "No domingo, 02h–04h, o iterate ficará indisponível para atualizações.",
    "severity": "warning",
    "publishedAt": "2026-05-20T10:00:00.000Z",
    "expiresAt": "2026-06-30T23:59:59.000Z"
  },
  {
    "id": "ann-2",
    "title": "Novas activities disponíveis",
    "body": "A lição E-commerce Frontend agora tem 17 activities para praticar.",
    "severity": "success",
    "publishedAt": "2026-05-15T08:00:00.000Z",
    "expiresAt": null
  },
  {
    "id": "ann-3",
    "title": "Dica da semana",
    "body": "Use o histórico de IA para revisar feedbacks das activities anteriores.",
    "severity": "info",
    "publishedAt": "2026-05-10T12:00:00.000Z",
    "expiresAt": null
  }
]
```

### TypeScript

```ts
export type AnnouncementSeverity = 'info' | 'warning' | 'success';

export interface Announcement {
  id: string;
  title: string;
  body: string;
  severity: AnnouncementSeverity;
  publishedAt: string;
  expiresAt: string | null;
}
```

### Service — comportamento obrigatório

1. Ler array do dummy
2. **Filtrar** itens com `expiresAt !== null` e `expiresAt < now`
3. **Ordenar** por `publishedAt` desc
4. Retornar array (pode ser `[]` — empty state, não erro)

```ts
// pseudo-lógica no service (fellow implementa)
const active = announcementsData
  .filter((a) => !a.expiresAt || new Date(a.expiresAt) > new Date())
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
return active;
```

### Empty state

Se após filtro o array for vazio → UI: *“Nenhum aviso no momento.”*

---

## T4 — UserStats

| Campo | Valor |
|---|---|
| **Componente** | `UserStatsBadge` |
| **Tabela Supabase (futuro)** | `user_stats` |
| **Service** | `getUserStats(): Promise<UserStats>` |
| **Hook** | `useGetUserStats()` |
| **Query key** | `queryKeys.userStats.current` → `['user-stats', 'current']` |
| **Integração** | Header da `HomePage` — `HomePageHeaderDataSlots.tsx` |
| **Erro na UI** | Compacto + **Tentar de novo** (`refetch`) no header |

### Contrato JSON (mentor entrega)

```json
{
  "userId": "user-1",
  "totalXp": 1240,
  "level": 5,
  "currentStreak": 3,
  "livesRemaining": 4
}
```

### TypeScript

```ts
export interface UserStats {
  userId: string;
  totalXp: number;
  level: number;
  currentStreak: number;
  livesRemaining: number;
}
```

### UI — formato sugerido

`Lv. 5 · 1.240 XP · 🔥 3`

(Opcional: ícone de coração + `livesRemaining` se couber no header.)

### Service — comportamento

- `getUserStats()` → stats do `user-1`
- Se não existir → `throw new Error('User stats not found')`

---

## T5 — LessonProgress

| Campo | Valor |
|---|---|
| **Componente** | `LessonProgressBar` |
| **Tabela Supabase (futuro)** | `lesson_progress` |
| **Service** | `getLessonProgress(lessonId: string): Promise<LessonProgress>` |
| **Hook** | `useGetLessonProgress(lessonId: string)` |
| **Query key** | `queryKeys.lessonProgress.byLesson(lessonId)` → `['lesson-progress', { lessonId }]` |
| **Integração** | `HomePage` — dentro de cada `LessonCard` |
| **Erro na UI** | Mensagem + **Tentar de novo** no card (no lugar da barra) |
| **`enabled`** | `enabled: !!lessonId` |

### Contrato JSON (mentor entrega — 1 registro por lessonId)

Para `lessonId = "lesson-1"`:

```json
{
  "lessonId": "lesson-1",
  "completedActivities": 5,
  "totalActivities": 17
}
```

> **`percent` não vem do JSON** — o fellow **calcula no service**:
> `percent = Math.round((completedActivities / totalActivities) * 100)`

### TypeScript

```ts
export interface LessonProgress {
  lessonId: string;
  completedActivities: number;
  totalActivities: number;
  percent: number; // 0–100, calculado no service
}
```

### Dummy sugerido

```ts
// Mapa ou array — fellow escolhe estrutura interna
export const lessonProgressData: Record<string, Omit<LessonProgress, 'percent'>> = {
  'lesson-1': {
    lessonId: 'lesson-1',
    completedActivities: 5,
    totalActivities: 17,
  },
};
```

### Service — comportamento

```ts
export async function getLessonProgress(lessonId: string): Promise<LessonProgress> {
  await simulateNetworkDelay();
  const row = lessonProgressData[lessonId];
  if (!row) {
    throw new Error(`Lesson progress not found: ${lessonId}`);
  }
  const percent = Math.round((row.completedActivities / row.totalActivities) * 100);
  return { ...row, percent };
}
```

### Hook — padrão com parâmetro

```ts
export function useGetLessonProgress(lessonId: string) {
  return useQuery({
    queryKey: queryKeys.lessonProgress.byLesson(lessonId),
    queryFn: () => getLessonProgress(lessonId),
    enabled: !!lessonId,
  });
}
```

---

## T6 — UserAchievements

| Campo | Valor |
|---|---|
| **Componente** | `AchievementsList` |
| **Tabelas Supabase (futuro)** | `achievements` + `user_achievements` |
| **Service** | `getUserAchievements(): Promise<UserAchievement[]>` |
| **Hook** | `useGetUserAchievements()` |
| **Query key** | `queryKeys.userAchievements.mine` → `['user-achievements', 'mine']` |
| **Integração** | Header da `HomePage` — drawer 🏆 em `HomePageHeaderDataSlots.tsx` |
| **Erro na UI** | Mensagem + **Tentar de novo** dentro do drawer |

### Contrato JSON (mentor entrega — array)

```json
[
  {
    "id": "ach-1",
    "title": "Primeira lição",
    "description": "Complete sua primeira activity com sucesso.",
    "iconEmoji": "🎯",
    "unlockedAt": "2026-05-10T14:22:00.000Z"
  },
  {
    "id": "ach-2",
    "title": "Sequência de fogo",
    "description": "Mantenha um streak de 3 dias.",
    "iconEmoji": "🔥",
    "unlockedAt": "2026-05-25T09:00:00.000Z"
  },
  {
    "id": "ach-3",
    "title": "Mestre do debug",
    "description": "Acerte 5 activities FixTheCode seguidas.",
    "iconEmoji": "🐛",
    "unlockedAt": null
  },
  {
    "id": "ach-4",
    "title": "Poliglota do código",
    "description": "Complete activities de 3 tipos diferentes.",
    "iconEmoji": "🌐",
    "unlockedAt": null
  }
]
```

### TypeScript

```ts
export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  iconEmoji: string;
  unlockedAt: string | null; // null = bloqueada
}
```

### UI — estados

| `unlockedAt` | Visual |
|---|---|
| `string` (ISO) | Card colorido, data de conquista |
| `null` | Card acinzentado, cadeado, sem data |

### Service — comportamento

- Retornar array completo (locked + unlocked)
- Ordenar: desbloqueadas primeiro (`unlockedAt` desc), depois bloqueadas
- Lista vazia `[]` → empty state no drawer

---

## T7 — DailyChallenge

| Campo | Valor |
|---|---|
| **Componente** | `DailyChallengeBanner` |
| **Tabela Supabase (futuro)** | `daily_challenges` |
| **Service** | `getDailyChallenge(): Promise<DailyChallenge>` |
| **Hook** | `useGetDailyChallenge()` |
| **Query key** | `queryKeys.dailyChallenge.today` → `['daily-challenge', 'today']` |
| **Integração** | `HomePage` — banner no topo |
| **Erro na UI** | Explícito + retry |

### Contrato JSON (mentor entrega)

```json
{
  "id": "dc-2026-05-28",
  "title": "Desafio do dia: Corrija o bug",
  "description": "Complete a próxima activity FixTheCode da lição E-commerce Frontend.",
  "bonusXp": 50,
  "expiresAt": "2026-05-28T23:59:59.000Z",
  "targetLessonId": "lesson-1"
}
```

### TypeScript

```ts
export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  bonusXp: number;
  expiresAt: string;
  targetLessonId: string;
}
```

### UI — elementos sugeridos

- Título + descrição
- Badge `+50 XP`
- Contagem regressiva ou “Expira hoje” (opcional — formatação de `expiresAt`)
- CTA: link para `/lesson/lesson-1`

### Service — comportamento

- `getDailyChallenge()` → desafio ativo do dia
- Se expirado (`expiresAt < now`) → `throw new Error('Daily challenge not found or expired')`
- Se dummy ausente → `throw new Error('Daily challenge not found')`

---

## T8 — Leaderboard

| Campo | Valor |
|---|---|
| **Componente** | `LeaderboardTable` |
| **Tabela Supabase (futuro)** | `leaderboard_entries` (ou view) |
| **Service** | `getLeaderboard(limit: number): Promise<LeaderboardEntry[]>` |
| **Hook** | `useGetLeaderboard(limit: number)` |
| **Query key** | `queryKeys.leaderboard.list(limit)` → `['leaderboard', { limit }]` |
| **Integração** | `HomePage` — seção “Ranking” |
| **Erro na UI** | Explícito + retry |
| **Parâmetro default** | `limit = 10` no hook |

### Contrato JSON (mentor entrega — array)

```json
[
  {
    "rank": 1,
    "userId": "user-42",
    "displayName": "Carlos Dev",
    "avatarUrl": "https://i.pravatar.cc/64?u=user-42",
    "totalXp": 3200,
    "isCurrentUser": false
  },
  {
    "rank": 2,
    "userId": "user-17",
    "displayName": "Beatriz Code",
    "avatarUrl": "https://i.pravatar.cc/64?u=user-17",
    "totalXp": 2850,
    "isCurrentUser": false
  },
  {
    "rank": 3,
    "userId": "user-1",
    "displayName": "Ana Fellow",
    "avatarUrl": "https://i.pravatar.cc/64?u=user-1",
    "totalXp": 1240,
    "isCurrentUser": true
  },
  {
    "rank": 4,
    "userId": "user-88",
    "displayName": "Diego React",
    "avatarUrl": "https://i.pravatar.cc/64?u=user-88",
    "totalXp": 980,
    "isCurrentUser": false
  },
  {
    "rank": 5,
    "userId": "user-33",
    "displayName": "Elena TS",
    "avatarUrl": "https://i.pravatar.cc/64?u=user-33",
    "totalXp": 750,
    "isCurrentUser": false
  }
]
```

### TypeScript

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

### Service — comportamento

1. Ordenar por `rank` asc (ou `totalXp` desc se rank não vier ordenado)
2. Aplicar `.slice(0, limit)`
3. Retornar array (mínimo 1 entrada no dummy)

### Hook

```ts
export function useGetLeaderboard(limit = 10) {
  return useQuery({
    queryKey: queryKeys.leaderboard.list(limit),
    queryFn: () => getLeaderboard(limit),
  });
}
```

### UI

- Destacar linha com `isCurrentUser: true` (background diferente)
- Colunas: `#` · avatar · nome · XP

---

## T9 — LearningResume

| Campo | Valor |
|---|---|
| **Componente** | `ContinueLearningCard` |
| **Tabela Supabase (futuro)** | `learning_resume` |
| **Service** | `getLearningResume(): Promise<LearningResume>` |
| **Hook** | `useGetLearningResume()` |
| **Query key** | `queryKeys.learningResume.current` → `['learning-resume', 'current']` |
| **Integração** | `HomePage` — card “Continue de onde parou” |
| **Erro na UI** | Mensagem na seção + **Tentar de novo**; empty state se sem lição em andamento |

### Contrato JSON (mentor entrega)

```json
{
  "lessonId": "lesson-1",
  "lessonTitle": "E-commerce Frontend com AI",
  "completedActivities": 5,
  "totalActivities": 17,
  "lastVisitedAt": "2026-05-27T18:30:00.000Z"
}
```

> `percent` calculado no service (mesma regra de T5).

### TypeScript

```ts
export interface LearningResume {
  lessonId: string;
  lessonTitle: string;
  completedActivities: number;
  totalActivities: number;
  lastVisitedAt: string;
  percent: number;
}
```

### UI

- Título da lição + barra de progresso + “Última visita: …”
- CTA → `/lesson/{lessonId}`

---

## T10 — Notifications

| Campo | Valor |
|---|---|
| **Componente** | `NotificationBellIcon` + `NotificationList` (drawer no header) |
| **Tabela Supabase (futuro)** | `notifications` |
| **Service** | `getNotifications(): Promise<NotificationsSummary>` |
| **Hook** | `useGetNotifications()` |
| **Query key** | `queryKeys.notifications.mine` → `['notifications', 'mine']` |
| **Integração** | Header da `HomePage` — drawer 🔔 em `HomePageHeaderDataSlots.tsx` |
| **Erro na UI** | Mensagem + **Tentar de novo** dentro do drawer (sino continua clicável) |

### Contrato JSON (mentor entrega)

```json
{
  "unreadCount": 2,
  "items": [
    {
      "id": "notif-1",
      "title": "Nova conquista desbloqueada",
      "read": false,
      "createdAt": "2026-05-28T08:00:00.000Z"
    },
    {
      "id": "notif-2",
      "title": "Seu streak está em risco!",
      "read": false,
      "createdAt": "2026-05-27T20:15:00.000Z"
    },
    {
      "id": "notif-3",
      "title": "Bem-vindo ao iterate",
      "read": true,
      "createdAt": "2026-05-01T10:00:00.000Z"
    }
  ]
}
```

### TypeScript

```ts
export interface Notification {
  id: string;
  title: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationsSummary {
  unreadCount: number;
  items: Notification[];
}
```

### Service — comportamento

- `unreadCount` pode ser **calculado** no service: `items.filter(n => !n.read).length`
- Fellow deve garantir consistência entre `unreadCount` e `items`

---

## T11 — ActivityEvents

| Campo | Valor |
|---|---|
| **Componente** | `RecentActivityFeed` |
| **Tabela Supabase (futuro)** | `activity_events` |
| **Service** | `getRecentActivity(limit?: number): Promise<ActivityEvent[]>` |
| **Hook** | `useGetRecentActivity(limit?: number)` |
| **Query key** | `queryKeys.activityEvents.recent(limit)` → `['activity-events', { limit }]` |
| **Integração** | `HomePage` — timeline abaixo dos avisos |
| **Erro na UI** | Mensagem na seção + **Tentar de novo**; `[]` → empty state |

### Contrato JSON (mentor entrega — array)

```json
[
  {
    "id": "evt-1",
    "type": "lesson_completed",
    "label": "Você completou a activity act-05",
    "occurredAt": "2026-05-27T18:30:00.000Z"
  },
  {
    "id": "evt-2",
    "type": "achievement_unlocked",
    "label": "Conquista desbloqueada: Sequência de fogo",
    "occurredAt": "2026-05-25T09:00:00.000Z"
  },
  {
    "id": "evt-3",
    "type": "streak_milestone",
    "label": "Streak de 3 dias alcançado",
    "occurredAt": "2026-05-25T09:00:00.000Z"
  }
]
```

### TypeScript

```ts
export type ActivityEventType =
  | 'lesson_completed'
  | 'achievement_unlocked'
  | 'streak_milestone';

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  label: string;
  occurredAt: string;
}
```

### Service — comportamento

- Ordenar por `occurredAt` desc
- Opcional: `limit` default `10`

---

## Mapa Supabase consolidado

Referência para futuras migrations em `dfl-schema`. Campos em **snake_case** no banco; types no front em **camelCase**.

| Tabela | PK | Campos principais | Task |
|---|---|---|---|
| `profiles` | `id` | `name`, `email`, `age`, `avatar_url` | T1 |
| `user_preferences` | `user_id` | `theme`, `sound_effects_enabled`, `language` | T2 |
| `announcements` | `id` | `title`, `body`, `severity`, `published_at`, `expires_at` | T3 |
| `user_stats` | `user_id` | `total_xp`, `level`, `current_streak`, `lives_remaining` | T4 |
| `lesson_progress` | `user_id` + `lesson_id` | `completed_activities`, `total_activities` | T5 |
| `achievements` | `id` | `title`, `description`, `icon_emoji` | T6 |
| `user_achievements` | `user_id` + `achievement_id` | `unlocked_at` | T6 |
| `daily_challenges` | `id` | `title`, `description`, `bonus_xp`, `expires_at`, `target_lesson_id` | T7 |
| `leaderboard_entries` | view ou materialized | `rank`, `user_id`, `display_name`, `avatar_url`, `total_xp` | T8 |
| `learning_resume` | `user_id` | `lesson_id`, `completed_activities`, `total_activities`, `last_visited_at` | T9 |
| `notifications` | `id` | `user_id`, `title`, `read`, `created_at` | T10 |
| `activity_events` | `id` | `user_id`, `type`, `label`, `occurred_at` | T11 |

### Query keys — bloco para `queryKeys.ts`

```ts
export const queryKeys = {
  userProfile: {
    current: ['user-profile', 'current'] as const,
  },
  userPreferences: {
    current: ['user-preferences', 'current'] as const,
  },
  announcements: {
    active: ['announcements', 'active'] as const,
  },
  userStats: {
    current: ['user-stats', 'current'] as const,
  },
  lessonProgress: {
    byLesson: (lessonId: string) => ['lesson-progress', { lessonId }] as const,
  },
  userAchievements: {
    mine: ['user-achievements', 'mine'] as const,
  },
  dailyChallenge: {
    today: ['daily-challenge', 'today'] as const,
  },
  leaderboard: {
    list: (limit: number) => ['leaderboard', { limit }] as const,
  },
  learningResume: {
    current: ['learning-resume', 'current'] as const,
  },
  notifications: {
    mine: ['notifications', 'mine'] as const,
  },
  activityEvents: {
    recent: (limit: number) => ['activity-events', { limit }] as const,
  },
  // existentes no projeto
  lessons: {
    all: ['lessons'] as const,
    byId: (id: string) => ['lessons', id] as const,
  },
  activities: {
    byLesson: (lessonId: string) => ['activities', { lessonId }] as const,
  },
} as const;
```

---

## Próximo passo

- **Publicar na plataforma:** [`tasks-plataforma-camada-de-dados.md`](./tasks-plataforma-camada-de-dados.md) — campos prontos (name, points, description)
- **Referência expandida:** [`issues-batch-camada-de-dados.md`](./issues-batch-camada-de-dados.md)

Antes do batch: mentor mergeia componentes em `src/components/data-layer/` → fellows `git pull`.

---

*Alinhado ao padrão ouro v6 — batch Camada de Dados, 11 tasks GET na HomePage.*
