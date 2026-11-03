# O que esperamos que você saiba até a reunião

> Material de preparação para fellows antes de iniciar as tasks de **Camada de Dados** no dfl-iterate.
>
> Objetivo: você não precisa implementar código ainda — precisa **entender o fluxo** e o **porquê** de cada decisão do padrão do projeto.

---

## Visão geral (leia primeiro)

No dfl-iterate, dados externos (lições, atividades, perfil, etc.) seguem este fluxo:

```txt
Componente/Página
  → Hook com React Query (useQuery)
      → Service (função async)
          → Dummy hoje / API amanhã
```

As cinco perguntas abaixo explicam **peças desse fluxo**. Se você conseguir explicar cada uma com suas palavras, está pronto para a reunião das tasks.

---

## 1) Diferença entre estado de UI (`useState`) e estado de dados (React Query)

### O que é cada um

| | **Estado de UI** | **Estado de dados (server state)** |
|---|---|---|
| **Onde vive** | Dentro do componente, na sessão do usuário | “Lá fora”: API, dummy, banco |
| **Quem gerencia** | Você, com `useState` / `useReducer` | React Query, com cache e sincronização |
| **Exemplos** | Modal aberto, aba ativa, texto do input, drawer visível | Lista de lições, detalhe de uma lição, ranking |
| **Some quando?** | Quando o componente desmonta (salvo que você persista) | Pode ficar em cache e ser reutilizado |

### Analogia simples

- **UI state** = o que está na **mesa do usuário agora** (formulário preenchido, menu aberto).
- **Server state** = o que está no **armazém/servidor** (catálogo de produtos, pedidos). Você **busca**, **cacheia** e **atualiza** quando precisa.

### Por que não misturar os dois

Se você guardar lista de lições só com `useState` + `useEffect`:

```tsx
// Padrão manual (evitamos no projeto para dados remotos)
const [lessons, setLessons] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  getLessons().then(setLessons).finally(() => setLoading(false));
}, []);
```

Funciona, mas em **cada tela** você repete loading, erro, retry e cache. React Query centraliza isso.

Com React Query:

```tsx
const { data: lessons = [], isPending, isError, refetch } = useLessons();
```

O hook `useLessons` encapsula a busca; a página só decide **o que mostrar**.

### Regra prática do projeto

- **Modal aberto?** Input digitado? Aba selecionada? → `useState`.
- **Lista veio de service/dummy/API?** → hook com `useQuery`.

### Exemplo no dfl-iterate

Na `HomePage`:

- **React Query**: `useLessons()` → dados das lições.
- **UI state** (em outros lugares): abrir drawer de histórico, modal de resultado, índice da activity atual — coisas da **experiência da tela**, não do “catálogo remoto”.

---

## 2) O que são `queryKey` e `queryFn`

São os **dois parâmetros principais** do `useQuery`. Juntos, dizem ao React Query: *“qual busca é essa?”* e *“como executá-la?”*.

### `queryKey` — identificador da consulta no cache

É um **array** que nomeia a query de forma única.

Exemplos no projeto (`src/lib/queryKeys.ts`):

```ts
['lessons']                           // todas as lições
['lessons', 'lesson-1']               // uma lição específica
['activities', { lessonId: 'lesson-1' }]  // atividades de uma lição
```

**Para que serve:**

1. **Cache** — React Query guarda o resultado indexado por essa chave.
2. **Reutilização** — Dois componentes com a mesma `queryKey` compartilham dados (sem buscar duas vezes desnecessariamente).
3. **Invalidação** — Depois de uma mutação, você pode “marcar obsoleto” tudo que começa com `['lessons']`.

**Regra do dfl-iterate:** não escrever `queryKey: ['lessons']` solto no hook. Usar o factory `queryKeys.lessons.all` para evitar typo e manter padrão único.

### `queryFn` — função que realmente busca os dados

É uma função **assíncrona** que retorna uma `Promise` com os dados (ou lança erro).

No projeto, quase sempre é uma função do **service**:

