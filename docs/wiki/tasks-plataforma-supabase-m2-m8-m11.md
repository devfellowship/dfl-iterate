# Tasks para a plataforma — Supabase (S-M2 / S-M8 / S-M11)

> **Uso:** copie **task name**, **points** e **description** para a plataforma.
>
> **Wikis (não cole na task):**
> - [Wiki 1 — Plataforma Supabase](./supabase-01-plataforma.md)
> - [Wiki 2 — Integração no iterate](./supabase-02-integracao-iterate.md)
>
> **SQL do mentor:**
> - [m2-m8-m11](./supabase-sql-setup-m2-m8-m11.sql) (1ª turma)
> - [m1-m3-m5-m10](./supabase-sql-setup-m1-m3-m5-m10.sql) (2ª turma)

---

## Texto do épico (colar uma vez)

```markdown
### Contexto

Vocês já fizeram READ (`useQuery`) e WRITE (`useMutation`) com **dummy**.
Agora a fonte de verdade passa a ser o **Supabase** (Postgres), no mesmo projeto sandbox da turma.

O client já está no repo (`src/lib/supabase.ts`). Vocês só trocam o miolo do **service**.

### Antes de começar

1. `git pull` na `main`
2. Preencha o `.env` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (mentor passa no canal)
3. Reinicie `npm run dev`
4. Leia as wikis 1 e 2 de Supabase
5. Confira no Table Editor se a tabela da sua task tem seed

### Regras

- Type, queryKey, hooks e UI **já existem** — não recriar
- Só alterar o service (dummy → `supabase.from(...)`)
- Mapper snake_case → camelCase no service
- `throw new Error(...)` se `error` do Supabase
- Branch só desta task: `<seu-nome>/feat/S-M{N}-supabase-...`
- `npx tsc --noEmit` + `npm run lint`
```

---

## Resumo

| Task | Mutation antiga | Tabela | Operações | Points | Dificuldade |
|---|---|---|---|---|---|
| **S-M2** | M2 preferências | `user_preferences` | GET + UPDATE | 100 | ★★☆ |
| **S-M11** | M11 feed | `activity_events` | GET + INSERT | 100 | ★★☆ |
| **S-M8** | M8 ranking | `leaderboard_entries` | GET + UPDATE + ranks | 150 | ★★★ |
| **S-M1** | M1 perfil | `profiles` | GET + UPDATE | 100 | ★★☆ |
| **S-M10** | M10 notificações | `notifications` | GET + UPDATE 1 linha | 100 | ★★☆ |
| **S-M3** | M3 avisos | `announcements` | GET + DELETE | 100 | ★★☆ |
| **S-M5** | M5 progresso | `lesson_progress` | GET + UPDATE +1 | 150 | ★★★ |

> Sugestão de aula: **todo mundo faz S-M2**; depois escolhe S-M11 ou S-M8.

---

## S-M2 — Preferências no Supabase

**task name:** `[Iterate] S-M2 — Supabase: user preferences (GET + UPDATE)`

**points:** `100`

**description:**

## Objetivo

Trocar o dummy de preferências pelo Supabase. Alternar tema/som no drawer ⚙️ deve persistir na tabela `user_preferences` e sobreviver a F5.

## Pré-requisito

- M2 (mutation) já entregue / na main
- `.env` com as chaves da turma
- Client `src/lib/supabase.ts` na main

## Escopo

- Em `user-preferences.service.ts`:
  - `getUserPreferences` → `.from('user_preferences').select(...).eq('user_id', ...).single()`
  - `updateUserPreferences` → `.update(...).eq('user_id', ...).select().single()`
- Mapear `user_id` / `sound_effects_enabled` ↔ `userId` / `soundEffectsEnabled`
- Remover uso do dummy neste service

## Fora de escopo

- Alterar hooks, queryKeys ou UI
- Auth / RLS
- Criar tabelas (mentor já criou)

## Critérios de aceite

- [ ] Drawer carrega preferências do Supabase
- [ ] Salvar altera a linha no Table Editor
- [ ] F5 mantém o valor
- [ ] `invalidateQueries` do hook existente continua funcionando
- [ ] `tsc` + `lint` passam

Como executar: [Wiki 2 — Integração](docs/wiki/supabase-02-integracao-iterate.md)

---

## S-M11 — Activity events no Supabase

**task name:** `[Iterate] S-M11 — Supabase: activity events (GET + INSERT)`

**points:** `100`

**description:**

## Objetivo

Trocar o dummy do feed de atividade pelo Supabase. Listar eventos da tabela `activity_events` e inserir novos pela UI do M11.

## Pré-requisito

- M11 (mutation) já entregue / na main
- `.env` preenchido

## Escopo

- Em `activity-events.service.ts`:
  - `getRecentActivity` → `.select(...).order('occurred_at', { ascending: false })`
  - `addActivityEvent` → `.insert({ id, type, label, occurred_at }).select().single()`
- Gerar `id` com `crypto.randomUUID()` (como no dummy)
- Manter validação de `label` trim + throw se vazio
- Mapear `occurred_at` ↔ `occurredAt`

## Fora de escopo

- Mudar hooks/UI
- Delete/update de eventos

## Critérios de aceite

- [ ] Feed carrega do Supabase
- [ ] Registrar evento cria linha no Table Editor
- [ ] Lista atualiza sem F5 (invalidate existente)
- [ ] `tsc` + `lint` passam

Como executar: [Wiki 2 — Integração](docs/wiki/supabase-02-integracao-iterate.md)

---

## S-M8 — Leaderboard no Supabase (desafio)

**task name:** `[Iterate] S-M8 — Supabase: leaderboard (GET + claim XP)`

**points:** `150`

**description:**

## Objetivo

