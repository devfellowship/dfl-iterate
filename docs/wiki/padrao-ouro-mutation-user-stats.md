# Padrão ouro — Mutation (READ + WRITE)

> **Para quem é:** fellows que já fizeram T1–T11 (`useGet*`) e vão implementar o batch **M1–M10** (WRITE).

Há **dois exemplos** no código. Comece pelo T7.

| Ordem | Recurso | Por quê |
|---|---|---|
| **1º — didático** | **T7 DailyChallenge** | Mutação simples: só preenche `completedAt`. CTA “Concluir desafio”. |
| **2º — avançado** | **T4 UserStats** | Soma XP e recalcula `level` — side effect no service. |

---

## Comece aqui: T7

```txt
DailyChallengeBanner (Concluir desafio)
  → HomePageTopDataSlots
      → useCompleteDailyChallenge().mutate()
          → completeDailyChallenge (service)
              → dummy (completedAt = ISO)
          → onSuccess: invalidateQueries(dailyChallenge.current)
      → useGetDailyChallenge() refetch
  → banner mostra “Concluído”
```

| Camada | Arquivo |
|---|---|
| Type | `src/types/index.ts` → `DailyChallenge` |
| Dummy | `src/test-utils/daily-challenge.dummy.ts` |
| Service | `src/services/daily-challenge.service.ts` |
| Query key | `queryKeys.dailyChallenge.current` |
| Hook READ | `src/hooks/useGetDailyChallenge.ts` |
| Hook WRITE | `src/hooks/useCompleteDailyChallenge.ts` |
| UI | `src/components/data-layer/DailyChallengeBanner.tsx` |
| Slot | `src/components/data-layer/HomePageDataSlots.tsx` |

---

## Depois: T4 (avançado)

```txt
UserStatsBadge (+XP)
  → claimPracticeXp (+25) → recalcula level → invalidate userStats
```

| Camada | Arquivo |
|---|---|
| Hook WRITE | `src/hooks/useClaimPracticeXp.ts` |
| Service | `src/services/user-stats.service.ts` |
| Slot | `src/components/data-layer/HomePageHeaderDataSlots.tsx` |

---

## Por que `invalidateQueries`

Não use `setQueryData` neste batch. Invalide → o `useGet*` refetch → UI fresca.

---

## Regras WRITE

1. Service async, sem React, `throw` em falha.
2. Dummy mutável via getters/setters (ESM).
3. `useMutation` + `onSuccess` → `invalidateQueries`.
4. Hook não trata UI; slot trata loading/erro/`mutate`.
5. Componente visual fino (callbacks por props).

---

## Persistência

Dummy em memória: acumula enquanto a aba fica aberta. **Reload** volta ao inicial.

---

## Checklist M*

- [ ] Type + dummy mutável + service get + write
- [ ] Query key + `useGet*` + `useUpdate*`/`useComplete*`/`useMark*`
- [ ] `invalidateQueries` no `onSuccess`
- [ ] Slot: loading, erro, botão com `isPending`
- [ ] `tsc` + `lint`

Estude os commits da PR de exemplos ouro no GitHub (um commit T4, um commit T7).
