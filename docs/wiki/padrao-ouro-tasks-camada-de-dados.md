# Padrão ouro — Tasks de Camada de Dados (Batch Fellows)

> **Documento vivo.** Use este arquivo para debater, revisar e atualizar o modelo antes de publicar cada task na plataforma.
>
> **Status:** v6 — Preview mock na UI; T1–T11 na mesma `HomePage` (T10 no header); T2 sem `reducedMotion`; Escola A fechada.

---

## Índice

1. [Visão e objetivo](#1-visão-e-objetivo)
2. [Fluxo ouro (fatia vertical completa)](#2-fluxo-ouro-fatia-vertical-completa)
3. [Convenções de nomenclatura CRUD](#3-convenções-de-nomenclatura-crud)
   - [3.1 Decisão fechada — Escola A](#31-decisão-fechada--escola-a)
4. [Estrutura de arquivos por task](#4-estrutura-de-arquivos-por-task)
5. [Exemplo de referência completo (UserProfile)](#5-exemplo-de-referência-completo-userprofile)
6. [Template padrão ouro de task (copiar por issue)](#6-template-padrão-ouro-de-task-copiar-por-issue)
7. [Mapa das tasks — componentes e dados](#7-mapa-das-tasks--componentes-e-dados)
   - [7.0 Matriz pedagógica (diversidade do batch)](#70-matriz-pedagógica-diversidade-do-batch)
   - [7.1 Tasks T1–T11](#71-tasks-t1t11)
   - [7.2 Detalhe T9–T11](#72-detalhe-t9t11)
8. [Progressão CRUD no batch](#8-progressão-crud-no-batch)
9. [Integração na UI (sem rota nova neste batch)](#9-integração-na-ui-sem-rota-nova-neste-batch)
10. [Rotas — batch futuro](#10-rotas--batch-futuro)
11. [Ponte Supabase (fixa em toda correção)](#11-ponte-supabase-fixa-em-toda-correção)
12. [Checklist de review / rubrica](#12-checklist-de-review--rubrica)
13. [Anti-patterns](#13-anti-patterns)
14. [Próximos passos deste documento](#14-próximos-passos-deste-documento)

**Publicação:** [`tasks-plataforma-camada-de-dados.md`](./tasks-plataforma-camada-de-dados.md) — campos prontos para a plataforma (name / points / description).

---

## 1. Visão e objetivo

Cada task do batch ensina **programação em camadas** com **React Query**, usando **dummy que simula o banco** (futuro Supabase).

O fellow não “só cria um hook”. Ele monta a fatia completa:

```txt
Contrato JSON (mentor entrega)
  → type + dummy (aluno implementa)
  → service async (aluno implementa)
  → queryKey + hook CRUD (aluno implementa)
  → integração na app (aluno implementa) — componente `.tsx` **fornecido pelo mentor**
```

**Foco pedagógico:** entender de onde vem o dado, como sobe pelas camadas e como a UI reage a `isPending` / `isError`.

**Não é foco neste batch:** fazer cada feature “fazer sentido de produto final”, nem criar rotas novas (ver [§10](#10-rotas--batch-futuro)).

---

## 2. Fluxo ouro (fatia vertical completa)

### Diagrama

```txt
┌──────────────────────────────────────────────────────────────┐
│  FASE 0 — Contrato (MENTOR entrega na issue)                 │
│  • JSON de referência (como viria do Supabase)               │
│  • Onde integrar na UI (sem rota nova neste batch)           │
│  • Operação CRUD desta task (GET / UPDATE / …)               │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  FASE 1 — Modelagem (ALUNO)                                │
│  • `interface` em `src/types/index.ts`                       │
│  • dummy em `src/test-utils/<recurso>.dummy.ts`            │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  FASE 2 — Service (ALUNO)                                  │
│  • `src/services/<recurso>.service.ts`                       │
│  • funções `getXxx`, `updateXxx`, … — async, sem React       │
│  • erro semântico → `throw new Error(...)`                   │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  FASE 3 — React Query (ALUNO)                              │
│  • chave em `src/lib/queryKeys.ts`                           │
│  • **1 arquivo por ação CRUD** em `src/hooks/`               │
│    ex.: `useGetUserProfile.ts`, `useUpdateUserProfile.ts`    │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  FASE 4 — Integração (ALUNO)                               │
│  • container em página/header existente                      │
│  • chama hook + trata isPending / isError                    │
│  • passa data → componente em `src/components/data-layer/` │
│    (presentacional — **mentor entrega antes do batch**)      │
└──────────────────────────────────────────────────────────────┘
```

### Analogia (restaurante)

| Camada | Papel | No código |
|---|---|---|
| Cliente | Pede e vê o prato | Componente presentacional |
| Garçom | Busca, avisa atraso/erro | Hook `useGet*` / `useUpdate*` |
| Cozinha | Prepara; grita se faltou ingrediente | Service |
| Despensa | Onde está a comida | Dummy (hoje) / Supabase (amanhã) |

### Regra de ouro da separação

- **Componente presentacional** → nunca importa React Query.
- **Hook CRUD** → nunca renderiza JSX.
- **Service** → nunca importa React.

### 2.1 Tratamento de erro na integração (regra do batch)

**Decisão pedagógica:** toda task ensina **`isError` explícito** — feedback visível + `refetch()`. Evitar omitir widget silenciosamente: o fellow precisa praticar o ciclo loading → sucesso → **falha → retry**.

| Formato | Tasks | Em `isError` |
|---|---|---|
| Compacto (header) | T1, T4 | Texto curto + botão retry inline |
| Drawer | T2, T6, T10 | Mensagem + retry **dentro do painel** |
| Seção | T3, T7, T8, T9, T11 | Bloco de erro + retry |
| Card | T5 | Linha de erro + retry no card |

**Empty state ≠ erro:** `[]` ou ausência legítima de dado → mensagem amigável, sem tratar como falha de rede.

Implementar na **integração** (`*DataSlots.tsx`, `LessonCard`) — nunca no componente presentacional.

---

## 3. Convenções de nomenclatura CRUD

> **Decisões fechadas:**
> 1. **1 arquivo por ação CRUD** — service agrupa funções; hooks não compartilham arquivo entre GET e UPDATE.
> 2. **Escola A** — prefixo explícito no hook: `useGet*`, `useUpdate*`, `useDelete*`, `useCreate*`. Ver [§3.1](#31-decisão-fechada--escola-a).

### Hooks (`src/hooks/`) — padrão oficial (Escola A)

| Ação | Arquivo | Função exportada | React Query |
|---|---|---|---|
| Leitura (lista) | `useGetLessons.ts` | `useGetLessons()` | `useQuery` |
| Leitura (por id) | `useGetLesson.ts` | `useGetLesson(lessonId)` | `useQuery` + `enabled` se necessário |
| Atualização | `useUpdateUserProfile.ts` | `useUpdateUserProfile()` | `useMutation` |
| Remoção | `useDeleteBookmark.ts` | `useDeleteBookmark()` | `useMutation` |

**Padrão de nome:** `use<Get|Create|Update|Delete><Recurso>`.

### Services (`src/services/<recurso>.service.ts`)

Funções **sem** prefixo `use`, espelhando HTTP/DB:

```ts
getUserProfile(): Promise<UserProfile>
updateUserProfile(payload): Promise<UserProfile>
deleteBookmark(id: string): Promise<void>
```

### Query keys (`src/lib/queryKeys.ts`)

Factory por recurso; ações de leitura usam chaves distintas quando o filtro muda:

```ts
userProfile: {
  current: ['user-profile', 'current'] as const,
},
userPreferences: {
  current: ['user-preferences', 'current'] as const,
},
announcements: {
  active: ['announcements', 'active'] as const,
},
learningResume: {
  current: ['learning-resume', 'current'] as const,
},
leaderboard: {
  list: (limit: number) => ['leaderboard', { limit }] as const,
},
```

### Migração do código existente (nota para mentores)

O projeto hoje tem `useLessons` (sem prefixo CRUD). **Plano:**

1. Este batch usa **só o padrão novo** (`useGet*`).
2. Refactor de `useLessons` → `useGetLessons` pode ser issue separada do mentor **ou** feita antes do batch.
3. Fellows copiam estrutura de `useGetLessons` / `lessons.service.ts`, não de nomes legados.

### 3.1 Decisão fechada — Escola A

**Decisão do mentor (confirmada):** hooks com **ação CRUD explícita no nome** + **1 arquivo por ação**.

```txt
hooks/useGetUserProfile.ts       →  useGetUserProfile()
hooks/useUpdateUserPreferences.ts →  useUpdateUserPreferences()  // Batch 2
services/user-profile.service.ts →  getUserProfile(), updateUserProfile()
```

| Camada | Convenção | Exemplo |
|---|---|---|
| Service | verbo HTTP/DB | `getUserProfile`, `updateUserPreferences` |
| Hook leitura | `useGet` + Recurso | `useGetUserProfile` |
| Hook escrita | `useUpdate` / `useCreate` / `useDelete` + Recurso | `useUpdateUserPreferences` |
| Arquivo | 1 ação = 1 arquivo | nunca query + mutation no mesmo `.ts` |

**Por que fechamos assim:** clareza para iniciantes, simetria com o service, alinhamento ao time DFL, e preparação natural para mutações no Batch 2.

**Código legado:** `useLessons` permanece até issue de refactor → `useGetLessons`. Fellows do batch **sempre** criam `useGet*`.

---

## 4. Estrutura de arquivos por task

Exemplo para task de leitura simples (GET):

```txt
src/
├── types/index.ts                          # + UserProfile
├── test-utils/user-profile.dummy.ts        # dummy
├── services/user-profile.service.ts        # getUserProfile()
├── services/index.ts                       # barrel export
├── lib/queryKeys.ts                        # + userProfile.current
├── hooks/useGetUserProfile.ts              # useQuery
├── hooks/index.ts                          # barrel export
└── components/profile/UserProfileCard.tsx  # presentacional
```

Integração em arquivo **já existente** (ex.: `GameHeader.tsx`, `HomePage.tsx`).

Para task com UPDATE (batch intermediário):

```txt
src/hooks/useGetSystemConfig.ts
src/hooks/useUpdateSystemConfig.ts          # useMutation
src/services/system-config.service.ts       # get + update
```

---

## 5. Exemplo de referência completo (UserProfile)

Use este exemplo ao explicar o fluxo na aula e ao revisar PRs.

### Fase 0 — Contrato JSON (mentor entrega)

```json
{
  "id": "user-1",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "age": 30,
  "avatarUrl": "https://i.pravatar.cc/64?u=user-1"
}
```

Tabela futura sugerida: `profiles`.

### Fase 1 — Type + dummy

```ts
// src/types/index.ts
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  avatarUrl: string;
}
```

```ts
// src/test-utils/user-profile.dummy.ts
import type { UserProfile } from '@/types';

export const userProfileData: UserProfile = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  age: 30,
  avatarUrl: 'https://i.pravatar.cc/64?u=user-1',
};
```

### Fase 2 — Service

```ts
// src/services/user-profile.service.ts
import { userProfileData } from '@/test-utils/user-profile.dummy';
import type { UserProfile } from '@/types';

const SIMULATED_LATENCY_MS = 300;
const simulateNetworkDelay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

export async function getUserProfile(): Promise<UserProfile> {
  await simulateNetworkDelay();
  if (!userProfileData) {
    throw new Error('User profile not found');
  }
  return userProfileData;
}
```

### Fase 3 — Query key + hook GET

```ts
// src/lib/queryKeys.ts (trecho)
userProfile: {
  current: ['user-profile', 'current'] as const,
},
```

```ts
// src/hooks/useGetUserProfile.ts
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/services';
import { queryKeys } from '@/lib/queryKeys';

export function useGetUserProfile() {
  return useQuery({
    queryKey: queryKeys.userProfile.current,
    queryFn: getUserProfile,
  });
}
```

> **Nota:** não usar `enabled: false` em GET que deve carregar ao montar a tela. Use `enabled: !!id` quando a busca depende de parâmetro.

### Fase 4 — Componente + integração

```tsx
// src/components/profile/UserProfileCard.tsx — PRESENTACIONAL
interface UserProfileCardProps {
  profile: UserProfile;
}

export function UserProfileCard({ profile }: UserProfileCardProps) {
  return (
    <article className="flex items-center gap-3 rounded-lg border p-4">
      <img src={profile.avatarUrl} alt="" className="h-12 w-12 rounded-full" />
      <div>
        <p className="font-semibold">{profile.name}</p>
        <p className="text-sm text-muted-foreground">{profile.email}</p>
        <p className="text-xs">{profile.age} anos</p>
      </div>
    </article>
  );
}
```

```tsx
// Integração (ex.: GameHeader ou seção da HomePage) — CONTAINER
const { data: profile, isPending, isError, refetch } = useGetUserProfile();

if (isPending) return <UserProfileCardSkeleton />;
if (isError) {
  return (
    <button type="button" onClick={() => refetch()}>
      Tentar de novo
    </button>
  );
}
if (!profile) return null;

return <UserProfileCard profile={profile} />;
```

---

## 6. Template padrão ouro de task (copiar por issue)

```markdown
## T{N} — {Título curto}

**Dificuldade:** 🟢 Iniciante | 🟡 Intermediário (~Xh)
**Operação CRUD:** GET | UPDATE | GET + UPDATE
**Integração UI:** {onde na app — sem rota nova}

---

### Contexto

{1–2 frases: o que falta na app e por que este dado existe.}

### Contrato JSON (referência Supabase)

**Tabela futura:** `{nome_da_tabela}`

```json
{ ... mentor preenche ... }
```

### Objetivo

Montar a fatia vertical completa: type → dummy → service → queryKey → hook(s) CRUD → componente → integração.

---

### Entregáveis (checklist do aluno)

#### Fase 1 — Modelagem
- [ ] Tipo `{TypeName}` em `src/types/index.ts`
- [ ] Dummy `src/test-utils/{recurso}.dummy.ts`

#### Fase 2 — Service
- [ ] `src/services/{recurso}.service.ts`
  - [ ] `{get|update|delete}Xxx()` async
  - [ ] latência simulada (~300ms)
  - [ ] `throw new Error(...)` em falha semântica
  - [ ] export no barrel `src/services/index.ts`

#### Fase 3 — React Query
- [ ] Entrada em `src/lib/queryKeys.ts`
- [ ] `src/hooks/use{Action}{Resource}.ts` (1 arquivo por ação)
  - [ ] export no barrel `src/hooks/index.ts`

#### Fase 4 — UI
- [ ] `{ComponentName}.tsx` presentacional (só props)
- [ ] Integrar em `{ArquivoExistente}.tsx`
  - [ ] tratar `isPending`
  - [ ] tratar `isError` + mensagem visível + `refetch()` (ver [§2.1](#21-tratamento-de-erro-na-integração-regra-do-batch))
  - [ ] renderizar componente com `data`

#### Validação
- [ ] `npx tsc --noEmit`
- [ ] `npm run lint`

---

### Critérios de aceite

- [ ] {comportamento visível 1}
- [ ] {comportamento visível 2}
- [ ] Componente **não** importa React Query
- [ ] Dummy **não** importado direto na página/componente de integração
- [ ] tsc + lint passam

---

### Referências

- Fluxo ouro: `docs/wiki/padrao-ouro-tasks-camada-de-dados.md`
- Preparação: `docs/wiki/o-que-esperamos-ate-a-reuniao.md`
- Código existente: `lessons.service.ts`, `queryKeys.ts`, `HomePage.tsx`

---

### Dicas

- {dica específica da task}

### Notas do mentor (opcional)

- Formato do erro na UI: compacto | drawer | seção | card (ver [§2.1](#21-tratamento-de-erro-na-integração-regra-do-batch))
- `enabled`: só se task usar parâmetro obrigatório
```

---

## 7. Mapa das tasks — componentes e dados

> **Contratos JSON detalhados:** [`contratos-json-tasks-camada-de-dados.md`](./contratos-json-tasks-camada-de-dados.md) · **Publicação na plataforma:** [`tasks-plataforma-camada-de-dados.md`](./tasks-plataforma-camada-de-dados.md)

### 7.0 Matriz pedagógica (diversidade do batch)

Cada task deve variar **pelo menos uma dimensão** para o batch não virar “11 cópias do mesmo GET”.

| Dimensão | Valores possíveis | Tasks que cobrem |
|---|---|---|
| Formato do dado | objeto único | T1, T2, T4, T7, T9 |
| | objeto + lista aninhada | T10 |
| | array / lista | T3, T6, T8, T11 |
| | derivado / cálculo no service | T5, T9 |
| Escopo | usuário atual (`self`) | T1, T2, T4, T5, T6, T7, T9, T10, T11 |
| | plataforma / global | T3 |
| | outros usuários | T8 |
| Hook | sem parâmetro | T1, T2, T3, T4, T6, T7, T9, T10 |
| | com parâmetro (`id`, `limit`) | T5, T8, T11 |
| UI | card / badge compacto | T1, T4 |
| | painel / modal / drawer | T2, T6, T10 (header HomePage) |
| | lista / tabela / timeline | T3, T6, T8, T11 |
| | banner / destaque | T7, T9 |
| | barra inline | T5 |
| Erro na UI | compacto + retry | T1, T4 |
| | drawer + retry | T2, T6, T10 |
| | seção + retry | T3, T7, T8, T9, T11 |
| | card + retry | T5 |

**Histórico:** T3 era trilhas (muito similar a lições) → **confirmada** como `AnnouncementList` (avisos da plataforma).

---

### 7.1 Tasks T1–T11

| Task | Componente | Recurso / tabela futura | Hook(s) | CRUD | Dific. | Diferencial pedagógico |
|---|---|---|---|---|---|---|
| **T1** | `UserProfileCard` | `profiles` | `useGetUserProfile` | GET | 🟢 | objeto `self`, identidade |
| **T2** | `AppearanceSettingsPanel` | `user_preferences` | `useGetUserPreferences` | GET | 🟢 | preferências **do usuário** (tema, som, idioma) |
| **T3** | `AnnouncementList` | `announcements` | `useGetAnnouncements` | GET | 🟢 | lista **plataforma**, severidade + datas ✅ |
| **T4** | `UserStatsBadge` | `user_stats` | `useGetUserStats` | GET | 🟢 | segundo recurso `self`, gamificação |
| **T5** | `LessonProgressBar` | `lesson_progress` | `useGetLessonProgress` | GET | 🟡 | parâmetro + **cálculo** no service |
| **T6** | `AchievementsList` | `achievements` + `user_achievements` | `useGetUserAchievements` | GET | 🟡 | lista com estado locked/unlocked |
| **T7** | `DailyChallengeBanner` | `daily_challenges` | `useGetDailyChallenge` | GET | 🟡 | objeto + urgência (`expiresAt`) |
| **T8** | `LeaderboardTable` | `leaderboard_entries` | `useGetLeaderboard` | GET | 🟡 | lista **outros users** + param `limit` |
| **T9** | `ContinueLearningCard` | `learning_resume` | `useGetLearningResume` | GET | 🟢 | objeto `self` + CTA para lição |
| **T10** | `NotificationBellIcon` + `NotificationList` | `notifications` | `useGetNotifications` | GET | 🟡 | resumo + contador `unreadCount` |
| **T11** | `RecentActivityFeed` | `activity_events` | `useGetRecentActivity` | GET | 🟡 | timeline temporal + param `limit` |

---

### T1 — Perfil do usuário (`UserProfileCard`)

**Sua ideia:** card com nome, avatar, email, idade.

**Padrão ouro:**
- Dado **identidade** do usuário (quem é).
- Integração: header da `HomePage` via `HomePageHeaderDataSlots` — badge compacto.
- **Separar de XP** (ver T4) — perfil muda pouco; stats mudam com gamificação.

**Tipo sugerido:** `UserProfile` — campos do contrato §5.

**Observação:** em `isError`, mostrar feedback compacto + retry no header — não omitir silenciosamente.

---

### T2 — Preferências de aparência (`AppearanceSettingsPanel`)

**Foco (mentor):** tema escolhido pelo usuário e outras preferências **básicas e tangíveis** — coisas que o aluno reconhece na UI.

**Padrão ouro:**
- Tabela futura: `user_preferences` — **1 registro por usuário** (row do usuário logado).
- Não é config global da plataforma — é “como **eu** quero usar o app”.
- Componente: painel em `Dialog`/`Sheet` aberto pelo ícone ⚙️ no header.
- UI mostra valores atuais em formato legível (ex.: “Tema: Escuro”, “Sons: Ativados”) — **neste batch só GET**; toggles visuais podem ser estáticos/desabilitados com nota “edição no Batch 2”.
- Ensina GET de **objeto único** com campos simples (`boolean`, `enum`).

**Tipo sugerido:**

```ts
type ThemePreference = 'light' | 'dark' | 'system';

interface UserPreferences {
  userId: string;
  theme: ThemePreference;
  soundEffectsEnabled: boolean;
  language: 'pt-BR' | 'en-US';
}
```

**Contrato JSON exemplo:**

```json
{
  "userId": "user-1",
  "theme": "dark",
  "soundEffectsEnabled": true,
  "language": "pt-BR"
}
```

**Integração:** ícone ⚙️ no **header da `HomePage`** (`HomePageHeaderDataSlots`) → drawer com preferências.

**Erro:** mensagem curta + **Tentar de novo** dentro do drawer.

**Batch futuro:** `useUpdateUserPreferences` + toggle de tema real + `invalidateQueries` em `queryKeys.userPreferences.current`.

**Nota para a issue:** explicar na abertura *“clique no ⚙️ para ver suas preferências salvas”* — evita parecer abstrato.

---

### T3 — Avisos da plataforma (`AnnouncementList`) ✅ confirmada

**Problema da ideia anterior (trilhas):** visual e semanticamente próxima das lições — fellow repete grid de cards educacionais sem aprender padrão novo.

**Nova proposta:** avisos operacionais da plataforma (manutenção, novidades, evento) — dado que **não é catálogo de estudo**.

**Padrão ouro:**
- Tabela futura: `announcements` (conteúdo editorial / ops, gerenciado fora do LMS de lições).
- UI: lista vertical compacta na `HomePage` (“Avisos”) — estilo alert/banner por item, não card de curso.
- Service ordena por `publishedAt` desc e **filtra expirados** (`expiresAt < now` → não retorna) — lógica na cozinha.
- Ensina: array GET, empty state (“Nenhum aviso”), severidade visual (`info` | `warning` | `success`).

**Tipo sugerido (rascunho):**

```ts
type AnnouncementSeverity = 'info' | 'warning' | 'success';

interface Announcement {
  id: string;
  title: string;
  body: string;
  severity: AnnouncementSeverity;
  publishedAt: string; // ISO
  expiresAt: string | null; // null = não expira
}
```

**Contrato JSON exemplo (1 item):**

```json
{
  "id": "ann-1",
  "title": "Manutenção programada",
  "body": "No domingo, 02h–04h, o iterate ficará indisponível.",
  "severity": "warning",
  "publishedAt": "2026-05-20T10:00:00.000Z",
  "expiresAt": "2026-05-28T23:59:59.000Z"
}
```

**Integração:** seção na `HomePage`, abaixo do header / acima das lições.

**Erro:** explícito com retry (seção visível — falha deve ser perceptível).

**Alternativas descartadas para T3:**

| Ideia | Por que não |
|---|---|
| Trilhas (`TrackList`) | Muito similar a lições |
| Feed de atividade | Reservado para T11 |
| Skill badges | Visual interessante, mas overlap com T6 (conquistas) |

---
### T4 — Stats do usuário / XP (`UserStatsBadge`)

**Sua dúvida:** centralizar no UserProfile ou separar?

**Recomendação:** **separar (T4)**.

| | UserProfile (T1) | UserStats (T4) |
|---|---|---|
| Tabela futura | `profiles` | `user_stats` |
| Muda quando | cadastro | joga / completa activity |
| UI | card identidade | badge XP + level + streak |
| Pedagogia | objeto único | segundo recurso, segunda query |

**Componente:** `UserStatsBadge` — pill ao lado do perfil no header: `Lv. 5 · 1.240 XP · 🔥 3`.

**Tipo sugerido (rascunho):**

```ts
interface UserStats {
  userId: string;
  totalXp: number;
  level: number;
  currentStreak: number;
  livesRemaining: number;
}
```

**Observação:** reforça que **1 componente ≠ 1 tabela sempre**, mas **1 task = 1 fatia vertical clara**.

---

### T5 — Progresso do usuário (`LessonProgressBar`)

**Sua ideia:** progresso em outra tabela ou com cálculo.

**Padrão ouro:**
- Service pode **derivar** `percent` a partir de `completed` / `total` (lógica na cozinha, não no JSX).
- Hook recebe parâmetro: `useGetLessonProgress(lessonId)`.
- Integração: dentro de cada card de lição na `HomePage` (N queries paralelas — ok com React Query).

**Tipo sugerido (rascunho):**

```ts
interface LessonProgress {
  lessonId: string;
  completedActivities: number;
  totalActivities: number;
  percent: number; // 0–100, calculado no service
}
```

**Observação:** primeira task com **`enabled: !!lessonId`** se integrar em loop. Ensina query parametrizada.

---

### T6 — Conquistas (`AchievementsList`)

**Sua ideia:** conquistas do aluno (outra tabela).

**Padrão ouro:**
- Dummy mistura conquistas **desbloqueadas** e **bloqueadas** (`unlockedAt: string | null`).
- UI: drawer acionado no **header da `HomePage`** (ícone troféu em `HomePageHeaderDataSlots`).
- Lista com estado visual diferente locked/unlocked.

**Tipo sugerido (rascunho):**

```ts
interface UserAchievement {
  id: string;
  title: string;
  description: string;
  iconEmoji: string;
  unlockedAt: string | null;
}
```

**Tabelas futuras:** `achievements` + `user_achievements` (join simulado no dummy).

---

### T7 — Desafio diário (`DailyChallengeBanner`)

**Sua ideia:** componente de desafio diário.

**Padrão ouro:**
- Banner destacado no topo da `HomePage` ou acima do grid de lições.
- Dado com **validade** (`expiresAt`) — prepara mente para filtros Supabase por data.
- Pode incluir CTA “Ver desafio” (link para lição existente, sem rota nova).

**Tipo sugerido (rascunho):**

```ts
interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  bonusXp: number;
  expiresAt: string; // ISO
  targetLessonId: string;
}
```

**Batch futuro:** `useUpdateDailyChallenge` (marcar como concluído) + `invalidateQueries`.

---

### T8 — Ranking (`LeaderboardTable`)

**Sua ideia:** ranking dos alunos.

**Padrão ouro:**
- GET com parâmetro `limit` → `useGetLeaderboard(limit)`.
- Tabela simples: posição, avatar, nome, XP.
- Integração: seção na `HomePage` ou painel lateral.
- Destacar linha do usuário atual (`isCurrentUser: boolean` no tipo).

**Tipo sugerido (rascunho):**

```ts
interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl: string;
  totalXp: number;
  isCurrentUser: boolean;
}
```

**Observação:** lista **de outros usuários** — diferente de T1/T4 (dados do self).

---

### 7.2 Detalhe T9–T11

T9–T11 integram na **mesma `HomePage`** que T1–T8 — sem rota nova. Componentes e preview mock já estão em `src/components/data-layer/`.

| Task | Componente | Tabela futura | Hook | Dific. | Por que existe |
|---|---|---|---|---|---|
| **T9** | `ContinueLearningCard` | `learning_resume` | `useGetLearningResume` | 🟢 | “Continue de onde parou” — objeto com link para lição |
| **T10** | `NotificationBellIcon` + `NotificationList` | `notifications` | `useGetNotifications` | 🟡 | Lista + **contador** `unreadCount` no header |
| **T11** | `RecentActivityFeed` | `activity_events` | `useGetRecentActivity` | 🟡 | Timeline temporal — UI diferente de tabela e de cards |

**T9 — Continue de onde parou (substitui UserPreferences — evita overlap com T2):**

Objeto único que resume a **última lição em andamento** — padrão clássico de LMS, visual distinto de preferências e de lista de avisos.

```ts
interface LearningResume {
  lessonId: string;
  lessonTitle: string;
  completedActivities: number;
  totalActivities: number;
  lastVisitedAt: string; // ISO
  percent: number; // 0–100, calculado no service
}
```

**Contrato JSON exemplo:**

```json
{
  "lessonId": "lesson-1",
  "lessonTitle": "Introdução ao React",
  "completedActivities": 5,
  "totalActivities": 17,
  "lastVisitedAt": "2026-05-27T18:30:00.000Z",
  "percent": 29
}
```

**Integração:** card destacado na `HomePage` (“Continue de onde parou”) com CTA linkando para `/lesson/{lessonId}`.

**Erro:** mensagem na seção + retry. Empty state legítimo (sem lição em andamento) ≠ erro de rede.

**Pedagogia:** segundo objeto `self` com **navegação** — fellow pratica CTA + dado derivado (`percent`) sem repetir T2/T5.

**T10 — Notifications:**

```ts
interface Notification {
  id: string;
  title: string;
  read: boolean;
  createdAt: string;
}

interface NotificationsSummary {
  unreadCount: number;
  items: Notification[];
}
```

Integração: drawer 🔔 no **header da `HomePage`** — `NotificationBellIcon` com badge + `NotificationList` no painel. Em `isError`: mensagem + retry **dentro do drawer**.

**T11 — RecentActivityFeed:**

```ts
interface ActivityEvent {
  id: string;
  type: 'lesson_completed' | 'achievement_unlocked' | 'streak_milestone';
  label: string; // texto pronto para exibir
  occurredAt: string;
}
```

Integração: coluna lateral na `HomePage` ou bloco abaixo de T3.

**Task mentor (opcional, fora do sorteio):** refactor `useLessons` → `useGetLessons` + atualizar `HomePage` — não sortear para fellow iniciante.

---

## 8. Progressão CRUD no batch

| Fase do batch | Tasks | O que ensina |
|---|---|---|
| **Leitura** | T1–T11 (todas) | `useGet*` + `useQuery` + service `get*` |
| **Leitura parametrizada** | T5, T8, T11 | `queryKey` com parâmetro, `enabled` |
| **Leitura lista** | T3, T6, T8, T11 | arrays, empty state, skeleton de lista |
| **Objeto + lista aninhada** | T10 | `unreadCount` derivado de `items` |
| **Filtro/transformação no service** | T3 | expirados removidos, ordenação |
| **Mutação** | *fora deste batch* | `useUpdate*` + `useMutation` + invalidate |

**Decisão:** este batch = **100% GET** (11 tasks). Mutações ficam para **Batch 2** (pode incluir rotas + `useUpdateUserPreferences`, `useUpdateDailyChallenge`).

Isso mantém escopo revisável em ~3–4h por fellow sem sobrecarregar.

---

## 9. Integração na UI (sem rota nova neste batch)

### Mapa visual (estado atual do repo)

```txt
HomePage (/)
├─ HEADER — HomePageHeaderDataSlots.tsx  ← fellows T1, T2, T4, T6, T10
│   [iterate]     [🔔 T10] [T4 stats] [🏆 T6] [⚙️ T2] [T1 perfil]
├─ T9 ContinueLearningCard
├─ T7 DailyChallengeBanner
├─ T3 AnnouncementList
├─ T11 RecentActivityFeed
├─ Hero + grid de lições
│   └─ LessonCard + T5 LessonProgressBar (por card)
└─ T8 LeaderboardTable

LessonPage (/lesson/:id)
└─ GameHeader — vidas/streak/xp da sessão + botão “Início” (sem tasks do batch)
```

### Arquivos de integração (preview mock hoje → hooks amanhã)

| Task | Onde integrar | Arquivo que o fellow edita |
|---|---|---|
| T1 | Header da `HomePage` | `HomePageHeaderDataSlots.tsx` |
| T2 | Header da `HomePage` (drawer ⚙️) | `HomePageHeaderDataSlots.tsx` |
| T3 | Corpo da `HomePage` | `HomePageDataSlots.tsx` (`HomePageTopDataSlots`) |
| T4 | Header da `HomePage` | `HomePageHeaderDataSlots.tsx` |
| T5 | Cada `LessonCard` | `HomePage.tsx` (componente interno) |
| T6 | Header da `HomePage` (drawer 🏆) | `HomePageHeaderDataSlots.tsx` |
| T7 | Corpo da `HomePage` (topo) | `HomePageDataSlots.tsx` |
| T8 | Corpo da `HomePage` (rodapé) | `HomePageDataSlots.tsx` (`HomePageBottomDataSlots`) |
| T9 | Corpo da `HomePage` (primeiro bloco) | `HomePageDataSlots.tsx` (`HomePageTopDataSlots`) |
| T10 | Header da `HomePage` (drawer 🔔) | `HomePageHeaderDataSlots.tsx` |
| T11 | Corpo da `HomePage` (abaixo dos avisos) | `HomePageDataSlots.tsx` (`HomePageTopDataSlots`) |

**Preview atual:** `src/components/data-layer/preview.mock.ts` alimenta os slots — fellows **substituem** por `useGet*` + estados.

**Regra:** componente em `src/components/data-layer/*.tsx` **não** importa React Query. Integração fica nos `*DataSlots.tsx` ou na `HomePage`.

---

## 10. Rotas — batch futuro

**Decisão:** criar **página dedicada por componente** é valioso para ensinar rotas, mas **fica fora deste batch** (muito escopo por task).

**Batch futuro sugerido (“Camada de Dados — Parte 2”):**

- `/profile` → `UserProfileCard` + `UserStatsBadge`
- `/settings` → `AppearanceSettingsPanel` + `useUpdateUserPreferences`
- `/announcements` → `AnnouncementList` full page
- `/leaderboard` → `LeaderboardTable` full page
- Introduzir `useUpdate*` onde fizer sentido
- Reforçar `queryClient.invalidateQueries` após mutação

Mencionar na aula de fechamento: *“Hoje integramos em telas existentes; no próximo batch vocês criam rotas.”*

---

## 11. Ponte Supabase (fixa em toda correção)

Texto padrão para mentores colarem no review:

> “Trocar dummy por Supabase = alterar **somente o service**. Hook `useGet*`, `queryKey` e componente presentacional permanecem. Ex.: `getUserProfile()` vira `supabase.from('profiles').select().single()`.”

Mapa tabela ↔ task (rascunho para schema futuro em `dfl-schema`):

| Tabela Supabase (futuro) | Task |
|---|---|
| `profiles` | T1 |
| `user_preferences` | T2 |
| `announcements` | T3 |
| `user_stats` | T4 |
| `lesson_progress` | T5 |
| `achievements` / `user_achievements` | T6 |
| `daily_challenges` | T7 |
| `leaderboard_entries` (ou view) | T8 |
| `learning_resume` | T9 |
| `notifications` | T10 |
| `activity_events` | T11 |

---

## 12. Checklist de review / rubrica

Todo PR deve satisfazer:

- [ ] Fluxo respeitado: **nenhum** import de dummy fora de `services/` e `test-utils/`
- [ ] Service: async, sem React, `throw` em erro semântico
- [ ] Hook: nome `use{Action}{Resource}`, 1 arquivo por ação CRUD
- [ ] `queryKey` via factory `queryKeys.*`
- [ ] Componente presentacional sem React Query
- [ ] Integração trata `isPending`, `isError` (mensagem + `refetch`) e empty state quando aplicável
- [ ] `npx tsc --noEmit` + `npm run lint`

Ver também: `docs/wiki/rubrica-e-template-pr.md`.

---

## 13. Anti-patterns

| ❌ Evitar | ✅ Fazer |
|---|---|
| `useGetUserProfile.ts` renderizando spinner | Container na página trata estados |
| `HomePage` importando dummy | `HomePage` chama `useGet*` |
| `return null` quando user não existe | `throw new Error('User profile not found')` |
| `queryKey: ['user']` solto | `queryKeys.userProfile.current` |
| `useGetUserData` + `getUserProfile` (nomes incoerentes) | Mesmo vocabulário em hook, service e tipo |
| `useUserProfile` sem prefixo `Get` (legado) | `useGetUserProfile` — Escola A |
| `enabled: false` sem motivo | Default `true`; `enabled: !!param` quando necessário |
| XP dentro de T1 “porque cabe” | T4 separada — duas queries, duas tabelas |

---

## 14. Próximos passos deste documento

Ordem acordada de trabalho:

1. ~~Fechar §3.1 — Escola A~~ ✅
2. ~~Validar T3 `AnnouncementList`~~ ✅
3. ~~Refinar T2 (preferências/tema) e T9 (sem overlap)~~ ✅
4. **Contratos JSON** — [`contratos-json-tasks-camada-de-dados.md`](./contratos-json-tasks-camada-de-dados.md) ✅
5. **PR mentor** — componentes + preview mock em `src/components/data-layer/` ✅
6. **11 tasks na plataforma** — [`tasks-plataforma-camada-de-dados.md`](./tasks-plataforma-camada-de-dados.md) ✅ (copiar name/points/description)
7. **Issues detalhadas** — [`issues-batch-camada-de-dados.md`](./issues-batch-camada-de-dados.md) ✅ (referência expandida)
8. **Aula** — usar §5 ao vivo + distribuir tasks
9. **Batch 2** — rotas + mutações (§10)

### Pendências abertas

- [x] Decisão nomenclatura hooks — **Escola A** (`useGet*`)
- [x] T3 `AnnouncementList` confirmada
- [x] T2 → `user_preferences` (tema, som, idioma — sem `reducedMotion`)
- [x] T9 → `ContinueLearningCard` (sem overlap com T2)
- [x] Integração T1–T11 na mesma `HomePage` (T10 no header)
- [x] Preview mock na UI
- [ ] Issue mentor: renomear `useLessons` → `useGetLessons` (timing?)
- [x] Atualizar `receita-pratica.md` com Escola A + links

### Avaliação do mapa (v6)

| Task | Status | Nota |
|---|---|---|
| T1 | ✅ | Base sólida |
| T2 | ✅ | Tema + prefs básicas — tangível para o aluno |
| T3 | ✅ | Confirmada — avisos ops |
| T4 | ✅ | Perfil ≠ stats |
| T5 | ✅ | Param + cálculo |
| T6 | ✅ | Join simulado |
| T7 | ✅ | Banner gamificado (distinto de T3) |
| T8 | ✅ | Dados de terceiros |
| T9 | ✅ | Resume learning — sem overlap T2 |
| T10 | ✅ | Notificações no header — contador + drawer |
| T11 | ✅ | Timeline abaixo dos avisos |

---

*Última atualização: v6 — T9–T11 na mesma HomePage; T10 no header; preview mock completo.*