```ts
export function useLessons() {
  return useQuery({
    queryKey: queryKeys.lessons.all,
    queryFn: getLessons,  // ← service
  });
}
```

Com parâmetro:

```ts
export function useLesson(lessonId: string) {
  return useQuery({
    queryKey: queryKeys.lessons.byId(lessonId),
    queryFn: () => getLessonById(lessonId),
  });
}
```

### Relação entre os dois

| | `queryKey` | `queryFn` |
|---|---|---|
| **Pergunta que responde** | “Qual consulta é essa?” | “Como busco os dados?” |
| **Tipo** | Array (identificador) | Função async |
| **Muda quando** | Recurso ou filtros mudam (`id`, `lessonId`) | Implementação da busca (dummy → fetch) |

**Importante:** se você mudar a `queryKey` sem querer (ex.: typo `'lessonz'`), o React Query trata como **outra query** — cache duplicado, dados “fantasma”, bugs difíceis.

---

## 3) Por que o service é `async` e sem React

### O que é o service neste projeto

Arquivo em `src/services/*.service.ts` com funções como:

```ts
export async function getLessons(): Promise<Lesson[]> {
  await simulateNetworkDelay();
  return lessonsData;
}
```

É a **camada de acesso a dados**: hoje lê dummy; amanhã pode chamar `fetch('/api/lessons')`.

### Por que `async` (sempre retorna `Promise`)

1. **API real é assíncrona** — rede tem latência. Mesmo lendo dummy hoje, simulamos delay (`setTimeout`) para a UI se comportar como produção.
2. **Contrato estável** — o hook `useQuery` espera uma `queryFn` que retorna `Promise`. Se amanhã trocar dummy por HTTP, o hook **não precisa mudar**.
3. **Consistência no time** — todo service segue o mesmo formato; review e onboarding ficam previsíveis.

### Por que “sem React”

O service **não deve** conter:

- `useState`, `useEffect`, `useCallback`
- JSX ou componentes
- lógica de “mostrar spinner” ou “mensagem de erro na tela”

**Motivos:**

| Motivo | Explicação |
|---|---|
| **Testabilidade** | Função pura de dados roda em Node/teste sem montar React. |
| **Reutilização** | Mesmo service pode ser usado por hook, script ou (futuro) SSR. |
| **Separação clara** | Service = *o que* buscar. Componente = *como* mostrar. |
| **Migração** | Trocar fonte de dados mexe **só** no service. |

### Onde fica cada responsabilidade

```txt
Service     → busca/transforma dados, lança erro se falhar
Hook        → conecta queryKey + queryFn (useQuery)
Componente  → isPending, isError, renderização
```

Se você colocar `useState` no service, quebra essa separação e o código fica difícil de manter.

---

## 4) Por que erro de “não encontrado” usa `throw new Error`

### Cenário

Buscar lição por id que não existe:

```ts
export async function getLessonById(id: string): Promise<Lesson> {
  const lesson = lessonsData.find((l) => l.id === id);
  if (!lesson) {
    throw new Error(`Lesson not found: ${id}`);
  }
  return lesson;
}
```

### O que acontece com `throw`

1. A `queryFn` **rejeita** a Promise.
2. React Query marca a query como **`isError: true`**.
3. A UI entra no fluxo de erro: mensagem + “Tentar de novo” (`refetch`).

Isso é **honesto**: “a operação falhou”.

### O que acontece se retornar `null` (anti-pattern)

```ts
if (!lesson) return null;  // ❌ evitar para “não encontrado”
```

Para o React Query, a busca **deu certo** — só que o dado é `null`.

Consequências:

- `isError` fica `false` → usuário não vê tela de erro.
- Código downstream faz `lesson.title` → **crash** ou tela em branco confusa.
- Você mistura “sucesso vazio” com “falha semântica”.

### Quando `null` ou `[]` faz sentido

- **Lista vazia** `[]` — busca ok, não há itens (empty state, não erro).
- **`null` opcional** — raro em services; preferir tipos explícitos ou `throw` para recurso obrigatório.

