# Issues — Batch Camada de Dados (prontas para publicar)

> **Documentos relacionados:**
> - Padrão ouro: [`padrao-ouro-tasks-camada-de-dados.md`](./padrao-ouro-tasks-camada-de-dados.md)
> - Contratos JSON: [`contratos-json-tasks-camada-de-dados.md`](./contratos-json-tasks-camada-de-dados.md)
>
> Copie cada seção abaixo como **uma issue** na plataforma — ou use o formato pronto em [`tasks-plataforma-camada-de-dados.md`](./tasks-plataforma-camada-de-dados.md) (campos **task name**, **points**, **description**).

---

## Decisão do batch — componentes visuais fornecidos

### Por que o mentor entrega o `.tsx` presentacional

| Sem componente pronto | Com componente pronto (decisão deste batch) |
|---|---|
| Fellow perde tempo com Tailwind/layout | Foco 100% em type → dummy → service → hook → integração |
| PRs com estilos diferentes dificultam review | Visual uniforme; review olha só camada de dados |
| Conflitos de merge em arquivos de UI | Componentes já na `main`; fellow mexe em poucos arquivos |
| Curva de distração (shadcn, espaçamento, etc.) | Props já tipadas — fellow “liga fio” nos dados |

### O que o fellow **ainda faz** (não é só colar)

1. Type + dummy + service + `queryKeys` + `useGet*`
2. **Integração (container)** no arquivo indicado — chama hook, trata `isPending` / `isError`, passa `data` pro componente
3. Skeleton/placeholder mínimo na integração (pode ser inline simples; não precisa componente elaborado)

### O que o fellow **não faz**

- ❌ Criar ou redesenhar o componente presentacional em `src/components/data-layer/`
- ❌ Importar dummy direto na página
- ❌ Colocar `useQuery` dentro do componente fornecido

### Preparação do mentor (antes de distribuir tasks)

1. **Componentes + preview** já em `src/components/data-layer/` — fellows fazem `git pull`.
2. **Slots de integração** com mock hoje (fellows substituem por hooks):
   - `HomePageHeaderDataSlots.tsx` → T1, T2, T4, T6, T10
   - `HomePageDataSlots.tsx` → T9, T7, T3, T11 (topo) + T8 (rodapé)
   - `HomePage.tsx` (`LessonCard`) → T5
3. Cada fellow cria branch e implementa type → dummy → service → `useGet*` → troca mock por hook.

### Mapa de integração (estado atual)

```txt
HomePage header: T10 notificações · T4 stats · T6 troféu · T2 config · T1 perfil
HomePage body:   T9 continue · T7 banner · T3 avisos · T11 atividade · T5 progresso · T8 ranking
LessonPage:      GameHeader (sessão) + botão voltar — fora do batch
```

### Mapa de componentes fornecidos

| Task | Arquivo (mentor implementa) | Props principais |
|---|---|---|
| T1 | `src/components/data-layer/UserProfileCard.tsx` | `profile: UserProfile` |
| T2 | `src/components/data-layer/AppearanceSettingsPanel.tsx` | `preferences: UserPreferences` |
| T3 | `src/components/data-layer/AnnouncementList.tsx` | `announcements: Announcement[]` |
| T4 | `src/components/data-layer/UserStatsBadge.tsx` | `stats: UserStats` |
| T5 | `src/components/data-layer/LessonProgressBar.tsx` | `progress: LessonProgress` |
| T6 | `src/components/data-layer/AchievementsList.tsx` | `achievements: UserAchievement[]` |
| T7 | `src/components/data-layer/DailyChallengeBanner.tsx` | `challenge: DailyChallenge` |
| T8 | `src/components/data-layer/LeaderboardTable.tsx` | `entries: LeaderboardEntry[]` |
| T9 | `src/components/data-layer/ContinueLearningCard.tsx` | `resume: LearningResume` |
| T10 | `src/components/data-layer/NotificationBell.tsx` | `NotificationBellIcon` + `NotificationList` |
| T11 | `src/components/data-layer/RecentActivityFeed.tsx` | `events: ActivityEvent[]` |

