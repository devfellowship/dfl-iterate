Leia o artigo [Começando a aprender Supabase](https://wiki.devfellowship.com/a/comeando-a-aprender-supabase) antes se ainda estiver confuso com dashboard, tabelas, SQL ou chaves. Esta página assume que aquele vocabulário já fez sentido.

---

## 0. Antes de tudo — atualize o projeto local

O client do Supabase (`src/lib/supabase.ts`) e a dependência `@supabase/supabase-js` entram pela `main`. Se o seu clone estiver atrasado, você vai procurar um arquivo que “não existe” e perder tempo.

Faça este ritual **sempre** que o mentor anunciar merge de infra na `main`.

### Passo a passo (PowerShell ou terminal do seu SO)

**1. Vá para a pasta do repositório**

```bash
cd caminho/para/dfl-iterate
```

**2. Confirme / troque para a branch `main`**

```bash
git checkout main
```

Se o Git reclamar de mudanças locais sem commit, resolva antes (commit na sua branch de feature, ou `git stash` se souber o que está fazendo). Não misture o setup da aula com um WIP bagunçado.

**3. Busque o que existe no remoto e atualize a `main`**

```bash
git fetch origin
git pull origin main
```

- `fetch` = “baixa as referências do remoto”  
- `pull` = “traz os commits novos para a minha `main` local”

Depois disso, sua `main` deve estar alinhada com a da organização.

**4. Instale as dependências novas**

A `main` agora inclui `@supabase/supabase-js`. Instale para o `node_modules` refletir o `package.json` / lockfile:

```bash
npm install
```

Se algo falhar no `npm install`, copie o erro e leve ao mentor — não comece a task “no escuro”.

**5. Confira se o client existe**

Você deve ver o arquivo:

```txt
src/lib/supabase.ts
```

Abra e leia por cima: ele cria um único client com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.  
**Você não precisa (e não deve) chamar `createClient` de novo dentro do service.**

**6. Configure o `.env` local**

Se ainda não tiver `.env`:

```bash
cp .env.example .env
```

No Windows PowerShell, se preferir:

```powershell
Copy-Item .env.example .env
```

Abra o `.env` e preencha com os valores que o mentor passou no canal:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

- Não commite o `.env`  
- Não use `service_role`  
- Detalhes das chaves: [Começando a aprender Supabase](https://wiki.devfellowship.com/a/comeando-a-aprender-supabase)

**7. Suba o app (ou reinicie se já estava rodando)**

O Vite lê variáveis de ambiente na subida. Se o server já estava aberto **antes** de salvar o `.env`, pare e suba de novo:

```bash
npm run dev
```

### Checklist rápido do setup

- [ ] Estou na branch `main`
- [ ] Rodei `git fetch` + `git pull`
- [ ] Rodei `npm install`
- [ ] Existe `src/lib/supabase.ts`
- [ ] `.env` preenchido com URL + anon/publishable key
- [ ] `npm run dev` foi iniciado **depois** do `.env`

Só então crie a branch da sua task (mais abaixo).

---

## 1. O mapa mental: o que muda e o que não muda

Vocês já construíram esta esteira:

```txt
UI / slot
  → hook useQuery (GET) e/ou useMutation (WRITE)
    → service async
      → dummy (memória)
```

Agora a esteira fica:

```txt
UI / slot
  → hook useQuery / useMutation   ← igual
    → service async               ← igual por fora
      → Supabase (Postgres)       ← miolo novo
```

### Não mexe (de propósito)

- Types (`UserPreferences`, `ActivityEvent`, `LeaderboardEntry`, `UserProfile`, `Notification`, `Announcement`, `LessonProgress`, …)
- `queryKeys`
- Hooks (`useGet*`, `useUpdate*`, `useAdd*`, …)
- `invalidateQueries` no `onSuccess`
- Layout do slot / textos da UI (salvo bug gritante)

### Mexe

- O **corpo** das funções no `src/services/*.service.ts`
- Remover imports do dummy **quando** não forem mais usados naquele service
- Um mapper local snake_case → camelCase

Essa disciplina não é capricho: ela prova que React Query era a camada certa. Se você precisar reescrever o hook só porque o banco mudou, o desenho estava acoplado demais.

---

## 2. O client pronto — como importar

No service:

```ts
import { supabase } from '@/lib/supabase';
```

Esse módulo já faz o `createClient(...)`. Um client por app é o padrão: conexão/config centralizada, menos chance de cada fellow criar um client diferente com env errado.

Se faltar env, o arquivo pode avisar no console. Na prática: sem `.env` correto, as chamadas ao banco falham — volte ao setup da seção 0.

---

## 3. Anatomia de uma chamada Supabase no service

Quase toda operação segue o mesmo ritual. Memorize o formato, não cada tabela:

```ts
const { data, error } = await supabase
  .from('nome_da_tabela')   // qual tabela
  .select('col1, col2')     // ou .insert / .update / .delete
  .eq('coluna', valor)      // filtro (quando fizer sentido)
  .single();                // quando você espera EXATAMENTE 1 linha

if (error) {
  throw new Error(`Mensagem clara: ${error.message}`);
}

// data ainda está em snake_case → mapear para o type do app
return mapToAppType(data);
```

### Por que `const { data, error } = ...`?

O client do Supabase **não lança exception automaticamente** na maioria dos casos de erro de API. Ele devolve `{ data, error }`. Se você ignorar `error` e usar `data` direto, pode passar `null` adiante e a UI fica “misteriosamente quebrada”.

No padrão do iterate, service continua lançando `throw new Error(...)` para o React Query transformar isso em `isError` — igual ao dummy.

### `.single()` versus lista

- Esperava **um** registro (preferências do `user-1`) → `.single()`
- Esperava **vários** (feed, ranking) → sem `.single()`, trate `data` como array (`data ?? []`)

Se você usar `.single()` e vier 0 ou N linhas, o Supabase reclama. Essa mensagem é amiga: em geral faltou `.eq(...)` ou a tabela não tem a linha que você achava.

### Mapper snake_case → camelCase

Exemplo clássico:

| Banco | TypeScript |
|---|---|
| `user_id` | `userId` |
| `sound_effects_enabled` | `soundEffectsEnabled` |
| `occurred_at` | `occurredAt` |
| `total_xp` | `totalXp` |

Faça o mapa **no service**, de forma explícita. Evite espalhar snake_case na UI.

---

## 4. Branch da task (depois do setup)

Com a `main` atualizada e o app rodando:

```bash
git checkout main
git pull origin main
git checkout -b <seu-nome>/feat/S-M2-supabase-preferences
```

Troque `S-M2-...` conforme a task (S-M11, S-M8, S-M1, S-M10, S-M3, S-M5).  
Uma branch por task — mesmo hábito das mutations.

---

## 5. S-M2 — Preferências (`user_preferences`)

**Comece por aqui.** É o caminho mais limpo: um registro, GET + UPDATE, UI que você já conhece (drawer ⚙️).

| | |
|---|---|
| Tabela | `user_preferences` |
| Arquivo | `src/services/user-preferences.service.ts` |
| Hooks (não reescrever) | `useGetUserPreferences`, `useUpdateUserPreferences` |

### 5.1 READ — `getUserPreferences`

**Antes:** lia `getUserPreferencesData()` do dummy.

**Depois (ideia — adapte ao seu estilo, mantenha a assinatura `Promise<UserPreferences>`):**

```ts
const { data, error } = await supabase
  .from('user_preferences')
  .select('user_id, theme, sound_effects_enabled, language')
  .eq('user_id', 'user-1')
  .single();

if (error) {
  throw new Error(`Failed to load preferences: ${error.message}`);
}

return {
  userId: data.user_id,
  theme: data.theme,
  soundEffectsEnabled: data.sound_effects_enabled,
  language: data.language,
};
```

O que cada peça faz:

- `.from('user_preferences')` — tabela certa  
- `.select(...)` — quais colunas (não precisa `*` às cegas)  
- `.eq('user_id', 'user-1')` — a linha da Ana Fellow / usuário demo  
- `.single()` — um objeto, não array  

Você pode remover o `simulateNetworkDelay` do dummy se quiser: a rede real já introduz latência. Não é obrigatório para o aceite.

### 5.2 UPDATE — `updateUserPreferences`

A mutation já manda o **objeto completo** (`UserPreferences`). O service grava no banco:

```ts
const { data, error } = await supabase
  .from('user_preferences')
  .update({
    theme: next.theme,
    sound_effects_enabled: next.soundEffectsEnabled,
    language: next.language,
    updated_at: new Date().toISOString(),
  })
  .eq('user_id', next.userId)
  .select('user_id, theme, sound_effects_enabled, language')
  .single();

if (error) {
  throw new Error(`Failed to update preferences: ${error.message}`);
}

return {
  userId: data.user_id,
  theme: data.theme,
  soundEffectsEnabled: data.sound_effects_enabled,
  language: data.language,
};
```

Note o mapeamento inverso no `.update`: camelCase do app → snake_case do banco.

### 5.3 Como testar de verdade (não só “a tela mudou”)

1. Abra a Home → drawer de preferências  
2. Alterne tema e/ou som  
3. Vá ao **Table Editor** → `user_preferences` → linha `user-1`  
4. Confirme que as colunas mudaram  
5. Dê F5 no app: o valor deve voltar do banco (não do dummy)

Se a UI muda e o Table Editor não, você ainda não está persistindo no Supabase (ou está olhando outro projeto/env).

---

## 6. S-M11 — Feed de atividade (`activity_events`)

Aqui o WRITE é um **INSERT** (criar linha nova). É o melhor segundo passo depois de S-M2.

| | |
|---|---|
| Tabela | `activity_events` |
| Arquivo | `src/services/activity-events.service.ts` |
| Hooks | `useGetRecentActivity`, `useAddActivityEvent` |

### 6.1 READ — `getRecentActivity`

```ts
const { data, error } = await supabase
  .from('activity_events')
  .select('id, type, label, occurred_at')
  .order('occurred_at', { ascending: false });

if (error) {
  throw new Error(`Failed to load activity: ${error.message}`);
}

return (data ?? []).map((row) => ({
  id: row.id,
  type: row.type,
  label: row.label,
  occurredAt: row.occurred_at,
}));
```

Ordene no banco (`.order`) — evita depender só do sort em memória, embora você possa manter um sort local se quiser defesa em profundidade.

### 6.2 CREATE — `addActivityEvent`

Mantenha a validação que vocês já aprenderam no M11 (`trim` + throw se vazio). Só a persistência muda:

```ts
const trimmedLabel = label.trim();
if (!trimmedLabel) {
  throw new Error('Activity label is required');
}

const id = crypto.randomUUID();
const occurredAt = new Date().toISOString();

const { data, error } = await supabase
  .from('activity_events')
  .insert({
    id,
    type,
    label: trimmedLabel,
    occurred_at: occurredAt,
  })
  .select('id, type, label, occurred_at')
  .single();

if (error) {
  throw new Error(`Failed to add activity: ${error.message}`);
}

return {
  id: data.id,
  type: data.type,
  label: data.label,
  occurredAt: data.occurred_at,
};
```

### 6.3 Como testar

1. Dispare a ação da UI que registra atividade  
2. Table Editor → nova linha em `activity_events`  
3. A lista atualiza sem F5 (invalidate do hook antigo)  
4. Bônus: peça para um colega atualizar a página — o evento dele/seu aparece no banco compartilhado  

Isso costuma ser o “aha” da aula: o dado saiu da sua máquina.

---

## 7. S-M8 — Ranking (`leaderboard_entries`) — desafio

Mais peças móveis: ler lista, achar current user, somar XP, recalcular ranks, **persistir** de volta.

| | |
|---|---|
| Tabela | `leaderboard_entries` |
| Arquivo | `src/services/leaderboard.service.ts` |
| Lógica que permanece | `recalculateRanks` (ou equivalente) em JS |

Faça S-M2 antes. S-M8 assume que você já confortável com `{ data, error }` e mapper.

### 7.1 READ — `getLeaderboard`

```ts
const { data, error } = await supabase
  .from('leaderboard_entries')
  .select('user_id, display_name, avatar_url, total_xp, rank, is_current_user')
  .order('rank', { ascending: true });

if (error) {
  throw new Error(`Failed to load leaderboard: ${error.message}`);
}

return (data ?? []).map((row) => ({
  userId: row.user_id,
  displayName: row.display_name,
  avatarUrl: row.avatar_url,
  totalXp: row.total_xp,
  rank: row.rank,
  isCurrentUser: row.is_current_user,
}));
```

### 7.2 WRITE — `claimLeaderBoardPractice`

A regra de negócio continua a do dummy:

1. Buscar as entradas (ou pelo menos achar `is_current_user`)  
2. Validar `amount`  
3. Somar XP no current user  
4. Recalcular `rank` no JavaScript  
5. Gravar no Supabase  

Persistência aceitável nesta task (escolha uma e documente no PR se quiser):

- Atualizar o current user (`total_xp`) e depois atualizar o `rank` de cada linha  
- Ou fazer um update/upsert por entry com `total_xp` + `rank`

Não é obrigatório usar SQL avançado (`RANK() OVER (...)`). O ponto da task é: **a lógica que você já tinha agora sobrevive com persistência real**.

### 7.3 Como testar + aviso de sandbox

1. Claim na UI  
2. Table Editor: `total_xp` / `rank` mudaram  
3. Ordem na tela acompanha  

⚠️ Vários fellows claimando o mesmo `user-1` ao mesmo tempo → o XP sobe “junto” ou parece imprevisível. Esperado no banco compartilhado. Foque em provar que **o seu** fluxo lê e escreve na tabela.

---

## 7b. Segunda turma — perfil, notificações, avisos, progresso

Se a sua task é S-M1, S-M10, S-M3 ou S-M5, leia a seção 3 (o ritual `{ data, error }`, `.single()`, mapper) e pule para a sua subseção. O desenho é o mesmo de S-M2, S-M11 e S-M8. O que muda é a tabela e o verbo do WRITE.

| Task | Tabela | Service | WRITE |
|---|---|---|---|
| S-M1 | `profiles` | `user-profile.service.ts` | `update` do objeto inteiro |
| S-M10 | `notifications` | `notifications.service.ts` | `update` de uma linha (`read = true`) |
| S-M3 | `announcements` | `announcements.service.ts` | `delete` por `id` |
| S-M5 | `lesson_progress` | `lessons.service.ts` (só o progresso) | `update` de `completed_activities + 1` |

Duas situações, e elas não são iguais:

- **S-M1 e S-M10** já têm `useMutation` na `main`. O hook, a query key e o botão ficam. Você troca só o corpo das funções no service.
- **S-M3 e S-M5** ainda só têm o GET. Além de trocar a leitura, você cria a função de escrita no service e o `useMutation` que invalida a query do GET — o mesmo padrão das mutations que a turma já fez. Se o botão ainda não existir na UI, ele entra junto.

Duas contas que **não** viram coluna no banco. Quem calcula é o service, como já era no dummy:

- `unreadCount` = quantos itens têm `read === false`
- `percent` = `Math.round((completedActivities / totalActivities) * 100)`

### S-M1 — Perfil (`profiles`)

Um registro, GET + UPDATE, a mesma forma da S-M2. A UI é o nome no header.

| | |
|---|---|
| Tabela | `profiles` |
| Arquivo | `src/services/user-profile.service.ts` |
| Hooks (não reescrever) | `useGetUserProfile`, `useUpdateUserProfile` |

#### READ — `getUserProfile`

**Antes:** lia `getUserProfileData()` do dummy.

**Depois** (mantenha `Promise<UserProfile>`):

```ts
const { data, error } = await supabase
  .from('profiles')
  .select('id, name, email, age, avatar_url')
  .eq('id', 'user-1')
  .single();

if (error) {
  throw new Error(`Failed to load profile: ${error.message}`);
}

return {
  id: data.id,
  name: data.name,
  email: data.email,
  age: data.age,
  avatarUrl: data.avatar_url,
};
```

O que cada peça faz:

- `.from('profiles')` — tabela certa
- `.eq('id', 'user-1')` — a linha da Ana Fellow
- `.single()` — um objeto, não array
- `avatar_url` no banco vira `avatarUrl` no type

#### UPDATE — `updateUserProfile`

A mutation já manda o objeto completo (`UserProfile`). O service grava e devolve o mesmo formato do GET:

```ts
const { data, error } = await supabase
  .from('profiles')
  .update({
    name: next.name,
    email: next.email,
    age: next.age,
    avatar_url: next.avatarUrl,
  })
  .eq('id', next.id)
  .select('id, name, email, age, avatar_url')
  .single();

if (error) {
  throw new Error(`Failed to update profile: ${error.message}`);
}

return {
  id: data.id,
  name: data.name,
  email: data.email,
  age: data.age,
  avatarUrl: data.avatar_url,
};
```

O `.eq('id', next.id)` é o `where`. Sem ele, o update pode atingir toda a tabela.

#### Como testar

1. Home → altere o nome e salve
2. Table Editor → `profiles` → linha `user-1` → a coluna `name` mudou
3. F5: o nome volta do banco

Se a UI muda e a tabela não, o service ainda está no dummy.

### S-M10 — Notificações (`notifications`)

Aqui o GET é uma **lista**, e o WRITE mexe em **uma** linha. O retorno do GET não é o array cru: a UI espera `{ unreadCount, items }`.

| | |
|---|---|
| Tabela | `notifications` |
| Arquivo | `src/services/notifications.service.ts` |
| Hooks (não reescrever) | `useGetNotifications`, `useMarkNotificationAsRead` |

#### READ — `getNotifications`

```ts
const { data, error } = await supabase
  .from('notifications')
  .select('id, title, read, created_at')
  .order('created_at', { ascending: false });

if (error) {
  throw new Error(`Failed to load notifications: ${error.message}`);
}

const items = (data ?? []).map((row) => ({
  id: row.id,
  title: row.title,
  read: row.read,
  createdAt: row.created_at,
}));

return {
  unreadCount: items.filter((item) => !item.read).length,
  items,
};
```

Sem `.single()`, porque são várias linhas. O seed tem 3: duas não lidas (`notif-1`, `notif-2`) e uma lida (`notif-3`). O badge começa em 2. `created_at` vira `createdAt`.

#### WRITE — `markNotificationAsRead`

Você não reescreve a notificação inteira. Só marca `read`.

```ts
const { data, error } = await supabase
  .from('notifications')
  .update({ read: true })
  .eq('id', id)
  .select('id, title, read, created_at')
  .single();

if (error) {
  throw new Error(`Failed to mark notification as read: ${error.message}`);
}

return {
  id: data.id,
  title: data.title,
  read: data.read,
  createdAt: data.created_at,
};
```

O `.eq('id', id)` garante que só aquela notificação muda. O `.single()` reclama se o id não existir — isso vira `throw`, e o React Query mostra `isError`.

O hook que já está na `main` invalida `queryKeys.notifications.all`. O GET roda de novo, o `unreadCount` é recalculado, o badge desce. Você não grava `unreadCount` no banco.

#### Como testar

1. Abra a lista e clique em “Marcar como lida” em `notif-1`
2. Table Editor → essa linha fica com `read = true`
3. O badge cai de 2 para 1, sem F5
4. F5: continua lida

### S-M3 — Avisos (`announcements`)

O WRITE desta task é um **DELETE**. Dispensar um aviso apaga a linha. No banco compartilhado, o aviso some para a turma inteira. Isso é esperado no sandbox.

| | |
|---|---|
| Tabela | `announcements` |
| Arquivo | `src/services/announcements.service.ts` |
| GET que já existe | `getAnnouncements` |
| WRITE que você cria | `dismissAnnouncement` |
| Hook que você cria | `useDismissAnnouncement` |

#### READ — `getAnnouncements`

A regra do dummy continua: aviso ativo é `expiresAt === null` **ou** data ainda no futuro. O `ann-4` está no banco de propósito, com data em 2020, para você provar que o filtro funciona. Ele não pode aparecer na UI.

```ts
const { data, error } = await supabase
  .from('announcements')
  .select('id, title, body, severity, published_at, expires_at')
  .order('published_at', { ascending: false });

if (error) {
  throw new Error(`Failed to load announcements: ${error.message}`);
}

return (data ?? [])
  .filter((row) => {
    if (row.expires_at === null) return true;
    return new Date(row.expires_at).getTime() > Date.now();
  })
  .map((row) => ({
    id: row.id,
    title: row.title,
    body: row.body,
    severity: row.severity,
    publishedAt: row.published_at,
    expiresAt: row.expires_at,
  }));
```

Na UI você vê 3 avisos (`ann-1`, `ann-2`, `ann-3`). No Table Editor existem 4. Os dois números diferentes, ao mesmo tempo, significam que o filtro está certo.

#### WRITE — `dismissAnnouncement`

Não existe na `main` ainda. Crie a função. Ela não precisa devolver o aviso: quem atualiza a lista é o invalidate.

```ts
export async function dismissAnnouncement(id: string): Promise<void> {
  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to dismiss announcement: ${error.message}`);
  }
}
```

O `.eq('id', id)` é obrigatório. Um `delete` sem filtro apaga a tabela.

#### Hook — no padrão que você já usou

```ts
export function useDismissAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dismissAnnouncement(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.announcements.all,
      });
    },
  });
}
```

Na UI, o botão chama `mutate(id)`. Enquanto `isPending`, o botão pode ficar desabilitado. Se `isError`, mostre a mensagem e deixe tentar de novo.

#### Como testar

1. A lista mostra 3 avisos, e o `ann-4` não está entre eles
2. Dispense o `ann-2`
3. Table Editor: a linha `ann-2` não existe mais
4. A lista atualiza sem F5
5. F5: continua fora

### S-M5 — Progresso da lição (`lesson_progress`)

Esta é a task com mais regra de negócio. A tabela guarda **contagem**, não porcentagem. A chave da linha é o par `user_id` + `lesson_id`: a Ana tem uma linha por lição (`lesson-1` 5/17, `lesson-2` 3/10, `lesson-3` 7/15).

Em `lessons.service.ts`, mexa só no progresso. `getLessons` e `getLessonById` continuam no dummy.

| | |
|---|---|
| Tabela | `lesson_progress` |
| Arquivo | `src/services/lessons.service.ts` |
| GET que já existe | `getLessonProgress(lessonId)` |
| WRITE que você cria | `incrementLessonProgress(lessonId)` |
| Hook que você cria | `useIncrementLessonProgress` |
| Query key | `queryKeys.lessonProgress.byLesson(lessonId)` |

#### READ — `getLessonProgress`

Dois filtros, porque a primary key tem duas colunas. `.single()` porque você quer a linha daquela lição, daquele usuário.

```ts
const { data, error } = await supabase
  .from('lesson_progress')
  .select('lesson_id, completed_activities, total_activities')
  .eq('user_id', 'user-1')
  .eq('lesson_id', lessonId)
  .single();

