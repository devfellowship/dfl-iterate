# Receita prática — Criar fluxo de dados no padrão do projeto

> **Documento complementar:** [`padrao-ouro-tasks-camada-de-dados.md`](./padrao-ouro-tasks-camada-de-dados.md) · [`contratos-json-tasks-camada-de-dados.md`](./contratos-json-tasks-camada-de-dados.md)

Use esta receita em qualquer task do batch Camada de Dados.

## Fluxo oficial

```txt
type → dummy → service → queryKey → useGet* → substituir mock nos *DataSlots*
```

Componente visual: `src/components/data-layer/*.tsx` (**já fornecido** — não recrie).

---

## Passo 1 — Defina o tipo

Arquivo: `src/types/index.ts` (mover de `src/components/data-layer/types.ts` se necessário)

Exemplo:
```ts
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  avatarUrl: string;
}
```

---

## Passo 2 — Crie o dummy

Pasta: `src/test-utils/`

Exemplo:
```ts
export const userProfileData: UserProfile = {
  id: 'user-1',
  name: 'Ana Fellow',
  email: 'ana.fellow@devfellowship.dev',
  age: 24,
  avatarUrl: 'https://i.pravatar.cc/64?u=user-1',
};
```

---

## Passo 3 — Crie o service

Pasta: `src/services/`

Regras:
- função `async` (`getXxx`, não `useGetXxx`)
- sem React (`useState`, JSX, etc.)
- erro semântico com `throw new Error(...)`

Exemplo:
```ts
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

---

## Passo 4 — Registre a query key

Arquivo: `src/lib/queryKeys.ts`

Exemplo:
```ts
userProfile: {
  current: ['user-profile', 'current'] as const,
},
```

---

## Passo 5 — Crie o hook `useGetXxx` (Escola A)

Pasta: `src/hooks/` — **1 arquivo por ação CRUD**

Exemplo:
```ts
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getUserProfile } from '@/services';

export function useGetUserProfile() {
  return useQuery({
    queryKey: queryKeys.userProfile.current,
    queryFn: getUserProfile,
  });
}
```

Exporte no `src/hooks/index.ts`.

---

## Passo 6 — Substitua o mock na integração

Arquivos de slot (batch atual):

| Tasks | Arquivo |
|---|---|
| T1, T2, T4, T6, T10 | `HomePageHeaderDataSlots.tsx` |
| T3, T7, T8, T9, T11 | `HomePageDataSlots.tsx` |
| T5 | `HomePage.tsx` (`LessonCard`) |

Exemplo:
```tsx
const { data: profile, isPending, isError, refetch } = useGetUserProfile();

if (isPending) return <ProfileSkeleton />;
if (isError) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span>Erro ao carregar perfil.</span>
      <Button size="sm" variant="ghost" onClick={() => refetch()}>
        Tentar de novo
      </Button>
    </div>
  );
}

return <UserProfileCard profile={profile} variant="compact" />;
```

Ordem padrão:
1. loading
2. erro (mensagem + `refetch()` — **nunca** omitir silenciosamente)
3. sucesso (ou empty state quando `[]` / sem dado legítimo)

---

## Passo 7 — Validação final

```bash
npx tsc --noEmit
npm run lint
```

---

## Anti-patterns (evite)

- Importar dummy direto na página ou nos `*DataSlots`.
- Query key hardcoded no hook.
- Service retornando `null` em erro semântico.
- Hook renderizando UI.
- Colocar `useQuery` dentro de `src/components/data-layer/`.
- Pular `isPending` e `isError`.

---

## Referências no repo

- `src/services/lessons.service.ts`
- `src/lib/queryKeys.ts`
- `src/pages/HomePage.tsx` (padrão `useLessons` — legado; novos hooks: `useGet*`)
- `src/components/data-layer/` (componentes + preview mock)
- [`tasks-plataforma-camada-de-dados.md`](./tasks-plataforma-camada-de-dados.md) (copiar task na plataforma)