> Componentes aceitam **apenas props** — zero React Query dentro deles.

---

## Instruções gerais (colar no topo de cada issue ou na descrição do épico)

```markdown
### Antes de começar

1. `git fetch && git pull` na branch `main` (componentes visuais já estão no repo).
2. Leia: wiki "O que esperamos até a reunião" + "Padrão ouro — Tasks de Camada de Dados".
3. Crie sua branch: `<seu-nome>/feat/T{N}-<descricao>` — detalhes em [`padrao-git-branches-commits-pr.md`](./padrao-git-branches-commits-pr.md).

### Escopo desta task

Você implementa a **camada de dados** e **substitui o mock** nos arquivos `*DataSlots.tsx` (ou `LessonCard` na T5). O componente visual já existe em `src/components/data-layer/` — **não recrie o `.tsx`**.

### Ordem sugerida

type → dummy → service → queryKey → useGet* → trocar mock por hook + isPending/isError nos slots.

### Validação

- [ ] `npx tsc --noEmit`
- [ ] `npm run lint`
- [ ] Testar manualmente o fluxo loading → sucesso → erro (simule falha no service se precisar)
```

---

## Tratamento de erro (regra do batch)

**Decisão pedagógica:** neste batch, **toda task trata `isError` de forma explícita** — mensagem visível + botão **Tentar de novo** (`refetch()`). Não omitir widget silenciosamente.

| Formato na UI | Tasks | O que mostrar em `isError` |
|---|---|---|
| **Compacto** (header) | T1, T4 | Texto curto + botão retry inline |
| **Drawer** | T2, T6, T10 | Mensagem + botão retry **dentro do painel** (ícone do header continua clicável) |
| **Seção** | T3, T7, T8, T9, T11 | Bloco de erro + botão retry |
| **Card** | T5 | Linha de erro + botão retry no card |

**Empty state ≠ erro:** lista vazia `[]` ou “sem dado” legítimo → mensagem amigável, **sem** tratar como falha de rede.

**Onde implementar:** na integração (`*DataSlots.tsx` ou `LessonCard`) — nunca no componente presentacional.

---

# T1 — Perfil do usuário no header

**Dificuldade:** 🟢 Iniciante (~3h)  
**Operação CRUD:** GET  
**Integração:** header da `HomePage` — `HomePageHeaderDataSlots.tsx`  
**Componente fornecido:** `src/components/data-layer/UserProfileCard.tsx`

---

### Contexto

O header da home não mostra **quem é** o aluno. Você vai buscar o perfil (mock `user-1`) e substituir o mock em `HomePageHeaderDataSlots` por `useGetUserProfile()`.

### Contrato JSON (tabela futura: `profiles`)

```json
{
  "id": "user-1",
  "name": "Ana Fellow",
  "email": "ana.fellow@devfellowship.dev",
  "age": 24,
  "avatarUrl": "https://i.pravatar.cc/64?u=user-1"
}
```

### Objetivo

Implementar `UserProfile` → dummy → `getUserProfile` → `useGetUserProfile` → integrar em `HomePageHeaderDataSlots.tsx`.

---

### Entregáveis

#### Fase 1 — Modelagem
- [ ] `UserProfile` em `src/types/index.ts`
- [ ] `src/test-utils/user-profile.dummy.ts`

#### Fase 2 — Service
- [ ] `src/services/user-profile.service.ts` — `getUserProfile()`
- [ ] Export em `src/services/index.ts`

#### Fase 3 — React Query
- [ ] `queryKeys.userProfile.current` em `src/lib/queryKeys.ts`
- [ ] `src/hooks/useGetUserProfile.ts`
- [ ] Export em `src/hooks/index.ts`

#### Fase 4 — Integração
- [ ] Em `HomePageHeaderDataSlots.tsx`: trocar `previewUserProfile` por `useGetUserProfile()`
- [ ] `isPending` → placeholder simples (ex.: círculo cinza + "…")
- [ ] `isError` → mensagem curta + botão **Tentar de novo** (`refetch()`) — formato compacto no header
- [ ] Sucesso → `<UserProfileCard profile={data} variant="compact" />`

