import { announcementsData } from '@/test-utils/announcements.dummy';
import type { Announcement } from '@/types';

/**
 * Camada de dados dos avisos.
 *
 * Hoje: lê do dummy local com latência simulada e filtra expirados.
 * Amanhã: vira `fetch` para endpoint de announcements.
 *
 * Regras desta camada (padrão do projeto):
 * - Funções assíncronas (`async`), sempre retornam Promise.
 * - Sem React aqui (nada de hooks, JSX, useState).
 * - Erro semântico (recurso não existe) é `throw new Error(...)`. O React Query
 *   transforma isso em estado `isError`, que a UI trata.
 */

const SIMULATED_LATENCY_MS = 300;

const simulateNetworkDelay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

function isActiveAnnouncement(announcement: Announcement): boolean {
  if (announcement.expiresAt === null) return true;
  return new Date(announcement.expiresAt).getTime() > Date.now();
}

export async function getAnnouncements(): Promise<Announcement[]> {
  await simulateNetworkDelay();
  return announcementsData.filter(isActiveAnnouncement);
}