if (error) {
  throw new Error(`Failed to load lesson progress: ${error.message}`);
}

const percent = Math.round(
  (data.completed_activities / data.total_activities) * 100,
);

return {
  lessonId: data.lesson_id,
  completedActivities: data.completed_activities,
  totalActivities: data.total_activities,
  percent,
};
```

`percent` nasce aqui. Se você tentar dar `.select('percent')`, o banco não tem essa coluna.

#### WRITE — `incrementLessonProgress`

Some 1 em `completed_activities` e pare no teto. 17/17 não vira 18/17.

```ts
const { data: current, error: readError } = await supabase
  .from('lesson_progress')
  .select('completed_activities, total_activities')
  .eq('user_id', 'user-1')
  .eq('lesson_id', lessonId)
  .single();

if (readError) {
  throw new Error(`Failed to load lesson progress: ${readError.message}`);
}

const nextCompleted = Math.min(
  current.completed_activities + 1,
  current.total_activities,
);

const { data, error } = await supabase
  .from('lesson_progress')
  .update({ completed_activities: nextCompleted })
  .eq('user_id', 'user-1')
  .eq('lesson_id', lessonId)
  .select('lesson_id, completed_activities, total_activities')
  .single();

if (error) {
  throw new Error(`Failed to increment lesson progress: ${error.message}`);
}