#### Validação
- [ ] `npx tsc --noEmit` + `npm run lint`

---

### Critérios de aceite

- [ ] Na `/`, o header mostra avatar + nome após ~300ms
- [ ] Durante loading, placeholder visível
- [ ] Em erro, mensagem compacta + **Tentar de novo** (header continua funcional)
- [ ] Nenhum import de dummy fora de `services/` / `test-utils/`
- [ ] `UserProfileCard` não importa React Query

### Referências

- `src/services/lessons.service.ts`
- `src/hooks/useLessons.ts` (legado — copiar estrutura, nomear `useGetUserProfile`)
- `docs/wiki/contratos-json-tasks-camada-de-dados.md` § T1

---

# T2 — Preferências de aparência (tema, som, idioma)

**Dificuldade:** 🟢 Iniciante (~3h)  
**Operação CRUD:** GET  
**Integração:** header da `HomePage` — drawer ⚙️ em `HomePageHeaderDataSlots.tsx`  
**Componente fornecido:** `src/components/data-layer/AppearanceSettingsPanel.tsx`

---

### Contexto

Preferências do usuário: tema, sons e idioma. Nesta task você **lê** e substitui o mock no drawer ⚙️. Edição (toggle) fica para o Batch 2.

### Contrato JSON (tabela futura: `user_preferences`)

```json
{
  "userId": "user-1",
  "theme": "dark",
  "soundEffectsEnabled": true,
  "language": "pt-BR"
}
```

### Objetivo

Implementar `UserPreferences` → dummy → `getUserPreferences` → `useGetUserPreferences` → abrir painel no header.

---

### Entregáveis

#### Fase 1 — Modelagem
- [ ] `ThemePreference` + `UserPreferences` em `src/types/index.ts`
- [ ] `src/test-utils/user-preferences.dummy.ts`

#### Fase 2 — Service
- [ ] `src/services/user-preferences.service.ts` — `getUserPreferences()`
- [ ] Export em `src/services/index.ts`

#### Fase 3 — React Query
- [ ] `queryKeys.userPreferences.current`
- [ ] `src/hooks/useGetUserPreferences.ts`

#### Fase 4 — Integração
- [ ] Em `HomePageHeaderDataSlots.tsx`: trocar mock por `useGetUserPreferences()` no drawer ⚙️
- [ ] `isPending` → "Carregando preferências…"
- [ ] `isError` → mensagem curta + botão **Tentar de novo** no drawer
- [ ] Sucesso → `<AppearanceSettingsPanel preferences={data} />`

#### Validação
- [ ] tsc + lint

---

### Critérios de aceite

- [ ] Clicar ⚙️ abre drawer com tema, sons e idioma legíveis
- [ ] Valores batem com o dummy (`dark`, sons ativados, `pt-BR`)
- [ ] Componente fornecido não foi alterado para adicionar hooks
- [ ] tsc + lint passam

### Dica

O componente já formata labels ("Tema: Escuro"). Você só passa `preferences` via props.

---

# T3 — Avisos da plataforma

**Dificuldade:** 🟢 Iniciante (~3h)  
**Operação CRUD:** GET (lista)  
**Integração:** `HomePage` — seção "Avisos"  
**Componente fornecido:** `src/components/data-layer/AnnouncementList.tsx`

---

### Contexto

A home precisa mostrar avisos operacionais (manutenção, novidades). Diferente das lições — é conteúdo da **plataforma**.

### Contrato JSON (tabela futura: `announcements`)

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

### Objetivo

Lista de avisos com **filtro de expirados** e **ordenação** no service.

---

### Entregáveis

#### Fase 1 — Modelagem
- [ ] `AnnouncementSeverity` + `Announcement` em `src/types/index.ts`
- [ ] `src/test-utils/announcements.dummy.ts`

