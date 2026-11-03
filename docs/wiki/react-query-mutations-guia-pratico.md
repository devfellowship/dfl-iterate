# React Query — Mutations na prática (adicionar, editar e excluir)

> **Para quem é:** fellows que já entregaram as tasks **T1–T11** (leitura com `useQuery` / `useGet*`) e vão implementar o próximo batch, onde a tela **altera dados**.
>
> **Pré-requisito:** [React Query — Fundamentos e Guia Prático](./react-query-fundamentos-e-guia-pratico.md).
>
> **Objetivo:** entender `useMutation` e saber implementar **criar**, **editar** e **excluir** seguindo o padrão do dfl-iterate.

---

## Índice

1. [Query vs Mutation](#1-query-vs-mutation)
2. [Anatomia do `useMutation`](#2-anatomia-do-usemutation)
3. [O fluxo em camadas (o que muda em relação às T1–T11)](#3-o-fluxo-em-camadas-o-que-muda-em-relação-às-t1t11)
4. [Dummy mutável: onde o dado "fica salvo" hoje](#4-dummy-mutável-onde-o-dado-fica-salvo-hoje)
5. [CREATE — adicionar um item](#5-create--adicionar-um-item)
6. [UPDATE — editar um item](#6-update--editar-um-item)
7. [DELETE — excluir um item](#7-delete--excluir-um-item)
8. [TOGGLE — marcar/desmarcar (o caso mais comum nas tasks)](#8-toggle--marcardesmarcar-o-caso-mais-comum-nas-tasks)
9. [`invalidateQueries`: o coração da atualização automática](#9-invalidatequeries-o-coração-da-atualização-automática)
10. [`mutate` vs `mutateAsync`](#10-mutate-vs-mutateasync)
11. [Estados na UI: loading, erro e reset](#11-estados-na-ui-loading-erro-e-reset)
12. [Callbacks: `onSuccess`, `onError`, `onSettled`](#12-callbacks-onsuccess-onerror-onsettled)
13. [Exemplos reais no dfl-iterate](#13-exemplos-reais-no-dfl-iterate)
14. [Erros comuns](#14-erros-comuns)
15. [Checklist antes da PR](#15-checklist-antes-da-pr)
16. [Exercícios para antes da aula](#16-exercícios-para-antes-da-aula)
17. [Próximo nível](#17-próximo-nível)

---

## 1) Query vs Mutation

| | `useQuery` | `useMutation` |
|---|---|---|
| Para quê | **Ler** dados | **Escrever** dados |
| HTTP típico | `GET` | `POST`, `PATCH`, `PUT`, `DELETE` |
| Quando roda | Automaticamente ao montar | Só quando você chama `mutate()` |
| Precisa de `queryKey`? | Sim (identidade no cache) | Não (não é cacheada) |
| Resultado | `data`, `isPending`, `isError`, `refetch` | `mutate`, `isPending`, `isError`, `reset` |

Analogia:

- **Query** = você **consulta** o extrato do banco. Acontece sozinho quando abre a tela.
- **Mutation** = você **faz uma transferência**. Só acontece quando você aperta o botão.

Detalhe importante: depois da transferência, o extrato está **desatualizado**. Quem avisa o extrato para atualizar é o `invalidateQueries` (seção 9).

---

## 2) Anatomia do `useMutation`

```ts
const mutation = useMutation({
  mutationFn: enviarParaOServidor, // função async — obrigatória
  onSuccess: () => { /* deu certo */ },
  onError: () => { /* deu erro */ },
});
```

O que você recebe de volta:

| Propriedade | O que é |
|---|---|
| `mutate(variables)` | Dispara a mutação (não retorna Promise) |
| `mutateAsync(variables)` | Dispara e retorna Promise (dá para `await`) |
| `isPending` | `true` enquanto está enviando |
| `isError` / `error` | Falhou |
| `isSuccess` | Deu certo |
| `data` | O que o `mutationFn` retornou |
| `reset()` | Limpa `isError`/`isSuccess` do estado da mutation |

Regra do projeto: **o hook não trata UI**. Ele devolve esse objeto e quem decide o que mostrar é o slot/página.

---

## 3) O fluxo em camadas (o que muda em relação às T1–T11)

Na leitura você aprendeu:

```txt
type → dummy → service → queryKey → useGet* → componente/slot
```

Na escrita o caminho é o mesmo, com **duas peças novas** no fim:

```txt
type → dummy MUTÁVEL → service (write) → useMutation → invalidateQueries
                                                              ↓
                                                  useGet* refaz a busca
                                                              ↓
                                                       UI atualiza sozinha
```

Diagrama do ciclo completo:

```txt
[1] Usuário clica no botão
        ↓
[2] Slot chama mutate()
        ↓
[3] Hook de mutation chama o service
        ↓
[4] Service altera o dado (dummy hoje, API amanhã)
        ↓
[5] onSuccess → invalidateQueries(queryKeys.recurso.*)
        ↓
[6] React Query marca aquele cache como "velho"
        ↓
[7] useGet* refaz a busca automaticamente
        ↓
[8] Componente recebe data novo e re-renderiza
```

Você **não** chama `refetch()` na mão. Você invalida, e o React Query cuida do resto.

---

## 4) Dummy mutável: onde o dado "fica salvo" hoje

Nas T1–T11 o dummy era só leitura:

```ts
// só leitura — suficiente para useQuery
export const announcementsData: Announcement[] = [ /* ... */ ];
```

Para escrever, o dummy precisa **guardar o estado alterado**. Em módulos ES (`import`/`export`) você **não pode reatribuir um valor importado**, então exportamos funções de acesso:

```ts
// src/test-utils/announcements.dummy.ts
import type { Announcement } from '@/types';

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Manutenção programada',
    body: 'Domingo, 02h–04h.',
    severity: 'warning',
    publishedAt: '2026-05-20T10:00:00.000Z',
    expiresAt: null,
  },
];

let announcementsData: Announcement[] = [...INITIAL_ANNOUNCEMENTS];

export function getAnnouncementsData(): Announcement[] {
  return [...announcementsData];
}

export function setAnnouncementsData(next: Announcement[]): void {
  announcementsData = [...next];
}

export function resetAnnouncementsData(): void {
  announcementsData = [...INITIAL_ANNOUNCEMENTS];
}
```

Três detalhes que valem entender:

1. **`let` + cópia inicial** — o `let` permite trocar o valor; a cópia evita mutar a constante original.
2. **Getter devolve cópia** (`[...array]`) — ninguém de fora consegue alterar o dummy "por acidente".
3. **Reload zera** — o estado vive na memória do navegador. Recarregar a página volta ao inicial. Isso é esperado neste estágio (ainda não temos backend).

---

## 5) CREATE — adicionar um item

### 5.1 Service

```ts
// src/services/announcements.service.ts
import {
  getAnnouncementsData,
  setAnnouncementsData,
} from '@/test-utils/announcements.dummy';
import type { Announcement } from '@/types';

const SIMULATED_LATENCY_MS = 300;

const simulateNetworkDelay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

export async function getAnnouncements(): Promise<Announcement[]> {
  await simulateNetworkDelay();
  return getAnnouncementsData();
}

/** O que o formulário envia — sem `id` nem `publishedAt` (quem gera é a "API"). */
export interface CreateAnnouncementInput {
  title: string;
  body: string;
  severity: Announcement['severity'];
}

export async function createAnnouncement(
  input: CreateAnnouncementInput,
): Promise<Announcement> {
  await simulateNetworkDelay();

  if (!input.title.trim()) {
    throw new Error('Título do aviso é obrigatório');
  }

  const created: Announcement = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    body: input.body.trim(),
    severity: input.severity,
    publishedAt: new Date().toISOString(),
    expiresAt: null,
  };

  setAnnouncementsData([created, ...getAnnouncementsData()]);
  return created;
}
```

Observe:

- Validação de negócio mora aqui, com `throw new Error(...)` — o React Query transforma isso em `isError`.
- O service **cria** o `id` e o `publishedAt`, porque amanhã é o backend que fará isso.
- Um tipo de **input** separado do tipo da entidade evita pedir campos que o usuário não digita.

### 5.2 Hook

```ts
// src/hooks/useCreateAnnouncement.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAnnouncement } from '@/services';
import { queryKeys } from '@/lib/queryKeys';

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.announcements.all,
      });
    },
  });
}
```

### 5.3 Uso no slot

```tsx
const { data: announcements = [], isPending, isError, refetch } =
  useGetAnnouncements();

const {
  mutate: createAnnouncementMutate,
  isPending: isCreating,
  isError: isCreateError,
  reset: resetCreate,
} = useCreateAnnouncement();

function handleSubmit(title: string, body: string) {
  resetCreate();
  createAnnouncementMutate({ title, body, severity: 'info' });
}
```

Na UI, o botão de enviar usa `disabled={isCreating}` e o erro aparece perto do formulário.

---

## 6) UPDATE — editar um item

A diferença principal: você precisa **identificar** qual item alterar e enviar **só o que mudou**.

### 6.1 Service

```ts
/** `Partial` = todos os campos opcionais. Envie apenas o que mudou. */
export type UpdateAnnouncementInput = Partial<
  Pick<Announcement, 'title' | 'body' | 'severity'>
>;

export async function updateAnnouncement(
  id: string,
  input: UpdateAnnouncementInput,
): Promise<Announcement> {
  await simulateNetworkDelay();

  const list = getAnnouncementsData();
  const index = list.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error(`Announcement not found: ${id}`);
  }

  const updated: Announcement = { ...list[index], ...input };
  const next = [...list];
  next[index] = updated;

  setAnnouncementsData(next);
  return updated;
}
```

Ponto-chave: `{ ...list[index], ...input }` — começa do item atual e sobrescreve **só** os campos enviados.

### 6.2 Hook

`mutationFn` recebe **um** argumento. Quando você precisa de dois (`id` e `input`), passe um objeto:

```ts
// src/hooks/useUpdateAnnouncement.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAnnouncement, type UpdateAnnouncementInput } from '@/services';
import { queryKeys } from '@/lib/queryKeys';

interface UpdateAnnouncementVariables {
  id: string;
  input: UpdateAnnouncementInput;
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: UpdateAnnouncementVariables) =>
      updateAnnouncement(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.announcements.all,
      });
    },
  });
}
```

### 6.3 Uso

```tsx
const { mutate: updateAnnouncementMutate, isPending: isUpdating } =
  useUpdateAnnouncement();

updateAnnouncementMutate({
  id: 'ann-1',
  input: { title: 'Novo título' },
});
```

---

## 7) DELETE — excluir um item

### 7.1 Service

```ts
export async function deleteAnnouncement(id: string): Promise<void> {
  await simulateNetworkDelay();

  const list = getAnnouncementsData();
  const exists = list.some((item) => item.id === id);

  if (!exists) {
    throw new Error(`Announcement not found: ${id}`);
  }

  setAnnouncementsData(list.filter((item) => item.id !== id));
}
```

`Promise<void>` é adequado: não há nada útil para devolver depois de apagar.

### 7.2 Hook

```ts
// src/hooks/useDeleteAnnouncement.ts
export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAnnouncement(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.announcements.all,
      });
    },
  });
}
```

### 7.3 Uso — desabilitando só a linha que está sendo apagada

Um erro comum é desabilitar **todos** os botões durante a exclusão. Use `variables` para saber qual item está em andamento:

```tsx
const {
  mutate: deleteAnnouncementMutate,
  isPending: isDeleting,
  variables: deletingId,
} = useDeleteAnnouncement();

{announcements.map((item) => (
  <li key={item.id}>
    {item.title}
    <button
      type="button"
      onClick={() => deleteAnnouncementMutate(item.id)}
      disabled={isDeleting && deletingId === item.id}
    >
      {isDeleting && deletingId === item.id ? 'Excluindo…' : 'Excluir'}
    </button>
  </li>
))}
```

---

## 8) TOGGLE — marcar/desmarcar (o caso mais comum nas tasks)

Muitas tasks do próximo batch são desse tipo: marcar notificação como lida, concluir o desafio do dia, alternar uma preferência. É um **UPDATE de um campo**.

```ts
export async function markNotificationAsRead(
  id: string,
): Promise<Notification> {
  await simulateNetworkDelay();

  const list = getNotificationsData();
  const index = list.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error(`Notification not found: ${id}`);
  }

  // Idempotente: já está lida, devolve como está.
  if (list[index].read) {
    return { ...list[index] };
  }

  const updated: Notification = { ...list[index], read: true };
  const next = [...list];
  next[index] = updated;

  setNotificationsData(next);
  return updated;
}
```

**Idempotente** significa: chamar duas vezes tem o mesmo efeito que chamar uma vez. Isso evita bug quando o usuário clica rápido duas vezes.

---

## 9) `invalidateQueries`: o coração da atualização automática

Depois de escrever, o cache de leitura está velho. Você marca como velho assim:

```ts
queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all });
```

### Como o React Query casa as chaves

A comparação é por **prefixo**. Se suas chaves são:

```ts
['announcements']                    // lista
['announcements', 'ann-1']           // detalhe
```

Então:

| Você invalida | O que é afetado |
|---|---|
| `['announcements']` | A lista **e** todos os detalhes |
| `['announcements', 'ann-1']` | Só o detalhe do `ann-1` |

Por isso a factory em `src/lib/queryKeys.ts` existe: chaves consistentes tornam a invalidação previsível.

### Quando invalidar mais de uma chave

Se a mutação afeta dois recursos, invalide os dois:

```ts
onSuccess: () => {
  void queryClient.invalidateQueries({ queryKey: queryKeys.dailyChallenge.current });
  void queryClient.invalidateQueries({ queryKey: queryKeys.userStats.current });
},
```

Exemplo real: concluir o desafio do dia dá XP — muda o desafio **e** as stats.

### Por que não `setQueryData`

Existe `queryClient.setQueryData`, que escreve no cache direto sem refazer a busca. Neste batch **não use**: dá mais chance de o cache ficar diferente da "fonte da verdade". `invalidateQueries` é mais seguro e é o que queremos praticar agora.

---

## 10) `mutate` vs `mutateAsync`

```ts
// mutate — dispara e segue a vida. Trate o resultado nos callbacks.
mutate({ title: 'Aviso' });

// mutateAsync — retorna Promise. Precisa de try/catch.
try {
  const created = await mutateAsync({ title: 'Aviso' });
  console.log(created.id);
} catch (error) {
  // se não tratar aqui, vira erro não capturado
}
```

Use `mutate` por padrão. `mutateAsync` só quando precisar do resultado em sequência (ex.: criar e navegar para o item criado).

---

## 11) Estados na UI: loading, erro e reset

Padrão que o review vai cobrar:

```tsx
<button type="button" onClick={handleSave} disabled={isPending}>
  {isPending ? 'Salvando…' : 'Salvar'}
</button>

{isError ? (
  <p className="text-destructive">
    Não foi possível salvar. Tente de novo.
  </p>
) : null}
```

Três regras:

1. **Sempre** desabilite o botão com `isPending` — evita clique duplo.
2. **Sempre** mostre o erro da mutation. Falha silenciosa é bug.
3. Chame `reset()` antes de disparar de novo, para limpar um erro anterior da tela.

```tsx
function handleSave() {
  reset();          // limpa isError da tentativa anterior
  mutate(payload);
}
```

### Loading de query vs loading de mutation

Não confunda:

- `isPending` da **query** → a tela ainda não tem dado (mostre skeleton/texto).
- `isPending` da **mutation** → a tela tem dado, mas uma ação está em andamento (desabilite o botão).

---

## 12) Callbacks: `onSuccess`, `onError`, `onSettled`

```ts
useMutation({
  mutationFn: createAnnouncement,
  onSuccess: (created) => {
    // roda só se deu certo; recebe o retorno do mutationFn
    void queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all });
  },
  onError: (error) => {
    // roda só se falhou
  },
  onSettled: () => {
    // roda sempre, sucesso ou erro
  },
});
```

Divisão de responsabilidade no projeto:

| Onde | O que fica lá |
|---|---|
| Hook (`onSuccess`) | `invalidateQueries` — é regra de cache |
| Slot/página | Toast, fechar modal, limpar formulário — é UI |

Para UI, você pode passar callbacks na chamada:

```tsx
mutate(payload, {
  onSuccess: () => {
    setIsModalOpen(false);
    setTitle('');
  },
});
```

Os dois rodam: primeiro o do hook, depois o da chamada.

---

## 13) Exemplos reais no dfl-iterate

Dois exemplos ouro estão no repositório. Estude nesta ordem.

### 13.1 T7 — DailyChallenge (comece por aqui)

Mutação simples: só preenche `completedAt`.

| Camada | Arquivo |
|---|---|
| Type | `src/types/index.ts` → `DailyChallenge` |
| Dummy mutável | `src/test-utils/daily-challenge.dummy.ts` |
| Service | `src/services/daily-challenge.service.ts` |
| Query key | `queryKeys.dailyChallenge.current` |
| Hook READ | `src/hooks/useGetDailyChallenge.ts` |
| Hook WRITE | `src/hooks/useCompleteDailyChallenge.ts` |
| UI | `src/components/data-layer/DailyChallengeBanner.tsx` |
| Slot | `src/components/data-layer/HomePageDataSlots.tsx` |

Fluxo: clicar em **Concluir desafio** → `completeDailyChallenge` → `completedAt` preenchido → invalida → banner mostra **Concluído**.

### 13.2 T4 — UserStats (depois)

Mutação com **efeito derivado**: soma XP e recalcula o `level`.

| Camada | Arquivo |
|---|---|
| Service | `src/services/user-stats.service.ts` |
| Hook WRITE | `src/hooks/useClaimPracticeXp.ts` |
| Slot | `src/components/data-layer/HomePageHeaderDataSlots.tsx` |

Fluxo: **+XP** → `claimPracticeXp(25)` → `totalXp` sobe e `level` é recalculado → invalida → badge atualiza.

Resumo dos dois em: [Padrão ouro — Mutation](./padrao-ouro-mutation-user-stats.md).

---

## 14) Erros comuns

| Erro | Por que é problema | Como corrigir |
|---|---|---|
| Não invalidar nada no `onSuccess` | O dado muda no dummy mas a tela não atualiza | `invalidateQueries` com a chave do recurso |
| Chamar `refetch()` na mão depois do `mutate` | Funciona, mas ignora o mecanismo de cache | Invalide a chave |
| Botão sem `disabled={isPending}` | Clique duplo dispara duas mutações | Desabilitar enquanto pendente |
| Ignorar `isError` da mutation | Usuário acha que salvou e não salvou | Mensagem visível + permitir tentar de novo |
| Mutar o array do dummy com `push` | Vaza estado e dificulta detectar mudança | Criar novo array (`[...lista, novo]`) |
| Colocar `useMutation` dentro de `src/components/data-layer/` | Componente visual deve ser fino | Hook no slot; componente recebe callback por props |
| `queryKey` string solta no `invalidateQueries` | Chave divergente não invalida nada | Sempre via `queryKeys.ts` |
| Guardar o resultado da mutation em `useState` | Duplica a fonte da verdade | Ler sempre pelo `useGet*` |
| `mutateAsync` sem `try/catch` | Erro não capturado no console | Use `mutate` ou trate com `try/catch` |

---

## 15) Checklist antes da PR

- [ ] Type da entidade em `src/types/index.ts`
- [ ] Dummy **mutável** com getter/setter em `src/test-utils/`
- [ ] Service com função de leitura **e** de escrita, `async`, sem React
- [ ] Validação de negócio com `throw new Error(...)` no service
- [ ] Query key registrada em `src/lib/queryKeys.ts`
- [ ] Hook `useGet*` para leitura
- [ ] Hook de mutation (`useCreate*` / `useUpdate*` / `useDelete*` / `useMark*` / `useComplete*`)
- [ ] `invalidateQueries` no `onSuccess` com a chave correta
- [ ] Componente visual continua fino (recebe callback + flag por props)
- [ ] Slot trata: loading da query, erro da query com "Tentar de novo", `isPending` e `isError` da mutation
- [ ] Testei na tela: carregar → agir → ver atualizar → forçar erro
- [ ] `npx tsc --noEmit` e `npm run lint` passam

---

## 16) Exercícios para antes da aula

Não precisa abrir PR. É para você chegar na aula com o modelo mental pronto.

**1. Leia o exemplo T7 e desenhe o caminho.** Abra os 4 arquivos (dummy, service, hook de query, hook de mutation) e escreva no papel: quem chama quem, na ordem.

**2. Responda com suas palavras:**
- Por que o dummy precisou de `getX()` / `setX()` em vez de exportar a variável?
- O que aconteceria se removêssemos o `invalidateQueries` do `onSuccess`?
- Qual a diferença entre o `isPending` da query e o da mutation?
- Por que o service usa `throw` em vez de retornar `null`?

**3. Escreva (só no papel ou num arquivo de rascunho)** a assinatura das três funções de service para um recurso da sua escolha:

```ts
getX(): Promise<X[]>
createX(input: CreateXInput): Promise<X>
deleteX(id: string): Promise<void>
```

**4. Rode o projeto** (`npm run dev`), clique em **Concluir desafio** no T7 e em **+XP** no T4. Observe o botão desabilitando e o dado mudando.

---

## 17) Próximo nível

Depois de dominar o que está aqui:

- **Optimistic update** (`onMutate`) — atualiza a tela **antes** da resposta e desfaz se falhar
- `setQueryData` para atualizar cache sem refetch
- `useMutationState` para observar mutações em andamento
- `retry` em mutations e tratamento de erro de rede
- Mutations com API real e Supabase (Estágio 4 do programa)

---

## Resumo

- `useQuery` lê, `useMutation` escreve.
- `mutationFn` chama o service; o service altera o dado.
- `onSuccess` invalida a chave; o `useGet*` refaz a busca; a UI atualiza sozinha.
- Sempre trate `isPending` e `isError` da mutation na tela.
- Componente visual continua fino: recebe callback e flag por props.

Domine isso e você entrega qualquer task de CRUD no padrão de time.
