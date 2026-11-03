# Guia do Padrão Ouro — React Query no dfl-iterate

## Quando usar este documento

Use este guia sempre que for criar ou revisar:
- um novo hook de dados (`useXxx`);
- um novo service;
- consumo de dados em página/componente.

Este é o documento canônico da trilha para React Query.

## Resumo em 5 pontos

- O hook de query conecta UI e service.
- Service é assíncrono, sem React, e pode dar `throw new Error`.
- Chaves de cache ficam centralizadas em `queryKeys`.
- Componente trata loading e erro; hook não renderiza UI.
- Estrutura boa e simples: poucas linhas e responsabilidades claras.

---

## Arquitetura oficial do fluxo

```txt
Componente/Página
  -> Hook de Query (useQuery)
      -> Service (async)
          -> Dummy hoje / API amanhã
```

### O que cada camada faz

- **Componente/Página**
  - chama o hook;
  - decide o que renderizar;
  - trata `isPending`, `isError`, `data`.

- **Hook de Query**
  - declara `queryKey` e `queryFn`;
  - retorna o objeto cru do React Query.

- **Service**
  - busca/prepara dados;
  - não usa hooks de React;
  - pode lançar erro com `throw new Error`.

---

## Exemplo real do projeto

### 1) query keys

Arquivo: `src/lib/queryKeys.ts`

```ts
export const queryKeys = {
  lessons: {
    all: ['lessons'] as const,
    byId: (id: string) => ['lessons', id] as const,
  },
  activities: {
    byLesson: (lessonId: string) => ['activities', { lessonId }] as const,
  },
} as const;
```

### 2) service

Arquivo: `src/services/lessons.service.ts`

```ts
export async function getLessons(): Promise<Lesson[]> {
  await simulateNetworkDelay();
  return lessonsData;
}
```

### 3) hook de query

Arquivo: `src/hooks/useLessons.ts`

```ts
export function useLessons() {
  return useQuery({
    queryKey: queryKeys.lessons.all,
    queryFn: getLessons,
  });
}
```

### 4) consumo na UI

Arquivo: `src/pages/HomePage.tsx`

```tsx
const { data: lessons = [], isPending, isError, refetch } = useLessons();
```

---

## Regras de ouro (não negociáveis neste bloco)

1. **Sem string solta de query key**
   - use sempre `queryKeys`.

2. **Service é assíncrono**
   - toda função de service deve retornar `Promise`.

3. **Sem React no service**
   - nada de `useState`, `useEffect`, JSX.

4. **Erro semântico com throw**
   - se não encontrou recurso: `throw new Error(...)`.

5. **Hook sem UI**
   - hook não decide layout de loading/erro.

6. **Componente trata estado da query**
   - `isPending` -> `isError` -> `data`.

---

## Modelo de implementação (copiar e adaptar)

### Service

```ts
export async function getThingById(id: string): Promise<Thing> {
  await simulateNetworkDelay();
  const item = thingsData.find((t) => t.id === id);
  if (!item) {
    throw new Error(`Thing not found: ${id}`);
  }
  return item;
}
```

### queryKey

```ts
things: {
  byId: (id: string) => ['things', id] as const,
}
```

### Hook

```ts
export function useThing(id: string) {
  return useQuery({
    queryKey: queryKeys.things.byId(id),
    queryFn: () => getThingById(id),
  });
}
```

### Componente

```tsx
const { data, isPending, isError, refetch } = useThing(id);

if (isPending) return <p>Carregando...</p>;
if (isError) return <button onClick={() => refetch()}>Tentar de novo</button>;
return <ThingView thing={data} />;
```

---

## Anti-patterns comuns e como corrigir

### Anti-pattern 1: importar dummy direto no componente

Errado:

```tsx
import { lessonsData } from '@/test-utils/lessons.dummy';
```

Certo:
- componente chama hook;
- hook chama service;
- service lê dummy.

### Anti-pattern 2: queryKey hardcoded

Errado:

```ts
queryKey: ['lessonz'] // typo silencioso
```

Certo:

```ts
queryKey: queryKeys.lessons.all
```

### Anti-pattern 3: ignorar erro

Errado:
- página só renderiza `data` e não trata `isError`.

Certo:
- sempre tenha caminho de erro + ação de retry.

---

## Checklist rápido antes de abrir PR

- [ ] Criei/atualizei query key no `queryKeys.ts`
- [ ] Service `async` sem React
- [ ] Hook `useQuery` com `queryKey` + `queryFn`
- [ ] Componente com `isPending` e `isError`
- [ ] Sem import direto de dummy no componente
- [ ] `npx tsc --noEmit` ok
- [ ] `npm run lint` ok (sem novos erros)

---

## Glossário rápido

- **React Query**: biblioteca para buscar/cachear dados remotos.
- **queryKey**: identificador da query no cache.
- **queryFn**: função que realmente busca dados.
- **isPending**: primeira carga em andamento.
- **isError**: erro ocorreu na busca.
- **refetch**: força nova tentativa de busca.

