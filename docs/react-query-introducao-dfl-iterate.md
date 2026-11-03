# React Query no dfl-iterate — Introdução prática (apostila)

> **Para quem é este artigo:** fellows que já sabem React básico (componentes, hooks, `useState`) e agora precisam buscar dados de forma padronizada no projeto.
>
> **Objetivo:** entender o *porquê* do React Query, suas vantagens e *como usar na prática* seguindo o padrão ouro do dfl-iterate.

---

## 1. O problema que o React Query resolve

Imagine que você precisa mostrar a lista de lições na `HomePage`.

Sem React Query, o fluxo manual costuma ser assim:

```tsx
const [lessons, setLessons] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);

useEffect(() => {
  setLoading(true);
  getLessons()
    .then(setLessons)
    .catch(() => setError(true))
    .finally(() => setLoading(false));
}, []);
```

Funciona, mas em cada tela você repete:
- estado de loading;
- estado de erro;
- lógica de busca;
- cache (ou falta dele);
- “tentar de novo”.

**React Query centraliza isso.** Você declara *o que* buscar e *com qual chave*, e a biblioteca cuida do resto.

---

## 2. O que é React Query (em uma frase)

**React Query** (`@tanstack/react-query`) é uma biblioteca para **buscar, cachear e sincronizar dados que vêm de fora do React** (API, dummy, banco).

Ela não substitui `useState` para coisas da interface (modal aberto, texto do input). Ela cuida do **server state** — dados que “moram” fora do componente.

| Tipo de estado | Exemplo | Quem cuida |
|---|---|---|
| **UI state** | modal aberto, aba ativa | `useState` |
| **Server state** | lista de lições, perfil do usuário | **React Query** (`useQuery`) |

---

## 3. Por que usamos no dfl-iterate

No projeto adotamos o fluxo:

```txt
Componente/Página
  → Hook de query (useQuery)
      → Service (função async)
          → Dummy hoje / API amanhã
```

**Vantagens para o time:**

1. **Um lugar só para buscar dados** — o service. Amanhã trocamos dummy por `fetch` sem reescrever todas as páginas.
2. **Loading e erro padronizados** — `isPending`, `isError`, `refetch` em todo lugar.
3. **Cache automático** — voltar para a Home não precisa buscar de novo (a menos que você invalide).
4. **Menos código repetido** — não montamos `useEffect` + 3 `useState` em cada tela.
5. **Review mais fácil** — todo mundo segue o mesmo molde (`useLessons`).

---

## 4. Conceitos essenciais (vocabulário)

### `useQuery`

Hook principal para **ler** dados. Você passa:

- **`queryKey`** — identificador único daquela busca (como um “nome” no cache).
- **`queryFn`** — função que **realmente** busca os dados (geralmente um service).

### `queryKey`

Array que identifica a query. Exemplos no projeto:

```ts
['lessons']                    // todas as lições
['lessons', 'lesson-1']        // uma lição específica
['activities', { lessonId: 'lesson-1' }]  // atividades de uma lição
```

No dfl-iterate, **nunca** escrevemos a chave solta no hook. Usamos o factory em `queryKeys.ts`.

### `queryFn`

Função assíncrona que retorna os dados. No projeto, é sempre uma função do **service**:

```ts
queryFn: getLessons
// ou, com parâmetro:
queryFn: () => getLessonById(lessonId)
```

### Estados que você mais usa na UI

| Campo | Significado | O que mostrar na tela |
|---|---|---|
| `isPending` | Primeira carga em andamento | “Carregando…” |
| `isError` | A busca falhou (`throw` no service) | Mensagem + “Tentar de novo” |
| `data` | Dados retornados com sucesso | Conteúdo normal |
| `refetch()` | Função para buscar de novo | Botão de retry |
| `isFetching` | Qualquer busca em andamento (inclui refetch) | Loader sutil (opcional) |

> **Atenção:** na versão 5 do TanStack Query, o estado inicial de carregamento chama-se `isPending` (antes muita gente usava `isLoading`). No projeto usamos `isPending`.

---

## 5. O padrão ouro do projeto (exemplo real)

### Camada 1 — Service (cozinha)

Arquivo: `src/services/lessons.service.ts`

```ts
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

Regras:
- **`async`** sempre.
- **Sem React** (sem `useState`, sem JSX).
- Recurso inexistente → **`throw new Error`**, não `return null`.

### Camada 2 — Query keys (etiqueta)

Arquivo: `src/lib/queryKeys.ts`

```ts
export const queryKeys = {
  lessons: {
    all: ['lessons'] as const,
    byId: (id: string) => ['lessons', id] as const,
  },
} as const;
```

### Camada 3 — Hook de query (garçom)

Arquivo: `src/hooks/useLessons.ts`

```ts
export function useLessons() {
  return useQuery({
    queryKey: queryKeys.lessons.all,
    queryFn: getLessons,
  });
}
```

O hook **não** renderiza UI. Só devolve o objeto do React Query.

### Camada 4 — Componente (cliente)

Arquivo: `src/pages/HomePage.tsx`

```tsx
const { data: lessons = [], isPending, isError, refetch } = useLessons();

