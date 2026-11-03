# Receita Prática — Como Criar um Novo Fluxo de Dados

## Quando usar este documento

Use este guia durante implementação de qualquer task do bloco.

Este arquivo é operacional: ele te diz **o que fazer em ordem**.

## Resumo em 5 pontos

- Sempre comece pelo tipo e pela query key.
- Crie service async e separado de React.
- Crie hook `useXxx` usando `useQuery`.
- Trate loading/erro no componente.
- Valide com TypeScript e lint antes da PR.

---

## Receita oficial em 7 passos

### Passo 1 — Defina (ou confirme) o tipo

Arquivo comum: `src/types/index.ts`

Exemplo:

```ts
export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
}
```

> Dica: se o tipo já existir, não duplique.

---

### Passo 2 — Crie o dummy (se a task pedir feature nova)

Pasta: `src/test-utils/`

Exemplo:

```ts
export const userProfileData: UserProfile = {
  id: 'user-1',
  name: 'Fellow Dev',
  avatarUrl: 'https://i.pravatar.cc/64?u=user-1',
};
```

> Dica: mantenha dados pequenos e claros para leitura.

---

### Passo 3 — Crie o service

Pasta: `src/services/`

Regras:
- `async`;
- sem React;
- `throw` para erro semântico.

Exemplo:

```ts
import { userProfileData } from '@/test-utils/user-profile.dummy';
import type { UserProfile } from '@/types';

export async function getCurrentUserProfile(): Promise<UserProfile> {
  await new Promise<void>((resolve) => setTimeout(resolve, 300));
  if (!userProfileData) {
    throw new Error('User profile not found');
  }
  return userProfileData;
}
```

---

### Passo 4 — Registre a query key

Arquivo: `src/lib/queryKeys.ts`

Exemplo:

```ts
userProfile: {
  current: ['user-profile', 'current'] as const,
}
```

> Dica: nomeie por recurso e intenção (`all`, `byId`, `current`, `list(limit)`).

---

### Passo 5 — Crie o hook `useXxx`

Pasta: `src/hooks/`

Exemplo:

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

Depois exporte no barrel `src/hooks/index.ts`.

---

### Passo 6 — Consuma no componente com estados

Exemplo:

```tsx
const { data: profile, isPending, isError, refetch } = useUserProfile();

if (isPending) return <p>Carregando perfil...</p>;
if (isError) return <button onClick={() => refetch()}>Tentar de novo</button>;
if (!profile) return null;

return <ProfileBadge profile={profile} />;
```

---

### Passo 7 — Verificação final e PR

No terminal:

```bash
npx tsc --noEmit
npm run lint
```

Na descrição da PR:
- o que foi criado;
- por que foi criado;
- como foi validado.

---

## Template pronto para task nova

Copie e adapte:

1. Tipo em `src/types/index.ts`
2. Dummy em `src/test-utils/xxx.dummy.ts`
3. Service em `src/services/xxx.service.ts`
4. Query key em `src/lib/queryKeys.ts`
5. Hook em `src/hooks/useXxx.ts`
6. Export no barrel (`hooks/index.ts` e, se necessário, `services/index.ts`)
7. Consumo no componente com estados

---

## Erros comuns neste passo a passo

- esquecer de exportar o hook no `src/hooks/index.ts`;
- usar string solta em `queryKey`;
- não tratar `isError`;
- service retornando `null` em vez de `throw`;
- criar hook com UI dentro (anti-pattern).

---

## Mini checklist do fellow

- [ ] Tipo definido/reutilizado
- [ ] Service async criado
- [ ] Query key adicionada
- [ ] Hook criado e exportado
- [ ] Componente com loading + erro + sucesso
- [ ] Build/lint ok
- [ ] PR com descrição clara

