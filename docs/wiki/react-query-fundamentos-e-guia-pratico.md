# React Query — Fundamentos e Guia Prático (Wiki)

> Documento central de referência sobre React Query para fellows da DevFellowship.
>
> Objetivo: explicar a base de funcionamento, o que ele possibilita no dia a dia e como usar com exemplos simples.

---

## 1) O que é React Query

**React Query** (atualmente TanStack Query) é uma biblioteca para gerenciar **estado de dados remotos** no frontend.

Em vez de você montar manualmente:
- loading;
- erro;
- retry;
- cache;
- sincronização após mutação;

ela já oferece esse fluxo pronto, com uma API consistente.

---

## 2) Problema que ele resolve

Sem React Query, um fluxo comum vira:
- `useState` para dados
- `useState` para loading
- `useState` para erro
- `useEffect` para buscar
- lógica de retry
- lógica de cache (geralmente inexistente)

Esse padrão se repete em várias telas, aumenta duplicação e inconsistência.

Com React Query, a busca vira declarativa:

```ts
useQuery({ queryKey, queryFn })
```

e você recebe os estados necessários.

---

## 3) Conceito principal: Server State vs UI State

React Query é para **server state** (dados que vêm de fora do componente).

### Server state (React Query)
- lista de usuários
- detalhes de uma lição
- ranking
- atividades por aula

### UI state (React/`useState`)
- modal aberto/fechado
- tab selecionada
- texto digitado no input
- estado de dropdown

Regra prática:
- se o dado vem de API/dummy/banco: pense React Query;
- se é interação local de interface: `useState`.

---

## 4) Como React Query funciona (modelo mental)

Pense em 3 partes:

1. **`queryKey`**: identificação única da consulta
2. **`queryFn`**: função assíncrona que busca os dados
3. **cache**: resultado guardado por chave

Fluxo:
- componente pede `queryKey = ['lessons']`
- React Query verifica cache
- se necessário, executa `queryFn`
- atualiza estados (`isPending`, `isError`, `data`)
- componentes que usam a mesma chave reaproveitam cache

---

## 5) Termos importantes (glossário rápido)

- **Query**: operação de leitura (`GET`)
- **Mutation**: operação de escrita (`POST/PUT/PATCH/DELETE`)
- **queryKey**: “nome” da query no cache
- **queryFn**: função assíncrona que retorna dados
- **invalidateQueries**: marca cache como desatualizado
- **refetch**: força nova busca
- **stale**: dado potencialmente antigo (precisa atualizar quando fizer sentido)
- **fresh**: dado atual dentro da estratégia de cache

---

## 6) Hook mais usado: `useQuery`

Exemplo mínimo:

```ts
import { useQuery } from '@tanstack/react-query';

async function getUsers() {
  const response = await fetch('/api/users');
  if (!response.ok) throw new Error('Erro ao buscar usuários');
  return response.json();
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
}
```

Uso na UI:

```tsx
const { data: users = [], isPending, isError, refetch } = useUsers();

if (isPending) return <p>Carregando...</p>;
if (isError) return <button onClick={() => refetch()}>Tentar de novo</button>;

return (
  <ul>
    {users.map((u) => <li key={u.id}>{u.name}</li>)}
  </ul>
);
```

---

## 7) Query keys: boas práticas

A qualidade do cache depende da qualidade das chaves.

### Bom padrão

```ts
['lessons']
['lessons', lessonId]
['activities', { lessonId }]
['leaderboard', { limit: 10 }]
```

### Evitar
- chaves inconsistentes para o mesmo recurso
- strings mágicas espalhadas no código

Em times/projetos grandes, use um **factory de query keys** (como no dfl-iterate com `queryKeys.ts`).

---

## 8) Tratamento de estados na UI

Ordem recomendada:

1. `isPending`
2. `isError`
3. `empty state` (quando aplicável)
4. sucesso (`data`)

Exemplo:

```tsx
if (isPending) return <Loading />;
if (isError) return <ErrorState onRetry={refetch} />;
if (!data || data.length === 0) return <EmptyState />;
return <Success data={data} />;
```

---

## 9) Erro no service: por que usar `throw`

Se o dado não existe, prefira:

```ts
if (!lesson) throw new Error(`Lesson not found: ${id}`);
```

Em vez de:

```ts
if (!lesson) return null;
```

Com `throw`, React Query entra em `isError` corretamente.
Com `null`, você pode mascarar erro e quebrar em outro ponto da UI.

---

## 10) Escrevendo dados: `useMutation` (conceito básico)

`useQuery` lê.  
`useMutation` escreve.

Exemplo:

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

async function createLesson(payload: { title: string }) {
  const response = await fetch('/api/lessons', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Erro ao criar lição');
  return response.json();
}

export function useCreateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
}
```

O `invalidateQueries` é o gatilho para atualizar listas relacionadas.

Aprofundamento (adicionar, editar e excluir passo a passo): [React Query — Mutations na prática](./react-query-mutations-guia-pratico.md).

---

## 11) O que React Query possibilita no projeto

### 1. Padronização
Todo mundo implementa leitura e erro de forma parecida.

### 2. Cache automático
Menos requisições repetidas e sensação de app mais rápido.

### 3. Retry e refetch simples
Sem reescrever lógica toda vez.

### 4. Evolução dummy -> API real
Se a arquitetura estiver correta (component -> hook -> service), a migração fica muito mais barata.

### 5. Melhor experiência de manutenção
Menos código imperativo duplicado em cada página.

---

## 12) Exemplo curto do dfl-iterate (real)

No projeto, o padrão está assim:

- `src/services/lessons.service.ts` define `getLessons()`
- `src/lib/queryKeys.ts` define `queryKeys.lessons.all`
- `src/hooks/useLessons.ts` faz:

```ts
return useQuery({
  queryKey: queryKeys.lessons.all,
  queryFn: getLessons,
});
```

- `src/pages/HomePage.tsx` consome:
  - `isPending`
  - `isError`
  - `data`
  - `refetch`

Esse é o padrão recomendado para novos fluxos.

---

## 13) Erros comuns de quem está começando

1. Usar React Query para estado de UI local  
2. Chamar hook condicionalmente (`if (...) useQuery(...)`)  
3. Não tratar `isError`  
4. Usar queryKey hardcoded em vários lugares  
5. Retornar `null` no service em erro semântico  
6. Misturar busca de dados e UI no mesmo arquivo sem separação

---

## 14) Checklist rápido de implementação

- [ ] Tenho `queryKey` estável e consistente?
- [ ] Minha `queryFn` é assíncrona e pode lançar erro?
- [ ] Tratei loading/erro/sucesso na UI?
- [ ] Tenho fallback de empty state quando necessário?
- [ ] Estou separando componente, hook e service?

---

## 15) Quando NÃO usar React Query

Não use para:
- modal aberto/fechado
- valor de input digitado
- estado visual transitório local

Use `useState` para isso.

---

## 16) Próximos assuntos (nível intermediário)

Depois de dominar o básico, estudar:
- `staleTime` e `gcTime`
- `enabled` para queries condicionais
- `select` para transformação de dados
- mutations otimistas (`onMutate`)
- paginação/infinite query
- pré-carregamento (`prefetchQuery`)

---

## Resumo final

React Query é uma base de produtividade para lidar com dados remotos no frontend.  
Ele não “substitui React”, ele complementa React para o cenário de busca/cache/sincronização.

Se você dominar:
- `useQuery`
- `queryKey`
- `queryFn`
- tratamento de estados
- separação em camadas

você já consegue implementar a maioria das tasks de dados em projetos reais com padrão de time.

