# Bloco 3 — Camada de Dados (Material para Fellows)

## Índice

- [Parte 1 — Roteiro da sessão didática](#parte-1--roteiro-da-sessão-didática-30min)
  - [Abertura](#abertura-o-que-vamos-aprender-hoje-3min)
  - [Por que mudar](#parte-1-por-que-a-gente-precisa-mudar-5min)
  - [Solução em 3 camadas](#parte-2-a-solução-em-3-camadas-10min)
  - [Walkthrough do código](#parte-3-walkthrough-do-código-real-8min)
  - [Regras de ouro](#parte-4-regras-de-ouro-3min)
  - [Q&A + entrega](#parte-5-qa--entrega-das-tasks-13min)
- [Parte 2 — As 8 tasks](#parte-2--enunciados-das-8-tasks)
- [Sumário de distribuição](#sumário-de-distribuição)

---

# Parte 1 — Roteiro da sessão didática (~30min)

## Abertura: o que vamos aprender hoje (3min)

> "Vocês já aprenderam a separar **componente visual** (`components/activity/`) e **lógica** (`hooks/`). Isso é o padrão _vertical_ — cada atividade tem seu próprio componente fininho consumindo seu próprio hook gordinho de lógica.
>
> Hoje vamos aprender o padrão _horizontal_: **de onde vêm os dados**. Como uma página pega informação (hoje de um arquivo dummy, amanhã de uma API), passa por validação/transformação e chega no componente sem fazer ele saber de onde veio.
>
> Esse é o ponto que diferencia projeto de aprendiz de projeto de produção. Saindo daqui, vocês vão saber montar essa camada do zero — exatamente do jeito que a gente faz nos projetos internos da DevFellowship."

---

## Parte 1: Por que a gente precisa mudar (5min)

### Como tá hoje (anti-pattern)

```tsx
// HomePage.tsx (versão antiga, antes do refactor)
import { lessonsData } from "@/test-utils/lessons.dummy";

export default function HomePage() {
  return (
    <div>
      {lessonsData.map((lesson) => (
        <LessonCard lesson={lesson} />
      ))}
    </div>
  );
}
```

> "Pareceu inocente, né? Funciona. Mas vamos imaginar o futuro:
>
> 1. **Amanhã as lições vêm de uma API**. Vou ter que abrir TODAS as páginas que importam `lessonsData` e mudar pra `fetch`. Quantas páginas? Sei lá. Talvez 10. Talvez 20. Cada uma com seu próprio jeito de tratar `loading`, `error`. Inferno.
> 2. **E se eu quiser que TODAS essas páginas mostrem o mesmo loader bonito?** Vou ter que copiar o JSX em 20 lugares.
> 3. **E se a API ficar instável e eu quiser cachear pra não bater de novo a cada navegação?** Cada página teria que ter seu próprio estado de cache. Inviável.
>
> A solução pra esses 3 problemas é a mesma: **separar 'de onde vem o dado' de 'quem mostra o dado'**. É disso que a gente vai falar."

---

## Parte 2: A solução em 3 camadas (10min)

```
┌──────────────┐
│  COMPONENTE  │  ← só renderiza. Pergunta: "tem dado? tô esperando? deu ruim?"
└──────┬───────┘
       │ usa
       ▼
┌──────────────┐
│  HOOK DE     │  ← liga o componente ao service. Usa React Query.
│  QUERY       │     Devolve { data, isPending, isError, refetch }
└──────┬───────┘
       │ chama
       ▼
┌──────────────┐
│  SERVICE     │  ← função async pura. Lê do dummy (ou da API amanhã).
└──────┬───────┘     Sem React aqui. Sem JSX. Sem useState.
       │ lê de
       ▼
┌──────────────┐
│  DUMMY /     │
│  FETCH       │
└──────────────┘
```

### Analogia do restaurante

> "Pensem num restaurante:
>
> - **Cliente (componente)** — só sabe pedir 'quero um prato'. Não conhece a cozinha.
> - **Garçom (hook)** — leva o pedido pra cozinha e traz o prato pronto. Avisa o cliente se vai demorar (`isPending`) ou se acabou o estoque (`isError`).
> - **Cozinha (service)** — sabe fazer o prato. Não fala com cliente. Se faltar ingrediente, **grita** um erro (`throw new Error`).
> - **Despensa (dummy / fetch)** — o lugar de onde a comida vem.
>
> Cliente não vai na despensa pegar comida. Cozinha não fala com cliente. Cada um tem sua responsabilidade. Quando a despensa muda de lugar (dummy → API), só a cozinha precisa saber."

### Camada 1 — Service (a "cozinha")

Vamos olhar o service real do projeto:

```ts
// src/services/lessons.service.ts
const SIMULATED_LATENCY_MS = 300;

const simulateNetworkDelay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

export async function getLessons(): Promise<Lesson[]> {
  await simulateNetworkDelay();
  return lessonsData;
}

export async function getLessonById(id: string): Promise<Lesson> {
  await simulateNetworkDelay();
  const lesson = lessonsData.find((l) => l.id === id);
  if (!lesson) {
    throw new Error(`Lesson not found: ${id}`);
  }
  return lesson;
}
```

Reparem em 4 coisas:

1. **É `async` e retorna `Promise`**. Sempre. Mesmo que hoje seja síncrono no dummy.
2. **Não tem `useState`, não tem JSX, não tem `import { useXxx }`**. É uma função PURA de dados. Dá pra rodar em Node, em teste, em qualquer lugar.
3. Tem **latência simulada** (`setTimeout 300ms`). Pra quê? Pra a UI parecer real — assim vocês veem o loader funcionando. Quando virar fetch de verdade, esse `setTimeout` some.
4. Quando o recurso **não existe**, a gente faz **`throw new Error`**. Não retorna `null`. Não retorna `undefined`. **Grita**.

> Por que `throw` em vez de `return null`? Porque o React Query, no nosso próximo passo, **converte `throw` em estado `isError`** automaticamente. Se eu retornar `null`, o componente vai achar que 'deu certo, só não tem nada'. Aí ele tenta `lesson.title` e quebra. **`throw` é mais honesto**.

### Camada 2 — queryKeys (a "etiqueta do pedido")

Toda vez que o React Query busca um dado, ele guarda numa cache identificada por uma **chave**. Tipo um numerinho de comanda do restaurante.

```ts
// src/lib/queryKeys.ts
export const queryKeys = {
  lessons: {
    all: ["lessons"] as const,
    byId: (id: string) => ["lessons", id] as const,
  },
  activities: {
    byLesson: (lessonId: string) => ["activities", { lessonId }] as const,
  },
} as const;
```

Por que existe esse arquivo, em vez de cada hook escrever `queryKey: ['lessons']` direto?

1. **Autocomplete**. Quando você escreve `queryKeys.lessons.`, o VSCode mostra as opções. Sem ele, você teria que ir no MDN ver o nome da chave.
2. **Sem typo silencioso**. Se eu escrever `'lesons'` (esqueci uma 's'), o React Query acha que é OUTRA query. Vai buscar de novo. Vai dar bug invisível. Com o factory, o TypeScript me bate na mão.
3. **Invalidação em grupo**. Quando o aluno completa uma atividade, eu quero atualizar 'tudo que tem a ver com lições'. Aí eu chamo `queryClient.invalidateQueries({ queryKey: queryKeys.lessons.all })` e pronto — todas as queries que começam com `['lessons', ...]` são marcadas como obsoletas. **Não dá pra fazer isso com strings soltas.**

> ❌ Anti-pattern: **NUNCA** escrevam `queryKey: ['minha-coisa']` direto no hook. Sempre adicionem entrada nova no `queryKeys.ts`.

### Camada 3 — Hook de query (o "garçom")

Aqui é onde a mágica acontece:

```ts
// src/hooks/useLessons.ts
export function useLessons() {
  return useQuery({
    queryKey: queryKeys.lessons.all,
    queryFn: getLessons,
  });
}
```

É **isso**. Esse é o hook completo. 4 linhas reais.

O `useQuery` é uma função do `@tanstack/react-query` que recebe 2 coisas:

- `queryKey` — a etiqueta (do factory)
- `queryFn` — a função do service (a cozinha)

E te devolve um OBJETO MÁGICO com vários campos prontos. Os principais:

| Campo        | O que é                                               | Quando usar                  |
| ------------ | ----------------------------------------------------- | ---------------------------- |
| `data`       | O retorno da `queryFn`. `undefined` enquanto carrega. | Renderizar conteúdo          |
| `isPending`  | `true` na primeira carga                              | Mostrar loader               |
| `isError`    | `true` se o service deu `throw`                       | Mostrar mensagem de erro     |
| `error`      | O `Error` que foi jogado                              | Debug ou mensagem detalhada  |
| `refetch()`  | Função pra forçar nova busca                          | Botão "tentar de novo"       |
| `isFetching` | `true` em qualquer busca (inclusive refetch)          | Loader sutil durante refresh |

> ✅ **Regra de ouro do hook**: ele NÃO trata UI. Ele devolve o objeto cru pro componente. Quem decide o que mostrar é o componente.

### Camada 4 — Componente (o "cliente")

Agora a parte mais visível. Olhem como o `HomePage` consome:

```tsx
// src/pages/HomePage.tsx (linha 10)
export default function HomePage() {
  const navigate = useNavigate();
  const { data: lessons = [], isPending, isError, refetch } = useLessons();
  // ...
}
```

**A linha 10 é a aula inteira.** Vamos ler com calma:

- `useLessons()` — chamei o hook.
- `{ data: lessons = [], ... }` — desestruturei e **renomeei `data` para `lessons`** (fica mais legível no resto do código), e dei valor default `[]` pra não dar erro de `map` em `undefined`.
- `isPending`, `isError`, `refetch` — peguei só os campos que vou usar.

E aí, no JSX:

```tsx
{isPending ? (
  <div>Carregando lições...</div>
) : isError ? (
  <div>
    <p>Não foi possível carregar as lições.</p>
    <Button onClick={() => refetch()}>Tentar de novo</Button>
  </div>
) : (
  <div className="grid gap-6">
    {lessons.map((lesson, index) => (
      <LessonCard key={lesson.id} lesson={lesson} index={index} onStart={...} />
    ))}
  </div>
)}
```

**Três caminhos. Sempre.**

1. Tô esperando? → mostro "Carregando..."
2. Deu ruim? → mostro mensagem + botão "Tentar de novo" que chama `refetch()`
3. Deu certo? → renderizo a UI real

> ❌ **Anti-pattern**: ignorar `isPending` e `isError`. Se você só faz `lessons.map(...)`, no primeiro instante `lessons` é `undefined` e quebra. Ou pior, fica em branco e o aluno acha que o app está bugado.

---

## Parte 3: Walkthrough do código real (8min)

Abra o VS Code e mostre os 4 arquivos NA ORDEM:

1. **`src/services/lessons.service.ts`** (a cozinha)
2. **`src/lib/queryKeys.ts`** (as etiquetas)
3. **`src/hooks/useLessons.ts`** (o garçom)
4. **`src/pages/HomePage.tsx`** (o cliente)

Leia em voz alta, parando em cada `//` comment e cada bloco de JSDoc.

**Ponto-chave a destacar**:

> "Notem que esses arquivos são **PEQUENOS**. O service tem 35 linhas. O hook tem 30. O queryKeys tem 22. Isso é proposital — cada camada faz UMA coisa, e quando vocês forem criar a de vocês, vai ser quase do mesmo tamanho."

**Pergunta retórica pra fixar**:

> "Se amanhã eu quiser que `getLessons` faça `fetch('/api/lessons')` em vez de ler do dummy, em quantos arquivos eu mexo?"
>
> _Pausa_
>
> "Um. Só o service. O hook não muda. O queryKeys não muda. O componente não muda. **Isso é desacoplamento**."

---

## Parte 4: Regras de ouro (3min)

### ✅ Faça

1. **Adicione entrada no `queryKeys.ts`** antes de criar o hook
2. **Service é `async` e retorna `Promise<Tipo>`** sempre
3. **Service joga `throw new Error`** quando o recurso não existe
4. **Hook devolve o objeto cru do `useQuery`** — sem mexer no shape
5. **Componente trata `isPending` → `isError` → `data`** nessa ordem
6. **Renomear `data` para algo descritivo** na desestruturação (`data: lessons`)
7. **Dar valor default** ao desestruturar (`data: lessons = []`)
8. **Botão "tentar de novo"** chama `refetch()` no estado de erro
9. **Comente o hook com JSDoc** seguindo o modelo do `useLessons`

### ❌ Não faça

1. ~~`queryKey: ['minha-coisa']`~~ direto no hook (sempre via factory)
2. ~~`return null`~~ no service (sempre `throw`)
3. ~~`useState` ou `useEffect` no service~~
4. ~~`if (loading) return <Spinner />`~~ DENTRO do hook (UI é da página)
5. ~~`lessons.map(...)`~~ sem checar `isPending`/`isError` antes
6. ~~Ignorar `isError`~~ ("ah, mas é dummy, nunca dá erro") — quando virar API, vai dar
7. ~~Importar `lessonsData` direto~~ no componente (sempre via service+hook)

---

## Parte 5: Q&A + entrega das tasks (1-3min)

> "Cada um de vocês vai pegar UMA task que segue esse mesmo padrão. Algumas são refactor (transformar import direto em hook), outras são feature nova. Mas TODAS criam:
>
> - 1 dummy (se a feature for nova)
> - 1 service
> - 1 entrada no `queryKeys.ts`
> - 1 hook
> - 1 componente que consome com `isPending` + `isError` + `data`
>
> **Se você fizer algo diferente disso, não tá no padrão.** Antes de abrir PR, abra o `useLessons.ts` ao lado do seu hook e compare lado a lado. Se a estrutura for diferente, ajuste.
>
> Dúvidas?"

---

# Parte 2 — Enunciados das 8 tasks

Cada task abaixo é uma issue pronta pra copiar/colar no GitHub.

---

## Issue T1 — `useLesson(lessonId)` no padrão ouro

**Dificuldade**: 🟢 Iniciante (~2h)
**Tipo**: Refactor

### Contexto

A `LessonPage` hoje busca a lição importando o dummy direto:

```tsx
const lesson = lessonsData.find((l) => l.id === lessonId);
```

Isso é o **anti-pattern** que estamos eliminando. Já existe um service pronto (`getLessonById`) — só falta criar o hook React Query e a página consumir.

### Objetivo

Criar `useLesson(lessonId)` espelhando o gold standard `useLessons`, e refatorar `LessonPage` para consumir.

### Tarefas

- [ ] Confirmar que `queryKeys.lessons.byId(id)` já existe em `src/lib/queryKeys.ts` (já existe — só usar)
- [ ] Criar `src/hooks/useLesson.ts`:
  - Função `useLesson(lessonId: string)`
  - Usa `useQuery` com `queryKey: queryKeys.lessons.byId(lessonId)` e `queryFn: () => getLessonById(lessonId)`
  - JSDoc seguindo o estilo de `useLessons.ts`
- [ ] Exportar de `src/hooks/index.ts`
- [ ] Refatorar `src/pages/LessonPage.tsx`:
  - Remover `import { lessonsData }`
  - Substituir `const lesson = lessonsData.find(...)` por `const { data: lesson, isPending, isError } = useLesson(lessonId ?? '')`
  - Adaptar os guards existentes (`if (!lesson)`) para também tratar `isPending` (loader simples) e `isError` (mensagem + botão voltar)

### Critérios de aceite

- [ ] Acessar `/lesson/lesson-1` funciona normalmente
- [ ] Acessar `/lesson/lesson-inexistente` mostra mensagem de erro (não crash)
- [ ] Durante 300ms de "loading simulado" aparece "Carregando lição..." na tela
- [ ] `npx tsc --noEmit` e `npm run lint` passam sem novos erros

### Referências

- Hook modelo: `src/hooks/useLessons.ts`
- Service já existe: `src/services/lessons.service.ts` → `getLessonById`
- Consumo modelo: `src/pages/HomePage.tsx` (linhas 10 e 58-80)

### Dicas

- O `useParams` devolve `lessonId: string | undefined`. Use `lessonId ?? ''` ou guard antes de chamar o hook.
- Não esqueça o estado `isPending` — sem ele, no primeiro render `lesson` é `undefined` e a tela aparece como "lição não encontrada" antes do dado chegar.

---

## Issue T2 — `useActivitiesByLesson(lessonId)` no padrão ouro

**Dificuldade**: 🟡 Intermediário (~4h)
**Tipo**: Refactor (cuidado: estado mutável)

### Contexto

O `useActivityPage` hoje importa o dummy direto:

```ts
import { activitiesData } from "@/test-utils/activities.dummy";
```

Já existe o service `getActivitiesByLessonId`. Mas o hook `useActivityPage` faz mais que só buscar — ele mantém um **estado local mutável** de progresso (status `CURRENT` / `COMPLETED` / `LOCKED`). Essa é a parte delicada.

### Objetivo

Criar `useActivitiesByLesson(lessonId)` no padrão ouro e adaptar `useActivityPage` para consumir, **sem perder** a lógica de progressão de status.

### Tarefas

- [ ] Confirmar `queryKeys.activities.byLesson(lessonId)` em `src/lib/queryKeys.ts` (já existe)
- [ ] Criar `src/hooks/useActivitiesByLesson.ts`:
  - Função `useActivitiesByLesson(lessonId: string)`
  - Retorna o objeto cru do `useQuery`
- [ ] Exportar de `src/hooks/index.ts`
- [ ] Refatorar `src/hooks/useActivityPage.ts`:
  - Remover `import { activitiesData }`
  - Usar `useActivitiesByLesson(lessonId)` para buscar as atividades base
  - Manter o estado local `activities` (com status mutável) como antes, mas inicializar a partir do `data` retornado pelo hook
  - O `useEffect` que reseta o estado quando `lessonId` muda deve agora reagir ao `data` chegando
- [ ] Refatorar `LessonPage` para propagar `isPending` e `isError` do `useActivityPage`:
  - Expor `isPending` e `isError` no retorno de `useActivityPage`
  - Renderizar loader e error state na `LessonPage` ANTES dos guards de "lição vazia"

### Critérios de aceite

- [ ] Acessar `/lesson/lesson-1` mostra "Carregando atividades..." por 300ms e depois renderiza normal
- [ ] Trocar de lição (futuro) reseta o progresso corretamente
- [ ] Completar atividade ainda funciona (status `CURRENT` → `COMPLETED`, próxima vira `CURRENT`)
- [ ] `npx tsc --noEmit` e `npm run lint` passam

### Referências

- Hook modelo: `src/hooks/useLessons.ts`
- Service já existe: `src/services/activities.service.ts` → `getActivitiesByLessonId`
- Estado mutável atual: `src/hooks/useActivityPage.ts` (linhas 19-33)

### Dicas

- **NÃO** mexa em `completeActivity` — só na parte de buscar a lista inicial.
- Cuidado com `useEffect`: ele deve resetar o estado quando `data` chegar (não quando `lessonId` muda — porque o `data` chega depois).
- Sem perder a ordenação por `order` (o service já ordena, mantenha).

---

## Issue T3 — `useUserProfile()` + `ProfileBadge` no header

**Dificuldade**: 🟢 Iniciante (~3h)
**Tipo**: Feature nova

### Contexto

Hoje o `GameHeader` mostra lives/streak/xp, mas não mostra **quem é** o aluno. Vamos adicionar um badge com avatar + nome do usuário, mockado por enquanto.

### Objetivo

Criar a stack inteira (tipo → dummy → service → queryKey → hook → componente → integração) para o perfil do usuário.

### Tarefas

- [ ] Adicionar tipo `UserProfile` em `src/types/index.ts`:
  ```ts
  export interface UserProfile {
    id: string;
    name: string;
    avatarUrl: string;
    totalXp: number;
    joinedAt: string;
  }
  ```
- [ ] Criar dummy `src/test-utils/user-profile.dummy.ts` com 1 perfil de exemplo
- [ ] Criar `src/services/user-profile.service.ts`:
  - `getCurrentUserProfile(): Promise<UserProfile>`
  - Latência simulada
  - Exportar pelo barrel `src/services/index.ts`
- [ ] Adicionar `queryKeys.userProfile.current` em `src/lib/queryKeys.ts`
- [ ] Criar `src/hooks/useUserProfile.ts` no padrão ouro
- [ ] Criar `src/components/game/ProfileBadge.tsx`:
  - Recebe `profile: UserProfile`
  - Renderiza avatar circular + nome
- [ ] Integrar no `src/components/game/GameHeader.tsx`:
  - Chamar `useUserProfile()`
  - Renderizar `<ProfileBadge>` à esquerda do `lives`
  - Enquanto `isPending`, mostrar placeholder (avatar genérico + "Carregando...")

### Critérios de aceite

- [ ] Acessar `/lesson/lesson-1` mostra o badge no header
- [ ] Durante 300ms aparece placeholder, depois o nome/avatar real
- [ ] `isError` → badge fica oculto (silenciosamente, sem quebrar header)
- [ ] `npx tsc --noEmit` e `npm run lint` passam

### Referências

- Hook modelo: `src/hooks/useLessons.ts`
- Service modelo: `src/services/lessons.service.ts`
- Componente que vai receber: `src/components/game/GameHeader.tsx`

### Dicas

- Use `https://i.pravatar.cc/64?u=ID` no `avatarUrl` para gerar avatar consistente.
- Não trate erro de forma intrusiva — se o profile não carregar, melhor esconder o badge do que mostrar erro pro usuário.

---

## Issue T4 — `useLessonProgress(lessonId)` + barra de progresso no card

**Dificuldade**: 🟢 Iniciante (~3h)
**Tipo**: Feature nova

### Contexto

Hoje o card da lição na `HomePage` mostra `totalActivities` mas não diz quantas o aluno completou. Vamos adicionar uma barra visual.

### Objetivo

Criar a stack para "progresso por lição" — um service que retorna `{ completed, total, percent }`.

### Tarefas

- [ ] Tipo `LessonProgress` em `src/types/index.ts`:
  ```ts
  export interface LessonProgress {
    lessonId: string;
    completed: number;
    total: number;
    percent: number; // 0–100
  }
  ```
- [ ] Dummy `src/test-utils/lesson-progress.dummy.ts` com progresso mockado por lição
- [ ] Service `src/services/lesson-progress.service.ts`:
  - `getLessonProgress(lessonId: string): Promise<LessonProgress>`
  - `throw` se a lição não existir
- [ ] `queryKeys.lessonProgress.byLesson(lessonId)`
- [ ] Hook `useLessonProgress.ts` no padrão ouro
- [ ] Modificar `src/pages/HomePage.tsx` (componente `LessonCard`):
  - Adicionar barra de progresso usando o hook
  - Mostrar texto "X de Y atividades concluídas"
  - Enquanto pending: barra cinza com placeholder
  - Em error: omitir a barra (não bloquear o card)

### Critérios de aceite

- [ ] Cada card da `HomePage` mostra barra de progresso
- [ ] Cada lição faz sua própria query (verifique no DevTools do React Query)
- [ ] `npx tsc --noEmit` e `npm run lint` passam

### Referências

- Hook modelo: `useLessons.ts`
- Consumo modelo: `HomePage.tsx`
- Componente `Progress` do `shadcn/ui` (`src/components/ui/progress.tsx`)

### Dicas

- O hook deve ser chamado **dentro** do `LessonCard` (não no `HomePage`), porque cada card precisa do progresso da SUA lição.
- Atenção: 10 cards = 10 queries paralelas. Tudo bem, React Query batches e cacheia.

---

## Issue T5 — `useRecentLessons(limit)` + widget "Continue de onde parou"

**Dificuldade**: 🟡 Intermediário (~4h)
**Tipo**: Feature nova

### Contexto

A `HomePage` hoje mostra TODAS as lições. Falta um destaque para "continue de onde parou" — as últimas N lições que o aluno acessou.

### Objetivo

Stack completa de "lições recentes" + carrossel acima do grid principal na `HomePage`.

### Tarefas

- [ ] Tipo `RecentLesson` em `src/types/index.ts` (Lesson + `lastVisitedAt: string`)
- [ ] Dummy `src/test-utils/recent-lessons.dummy.ts` (3-5 lições com timestamps mockados)
- [ ] Service `getRecentLessons(limit: number)` — ordena por `lastVisitedAt` desc
- [ ] `queryKeys.recentLessons.list(limit)`
- [ ] Hook `useRecentLessons(limit: number = 5)`
- [ ] Componente `src/components/home/ContinueWidget.tsx`:
  - Carrossel horizontal com cards menores
  - Mostra título da lição + tempo desde a última visita ("há 2 horas")
- [ ] Integrar acima do grid principal na `HomePage`
  - Esconder widget completamente se `data?.length === 0`

### Critérios de aceite

- [ ] Widget aparece quando há lições recentes
- [ ] Loader skeleton enquanto carrega
- [ ] Em erro, widget é omitido sem quebrar resto da página
- [ ] `npx tsc --noEmit` e `npm run lint` passam

### Referências

- Modelo de hook com parâmetro: pegue ideia em `useActivitiesByLesson` (que será criado pelo fellow da T2 — coordene se necessário).
- Use `date-fns` ou `formatRelative` para "há 2 horas".

---

## Issue T6 — `useAchievements()` + drawer de conquistas

**Dificuldade**: 🟡 Intermediário (~4h)
**Tipo**: Feature nova

### Contexto

Conquistas são um mecanismo clássico de gamificação. Vamos mockar as conquistas do aluno e mostrar num drawer.

### Objetivo

Stack completa + drawer acessível por botão no `GameHeader`.

### Tarefas

- [ ] Tipo `Achievement`:
  ```ts
  export interface Achievement {
    id: string;
    title: string;
    description: string;
    iconEmoji: string;
    unlockedAt: string | null; // null = ainda não conquistada
  }
  ```
- [ ] Dummy com ~8 conquistas (algumas unlocked, algumas null)
- [ ] Service `getMyAchievements(): Promise<Achievement[]>`
- [ ] `queryKeys.achievements.mine`
- [ ] Hook `useAchievements`
- [ ] Componente `src/components/game/AchievementsDrawer.tsx`:
  - Usa `Sheet` do `shadcn/ui`
  - Lista as conquistas; as não conquistadas ficam acinzentadas
- [ ] Botão troféu no `GameHeader` abre o drawer

### Critérios de aceite

- [ ] Botão no header abre/fecha o drawer
- [ ] Conquistas unlocked aparecem coloridas, locked acinzentadas
- [ ] Contagem "X de Y desbloqueadas" no topo do drawer
- [ ] `npx tsc --noEmit` e `npm run lint` passam

### Referências

- Hook modelo: `useLessons.ts`
- Sheet do shadcn: `src/components/ui/sheet.tsx` (já instalado)

---

## Issue T7 — `useDailyChallenge()` + banner na HomePage

**Dificuldade**: 🟡 Intermediário (~3h)
**Tipo**: Feature nova

### Contexto

Vamos criar um "desafio do dia" — uma atividade destacada que muda diariamente, com CTA chamativo.

### Objetivo

Service que retorna a atividade do dia + banner na HomePage.

### Tarefas

- [ ] Tipo `DailyChallenge { date: string, activity: Activity, xpBonus: number }`
- [ ] Service `getDailyChallenge(): Promise<DailyChallenge>`:
  - Pega uma atividade do `activitiesData` baseado na data atual (módulo do dia do ano)
  - Bônus de XP fixo (ex: 50)
- [ ] `queryKeys.dailyChallenge.today`
- [ ] Hook `useDailyChallenge`
- [ ] Componente `src/components/home/DailyChallengeBanner.tsx`:
  - Banner amarelo/laranja chamativo no topo
  - Mostra título da atividade + bônus de XP + botão "Aceitar desafio"
- [ ] Integrar acima do hero da `HomePage`

### Critérios de aceite

- [ ] Banner aparece no topo da HomePage
- [ ] Botão "Aceitar desafio" navega para `/lesson/{lessonId}` (ou usar uma rota fictícia `/challenge`)
- [ ] Em error → banner some
- [ ] `npx tsc --noEmit` e `npm run lint` passam

### Dicas

- Para "atividade do dia", use `new Date().getDate()` ou um hash simples — não precisa ser sofisticado.
- Cuidado com o cache: `queryKey: ['daily-challenge', { date: 'YYYY-MM-DD' }]` para não cachear o desafio de ontem.

---

## Issue T8 — `useLeaderboard(limit)` + página `/leaderboard`

**Dificuldade**: 🟡 Intermediário (~4h)
**Tipo**: Feature nova (inclui rota nova)

### Contexto

Toda plataforma gamificada tem ranking. Hoje não temos. Vamos criar uma página simples mostrando o top N.

### Objetivo

Stack completa + nova rota acessível.

### Tarefas

- [ ] Tipo `LeaderboardEntry`:
  ```ts
  export interface LeaderboardEntry {
    rank: number;
    userId: string;
    name: string;
    avatarUrl: string;
    totalXp: number;
  }
  ```
- [ ] Dummy com 20 entries
- [ ] Service `getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]>` — já ordena por `totalXp` desc
- [ ] `queryKeys.leaderboard.list(limit)`
- [ ] Hook `useLeaderboard`
- [ ] Página `src/pages/LeaderboardPage.tsx`:
  - Tabela com posição/avatar/nome/XP
  - Top 3 destacados (cores: ouro/prata/bronze)
  - Loading skeleton
  - Error state com refetch
- [ ] Adicionar rota em `src/App.tsx`: `/leaderboard`
- [ ] Adicionar link no header da `HomePage` para "Ranking"

### Critérios de aceite

- [ ] Acessar `/leaderboard` renderiza a tabela
- [ ] Loading skeleton enquanto carrega
- [ ] Botão "Tentar de novo" em caso de erro
- [ ] Link no header da HomePage funciona
- [ ] `npx tsc --noEmit` e `npm run lint` passam

### Referências

- Estrutura de página: `src/pages/HomePage.tsx`
- Rota: `src/App.tsx`
- Tabela: pode usar `Table` do shadcn/ui ou estilizar div com Tailwind

---

# Sumário de distribuição

| Aluno   | Task                         | Dificuldade      | Tipo               |
| ------- | ---------------------------- | ---------------- | ------------------ |
| Aluno 1 | T1 — `useLesson(id)`         | 🟢 Iniciante     | Refactor           |
| Aluno 2 | T2 — `useActivitiesByLesson` | 🟡 Intermediário | Refactor (cuidado) |
| Aluno 3 | T3 — `useUserProfile`        | 🟢 Iniciante     | Feature            |
| Aluno 4 | T4 — `useLessonProgress`     | 🟢 Iniciante     | Feature            |
| Aluno 5 | T5 — `useRecentLessons`      | 🟡 Intermediário | Feature            |
| Aluno 6 | T6 — `useAchievements`       | 🟡 Intermediário | Feature            |
| Aluno 7 | T7 — `useDailyChallenge`     | 🟡 Intermediário | Feature            |
| Aluno 8 | T8 — `useLeaderboard` + rota | 🟡 Intermediário | Feature            |

**Sugestão de distribuição**: dê T1, T3 e T4 para os 3 fellows mais iniciantes (não bloqueiam ninguém e são bem similares ao gold standard). Reserve T2 para o mais avançado (envolve mexer no `useActivityPage` que é o coração da página).

---

# Apêndice — Checklist do mentor antes de distribuir

- [ ] Branch principal (`main`) tem o Bloco 1 mergeado (com `useLessons` + `HomePage` refatorada como referência)
- [ ] Cada fellow tem acesso ao repositório e sabe abrir PR
- [ ] Cada fellow tem `npx tsc --noEmit` + `npm run lint` rodando localmente
- [ ] Sessão de 30min agendada antes da distribuição
- [ ] `CLAUDE.md` lido pelos fellows (especialmente a seção "Padrões ouro")
- [ ] Issues criadas no GitHub (1 por task) com label `bloco-3` e assignee
- [ ] Canal de dúvidas combinado (Slack / Discord / WhatsApp)
