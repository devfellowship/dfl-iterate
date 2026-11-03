# Tasks para a plataforma — Batch Camada de Dados

> **Uso:** copie os três campos de cada task (**task name**, **points**, **description**) para criar a task na plataforma.
>
> **Documentos de apoio:** [`padrao-ouro-tasks-camada-de-dados.md`](./padrao-ouro-tasks-camada-de-dados.md) · [`contratos-json-tasks-camada-de-dados.md`](./contratos-json-tasks-camada-de-dados.md) · [`issues-batch-camada-de-dados.md`](./issues-batch-camada-de-dados.md)

---

## Estado atual do fluxo (v6)

```txt
type → dummy → service → queryKey → useGet* → integração (substituir mock nos *DataSlots*)
```

| Onde | Tasks | Arquivo que o fellow edita |
|---|---|---|
| Header da `HomePage` | T1, T2, T4, T6, T10 | `src/components/data-layer/HomePageHeaderDataSlots.tsx` |
| Corpo da `HomePage` | T9, T7, T3, T11, T8 | `src/components/data-layer/HomePageDataSlots.tsx` |
| Cada card de lição | T5 | `src/pages/HomePage.tsx` (`LessonCard`) |

**Componentes visuais:** já em `src/components/data-layer/` — fellow **não recria** o `.tsx`.

**Preview hoje:** `src/components/data-layer/preview.mock.ts` → fellow troca por hooks.

**Hooks:** Escola A — `useGet*`, 1 arquivo por ação CRUD.

**Validação obrigatória:** `npx tsc --noEmit` + `npm run lint`.

**Erro na UI (regra do batch):** toda task trata `isError` com mensagem visível + **Tentar de novo** (`refetch()`). Empty state legítimo (`[]`, sem dado) ≠ erro.

---

## Resumo de pontos

| Task | Dificuldade | Points |
|---|---|---|
| T1 | 🟢 | 100 |
| T2 | 🟢 | 100 |
| T3 | 🟢 | 100 |
| T4 | 🟢 | 100 |
| T5 | 🟡 | 150 |
| T6 | 🟡 | 150 |
| T7 | 🟡 | 150 |
| T8 | 🟡 | 150 |
| T9 | 🟢 | 100 |
| T10 | 🟡 | 150 |
| T11 | 🟡 | 150 |
| **Total** | | **1400** |

---

## Texto base (épico ou instrução geral — opcional)

Colar uma vez no épico do batch ou repetir no topo de cada task:

```markdown
### Antes de começar

1. `git fetch && git pull` na `main` (componentes + preview mock já estão no repo).
2. Leia: [Comece por aqui](docs/wiki/comece-por-aqui.md) + contrato JSON da sua task.
3. Branch: `<seu-nome>/feat/T{N}-<descricao>`.

### Fluxo que você implementa

`type` → `dummy` → `service` → `queryKey` → `useGet*` → substituir mock no slot indicado.

### Regras

- Hook: `useGet*` (Escola A) — 1 arquivo por ação CRUD.
- Service: `async`, sem React, `throw new Error(...)` em falha semântica.
- Query key: sempre via `src/lib/queryKeys.ts`.
- **Não** importar dummy nos slots ou páginas.
- **Não** colocar React Query em `src/components/data-layer/`.
- Referência de código: `src/services/lessons.service.ts`, `src/lib/queryKeys.ts`.

### Validação

- [ ] `npx tsc --noEmit`
- [ ] `npm run lint`
- [ ] Testar loading → sucesso → erro (quando aplicável)

---

## T1 — Perfil do usuário

**task name:** `[Iterate] T1 — Perfil do usuário no header`

**points:** `100`

**description:**

> *Copie da seção **Objetivo** até o último checkbox.*

## Objetivo

Implementar a fatia completa de dados do **perfil do usuário logado** (`user-1`) e conectar ao `UserProfileCard` no header da HomePage.

## Didática

- Primeiro GET de **objeto único** (`self`).
- Separar identidade (T1) de gamificação (T4) — duas queries, duas tabelas futuras.
- Tratar `isError` com feedback **compacto** + botão **Tentar de novo** no header.

## Contrato

| Campo | Valor |
|---|---|
| Componente | `UserProfileCard` (fornecido) |
| Tabela futura | `profiles` |
| Service | `getUserProfile(): Promise<UserProfile>` |
| Hook | `useGetUserProfile()` |
| Query key | `queryKeys.userProfile.current` → `['user-profile', 'current']` |
| Integração | `src/components/data-layer/HomePageHeaderDataSlots.tsx` (slot T1) |
| Erro na UI | Compacto + **Tentar de novo** no header |

## JSON de referência

```json
{
  "id": "user-1",
  "name": "Ana Fellow",
  "email": "ana.fellow@devfellowship.dev",
  "age": 24,
  "avatarUrl": "https://i.pravatar.cc/64?u=user-1"
}
```

## Arquivos que você cria/edita

| Ação | Arquivo |
|---|---|
| Criar | `src/types/index.ts` — `UserProfile` |
| Criar | `src/test-utils/user-profile.dummy.ts` |
| Criar | `src/services/user-profile.service.ts` — `getUserProfile` |
| Criar | `src/hooks/useGetUserProfile.ts` |
| Editar | `src/lib/queryKeys.ts` — `userProfile.current` |
| Editar | `src/services/index.ts`, `src/hooks/index.ts` (exports) |
| Editar | `HomePageHeaderDataSlots.tsx` — trocar mock por hook |

**Não editar:** `UserProfileCard.tsx`.

## Critérios de pronto

- [ ] Header mostra avatar + nome após ~300ms
- [ ] `isPending` → placeholder simples
- [ ] `isError` → mensagem compacta + **Tentar de novo** (header continua funcional)
- [ ] Nenhum import de dummy fora de `services/` / `test-utils/`
- [ ] `tsc` + `lint` passam

---

## T2 — Preferências de aparência

**task name:** `[Iterate] T2 — Preferências de aparência (tema, som, idioma)`

**points:** `100`

**description:**

> *Copie da seção **Objetivo** até o último checkbox.*

## Objetivo

Buscar preferências do usuário (`user-1`) e exibir no drawer ⚙️ do header via `AppearanceSettingsPanel`.

## Didática

- Segundo objeto `self` — campos simples (`enum`, `boolean`).
- Neste batch: **somente GET** (toggles visuais podem ficar desabilitados).
- Erro **explícito** — mensagem + **Tentar de novo** dentro do drawer.

## Contrato

| Campo | Valor |
|---|---|
| Componente | `AppearanceSettingsPanel` (fornecido) |
| Tabela futura | `user_preferences` |
| Service | `getUserPreferences(): Promise<UserPreferences>` |
| Hook | `useGetUserPreferences()` |
| Query key | `queryKeys.userPreferences.current` → `['user-preferences', 'current']` |
| Integração | `HomePageHeaderDataSlots.tsx` — drawer ⚙️ (slot T2) |
| Erro na UI | Mensagem + **Tentar de novo** dentro do drawer |

## JSON de referência

```json
{
  "userId": "user-1",
  "theme": "dark",
  "soundEffectsEnabled": true,
  "language": "pt-BR"
}
```

## Arquivos que você cria/edita

| Ação | Arquivo |
|---|---|
| Criar | `src/types/index.ts` — `ThemePreference`, `UserPreferences` |
| Criar | `src/test-utils/user-preferences.dummy.ts` |
| Criar | `src/services/user-preferences.service.ts` |
| Criar | `src/hooks/useGetUserPreferences.ts` |
| Editar | `src/lib/queryKeys.ts` — `userPreferences.current` |
| Editar | `HomePageHeaderDataSlots.tsx` — drawer ⚙️ |

## Critérios de pronto

- [ ] Clicar ⚙️ abre drawer com tema, sons e idioma legíveis
- [ ] Valores batem com o dummy (`dark`, sons ativados, `pt-BR`)
- [ ] Componente fornecido não ganhou React Query
- [ ] `tsc` + `lint` passam

---

## T3 — Avisos da plataforma

**task name:** `[Iterate] T3 — Avisos da plataforma`

**points:** `100`

**description:**

> *Copie da seção **Objetivo** até o último checkbox.*

## Objetivo

Listar avisos operacionais da plataforma na HomePage, com filtro e ordenação no **service**.

## Didática

- GET de **lista** — dado da plataforma (não catálogo de lições).
- Lógica de negócio na cozinha: remover expirados, ordenar por data.
- Erro **explícito** com botão “Tentar de novo” (`refetch`).

## Contrato

| Campo | Valor |
|---|---|
| Componente | `AnnouncementList` (fornecido) |
| Tabela futura | `announcements` |
| Service | `getAnnouncements(): Promise<Announcement[]>` |
| Hook | `useGetAnnouncements()` |
| Query key | `queryKeys.announcements.active` → `['announcements', 'active']` |
| Integração | `HomePageDataSlots.tsx` — `HomePageTopDataSlots` (slot T3) |
| Erro na UI | Explícito + `refetch()` |

## JSON de referência

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

## Service — comportamento obrigatório

1. Filtrar itens com `expiresAt !== null` e `expiresAt < now`
2. Ordenar por `publishedAt` desc
3. Lista vazia após filtro → `[]` (empty state, **não** erro)

## Arquivos que você cria/edita

| Ação | Arquivo |
|---|---|
| Criar | `AnnouncementSeverity`, `Announcement` + dummy |
| Criar | `src/services/announcements.service.ts` |
| Criar | `src/hooks/useGetAnnouncements.ts` |
| Editar | `src/lib/queryKeys.ts` — `announcements.active` |
| Editar | `HomePageDataSlots.tsx` — seção Avisos |

## Critérios de pronto

- [ ] Avisos visíveis com severidade (`info` / `warning` / `success`)
- [ ] Expirados não aparecem
- [ ] Empty state: “Nenhum aviso no momento.”
- [ ] Erro mostra mensagem + retry
- [ ] `tsc` + `lint` passam

---

## T4 — Stats do usuário (XP)

**task name:** `[Iterate] T4 — Stats do usuário (XP, level, streak)`

**points:** `100`

**description:**

> *Copie da seção **Objetivo** até o último checkbox.*

## Objetivo

Buscar estatísticas gamificadas do `user-1` e exibir no `UserStatsBadge` ao lado do perfil.

## Didática

- Segundo recurso `self` — **não** misturar com T1 (perfil ≠ stats).
- Objeto único, query separada.
- Erro **explícito** — mensagem compacta + **Tentar de novo** no header.

## Contrato

| Campo | Valor |
|---|---|
| Componente | `UserStatsBadge` (fornecido) |
| Tabela futura | `user_stats` |
| Service | `getUserStats(): Promise<UserStats>` |
| Hook | `useGetUserStats()` |
| Query key | `queryKeys.userStats.current` → `['user-stats', 'current']` |
| Integração | `HomePageHeaderDataSlots.tsx` (slot T4) |
| Erro na UI | Compacto + **Tentar de novo** no header |

## JSON de referência

```json
{
  "userId": "user-1",
  "totalXp": 1240,
  "level": 5,
  "currentStreak": 3,
  "livesRemaining": 4
}
```

## Arquivos que você cria/edita

| Ação | Arquivo |
|---|---|
| Criar | `UserStats` + dummy + service + hook |
| Editar | `src/lib/queryKeys.ts` — `userStats.current` |
| Editar | `HomePageHeaderDataSlots.tsx` |

## Critérios de pronto

- [ ] Badge mostra level, XP e streak (ex.: `Lv. 5 · 1.240 XP · 🔥 3`)
- [ ] Loading e erro tratados sem quebrar header
- [ ] `tsc` + `lint` passam

---

## T5 — Progresso por lição

**task name:** `[Iterate] T5 — Barra de progresso por lição`

**points:** `150`

**description:**

> *Copie da seção **Objetivo** até o último checkbox.*

## Objetivo

Buscar progresso do usuário **por lição** e exibir `LessonProgressBar` dentro de cada `LessonCard` na HomePage.

## Didática

- GET **parametrizado** (`lessonId`).
- Campo derivado: `percent` calculado no service (não vem do JSON).
- Hook com `enabled: !!lessonId`.

## Contrato

| Campo | Valor |
|---|---|
| Componente | `LessonProgressBar` (fornecido) |
| Tabela futura | `lesson_progress` |
| Service | `getLessonProgress(lessonId): Promise<LessonProgress>` |
| Hook | `useGetLessonProgress(lessonId)` |
| Query key | `queryKeys.lessonProgress.byLesson(lessonId)` |
| Integração | `src/pages/HomePage.tsx` — componente `LessonCard` |
| Erro na UI | Mensagem + **Tentar de novo** no card |

## JSON de referência (por `lessonId`)

```json
{
  "lessonId": "lesson-1",
  "completedActivities": 5,
  "totalActivities": 17
}
```

> `percent = Math.round((completedActivities / totalActivities) * 100)` — calcular no service.

## Arquivos que você cria/edita

| Ação | Arquivo |
|---|---|
| Criar | `LessonProgress` + dummy (mapa por `lessonId`) |
| Criar | `src/services/lesson-progress.service.ts` |
| Criar | `src/hooks/useGetLessonProgress.ts` |
| Editar | `src/lib/queryKeys.ts` — `lessonProgress.byLesson` |
| Editar | `HomePage.tsx` — `LessonCard` (não os DataSlots) |

## Critérios de pronto

- [ ] Barra aparece no card da lição com percentual correto (~29% para dummy)
- [ ] `enabled: !!lessonId` no hook
- [ ] Erro omite barra sem crash
- [ ] `tsc` + `lint` passam

---

## T6 — Conquistas do usuário

**task name:** `[Iterate] T6 — Lista de conquistas (drawer 🏆)`

**points:** `150`

**description:**

> *Copie da seção **Objetivo** até o último checkbox.*

## Objetivo

Listar conquistas do `user-1` (desbloqueadas e bloqueadas) no drawer 🏆 do header.

## Didática

- Lista com **estado visual** (`unlockedAt: string | null`).
- Simula join futuro `achievements` + `user_achievements`.
- Erro **explícito** — mensagem + **Tentar de novo** dentro do drawer.

## Contrato

| Campo | Valor |
|---|---|
| Componente | `AchievementsList` (fornecido) |
| Tabelas futuras | `achievements` + `user_achievements` |
| Service | `getUserAchievements(): Promise<UserAchievement[]>` |
| Hook | `useGetUserAchievements()` |
| Query key | `queryKeys.userAchievements.mine` → `['user-achievements', 'mine']` |
| Integração | `HomePageHeaderDataSlots.tsx` — drawer 🏆 (slot T6) |
| Erro na UI | Mensagem + **Tentar de novo** dentro do drawer |

## JSON de referência

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

## Service — comportamento

- Ordenar: desbloqueadas primeiro (`unlockedAt` desc), depois bloqueadas
- `[]` → empty state no drawer

## Arquivos que você cria/edita

| Ação | Arquivo |
|---|---|
| Criar | `UserAchievement` + dummy + service + hook |
| Editar | `HomePageHeaderDataSlots.tsx` — drawer 🏆 |

## Critérios de pronto

- [ ] Conquistas desbloqueadas coloridas; bloqueadas acinzentadas
- [ ] Drawer abre pelo ícone 🏆
- [ ] `tsc` + `lint` passam

---

## T7 — Desafio do dia

**task name:** `[Iterate] T7 — Banner do desafio diário`

**points:** `150`

**description:**

> *Copie da seção **Objetivo** até o último checkbox.*

## Objetivo

Buscar o desafio gamificado do dia e exibir no `DailyChallengeBanner` no topo do corpo da HomePage.

## Didática

- Objeto único com **urgência** (`expiresAt`).
- Service valida expiração — `throw` se expirado.
- Erro **explícito** com retry.

## Contrato

| Campo | Valor |
|---|---|
| Componente | `DailyChallengeBanner` (fornecido) |
| Tabela futura | `daily_challenges` |
| Service | `getDailyChallenge(): Promise<DailyChallenge>` |
| Hook | `useGetDailyChallenge()` |
| Query key | `queryKeys.dailyChallenge.today` → `['daily-challenge', 'today']` |
| Integração | `HomePageDataSlots.tsx` — `HomePageTopDataSlots` (slot T7) |
| Erro na UI | Explícito + `refetch()` |

## JSON de referência

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

## Arquivos que você cria/edita

| Ação | Arquivo |
|---|---|
| Criar | `DailyChallenge` + dummy + service + hook |
| Editar | `HomePageDataSlots.tsx` — slot T7 |

## Critérios de pronto

- [ ] Banner mostra título, descrição e bônus XP
- [ ] CTA navega para `/lesson/lesson-1`
- [ ] Desafio expirado → erro perceptível + retry
- [ ] `tsc` + `lint` passam

---

## T8 — Ranking

**task name:** `[Iterate] T8 — Tabela de ranking`

**points:** `150`

**description:**

> *Copie da seção **Objetivo** até o último checkbox.*

## Objetivo

Listar ranking de XP de **outros usuários** com parâmetro `limit` e destacar o usuário atual.

## Didática

- GET parametrizado — dados de **terceiros** (distinto de T1/T4).
- Service aplica `.slice(0, limit)` após ordenar.
- Erro explícito com retry.

## Contrato

| Campo | Valor |
|---|---|
| Componente | `LeaderboardTable` (fornecido) |
| Tabela futura | `leaderboard_entries` (view) |
| Service | `getLeaderboard(limit): Promise<LeaderboardEntry[]>` |
| Hook | `useGetLeaderboard(limit = 10)` |
| Query key | `queryKeys.leaderboard.list(limit)` |
| Integração | `HomePageDataSlots.tsx` — `HomePageBottomDataSlots` (slot T8) |
| Erro na UI | Explícito + `refetch()` |

## JSON de referência

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

## Arquivos que você cria/edita

| Ação | Arquivo |
|---|---|
| Criar | `LeaderboardEntry` + dummy + service + hook |
| Editar | `HomePageDataSlots.tsx` — rodapé (slot T8) |

## Critérios de pronto

- [ ] Linha `isCurrentUser: true` destacada
- [ ] Default `limit` documentado no hook (5 ou 10)
- [ ] Erro com retry
- [ ] `tsc` + `lint` passam

---

## T9 — Continue de onde parou

**task name:** `[Iterate] T9 — Continue de onde parou`

**points:** `100`

**description:**

> *Copie da seção **Objetivo** até o último checkbox.*

## Objetivo

Buscar a última lição em andamento do usuário e exibir no `ContinueLearningCard` — primeiro bloco do corpo da HomePage.

## Didática

- Objeto `self` com **navegação** (CTA para lição).
- Campo derivado `percent` — mesma regra de T5.
- Sem overlap com T2 (preferências) ou T5 (barra por card).
- Erro **explícito** — mensagem na seção + **Tentar de novo**; empty state se sem lição em andamento.

## Contrato

| Campo | Valor |
|---|---|
| Componente | `ContinueLearningCard` (fornecido) |
| Tabela futura | `learning_resume` |
| Service | `getLearningResume(): Promise<LearningResume>` |
| Hook | `useGetLearningResume()` |
| Query key | `queryKeys.learningResume.current` → `['learning-resume', 'current']` |
| Integração | `HomePageDataSlots.tsx` — `HomePageTopDataSlots` (slot T9) |
| Erro na UI | Mensagem na seção + **Tentar de novo** |

## JSON de referência

```json
{
  "lessonId": "lesson-1",
  "lessonTitle": "E-commerce Frontend com AI",
  "completedActivities": 5,
  "totalActivities": 17,
  "lastVisitedAt": "2026-05-27T18:30:00.000Z"
}
```

> Calcular `percent` no service.

## Arquivos que você cria/edita

| Ação | Arquivo |
|---|---|
| Criar | `LearningResume` + dummy + service + hook |
| Editar | `HomePageDataSlots.tsx` — slot T9 |

## Critérios de pronto

- [ ] Card mostra título, barra de progresso e última visita
- [ ] CTA leva a `/lesson/lesson-1`
- [ ] Erro omite card sem crash
- [ ] `tsc` + `lint` passam

---

## T10 — Notificações

**task name:** `[Iterate] T10 — Sino de notificações`

**points:** `150`

**description:**

> *Copie da seção **Objetivo** até o último checkbox.*

## Objetivo

Buscar resumo de notificações do usuário e conectar ao drawer 🔔 no header (`NotificationBellIcon` + `NotificationList`).

## Didática

- Objeto com **lista aninhada** + contador derivado (`unreadCount`).
- Garantir consistência entre contador e itens no service.
- Erro **explícito** — mensagem + **Tentar de novo** dentro do drawer (sino continua clicável).

## Contrato

| Campo | Valor |
|---|---|
| Componente | `NotificationBellIcon` + `NotificationList` (fornecidos) |
| Tabela futura | `notifications` |
| Service | `getNotifications(): Promise<NotificationsSummary>` |
| Hook | `useGetNotifications()` |
| Query key | `queryKeys.notifications.mine` → `['notifications', 'mine']` |
| Integração | `HomePageHeaderDataSlots.tsx` — drawer 🔔 (slot T10) |
| Erro na UI | Mensagem + **Tentar de novo** dentro do drawer |

## JSON de referência

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

## Arquivos que você cria/edita

| Ação | Arquivo |
|---|---|
| Criar | `Notification`, `NotificationsSummary` + dummy + service + hook |
| Editar | `HomePageHeaderDataSlots.tsx` — drawer 🔔 |

## Critérios de pronto

- [ ] Badge numérico reflete `unreadCount`
- [ ] Itens não lidos visualmente distintos
- [ ] Drawer lista título e data
- [ ] `tsc` + `lint` passam

---

## T11 — Atividade recente

**task name:** `[Iterate] T11 — Feed de atividade recente`

**points:** `150`

**description:**

> *Copie da seção **Objetivo** até o último checkbox.*

## Objetivo

Listar eventos recentes do usuário em timeline (`RecentActivityFeed`) — bloco abaixo dos avisos na HomePage.

## Didática

- Lista parametrizada (`limit`) — UI de **timeline** (distinta de tabela T8 e cards T3).
- Ordenação por `occurredAt` desc no service.
- Erro **explícito** — mensagem na seção + **Tentar de novo**; `[]` → empty state.

## Contrato

| Campo | Valor |
|---|---|
| Componente | `RecentActivityFeed` (fornecido) |
| Tabela futura | `activity_events` |
| Service | `getRecentActivity(limit?): Promise<ActivityEvent[]>` |
| Hook | `useGetRecentActivity(limit = 10)` |
| Query key | `queryKeys.activityEvents.recent(limit)` |
| Integração | `HomePageDataSlots.tsx` — `HomePageTopDataSlots` (slot T11) |
| Erro na UI | Mensagem na seção + **Tentar de novo** |

## JSON de referência

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

## Arquivos que você cria/edita

| Ação | Arquivo |
|---|---|
| Criar | `ActivityEventType`, `ActivityEvent` + dummy + service + hook |
| Editar | `HomePageDataSlots.tsx` — slot T11 |

## Critérios de pronto

- [ ] Timeline com ícone por `type`, label e data
- [ ] Ordenação correta (mais recente primeiro)
- [ ] Empty state se `[]` (não é erro)
- [ ] `tsc` + `lint` passam

---

## Conflitos de merge (coordenação na aula)

| Arquivo compartilhado | Tasks |
|---|---|
| `HomePageHeaderDataSlots.tsx` | T1, T2, T4, T6, T10 |
| `HomePageDataSlots.tsx` | T3, T7, T8, T9, T11 |
| `HomePage.tsx` | T5 |

Sugestão: PRs sequenciais ou divisão por slot (`data-slot="T{N}"`).

---

*Alinhado ao padrão ouro v6 — preview mock em `src/components/data-layer/`, 11 tasks GET na mesma HomePage.*