### Regra do projeto

| Situação | O que fazer |
|---|---|
| Recurso **deveria existir** e não existe | `throw new Error(...)` |
| Lista legitamente vazia | retornar `[]` |
| Campo opcional dentro de objeto válido | modelar no tipo (`user?: User`) |

---

## 5) Por que a UI trata `isPending` e `isError`

### O ciclo de vida de uma query

Quando o componente monta e chama `useLessons()`:

1. **Primeiro render** — ainda não há dados → `data` é `undefined`, `isPending` tende a ser `true`.
2. **Sucesso** — `queryFn` resolve → `data` preenchido, `isPending` false.
3. **Falha** — `queryFn` lança → `isError` true, `data` pode continuar undefined ou stale.

Se você **ignorar** `isPending` e fazer `lessons.map(...)` direto, no primeiro frame `lessons` é `undefined` → erro ou flash estranho.

### `isPending` — primeira carga

Significa: “ainda estou buscando pela primeira vez (ou não tenho dado em cache para mostrar)”.

**O que mostrar:**

```tsx
if (isPending) {
  return <p>Carregando lições...</p>;
}
```

Isso evita:

- tela em branco;
- sensação de bug;
- acesso a `data` antes de existir.

> No TanStack Query v5, usamos `isPending` para esse estado inicial. (Versões antigas usavam muito `isLoading`; no projeto seguimos `isPending`.)

### `isError` — a busca falhou

Significa: a `queryFn` rejeitou (ex.: `throw new Error` no service, rede offline, 404 tratado com throw).

**O que mostrar:**

```tsx
if (isError) {
  return (
    <>
      <p>Não foi possível carregar as lições.</p>
      <button onClick={() => refetch()}>Tentar de novo</button>
    </>
  );
}
```

**Por que importa:**

- Usuário entende que **não é “não tem nada”**, e sim **falha recuperável**.
- `refetch()` dispara nova tentativa sem recarregar a página inteira.

### Ordem recomendada na UI

```tsx
if (isPending) return <Loading />;
if (isError) return <Error onRetry={refetch} />;
if (!data || (Array.isArray(data) && data.length === 0)) return <Empty />;
return <Success data={data} />;
```

### Exemplo real: `HomePage`

```tsx
const { data: lessons = [], isPending, isError, refetch } = useLessons();

{isPending ? (
  <div>Carregando lições...</div>
) : isError ? (
  <div>
    <p>Não foi possível carregar as lições.</p>
    <Button onClick={() => refetch()}>Tentar de novo</Button>
  </div>
) : (
  lessons.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)
)}
```

Default `data: lessons = []` ajuda no ramo de sucesso, mas **não substitui** tratar `isPending` e `isError`.

### O hook não renderiza UI — a página sim

`useLessons` devolve estados crus. Quem decide layout de loading/erro é o **componente**. Isso mantém hooks reutilizáveis e UI consistente por tela.

---

## Checklist: “estou pronto para a reunião?”

Tente responder sem olhar o texto:

1. Dê um exemplo de **UI state** e um de **server state** no contexto de uma lição.
2. Explique a diferença entre **`queryKey`** e **`queryFn`**.
3. Por que **`getLessons`** não pode usar `useState`?
4. Por que **`throw new Error`** é melhor que `return null` quando a lição não existe?
5. O que acontece na tela se você **não** tratar `isPending`?

Se conseguir responder essas cinco, você está alinhado com o que vamos exigir nas tasks.

---

## Próximo passo (depois da reunião)

Na reunião das tasks, você vai **aplicar** esse conhecimento criando:

- service → query key → hook `useXxx` → consumo na UI

Enquanto isso, use também:

- **React Query - Fundamentos e Guia** (teoria ampla)
- **React Query no dfl-iterate - Introdução prática** (aplicação no código)
- **FAQ e Troubleshooting - React Query (Batch)** (quando travar)

Bons estudos!
