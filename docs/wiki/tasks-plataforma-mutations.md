# Tasks para a plataforma — Mutations (WRITE)

> **Uso:** copie **task name**, **points** e **description** (da seção Objetivo até o último checkbox) para a plataforma.
>
> **Como executar** (não cole na task — o fellow lê na wiki):
> [Guia de execução — Mutations](./guia-execucao-mutations-m2-m11-m8.md)
>
> **Referência de código:** [PR #76](https://github.com/devfellowship/dfl-iterate/pull/76)

---

## Texto do épico (colar uma vez)

```markdown
### Contexto

O `useQuery` / READ das tasks anteriores já está (ou estará) na main (`useGet*`).
Estas tasks de mutation adicionam o WRITE (`useMutation`).

A mutation não substitui a query: ela grava no service e, no sucesso, invalida a mesma queryKey para o GET refetchar.

### Antes de começar

1. `git fetch && git pull origin main`
2. Confirme que o useQuery da task anterior **já está na main** e funciona na tela.
3. Branch **só da mutation** (não misture com o READ): `<seu-nome>/feat/M{N}-<descricao>`
4. Leia o [guia de execução](docs/wiki/guia-execucao-mutations-m2-m11-m8.md) e olhe a [PR #76](https://github.com/devfellowship/dfl-iterate/pull/76).

### Regras

- Reaproveite type, GET, queryKey e `useGet*`
- Dummy mutável (`get` / `set`); write só no service
- `invalidateQueries` na key do GET — sem `setQueryData`
- React Query no container/slot, não no componente visual
- `npx tsc --noEmit` + `npm run lint`
```

---

## Resumo

| Task atual | Task anterior (useQuery) | Tipo | Points |
|---|---|---|---|
| **M1** | Perfil | UPDATE (objeto completo) | 100 |
| **M2** | Preferências | UPDATE (objeto completo) | 100 |
| **M3** | Avisos | DISMISS por `id` | 100 |
| **M5** | Progresso por lição | UPDATE (+1 atividade) | 150 |
| **M8** | Ranking | UPDATE + recálculo | 200 |
| **M10** | Notificações | UPDATE (marcar 1 lida) | 100 |
| **M11** | Feed de atividade | CREATE | 150 |

> **M4** (claim XP / stats) — fora deste lote.

### Query keys (invalidar a do GET)

```ts
userProfile.current              // ['user-profile']
userPreferences.current          // ['user-preferences', 'current']
announcements.all                // ['announcements']
lessonProgress.byLesson(id)      // ['lessonProgress', id]
leaderboard.list()               // ['leaderboard', 'list']
notifications.all                // ['notifications']
activityEvents.recent()          // ['activityEvents', 'recent']
```

---

## M1 — Atualizar perfil

**task name:** `[Iterate] M1 — Mutation: atualizar perfil`

**points:** `100`

**description:**

## Objetivo

Permitir atualizar o perfil do usuário no header. A UI deve refletir o novo valor sem reload, reusando o `useGetUserProfile` já existente.

## Pré-requisito

READ do perfil **já mergeado na `main`**. Branch separada só para esta mutation.

## Escopo

- `updateUserProfile(next: UserProfile)` no service existente (objeto **completo**, sem `Partial`)
- `useUpdateUserProfile()` com `invalidateQueries` em `queryKeys.userProfile.current` (`['user-profile']`)
- CTA no slot T1 (ex.: botão que salva o perfil montado com `{ ...profile, ...camposAlterados }`)
- Dummy de perfil persistindo em memória (`get` / `set`)

## Fora de escopo

- Recriar type, queryKey ou `useGetUserProfile`
- Upload real de imagem / formulário completo de settings

## Critérios de aceite

- [ ] Salvar perfil atualiza o card no header sem F5
- [ ] Mutation recebe o objeto `UserProfile` completo
- [ ] Botão reflete `isPending`; erro da mutation é visível
- [ ] Invalidação usa `queryKeys.userProfile.current`
- [ ] `tsc` + `lint` passam

Como executar: [Guia de execução — M1](docs/wiki/guia-execucao-mutations-m2-m11-m8.md)  
Referência: [PR #76](https://github.com/devfellowship/dfl-iterate/pull/76)

---

## M2 — Atualizar preferências

**task name:** `[Iterate] M2 — Mutation: atualizar preferências`

**points:** `100`

**description:**

## Objetivo

Permitir que o usuário altere tema e sons no drawer ⚙️. A UI deve atualizar sem reload, reusando o `useGetUserPreferences` já existente.

## Escopo

- `updateUserPreferences(next: UserPreferences)` no service existente (objeto **completo**, sem `Partial`)
- `useUpdateUserPreferences()` com `invalidateQueries` em `queryKeys.userPreferences.current`
- CTA no drawer de preferências: alternar tema e ligar/desligar sons
- Dummy de preferências persistindo em memória (`get` / `set`)

## Fora de escopo

- Recriar type, queryKey ou `useGetUserPreferences`
- Aplicar o tema no CSS do app (basta o valor no painel mudar)

## Critérios de aceite

- [ ] Alternar tema/sons atualiza o painel sem F5
- [ ] Botão reflete `isPending`; erro da mutation é visível
- [ ] Invalidação usa a mesma key do GET
- [ ] `tsc` + `lint` passam

Como executar: [Guia de execução — M2](docs/wiki/guia-execucao-mutations-m2-m11-m8.md)  
Referência: [PR #76](https://github.com/devfellowship/dfl-iterate/pull/76)

---

## M3 — Dispensar aviso

**task name:** `[Iterate] M3 — Mutation: dispensar aviso`

**points:** `100`

**description:**

## Objetivo

Permitir dispensar **um** aviso da lista por `id`. O item some da UI sem reload, reusando o `useGetAnnouncements` já existente.

## Pré-requisito

READ de avisos **já mergeado na `main`**. Branch separada só para esta mutation.

## Escopo

- `dismissAnnouncement(id: string)` no service existente (remove o item com esse `id` do dummy; se não achar → `throw`)
- `useDismissAnnouncement()` com `invalidateQueries` em `queryKeys.announcements.all` (`['announcements']`)
- CTA por item (ex.: botão “Dispensar” / “Fechar” em cada aviso)
- Dummy de avisos persistindo em memória (`get` / `set`)

## Fora de escopo

- Recriar type, queryKey ou `useGetAnnouncements`
- “Limpar todos” (não é V1)
- Criar/editar texto de avisos

## Critérios de aceite

- [ ] Dispensar um aviso remove **só** aquele item da lista sem F5
- [ ] `id` inexistente resulta em erro tratado na UI
- [ ] Botão reflete `isPending`; erro da mutation é visível
- [ ] Invalidação usa `queryKeys.announcements.all`
- [ ] `tsc` + `lint` passam

Como executar: [Guia de execução — M3](docs/wiki/guia-execucao-mutations-m2-m11-m8.md)  
Referência: [PR #76](https://github.com/devfellowship/dfl-iterate/pull/76)

---

## M5 — Avançar progresso da lição

**task name:** `[Iterate] M5 — Mutation: +1 atividade no progresso`

**points:** `150`

**description:**

## Objetivo

Permitir avançar o progresso de uma lição em **+1 atividade concluída**. A barra de progresso no card deve atualizar sem reload, reusando o `useLessonProgressBarById` / GET de progresso já existente.

## Escopo

- `advanceLessonProgress(lessonId: string)` no service existente:
  - soma 1 em `completedActivities` (não ultrapassar `totalActivities`)
  - recalcula `percent` no service
- `useAdvanceLessonProgress()` com `invalidateQueries` em `queryKeys.lessonProgress.byLesson(lessonId)`
- Botão “+1 atividade” no `LessonCard` (slot T5), ao lado da barra
- Dummy de progresso persistindo em memória (`get` / `set`) — **sem** mutar o dummy in-place no GET

## Fora de escopo

- Recriar type, queryKey ou o hook de GET do progresso
- Completar a lição inteira de uma vez / desbloquear próxima trilha
- Invalidar ranking ou user stats

## Critérios de aceite

- [ ] O clique aumenta “X de Y atividades” e o `%` da barra sem F5
- [ ] No teto (`completedActivities === totalActivities`), a mutation falha ou no-op de forma clara (documente no service; erro visível se `throw`)
- [ ] Botão reflete `isPending`; erro da mutation é visível
- [ ] Invalidação usa `queryKeys.lessonProgress.byLesson(lessonId)`
- [ ] `tsc` + `lint` passam

Como executar: [Guia de execução — M5](docs/wiki/guia-execucao-mutations-m2-m11-m8.md)  
Referência: [PR #76](https://github.com/devfellowship/dfl-iterate/pull/76)

---

## M8 — +XP no ranking

**task name:** `[Iterate] M8 — Mutation: +XP no ranking`

**points:** `200`

**description:**

## Objetivo

Permitir que o usuário atual ganhe XP de prática no ranking. A tabela deve atualizar XP e posição sem reload, reusando o `useGetLeaderboard` já existente.

## Escopo

- `claimLeaderboardPracticeXp(amount?)` no service existente (default `25`)
- No service: somar XP em `isCurrentUser`, reordenar por XP e recalcular `rank`
- `useClaimLeaderboardXp()` com `invalidateQueries` em `queryKeys.leaderboard.list()`
- Botão “+XP no ranking” na tabela **viva** (a que já usa `useGetLeaderboard`)
- Dummy do ranking persistindo em memória (`get` / `set`)

## Fora de escopo

- Recriar type, queryKey ou `useGetLeaderboard`
- Editar `rank` na UI / no clique
- Invalidar `userStats` (fora deste lote)
- Introduzir `limit` se o GET atual não usa

## Critérios de aceite

- [ ] O clique aumenta o XP da linha “(você)” sem F5
- [ ] Depois de cliques suficientes, a posição pode mudar
- [ ] Recálculo de rank vive no service, não no JSX
- [ ] Botão reflete `isPending`; erro da mutation é visível
- [ ] Integração não depende de `previewLeaderboard`
- [ ] `tsc` + `lint` passam

Como executar: [Guia de execução — M8](docs/wiki/guia-execucao-mutations-m2-m11-m8.md)  
Referência: [PR #76](https://github.com/devfellowship/dfl-iterate/pull/76)

---

## M10 — Marcar notificação como lida

**task name:** `[Iterate] M10 — Mutation: marcar notificação como lida`

**points:** `100`

**description:**

## Objetivo

Permitir marcar **uma** notificação como lida por `id`. Badge de não lidas e estilo do item devem atualizar sem reload, reusando o `useGetNotifications` já existente.

## Escopo

- `markNotificationAsRead(id: string)` no service existente (`read: true` nesse item; se não achar → `throw`)
- `useMarkNotificationAsRead()` com `invalidateQueries` em `queryKeys.notifications.all` (`['notifications']`)
- CTA no item não lido (ex.: botão “Marcar como lida” ou clique no item)
- Dummy de notificações persistindo em memória (`get` / `set`)
- `unreadCount` continua sendo derivado no GET a partir dos `items`

## Fora de escopo

- Recriar type, queryKey ou `useGetNotifications`
- “Marcar todas como lidas” (não é V1)
- Apagar notificação

## Critérios de aceite

- [ ] Marcar uma não lida atualiza o item e o badge sem F5
- [ ] Só aquela notificação muda de estado
- [ ] Botão/ação reflete `isPending`; erro da mutation é visível
- [ ] Invalidação usa `queryKeys.notifications.all`
- [ ] `tsc` + `lint` passam

Como executar: [Guia de execução — M10](docs/wiki/guia-execucao-mutations-m2-m11-m8.md)  
Referência: [PR #76](https://github.com/devfellowship/dfl-iterate/pull/76)

---

## M11 — Registrar atividade recente

**task name:** `[Iterate] M11 — Mutation: registrar atividade recente`

**points:** `150`

**description:**

## Objetivo

Permitir registrar um novo evento no feed de atividade recente. O item deve aparecer no topo da lista sem reload, reusando o `useGetRecentActivity` já existente.

## Escopo

- `addActivityEvent({ type, label })` no service existente (gerar `id` e `occurredAt` no service)
- `useAddActivityEvent()` com `invalidateQueries` em `queryKeys.activityEvents.recent()`
- Botão “Registrar atividade” no slot do feed (form completo não é necessário na V1)
- Dummy da lista persistindo em memória (`get` / `set`)

## Fora de escopo

- Recriar type, queryKey ou `useGetRecentActivity`
- Formulário livre de tipo/label (V1 pode fixar `lesson_completed` + um label)
- DELETE / limpar feed (extra, não bloqueia)

## Critérios de aceite

- [ ] O clique adiciona um evento no topo do feed sem F5
- [ ] `occurredAt` é o momento do clique
- [ ] Botão reflete `isPending`; erro da mutation é visível
- [ ] Invalidação usa a mesma key do GET
- [ ] `tsc` + `lint` passam

Como executar: [Guia de execução — M11](docs/wiki/guia-execucao-mutations-m2-m11-m8.md)  
Referência: [PR #76](https://github.com/devfellowship/dfl-iterate/pull/76)