#### Fase 2 — Service
- [ ] `getAnnouncements(): Promise<Announcement[]>`
- [ ] Filtrar `expiresAt < now`
- [ ] Ordenar `publishedAt` desc
- [ ] `[]` é válido (empty state), não `throw`

#### Fase 3 — React Query
- [ ] `queryKeys.announcements.active`
- [ ] `src/hooks/useGetAnnouncements.ts`

#### Fase 4 — Integração (`HomePage`)
- [ ] Seção "Avisos" acima ou abaixo do grid de lições
- [ ] `isPending` → skeleton ou texto de loading
- [ ] `isError` → mensagem + botão `refetch()` (**explícito**)
- [ ] Sucesso vazio → "Nenhum aviso no momento"
- [ ] Sucesso → `<AnnouncementList announcements={data} />`

---

### Critérios de aceite

- [ ] Avisos aparecem com cores por `severity`
- [ ] Itens expirados no dummy não aparecem (teste adicionando um com `expiresAt` no passado)
- [ ] Erro mostra retry
- [ ] tsc + lint

---

# T4 — Badge de stats (XP, level, streak)

**Dificuldade:** 🟢 Iniciante (~3h)  
**Operação CRUD:** GET  
**Integração:** header da `HomePage` — `HomePageHeaderDataSlots.tsx`  
**Componente fornecido:** `src/components/data-layer/UserStatsBadge.tsx`

---

### Contexto

Perfil (T1) = quem é o aluno. Stats (T4) = **como está jogando** (XP, level, streak). Tabelas separadas — duas queries.

### Contrato JSON (tabela futura: `user_stats`)

```json
{
  "userId": "user-1",
  "totalXp": 1240,
  "level": 5,
  "currentStreak": 3,
  "livesRemaining": 4
}
```

### Entregáveis

- [ ] `UserStats` + dummy + `getUserStats` + `useGetUserStats`
- [ ] `queryKeys.userStats.current`
- [ ] Integração em `HomePageHeaderDataSlots.tsx` com `useGetUserStats()`
- [ ] `isError` → mensagem compacta + **Tentar de novo** no header

### Critérios de aceite

- [ ] Header da home mostra `Lv. 5 · 1.240 XP · 🔥 3` (ou similar)
- [ ] Independente do perfil T1 (duas queries separadas)
- [ ] tsc + lint

---

# T5 — Barra de progresso por lição

**Dificuldade:** 🟡 Intermediário (~4h)  
**Operação CRUD:** GET parametrizado  
**Integração:** `HomePage` — dentro de cada `LessonCard`  
**Componente fornecido:** `src/components/data-layer/LessonProgressBar.tsx`

---

### Contexto

Cada card de lição deve mostrar quantas activities o aluno completou. Uma query **por lição** no card.

### Contrato JSON (por `lessonId`; exemplo `lesson-1`)

```json
{
  "lessonId": "lesson-1",
  "completedActivities": 5,
  "totalActivities": 17
}
```

> `percent` é **calculado no service**: `Math.round((completed / total) * 100)`.

### Entregáveis

- [ ] `LessonProgress` (com `percent`) + dummy (mapa por `lessonId`)
- [ ] `getLessonProgress(lessonId)` — `throw` se lição não existir
- [ ] `useGetLessonProgress(lessonId)` com `enabled: !!lessonId`
- [ ] `queryKeys.lessonProgress.byLesson(lessonId)`
- [ ] Hook chamado **dentro** do `LessonCard`, não no `HomePage` pai
- [ ] `isError` → mensagem curta + **Tentar de novo** no card (no lugar da barra)

### Critérios de aceite

- [ ] Card da `lesson-1` mostra barra ~29% (5/17)
- [ ] React Query DevTools mostra query por `lessonId`
- [ ] `LessonProgressBar` recebe `progress` via props
- [ ] tsc + lint

### Dica

10 cards = 10 queries paralelas. React Query lida bem com isso.

---

# T6 — Drawer de conquistas

