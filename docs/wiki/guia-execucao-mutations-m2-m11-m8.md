# Guia de execução — Mutations (WRITE)

> **Para quem é:** fellow com a task **M1, M2, M3, M5, M8, M10 ou M11** na plataforma.
>
> A task na plataforma diz **o quê** e **quando está pronto**. Este guia diz **como** executar, sem ficar perdido.
>
> **Leia nesta ordem:**
> 1. Este guia (receita comum + ficha da sua task)
> 2. [PR #76](https://github.com/devfellowship/dfl-iterate/pull/76) — código ouro (T7 simples, T4 avançado)
> 3. [Mutations — guia prático](./react-query-mutations-guia-pratico.md) — se quiser o *porquê* (CREATE / UPDATE / DELETE)

A [aula com trechos de código](./aula-mutation-t2-t8-t11.md) é material de reunião. Use este guia no dia a dia da task.

---

## O que você está fazendo

Nas tasks anteriores de **useQuery** você ligou o **READ**: `useQuery` → service GET → dummy → tela.

Nestas tasks de **mutation** você liga o **WRITE**: alguém clica → `useMutation` → service WRITE → dummy muda → você **invalida** a query do GET → a tela atualiza sozinha.

```txt
já existe na main:
  type → dummy → service GET → queryKey → useGet* → slot

você adiciona:
  dummy mutável → service WRITE → useMutation → invalidateQueries → botão
```

A mutation **não substitui** o `useGet*`. Ela escreve e pede para o GET buscar de novo.

---

## Antes de abrir o editor

1. `git fetch && git pull origin main`
2. Confirme que o `useQuery` / READ da task anterior **já está na main** e funciona na tela (loading → dado → erro + retry).
3. Branch **só da mutation** (não misture com o READ): `<seu-nome>/feat/M{N}-<descricao-curta>`
   - Ex.: `ana/feat/M2-update-preferences`
4. Abra o hook `useGet*` da task anterior e anote a **queryKey** — você vai invalidar **essa**, não criar outra.

### Keys oficiais deste batch

```ts
queryKeys.userProfile.current              // ['user-profile']
queryKeys.userPreferences.current          // ['user-preferences', 'current']
queryKeys.announcements.all                // ['announcements']
queryKeys.lessonProgress.byLesson(id)      // ['lessonProgress', id]
queryKeys.leaderboard.list()               // ['leaderboard', 'list']
queryKeys.notifications.all                // ['notifications']
queryKeys.activityEvents.recent()          // ['activityEvents', 'recent']
```

Se o GET mergeado usar uma tupla diferente da tabela acima, **siga o GET** (é a fonte da verdade).

---

## Receita comum (vale para todas)

Faça nesta ordem. A ficha da sua task só muda o *quê* escrever, não o *como* encaixar.

### 1. Dummy mutável

Hoje o dummy da task anterior (useQuery) é um `const` exportado. Enquanto for `const`, a mutation “grava” e some no próximo GET (o GET relê o mesmo objeto inicial).

Passe para um store em memória:

- `getXxxData()` — devolve **cópia**
- `setXxxData(next)` — grava **cópia**
- `resetXxxData()` — volta ao estado inicial (útil para raciocinar / testes)

Depois, o GET do service passa a usar o **getter**, não o `const` direto.

Por que cópia? Se você devolver o mesmo array/objeto, o React Query e o seu código podem mutar a memória sem querer e a UI fica “estranha”.

### 2. Função WRITE no service

No **mesmo** arquivo de service do GET:

- `async`
- `await` do delay (igual o GET)
- `throw new Error(...)` em dado inválido / não encontrado
- sem React, sem JSX, sem hooks
- regra de negócio **aqui** (gerar id, somar XP, recalcular rank, remover por id…)

### 3. Hook `useMutation`

Um arquivo novo, um hook por ação: `useUpdate*`, `useAdd*`, `useDismiss*`, `useAdvance*`, `useMark*`, `useClaim*`.

Esqueleto:

```ts
export function useUpdateSomething() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: writeFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.recurso.chaveDoGet,
      });
    },
  });
}
```

Regras:

- Invalide a **mesma** key do `useGet*`
- **Não** use `setQueryData` neste batch
- Hook não trata UI (sem toast, sem `alert`, sem JSX)

### 4. Slot / container

O slot que já tem o GET ganha o WRITE:

- `mutate(...)` no clique
- `isPending` no botão (`disabled` + texto “Salvando…” / “Registrando…” / “…”)
- `isError` da mutation visível + `reset()` antes de tentar de novo
- loading/erro/retry do **GET** continuam existindo

### 5. Componente visual

Fino: recebe dados + callbacks (`onToggleTheme`, `onDismiss`, `onMarkAsRead`, `onClaimXp`…).

**Não** coloque `useMutation` / `useQuery` em `src/components/data-layer/*` (exceto se o arquivo já for o slot/container). O painel, o feed, a lista e a tabela só desenham.

### O que você NÃO faz

- Recriar type, queryKey ou `useGet*`
- Importar dummy no slot ou na page
- Editar `src/components/ui/`
- Esperar persistência após F5 — dummy em memória **volta ao inicial**. Isso é esperado.

### Validação

- [ ] `npx tsc --noEmit`
- [ ] `npm run lint`
- [ ] Clique atualiza a UI **sem** reload
- [ ] F5 volta ao dummy inicial

---

## Mapa das tasks

| Task atual | Task anterior (useQuery) | Tipo | O que muda na tela | Points |
|---|---|---|---|---|
| **M1** | Perfil | UPDATE (objeto completo) | Card do header atualiza nome/dados | 100 |
| **M2** | Preferências | UPDATE (objeto completo) | Drawer ⚙️: tema e sons mudam no clique | 100 |
| **M3** | Avisos | DISMISS por `id` | Um aviso some da lista | 100 |
| **M5** | Progresso por lição | UPDATE (+1) | Barra do card sobe (“X de Y” e %) | 150 |
| **M8** | Ranking | UPDATE + recálculo | “+XP” no “você”; posição pode subir | 200 |
| **M10** | Notificações | UPDATE (1 lida) | Item fica lido; badge de unread cai | 100 |
| **M11** | Feed de atividade | CREATE | Item novo no topo do feed | 150 |

> **M4** (claim XP / stats) — fora deste lote.

Ordem sugerida se for fazer mais de uma: **M2 → M1 → M10 → M3 → M11 → M5 → M8**.

---

## Ficha M1 — Atualizar perfil (UPDATE)

### Pré-requisito

O READ do perfil (**T1**) precisa estar **mergeado na `main`**. Depois disso, abra uma branch **só** para a M1.

| Camada | Onde |
|---|---|
| Type | `UserProfile` (`id`, `name`, `email`, `age`, `avatarUrl`) — em `src/types` (ou arquivo dedicado, conforme o READ) |
| Dummy | `src/test-utils/user-profile.dummy.ts` (ainda `const` → tornar mutável) |
| GET | `getUserProfile()` no service de perfil |
| Hook READ | `useGetUserProfile()` |
| Query key | `queryKeys.userProfile.current` → `['user-profile']` |
| Slot | `HomePageHeaderDataSlots.tsx` (slot T1) |
| Visual | `UserProfileCard` |

### O que entregar

Permitir **salvar o perfil** com o objeto **completo**. A UI do header reflete o valor novo sem F5.

Fluxo:

```txt
clique "Atualizar perfil" (ou similar)
  → slot monta { ...profile, name: 'Ana Fellow (editado)' }
  → mutate(nextProfile)
  → updateUserProfile grava o objeto completo no dummy
  → invalidateQueries(userProfile.current)
  → useGetUserProfile refetch
  → card do header mostra o valor novo
```

### Contrato WRITE

| Campo | Valor |
|---|---|
| Service | `updateUserProfile(next: UserProfile): Promise<UserProfile>` |
| Hook | `useUpdateUserProfile()` |
| Key a invalidar | `queryKeys.userProfile.current` |
| UI | botão no slot T1 (V1 pode fixar o novo `name` no clique) |

**Sem `Partial`.** Igual à M2: o slot já tem o objeto do GET. Ele faz o spread e manda o objeto **inteiro**:

```ts
updateProfile({
  ...profile,
  name: 'Ana Fellow (editado)',
});
```

Por que assim? Fica legível: “pego o que já li, mudo um campo, mando o resultado”. O service só valida e grava.

No service: delay → se faltar `id`, throw → `set` → return do getter.

### UI

- CTA no slot (ou props no `UserProfileCard`: `onUpdateProfile?`, `isUpdating?`)
- Botão `disabled={isUpdating}`
- O card **não** chama o service — só dispara callback / o slot chama `mutate`

Formulário completo de settings **não** é obrigatório na V1.

### Arquivos

| Ação | Arquivo |
|---|---|
| Editar | `user-profile.dummy.ts` → get/set/reset |
| Editar | service de perfil → GET usa getter + `updateUserProfile` |
| Criar | `src/hooks/useUpdateUserProfile.ts` |
| Editar | `hooks/index.ts` (+ barrel de services se faltar) |
| Editar | `HomePageHeaderDataSlots.tsx` (e props no card se precisar) |

### Travou?

| Sintoma | Causa típica |
|---|---|
| Clicou e nada mudou | Dummy ainda `const` ou GET não usa o getter |
| Mudou uma vez e grudou | Esqueceu `invalidateQueries` ou usou key diferente da do GET |
| TS reclama da key | Copie a key **exata** de `useGetUserProfile` (`['user-profile']`) |
| Misturou com o READ na mesma branch | Abra branch nova **depois** do merge do T1 |

---

## Ficha M2 — Atualizar preferências (UPDATE)

### Pré-requisito (já na main)

| Camada | Onde |
|---|---|
| Type | `src/types/UserPreferences.ts` |
| Dummy | `src/test-utils/user-preferences.dummy.ts` (ainda `const`) |
| GET | `getUserPreferences()` em `user-preferences.service.ts` |
| Hook READ | `useGetUserPreferences()` |
| Query key | `queryKeys.userPreferences.current` → `['user-preferences', 'current']` |
| Slot | drawer ⚙️ em `HomePageHeaderDataSlots.tsx` |
| Visual | `AppearanceSettingsPanel` |

### O que entregar

Permitir alterar **tema** e **sons** no drawer. A UI reflete o valor novo sem F5.

Fluxo:

```txt
clique "Alternar tema"
  → slot monta { ...preferences, theme: 'light' | 'dark' }
  → mutate(nextPreferences)
  → updateUserPreferences grava o objeto completo no dummy
  → invalidateQueries(userPreferences.current)
  → useGetUserPreferences refetch
  → painel mostra o valor novo
```

### Contrato WRITE

| Campo | Valor |
|---|---|
| Service | `updateUserPreferences(nextPreferences: UserPreferences): Promise<UserPreferences>` |
| Hook | `useUpdateUserPreferences()` |
| Key a invalidar | `queryKeys.userPreferences.current` |
| UI | botões “Alternar tema” e “Ligar/Desligar sons” |

**Sem `Partial`.** O slot já tem o objeto do GET. Ele faz o spread e manda o objeto **inteiro**:

```ts
updatePreferences({
  ...preferences,
  theme: preferences.theme === 'dark' ? 'light' : 'dark',
});

updatePreferences({
  ...preferences,
  soundEffectsEnabled: !preferences.soundEffectsEnabled,
});
```

Por que assim? Na aula fica legível: “pego o que já li, mudo um campo, mando o resultado”. O service só valida e grava.

No service: delay → se faltar `userId`, throw → `set` → return do getter.

### UI

No `AppearanceSettingsPanel`:

- Tire o texto “Edição de preferências disponível em breve.”
- Props opcionais: `onToggleTheme?`, `onToggleSound?`, `isUpdating?`
- Botões `disabled={isUpdating}`

O painel **não** chama o service. Só dispara callback.

Aplicar o tema no CSS do app **não** é obrigatório. Basta o valor no painel mudar.

### Arquivos

| Ação | Arquivo |
|---|---|
| Editar | `user-preferences.dummy.ts` → get/set/reset |
| Editar | `user-preferences.service.ts` → GET usa getter + `updateUserPreferences` |
| Criar | `src/hooks/useUpdateUserPreferences.ts` |
| Editar | `hooks/index.ts` (+ barrel de services se faltar) |
| Editar | `AppearanceSettingsPanel.tsx` |
| Editar | `HomePageHeaderDataSlots.tsx` |

### Travou?

| Sintoma | Causa típica |
|---|---|
| Clicou e nada mudou | Dummy ainda `const` ou GET não usa o getter |
| Mudou uma vez e grudou | Esqueceu `invalidateQueries` ou usou key diferente da do GET |
| TS reclama da key | Copie a key **exata** de `useGetUserPreferences` |
| Recriou `useGet*` | Não precisa. Só acrescente o WRITE |

---

## Ficha M3 — Dispensar aviso (por id)

### Pré-requisito

O READ de avisos (**T3**) precisa estar **mergeado na `main`**. Depois disso, abra uma branch **só** para a M3.

| Camada | Onde |
|---|---|
| Type | `Announcement` |
| Dummy | dummy de avisos (ainda `const` array → tornar mutável) |
| GET | `getAnnouncements()` (filtros/ordenação do READ continuam) |
| Hook READ | `useGetAnnouncements()` |
| Query key | `queryKeys.announcements.all` → `['announcements']` |
| Slot | `HomePageTopDataSlots` / seção de avisos (T3) |
| Visual | `AnnouncementList` |

### O que entregar

Botão **“Dispensar”** (ou “Fechar”) em **cada** aviso. Some **só** o item com aquele `id`.

Fluxo:

```txt
clique "Dispensar" no aviso ann-1
  → mutate('ann-1')
  → dismissAnnouncement remove esse id do dummy (ou throw se não achar)
  → invalidateQueries(announcements.all)
  → useGetAnnouncements refetch
  → lista aparece sem o ann-1
```

### Contrato WRITE

| Campo | Valor |
|---|---|
| Service | `dismissAnnouncement(id: string): Promise<void>` (ou retorna a lista restante) |
| Hook | `useDismissAnnouncement()` |
| Key a invalidar | `queryKeys.announcements.all` |
| UI | CTA por item |

Comportamento do service:

1. Delay  
2. Ler a lista do dummy  
3. Se **não** existir item com esse `id` → `throw new Error(...)`  
4. Gravar lista filtrada: `current.filter((a) => a.id !== id)`  
5. Return  

### UI

No `AnnouncementList` (ou no slot, se preferir):

- Props opcionais: `onDismiss?(id: string)`, `isDismissingId?: string`
- Botão desabilitado enquanto `isDismissingId === item.id`

A lista **não** chama o service. Só dispara callback.

**Não** é “limpar todos” nesta task — só dismiss por `id`.

### Arquivos

| Ação | Arquivo |
|---|---|
| Editar | dummy de announcements → get/set/reset |
| Editar | `announcements.service.ts` → GET usa getter + `dismissAnnouncement` |
| Criar | `src/hooks/useDismissAnnouncement.ts` |
| Editar | `hooks/index.ts` (+ barrel de services se faltar) |
| Editar | `AnnouncementList.tsx` e/ou slot T3 |

### Travou?

| Sintoma | Causa típica |
|---|---|
| Clicou e o aviso continua | Dummy ainda `const` ou não filtrou no `set` |
| Sumiram todos | Filtrou errado / gravou `[]` |
| Erro não aparece quando id some | Esqueceu o `throw` no service |
| Key errada | Invalide `queryKeys.announcements.all` |

---

## Ficha M5 — +1 atividade no progresso

### Pré-requisito (já na main)

| Camada | Onde |
|---|---|
| Type | `src/types/LessonProgress.ts` |
| Dummy | `src/test-utils/lesson-progress.dummy.ts` (ainda `const`) |
| GET | `getLessonProgress(lessonId)` em `lessons.service.ts` |
| Hook READ | `useLessonProgressBarById(lessonId)` |
| Query key | `queryKeys.lessonProgress.byLesson(lessonId)` → `['lessonProgress', lessonId]` |
| Slot | `LessonCard` em `HomePage.tsx` (`data-slot="T5"`) |
| Visual | `LessonProgressBar` |

### O que é “+1 atividade”?

É **avançar a barra de progresso** daquele card:

- `completedActivities` sobe 1  
- `percent` é recalculado no service  

Ex.: de `5 de 17` → `6 de 17` e a barra engorda.  
**Não** é criar uma activity nova no catálogo da lição.

Fluxo:

```txt
clique "+1 atividade" no card lesson-1
  → mutate('lesson-1')
  → advanceLessonProgress soma 1, recalcula percent, grava no dummy
  → invalidateQueries(lessonProgress.byLesson('lesson-1'))
  → useLessonProgressBarById refetch
  → barra atualiza
```

### Contrato WRITE

| Campo | Valor |
|---|---|
| Service | `advanceLessonProgress(lessonId: string): Promise<LessonProgress>` |
| Hook | `useAdvanceLessonProgress()` |
| Key a invalidar | `queryKeys.lessonProgress.byLesson(lessonId)` |
| UI | botão “+1 atividade” no card, junto da barra |

Comportamento do service (deixe legível):

1. Delay  
2. Achar o progresso pelo `lessonId` — senão throw  
3. Se `completedActivities >= totalActivities` → throw (já completo)  
4. Montar objeto **novo** (não mutar o dummy in-place):

```ts
const completedActivities = lesson.completedActivities + 1;
const percent = Math.round(
  (completedActivities / lesson.totalActivities) * 100,
);

const next = {
  ...lesson,
  completedActivities,
  percent,
};
```

5. `set` no dummy + return de `next`

**Importante:** o GET também não deve mutar o dummy in-place ao calcular `percent`. Sempre retorne cópia.

### Hook

```ts
return useMutation({
  mutationFn: (lessonId: string) => advanceLessonProgress(lessonId),
  onSuccess: (_data, lessonId) => {
    void queryClient.invalidateQueries({
      queryKey: queryKeys.lessonProgress.byLesson(lessonId),
    });
  },
});
```

No `LessonCard`:

```ts
advanceProgress(lesson.id);
```

### Arquivos

| Ação | Arquivo |
|---|---|
| Editar | `lesson-progress.dummy.ts` → get/set/reset |
| Editar | `lessons.service.ts` → GET imutável + `advanceLessonProgress` |
| Criar | `src/hooks/useAdvanceLessonProgress.ts` |
| Editar | `hooks/index.ts` |
| Editar | `HomePage.tsx` (`LessonCard`) |

### Travou?

| Sintoma | Causa típica |
|---|---|
| Barra não sobe | Dummy ainda `const` / GET mutava e “grudava” / key sem o `lessonId` certo |
| Passou do total | Faltou o guard `>= totalActivities` |
| Outro card atualizou | Invalidou key genérica demais — use `byLesson(lessonId)` |

---

## Ficha M8 — +XP no ranking (UPDATE + recálculo)

### Pré-requisito (já na main)

| Camada | Onde |
|---|---|
| Type | `src/types/LeaderboardEntry.ts` |
| Dummy | `src/test-utils/leaderboard.dummy.ts` (ainda `const`) |
| GET | `getLeaderboard()` — sem `limit` obrigatório; siga o que já existe |
| Hook READ | `useGetLeaderboard()` (arquivo pode ser `useGetLeaderBoardTable.ts`) |
| Query key | `queryKeys.leaderboard.list()` → `['leaderboard', 'list']` |
| Visual | `LeaderboardTable` |

### Atenção: pode haver duas tabelas

Na `main` às vezes existe preview estático **e** tabela viva com `useGetLeaderboard`.

Nesta task:

1. Ache a renderização que **já usa** o hook (a viva)
2. Coloque o botão **aí**
3. Não use `previewLeaderboard` no WRITE
4. Se o preview estático sobrar, remova ou alinhe no review — o alvo é **uma** tabela viva  

(Ver também [`pr-de-hygiene.md`](./pr-de-hygiene.md).)

### O que entregar

Botão **“+XP no ranking”** soma `25` XP no usuário atual (`isCurrentUser`). O service reordena por XP e redefine `rank` (1, 2, 3…). A tabela atualiza sozinha.

```txt
clique "+XP"
  → mutate(25)
  → achar isCurrentUser → somar XP → ordenar → recalcular rank → set dummy
  → invalidateQueries(leaderboard.list())
  → useGetLeaderboard refetch
  → XP e (às vezes) posição mudam
```

**Não** edite `rank` no clique. Rank é consequência do XP.

Isso espelha o T4 da [PR #76](https://github.com/devfellowship/dfl-iterate/pull/76) (XP + estado derivado no service).

### Contrato WRITE

| Campo | Valor |
|---|---|
| Service | `claimLeaderboardPracticeXp(amount?: number): Promise<LeaderboardEntry[]>` |
| Default | `25` |
| Hook | `useClaimLeaderboardXp()` |
| Key a invalidar | `queryKeys.leaderboard.list()` |

Helper **legível** no service (não comprima em uma linha):

```ts
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
```

`claimLeaderboardPracticeXp`:

1. Delay  
2. `amount <= 0` → throw  
3. Ler dummy  
4. Sem `isCurrentUser` → throw  
5. Mapear: no usuário atual, `totalXp + amount`  
6. `recalculateRanks`  
7. `set` + return da lista  

Não precisa invalidar `userStats` nesta task. Foque no ranking.

### Arquivos

| Ação | Arquivo |
|---|---|
| Editar | `leaderboard.dummy.ts` → get/set/reset |
| Editar | `leaderboard.service.ts` → helper + `claimLeaderboardPracticeXp` |
| Criar | `src/hooks/useClaimLeaderboardXp.ts` |
| Editar | barrels (`hooks/index.ts`, `services/index.ts` se o GET ainda não estiver exportado) |
| Editar | container da tabela **viva** |

### Travou?

| Sintoma | Causa típica |
|---|---|
| XP muda, posição não | Esqueceu ordenar / recalcular rank no service |
| Duas tabelas, uma não atualiza | Você ligou o botão no preview, não no GET vivo |
| GET não tem `limit` | Normal na main. Não invente `limit` nesta task |

---

## Ficha M10 — Marcar notificação como lida

### Pré-requisito (já na main)

| Camada | Onde |
|---|---|
| Type | `Notification` / `NotificationsSummary` |
| Dummy | `src/test-utils/notifications.dummy.ts` (ainda `const`) |
| GET | `getNotifications()` — deriva `unreadCount` a partir de `items` |
| Hook READ | `useGetNotifications()` |
| Query key | `queryKeys.notifications.all` → `['notifications']` |
| Slot | drawer 🔔 em `HomePageHeaderDataSlots.tsx` |
| Visual | `NotificationList` / `NotificationBellIcon` |

### O que entregar

Marcar **uma** notificação como lida por `id`. O item muda de estilo e o badge de não lidas cai, sem F5.

Fluxo:

```txt
clique "Marcar como lida" no item n-2
  → mutate('n-2')
  → markNotificationAsRead seta read: true nesse item
  → invalidateQueries(notifications.all)
  → useGetNotifications refetch
  → item fica lido; unreadCount recalcula no GET
```

### Contrato WRITE

| Campo | Valor |
|---|---|
| Service | `markNotificationAsRead(id: string): Promise<NotificationsSummary>` (ou `void`) |
| Hook | `useMarkNotificationAsRead()` |
| Key a invalidar | `queryKeys.notifications.all` |
| UI | CTA **por item** (só faz sentido em não lidas) |

Comportamento do service:

1. Delay  
2. Ler dummy  
3. Se não achar o `id` → throw  
4. Mapear cópia da lista: aquele item com `read: true`  
5. `set` + return (o GET seguinte recalcula `unreadCount`)

```ts
onSuccess: () => {
  void queryClient.invalidateQueries({
    queryKey: queryKeys.notifications.all,
  });
},
```

### UI

No `NotificationList`:

- Props: `onMarkAsRead?(id: string)`, `isMarkingId?: string`
- Botão ou ação só quando `!item.read`
- `disabled` enquanto `isMarkingId === item.id`

A lista **não** chama o service.

**Não** implementar “marcar todas como lidas” na V1.

### Arquivos

| Ação | Arquivo |
|---|---|
| Editar | `notifications.dummy.ts` → get/set/reset |
| Editar | `notifications.service.ts` → GET usa getter + `markNotificationAsRead` |
| Criar | `src/hooks/useMarkNotificationAsRead.ts` |
| Editar | `hooks/index.ts` (+ barrel de services se faltar) |
| Editar | `NotificationBell.tsx` / `NotificationList` + slot do drawer |

### Travou?

| Sintoma | Causa típica |
|---|---|
| Item marca, badge não cai | GET não recalcula `unreadCount` a partir dos items / dummy sem `set` |
| Todas ficaram lidas | Map/filter errado no service |
| Key errada | Use `queryKeys.notifications.all` |

---

## Ficha M11 — Registrar atividade (CREATE)

### Pré-requisito (já na main)

| Camada | Onde |
|---|---|
| Type | `src/types/ActivityEvent.ts` (`id`, `type`, `label`, `occurredAt`) |
| Dummy | `src/test-utils/activity-events.dummy.ts` (ainda `const` array) |
| GET | `getRecentActivity()` — já ordena por `occurredAt` desc |
| Hook READ | `useGetRecentActivity()` |
| Query key | `queryKeys.activityEvents.recent()` → `['activityEvents', 'recent']` |
| Slot | `HomePageTopDataSlots` (`data-slot="T11"`) |
| Visual | `RecentActivityFeed` |

### O que entregar

Botão **“Registrar atividade”** cria um evento e ele aparece **no topo** do feed.

Fluxo:

```txt
clique
  → mutate({ type, label })
  → service gera id + occurredAt, prepend no dummy
  → invalidateQueries(activityEvents.recent())
  → useGetRecentActivity refetch
  → item novo no topo
```

### Contrato WRITE

| Campo | Valor |
|---|---|
| Service | `addActivityEvent({ type, label }): Promise<ActivityEvent>` |
| Hook | `useAddActivityEvent()` |
| Key a invalidar | `queryKeys.activityEvents.recent()` |
| UI | botão acima do feed (pode ficar **no slot**) |

Comportamento do service:

1. Delay  
2. Label vazio → throw  
3. Montar evento:

```ts
{
  id: `evt-${Date.now()}`,
  type: input.type,
  label: input.label.trim(),
  occurredAt: new Date().toISOString(),
}
```

4. Gravar `[created, ...current]`  
5. Retornar o **evento criado**

Na V1 **não** precisa de `<form>`. No `onClick`, fixe:

```ts
addEvent({
  type: 'lesson_completed',
  label: 'Você registrou uma nova prática na aula',
});
```

O feed pode continuar só recebendo `events`. O botão no slot é suficiente.

### Dummy de lista

Sempre copie o array (`map` / spread). Não dê `push` no array original dentro do slot — write só no service.

### Extra (não bloqueia a task)

`clearRecentActivity()` + “Limpar feed”, ou remover por `id`. Só se sobrar tempo.

### Arquivos

| Ação | Arquivo |
|---|---|
| Editar | `activity-events.dummy.ts` → get/set/reset |
| Editar | `activity-events.service.ts` → `addActivityEvent` |
| Criar | `src/hooks/useAddActivityEvent.ts` |
| Editar | `hooks/index.ts` |
| Editar | `HomePageDataSlots.tsx` (slot T11) |

### Travou?

| Sintoma | Causa típica |
|---|---|
| Item não aparece | Sem `set*` ou invalidou a key errada |
| Item aparece no fim | GET ordena por data — confira se `occurredAt` é `new Date().toISOString()` |
| Mutou o array no JSX | A regra de prepend vive no service |

---

## Rubrica (o que o review vai olhar)

| Critério | M1 | M2 | M3 | M5 | M8 | M10 | M11 |
|---|---|---|---|---|---|---|---|
| Dummy `get` / `set` | sim | sim | sim | sim | sim | sim | sim |
| Service WRITE async + throw | sim | sim | sim | sim | sim | sim | sim |
| `useMutation` + invalidate na key do GET | sim | sim | sim | sim | sim | sim | sim |
| Botão com `isPending` | sim | sim | sim | sim | sim | sim | sim |
| Sem React Query no visual fino | sim | sim | sim | sim | sim | sim | sim |
| Branch só da mutation (após READ na main) | sim | sim | sim | sim | sim | sim | sim |
| `tsc` + `lint` | sim | sim | sim | sim | sim | sim | sim |

Regra de negócio no service (não no JSX):

| Task | O que vive no service |
|---|---|
| M1 / M2 | Validar + gravar objeto completo |
| M3 | Remover por `id` |
| M5 | +1 `completedActivities` + `percent` |
| M8 | XP + sort + ranks |
| M10 | `read: true` no item |
| M11 | Gerar `id` / `occurredAt` + prepend |

---

## Git / PR

| Campo | Padrão |
|---|---|
| Branch | `<seu-nome>/feat/M{N}-<descricao>` |
| Commit | `feat(M2): add updateUserPreferences mutation` |
| PR título | `feat(M2): mutation to update appearance preferences` |
| PR body | Summary + Issue (UUID) + What was done |

Detalhes: [`padrao-git-branches-commits-pr.md`](./padrao-git-branches-commits-pr.md)

---

## FAQ geral

**Preciso criar outra queryKey?**  
Não. Invalide a do GET.

**Reload volta o dado antigo?**  
Sim. Dummy em memória. Esperado neste batch.

**Posso usar `setQueryData` para ficar mais rápido?**  
Não neste batch. O objetivo é entender invalidate → refetch.

**Onde coloco o botão?**  
No slot/container que já tem o `useGet*`. O componente visual só desenha (ou recebe callback).

**M1 / M3: o useQuery ainda não está na main?**  
Espere o merge do READ. Depois: `git pull origin main` e abra branch **nova** só da mutation.

**M5 é criar activity no lesson?**  
Não. Só incrementa o progresso da barra daquele card.

**Os READs de preferências, feed, ranking, notificações e progresso?**  
Já estavam na main no momento deste guia — confirme com `git pull`.

**Travei no código.**

1. Esta ficha  
2. [PR #76](https://github.com/devfellowship/dfl-iterate/pull/76) (commits separados T7 / T4)  
3. [Guia prático de mutations](./react-query-mutations-guia-pratico.md)  
4. Peça ajuda com: dummy / service / hook / slot / saída do `tsc`
