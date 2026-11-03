# Tasks do Batch — Bloco 3 (Data Layer + React Query)

## Quando usar este documento

Este arquivo é a referência oficial das tasks distribuídas para o batch.

Use para:
- escolher task;
- entender escopo;
- validar critérios de aceite.

---

## Visão geral

Objetivo comum das 8 tasks:
- praticar o padrão `component -> hook -> service -> dummy/api`;
- aplicar React Query com `queryKeys` centralizado;
- tratar loading/erro de forma consistente.

---

## T1 — `useLesson(lessonId)` no padrão ouro

**Dificuldade**: Iniciante  
**Tipo**: Refactor

### Objetivo
Criar hook para buscar uma lição por id e remover import direto de dummy na `LessonPage`.

### Entregas
- `src/hooks/useLesson.ts`
- export no `src/hooks/index.ts`
- `LessonPage` consumindo `useLesson`

### Critérios de aceite
- loading + erro tratados;
- sem `lessonsData.find(...)` na página;
- `tsc` e `lint` sem novos erros.

---

## T2 — `useActivitiesByLesson(lessonId)` e adaptação do fluxo

**Dificuldade**: Intermediário  
**Tipo**: Refactor (sensível)

### Objetivo
Substituir leitura direta de `activitiesData` por hook de query, mantendo lógica de progressão local.

### Entregas
- `src/hooks/useActivitiesByLesson.ts`
- export no `src/hooks/index.ts`
- ajustes no `useActivityPage.ts` para inicializar estado local a partir da query

### Critérios de aceite
- fluxo de completar atividade continua funcionando;
- loading/erro de atividades tratados;
- sem quebra em `LessonPage`.

---

## T3 — `useUserProfile()` + `ProfileBadge` no header

**Dificuldade**: Iniciante  
**Tipo**: Feature nova

### Objetivo
Exibir perfil do usuário no `GameHeader` via camada padronizada de dados.

### Entregas
- tipo `UserProfile`
- dummy `user-profile.dummy.ts`
- service `user-profile.service.ts`
- query key `userProfile.current`
- hook `useUserProfile.ts`
- componente `ProfileBadge.tsx`
- integração no `GameHeader`

### Critérios de aceite
- badge aparece após loading;
- em erro, não quebra UI;
- padrão de arquitetura respeitado.

---

## T4 — `useLessonProgress(lessonId)` + progresso no card

**Dificuldade**: Iniciante  
**Tipo**: Feature nova

### Objetivo
Mostrar progresso por lição na `HomePage`.

### Entregas
- tipo `LessonProgress`
- dummy `lesson-progress.dummy.ts`
- service `lesson-progress.service.ts`
- query key dedicada
- hook `useLessonProgress.ts`
- barra + texto no `LessonCard`

### Critérios de aceite
- card exibe progresso com loading/erro apropriados;
- sem impactar navegação da home.

---

## T5 — `useRecentLessons(limit)` + widget "Continue de onde parou"

**Dificuldade**: Intermediário  
**Tipo**: Feature nova

### Objetivo
Criar widget de lições recentes no topo da Home.

### Entregas
- tipo `RecentLesson`
- dummy `recent-lessons.dummy.ts`
- service `getRecentLessons(limit)`
- query key `recentLessons.list(limit)`
- hook `useRecentLessons`
- componente `ContinueWidget`
- integração na HomePage

### Critérios de aceite
- widget com loading/erro/empty;
- ordenação por data recente funcionando.

---

## T6 — `useAchievements()` + drawer de conquistas

**Dificuldade**: Intermediário  
**Tipo**: Feature nova

### Objetivo
Adicionar drawer de conquistas no fluxo da lição.

### Entregas
- tipo `Achievement`
- dummy `achievements.dummy.ts`
- service `getMyAchievements`
- query key `achievements.mine`
- hook `useAchievements`
- `AchievementsDrawer.tsx`
- botão no `GameHeader`

### Critérios de aceite
- drawer abre/fecha corretamente;
- conquistas locked/unlocked visíveis e claras.

---

## T7 — `useDailyChallenge()` + banner na HomePage

**Dificuldade**: Intermediário  
**Tipo**: Feature nova

### Objetivo
Exibir desafio do dia no topo da Home.

### Entregas
- tipo `DailyChallenge`
- service `getDailyChallenge`
- query key diária
- hook `useDailyChallenge`
- `DailyChallengeBanner.tsx`
- integração na Home

### Critérios de aceite
- banner aparece com CTA;
- em erro, não quebra home;
- cache diário coerente.

---

## T8 — `useLeaderboard(limit)` + página `/leaderboard`

**Dificuldade**: Intermediário  
**Tipo**: Feature nova (inclui rota)

### Objetivo
Criar ranking completo com página dedicada.

### Entregas
- tipo `LeaderboardEntry`
- dummy `leaderboard.dummy.ts`
- service `getLeaderboard(limit)`
- query key `leaderboard.list(limit)`
- hook `useLeaderboard`
- página `LeaderboardPage.tsx`
- rota em `App.tsx`
- link na Home

### Critérios de aceite
- rota funciona com loading/erro;
- top 3 destacados visualmente.

---

## Regra de entrega para todas as tasks

- seguir padrão ouro do bloco;
- PR pequena, focada e com descrição clara;
- incluir evidências de validação (`tsc`, `lint`).

---

## Distribuição sugerida

- Iniciantes: T1, T3, T4
- Intermediários: T2, T5, T6, T7, T8

---

## Template de descrição de PR (copy/paste)

```md
## O que foi feito
- [ ] ...
- [ ] ...

## Por que
Breve contexto da task e benefício da mudança.

## Como validar
- npx tsc --noEmit
- npm run lint
- passos manuais na UI

## Observações
Riscos, decisões ou trade-offs.
```