return {
  lessonId: data.lesson_id,
  completedActivities: data.completed_activities,
  totalActivities: data.total_activities,
  percent: Math.round(
    (data.completed_activities / data.total_activities) * 100,
  ),
};
```

Os dois `.eq` no update importam: sem `lesson_id`, você somaria 1 em todas as lições do `user-1`.

#### Hook

A query key depende da lição. Invalide a da lição que você acabou de incrementar, senão a barra de outra lição que está em cache não é o problema — a barra **desta** lição é que não atualiza.

```ts
export function useIncrementLessonProgress(lessonId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => incrementLessonProgress(lessonId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.lessonProgress.byLesson(lessonId),
      });
    },
  });
}
```

#### Como testar

1. Abra uma lição (por exemplo `lesson-1`, que começa em 5/17)
2. Dispare o +1
3. Table Editor: `completed_activities` foi de 5 para 6. `total_activities` continua 17. Não existe coluna `percent`
4. A barra da UI acompanha, sem F5
5. F5: o 6/17 continua
6. No teto (17/17), outro clique não passa de 17

Vários fellows no mesmo `user-1` e na mesma lição somam no mesmo contador. O número pode subir mais de 1 se outra pessoa clicou junto. O que você precisa provar é que **o seu** clique gravou na tabela.

---

## 8. Erros comuns (e como pensar)

| Sintoma | O que verificar primeiro |
|---|---|
| Não acho `src/lib/supabase.ts` | Você está na `main` atualizada? Rodou `fetch`/`pull`? |
| `Cannot find module '@supabase/supabase-js'` | Rodou `npm install` depois do pull? |
| Requests falham / env missing | `.env` existe? Nomes `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`? Reiniciou o `npm run dev`? |
| `permission denied` / RLS | Table Editor acessível? Avise o mentor — pode ser policy do projeto |
| Erro de `.single()` (0 ou várias rows) | Filtro `.eq` certo? Seed existe? |
| UI atualiza, Table Editor não | Service ainda no dummy? Env apontando para outro projeto? |
| Table Editor atualiza, UI não | Hook ainda invalida a queryKey certa? Network tab mostra GET depois do WRITE? |
| TypeScript briga com `data` | Mapeie campo a campo; tipar o “row” ajuda |

Quando travar: **isole a camada**. Teste se o Table Editor muda. Se muda, o service WRITE está vivo e o problema é cache/UI. Se não muda, o problema ainda está no service/env/SQL.

---

## 9. Regras da entrega (igual espírito das mutations)

- Branch: `<seu-nome>/feat/S-M{N}-supabase-...`
- Escopo: **service** (+ mapper). Sem refatorar o app inteiro
- Exceção da segunda turma: S-M3 e S-M5 também criam a função de write e o `useMutation`, porque eles ainda não estão na `main`
- Remova imports mortos do dummy no arquivo que você migrou
- `npx tsc --noEmit` e `npm run lint` antes do PR
- Evidência no PR: print do **Table Editor depois** da ação na UI (antes/depois ajuda)
- Descrição curta: o que migrou, como testou

---

## 10. Ordem sugerida de aprendizado

Primeira turma (já encaminhada):

1. **S-M2** — GET + UPDATE  
2. **S-M11** — INSERT (mandar `id` gerado no client)  
3. **S-M8** — UPDATE + recálculo de rank  

Segunda turma (um recurso por pessoa):

1. **S-M1** — perfil, UPDATE do objeto  
2. **S-M10** — notificação, UPDATE de uma linha  
3. **S-M3** — aviso, DELETE por id  
4. **S-M5** — progresso, UPDATE +1  

Não tenha pressa de fazer mais de um recurso no mesmo dia. Uma task bem entendida vale mais que três PRs copiados.

---

## 11. Mini roteiro do dia (cole na cabeça)

```txt
1. main → fetch → pull → npm install → .env → npm run dev
2. Conferir tabela no Table Editor
3. Branch da task
4. Trocar só o service
5. Testar UI + Table Editor + F5
6. tsc + lint
7. PR com evidência
```