// Na UI:
{isPending ? (
  <p>Carregando lições...</p>
) : isError ? (
  <>
    <p>Não foi possível carregar as lições.</p>
    <Button onClick={() => refetch()}>Tentar de novo</Button>
  </>
) : (
  lessons.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)
)}
```

**Ordem obrigatória na UI:** `isPending` → `isError` → conteúdo com `data`.

---

## 6. Como criar seu próprio hook (receita rápida)

Para uma task nova (ex.: buscar perfil do usuário):

1. **Service** — `getCurrentUserProfile()` em `src/services/...`
2. **Query key** — `queryKeys.userProfile.current` em `src/lib/queryKeys.ts`
3. **Hook** — `useUserProfile()` com `useQuery`
4. **Componente** — trata `isPending`, `isError`, `data`

Template do hook:

```ts
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getCurrentUserProfile } from '@/services';

export function useUserProfile() {
  return useQuery({
    queryKey: queryKeys.userProfile.current,
    queryFn: getCurrentUserProfile,
  });
}
```

Template com parâmetro:

```ts
export function useLesson(lessonId: string) {
  return useQuery({
    queryKey: queryKeys.lessons.byId(lessonId),
    queryFn: () => getLessonById(lessonId),
  });
}
```

> Só chame o hook quando `lessonId` for válido, ou passe `enabled: Boolean(lessonId)` (conceito avançado; pergunte ao mentor se precisar).

---

## 7. Por que `throw` no service e não `return null`?

```ts
// ❌ Evitar
if (!lesson) return null;

// ✅ Padrão do projeto
if (!lesson) throw new Error(`Lesson not found: ${id}`);
```

Quando o service faz `throw`, o React Query marca `isError: true`. A UI entra no fluxo de erro de forma honesta.

Se você retornar `null`, o React Query acha que deu certo — e aí `lesson.title` quebra ou a tela fica estranha.

---

## 8. Diferença: hook de lógica vs hook de query

No dfl-iterate existem **dois tipos** de hook. Não misture as responsabilidades.

| | Hook de **lógica** (activity) | Hook de **query** (dados) |
|---|---|---|
| Exemplo | `useFillTheBlanks` | `useLessons` |
| Recebe | `activity`, `callbacks` | `queryKey`, `queryFn` |
| Faz | regra da atividade, `onSubmit` | busca dados, cache |
| UI | componente activity | página/lista |

Fluxo completo que vocês viram na reunião:

```txt
Componente visual (activity)
  → Hook com lógica (useFillTheBlanks, etc.)

Componente/Página (HomePage, LessonPage)
  → Hook com React Query (useLessons, useLesson, ...)
      → Service
          → Dummy / API
```

---

## 9. Erros comuns (e como evitar)

### “Minha tela fica em branco”

Provável causa: você faz `data.map(...)` sem tratar `isPending`. No primeiro render, `data` é `undefined`.

**Solução:** sempre checar `isPending` antes.

### “Erro nunca aparece”

Provável causa: service retorna `null` em vez de `throw`.

**Solução:** usar `throw new Error(...)`.

### “Criei outra query igual e não atualiza”

Provável causa: `queryKey` diferente (typo ou string solta).

**Solução:** usar sempre `queryKeys.ts`.

### “Coloquei useQuery dentro de um if”

```ts
// ❌ Quebra regras dos hooks
if (lessonId) {
  const q = useLesson(lessonId);
}
```

**Solução:** chamar o hook no topo do componente; use `enabled` ou guard na UI.

### “Meu hook renderiza spinner”

Hook de query **não** deve ter JSX. Spinner fica no **componente**.

---

## 10. Cache em linguagem simples

Quando `useLessons()` roda pela primeira vez, o React Query:
1. executa `getLessons`;
2. guarda o resultado na memória com a chave `['lessons']`.

Se outro componente (ou você voltar para a Home) pedir a mesma chave, ele pode **reutilizar** o cache — sem nova busca imediata.

Isso explica por que às vezes os dados “aparecem rápido” na segunda vez.

> Invalidar cache (`invalidateQueries`) é tema para depois; nas tasks atuais basta saber que a `queryKey` identifica o que está guardado.

---

## 11. Checklist antes de abrir PR

- [ ] Service `async`, sem React, com `throw` em erro
- [ ] Entrada em `queryKeys.ts`
- [ ] Hook `useXxx` só com `useQuery` + export no barrel
- [ ] Componente com `isPending` → `isError` → `data`
- [ ] Sem import de dummy direto na página
- [ ] `npx tsc --noEmit` e `npm run lint` ok

Compare seu hook lado a lado com `useLessons.ts`. Se a estrutura for parecida, você está no caminho certo.

---

## 12. Onde olhar no código (referências)

| O quê | Arquivo |
|---|---|
| Consumo na UI | `src/pages/HomePage.tsx` |
| Hook modelo | `src/hooks/useLessons.ts` |
| Query keys | `src/lib/queryKeys.ts` |
| Service modelo | `src/services/lessons.service.ts` |
| Provider (app já configurado) | `src/App.tsx` (QueryClientProvider) |

---

## 13. Resumo final

- React Query cuida de **dados externos** (não de estado de UI local).
- No projeto: **componente → hook `useQuery` → service → dummy/API**.
- **`queryKey`** identifica a busca no cache; use o factory central.
- **`queryFn`** é o service.
- UI trata **`isPending`**, **`isError`**, **`data`** e **`refetch`**.
- Service com erro usa **`throw`**, não `null`.
- Copie o molde de **`useLessons`** para cada task nova.

Com isso você tem base suficiente para executar as tasks do batch e evoluir para projetos internos com o mesmo padrão do time.
