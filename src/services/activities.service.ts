import { activitiesData } from '@/test-utils/activities.dummy';
import type { Activity } from '@/types';

/**
 * Camada de dados das atividades.
 *
 * Hoje: lê do dummy local com latência simulada.
 * Amanhã: vira `fetch` para `/api/lessons/:id/activities` (ver `src/api/contracts.ts`).
 *
 * Regras desta camada (padrão do projeto):
 * - Funções assíncronas (`async`), sempre retornam Promise.
 * - Sem React aqui (nada de hooks, JSX, useState).
 * - Resultado já vem ordenado por `order` — quem consome não precisa se preocupar.
 */

const SIMULATED_LATENCY_MS = 300;

const simulateNetworkDelay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

export async function getActivitiesByLessonId(lessonId: string): Promise<Activity[]> {
  await simulateNetworkDelay();
  return activitiesData
    .filter((a) => a.lessonId === lessonId)
    .sort((a, b) => a.order - b.order);
}