Trocar o dummy do ranking pelo Supabase. Claim de XP atualiza `total_xp` do current user, recalcula `rank` (mesma lógica JS de hoje) e persiste.

## Pré-requisito

- M8 (mutation) já entregue / na main
- `.env` preenchido
- Ideal ter feito S-M2 antes

## Escopo

- Em `leaderboard.service.ts`:
  - `getLeaderboard` → select em `leaderboard_entries`
  - `claimLeaderBoardPractice` → ler → somar XP → `recalculateRanks` → persistir updates no Supabase
- Mapear snake_case ↔ `LeaderboardEntry`

## Fora de escopo

- Window functions / views SQL avançadas
- Auth
- Mudar UI/hooks

## Critérios de aceite

- [ ] Ranking carrega do Supabase
- [ ] Claim altera `total_xp` / `rank` no Table Editor
- [ ] Ordem na UI acompanha
- [ ] `tsc` + `lint` passam

Como executar: [Wiki 2 — Integração](docs/wiki/supabase-02-integracao-iterate.md)

---

## S-M1 — Perfil no Supabase

**task name:** `[Iterate] S-M1 — Supabase: profile (GET + UPDATE)`

**points:** `100`

**description:**

## Objetivo

Trocar o dummy de perfil pelo Supabase. Salvar o nome no header deve persistir na tabela `profiles` e sobreviver a F5.

## Pré-requisito

- M1 já na `main`
- `.env` da turma

## Escopo

- `getUserProfile` e `updateUserProfile` em `user-profile.service.ts` via `profiles`
- Mapear `avatar_url` ↔ `avatarUrl`
- Objeto completo no update, `.eq('id', next.id)`

## Critérios de aceite

- [ ] Card carrega do Supabase
- [ ] Salvar altera a linha `user-1` no Table Editor
- [ ] F5 mantém
- [ ] `tsc` + `lint` passam

Como executar: [Wiki 2 — seção 7b](docs/wiki/supabase-02-integracao-iterate.md)

---

## S-M10 — Notificações no Supabase

**task name:** `[Iterate] S-M10 — Supabase: mark notification as read`

**points:** `100`

**description:**

## Objetivo

Trocar o dummy de notificações pelo Supabase. Marcar uma como lida atualiza `read` na tabela `notifications` e o badge, sem F5.

## Pré-requisito

- M10 já na `main`
- `.env` da turma

## Escopo

- `getNotifications` faz select e calcula `unreadCount` no service (não é coluna)
- `markNotificationAsRead(id)` faz `.update({ read: true }).eq('id', id)`
- Id inexistente → `throw`
- Mapear `created_at` ↔ `createdAt`

## Critérios de aceite

- [ ] Lista e badge vêm do Supabase
- [ ] Marcar como lida muda `read` no Table Editor
- [ ] Badge desce sem F5
- [ ] `tsc` + `lint` passam

Como executar: [Wiki 2 — seção 7b](docs/wiki/supabase-02-integracao-iterate.md)

---

## S-M3 — Avisos no Supabase

**task name:** `[Iterate] S-M3 — Supabase: dismiss announcement`

**points:** `100`

**description:**

## Objetivo

Listar avisos ativos a partir de `announcements` e dispensar um por `id` com `delete`. O item some da UI e da tabela.

## Pré-requisito

- `.env` da turma
- Se o `dismissAnnouncement` ainda não estiver na `main`, criar a função no service e o `useMutation` que invalida `queryKeys.announcements.all`, mais o botão na lista

## Escopo

- GET filtra `expires_at` nulo ou no futuro (o `ann-4` fica na tabela e fora da UI)
- `dismissAnnouncement(id)` → `.delete().eq('id', id)`
- Não recriar a tabela

## Critérios de aceite

- [ ] Lista mostra os avisos ativos do Supabase
- [ ] Dispensar apaga a linha no Table Editor
- [ ] A lista atualiza sem F5
- [ ] `tsc` + `lint` passam

Como executar: [Wiki 2 — seção 7b](docs/wiki/supabase-02-integracao-iterate.md)

---

## S-M5 — Progresso no Supabase

**task name:** `[Iterate] S-M5 — Supabase: +1 lesson progress`

**points:** `150`

**description:**

## Objetivo

Ler o progresso de uma lição em `lesson_progress` e avançar `completed_activities` em +1, sem passar de `total_activities`. A barra atualiza sem F5.

## Pré-requisito

- `.env` da turma
- Se a mutation de +1 ainda não estiver na `main`, criar `incrementLessonProgress(lessonId)` no service e o `useMutation` que invalida `queryKeys.lessonProgress.byLesson(id)`, mais o botão na barra

## Escopo

- GET por `user_id = 'user-1'` e `lesson_id`
- `percent` calculado no service, não é coluna
- UPDATE só de `completed_activities`

## Critérios de aceite

- [ ] Barra carrega do Supabase
- [ ] +1 muda a coluna no Table Editor e a barra
- [ ] Não passa de `total_activities`
- [ ] F5 mantém
- [ ] `tsc` + `lint` passam

Como executar: [Wiki 2 — seção 7b](docs/wiki/supabase-02-integracao-iterate.md)

---

## Checklist do mentor (2ª turma)

- [ ] Rodar `docs/wiki/supabase-sql-setup-m1-m3-m5-m10.sql` no SQL Editor
- [ ] Table Editor: `profiles` (1), `notifications` (3), `announcements` (4), `lesson_progress` (3)
- [ ] Republicar wiki 1 e wiki 2 (mesmos links, conteúdo ampliado)
- [ ] Publicar S-M1, S-M10, S-M3, S-M5
- [ ] Guilherme e Pedro: só o service. Fábio e Leonardo: service + mutation se a write ainda não estiver na `main`