**Dificuldade:** 🟡 Intermediário (~4h)  
**Operação CRUD:** GET (lista)  
**Integração:** header da `HomePage` — drawer 🏆 em `HomePageHeaderDataSlots.tsx`  
**Componente fornecido:** `src/components/data-layer/AchievementsList.tsx`

---

### Contrato JSON (tabela futura: `achievements` + `user_achievements`)

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

### Entregáveis

- [ ] `UserAchievement` + dummy + `getUserAchievements`
- [ ] Service ordena: desbloqueadas primeiro, depois bloqueadas
- [ ] `useGetUserAchievements` + `queryKeys.userAchievements.mine`
- [ ] Ícone troféu no header da home → drawer com `useGetUserAchievements()`
- [ ] `isError` → mensagem + **Tentar de novo** dentro do drawer

### Critérios de aceite

- [ ] Conquistas desbloqueadas e bloqueadas visualmente distintas
- [ ] Drawer abre/fecha sem quebrar header
- [ ] tsc + lint

---

# T7 — Banner do desafio diário

**Dificuldade:** 🟡 Intermediário (~3–4h)  
**Operação CRUD:** GET  
**Integração:** `HomePage` — banner no topo  
**Componente fornecido:** `src/components/data-layer/DailyChallengeBanner.tsx`

---

### Contrato JSON (tabela futura: `daily_challenges`)

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

### Entregáveis

- [ ] `DailyChallenge` + dummy + `getDailyChallenge`
- [ ] Service: `throw` se expirado ou ausente
- [ ] `useGetDailyChallenge` + `queryKeys.dailyChallenge.today`
- [ ] Banner no topo da `HomePage`
- [ ] CTA do componente leva a `/lesson/lesson-1` (via props ou link no componente fornecido)
- [ ] Erro **explícito** + `refetch()`

### Critérios de aceite

- [ ] Banner mostra título, descrição e bônus XP
- [ ] CTA navega para a lição
- [ ] tsc + lint

---

# T8 — Tabela de ranking

**Dificuldade:** 🟡 Intermediário (~4h)  
**Operação CRUD:** GET parametrizado (lista)  
**Integração:** `HomePage` — seção "Ranking"  
**Componente fornecido:** `src/components/data-layer/LeaderboardTable.tsx`

---

### Contrato JSON (tabela futura: `leaderboard_entries`)

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

### Entregáveis

- [ ] `LeaderboardEntry` + dummy + `getLeaderboard(limit)`
- [ ] Service aplica `.slice(0, limit)` após ordenar por rank
- [ ] `useGetLeaderboard(limit = 10)` + `queryKeys.leaderboard.list(limit)`
- [ ] Seção na `HomePage`
- [ ] Erro explícito + retry

### Critérios de aceite

- [ ] Linha do usuário atual (`isCurrentUser: true`) destacada
- [ ] Default `limit` 5 ou 10 documentado no hook
- [ ] tsc + lint

---

# T9 — Continue de onde parou

**Dificuldade:** 🟢 Iniciante (~3h)  
**Operação CRUD:** GET (objeto único)  
**Integração:** `HomePage` — primeiro bloco do corpo (`HomePageTopDataSlots`)  
**Componente fornecido:** `src/components/data-layer/ContinueLearningCard.tsx`

---

### Contrato JSON (tabela futura: `learning_resume`)

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

### Entregáveis

- [ ] `LearningResume` + dummy + `getLearningResume`
- [ ] Service calcula `percent` a partir de `completedActivities` / `totalActivities`
- [ ] `useGetLearningResume` + `queryKeys.learningResume.current`
- [ ] Substituir mock em `HomePageTopDataSlots` (slot T9)
- [ ] `isError` → mensagem na seção + **Tentar de novo**
- [ ] Empty state legítimo (sem lição em andamento) → mensagem amigável, **não** confundir com erro de rede

### Critérios de aceite

- [ ] Card mostra título, barra de progresso e “Última visita”
- [ ] CTA navega para `/lesson/{lessonId}`
- [ ] tsc + lint

---

# T10 — Sino de notificações

