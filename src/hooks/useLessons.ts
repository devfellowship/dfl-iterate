import { useQuery } from '@tanstack/react-query';
import { getLessons } from '@/services';
import { queryKeys } from '@/lib/queryKeys';

/**
 * 🟡 PADRÃO OURO — fluxo de dados (referência para a fase 4).
 *
 * Como ler:
 *   componente  →  hook de query  →  service  →  (dummy / fetch)
 *
 * Regras desta camada (replicar para qualquer novo hook de dados):
 * 1. `useQuery` é o coração — recebe `queryKey` + `queryFn`.
 * 2. `queryKey` SEMPRE vem de `@/lib/queryKeys` (sem string solta).
 * 3. `queryFn` é uma função do service em `@/services` (assíncrona, sem React).
 * 4. O hook **não** trata UI — devolve o objeto cru do React Query e a página
 *    decide o que fazer com `isPending`, `isError`, `data`, `refetch` etc.
 *
 * Para criar um hook novo no mesmo padrão (ex.: `useLesson(id)`,
 * `useActivitiesByLesson(lessonId)`), basta copiar este arquivo e trocar:
 *   - o nome da função
 *   - a `queryKey`
 *   - a `queryFn`
 */
export function useLessons() {
  return useQuery({
    queryKey: queryKeys.lessons.all,
    queryFn: getLessons,
  });
}
