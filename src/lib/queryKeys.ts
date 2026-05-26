/**
 * Factory central de query keys do React Query.
 *
 * Por que existir:
 * - Evita chave string solta espalhada pelo código.
 * - Permite invalidar grupos inteiros (ex.: `queryClient.invalidateQueries({ queryKey: queryKeys.lessons.all })`).
 * - Ajuda autocomplete a guiar quem está escrevendo um hook novo.
 *
 * Convenção:
 * - `all` é a chave-raiz daquele recurso (sem parâmetro).
 * - Funções recebem parâmetros e retornam tuplas `as const` para o TS narrar bem.
 */
export const queryKeys = {
  lessons: {
    all: ['lessons'] as const,
    byId: (id: string) => ['lessons', id] as const,
  },
  activities: {
    byLesson: (lessonId: string) => ['activities', { lessonId }] as const,
  },
} as const;