**Dificuldade:** 🟡 Intermediário (~4h)  
**Operação CRUD:** GET (objeto + lista aninhada)  
**Integração:** Header da `HomePage` — drawer 🔔 em `HomePageHeaderDataSlots`  
**Componente fornecido:** `src/components/data-layer/NotificationBell.tsx` (`NotificationBellIcon` + `NotificationList`)

---

### Contrato JSON (tabela futura: `notifications`)

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

### Entregáveis

- [ ] `Notification` + `NotificationsSummary` + dummy + `getNotifications`
- [ ] Service garante consistência entre `unreadCount` e `items` (pode calcular no service)
- [ ] `useGetNotifications` + `queryKeys.notifications.mine`
- [ ] Substituir mock no drawer 🔔 em `HomePageHeaderDataSlots` (slot T10)
- [ ] `isError` → mensagem + **Tentar de novo** dentro do drawer (sino continua clicável)

### Critérios de aceite

- [ ] Badge numérico reflete `unreadCount`
- [ ] Lista no drawer mostra título e data de cada notificação
- [ ] Itens não lidos visualmente distintos
- [ ] tsc + lint

---

# T11 — Feed de atividade recente

**Dificuldade:** 🟡 Intermediário (~4h)  
**Operação CRUD:** GET parametrizado (lista)  
**Integração:** `HomePage` — bloco abaixo dos avisos (`HomePageTopDataSlots`)  
**Componente fornecido:** `src/components/data-layer/RecentActivityFeed.tsx`

---

### Contrato JSON (tabela futura: `activity_events`)

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

### Entregáveis

- [ ] `ActivityEvent` + dummy + `getRecentActivity(limit)`
- [ ] Service ordena por `occurredAt` desc; default `limit` 10
- [ ] `useGetRecentActivity(limit = 10)` + `queryKeys.activityEvents.recent(limit)`
- [ ] Substituir mock em `HomePageTopDataSlots` (slot T11)
- [ ] `isError` → mensagem na seção + **Tentar de novo**
- [ ] Lista vazia `[]` → empty state (não é erro)

### Critérios de aceite

- [ ] Timeline mostra ícone por `type`, `label` e data relativa/absoluta
- [ ] Empty state se lista vazia (não é erro)
- [ ] tsc + lint

---

## Checklist do mentor (antes do batch)

- [x] Componentes + preview mock em `src/components/data-layer/`
- [x] Slots em `HomePageHeaderDataSlots`, `HomePageDataSlots`, `HomePage` (T5)
- [ ] Fellows fazem `git pull` na aula
- [ ] 11 tasks publicadas na plataforma ([`tasks-plataforma-camada-de-dados.md`](./tasks-plataforma-camada-de-dados.md))
- [ ] Wiki sincronizada (padrão ouro + contratos + issues)
- [ ] (Opcional) Issue mentor: `useLessons` → `useGetLessons`

### Types nos componentes

Tipos provisórios em `src/components/data-layer/types.ts`. **Fellows movem** para `src/types/index.ts` na task e ajustam imports.

---

## Distribuição sugerida na aula

| Fellow | Task | Motivo |
|---|---|---|
| 1–2 | T1, T2 | Iniciante — objeto único, header |
| 3–4 | T3, T4 | Lista + badge |
| 5 | T5 | Parametrizado — único mais delicado |
| 6–7 | T6, T7 | Drawer + banner |
| 8 | T8 | Ranking |
| 9 | T9 | Objeto `self` + CTA — corpo da HomePage |
| 10 | T10 | Contador + drawer no header |
| 11 | T11 | Timeline parametrizada — fecha batch |

**Conflitos de merge:** T1/T2/T4/T6/T10 compartilham `HomePageHeaderDataSlots.tsx` — **coordenar** ordem de merge ou dividir por PR sequencial. T3/T7/T8/T9/T11 compartilham `HomePageDataSlots.tsx`.

---

*Issues alinhadas ao padrão ouro v6 + contratos JSON + preview mock em `data-layer/`.*
