import { userPreferencesData } from '@/test-utils/user-preferences.dummy';
import type { UserPreferences } from '@/types';

/**
 * Camada de dados das preferências do usuário.
 *
 * Hoje: lê do dummy local com latência simulada.
 * Amanhã: vira `fetch` para a tabela `user_preferences` (ver contrato em `src/api/contracts.ts`).
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

export async function getUserPreferences(): Promise<UserPreferences> {
  await simulateNetworkDelay();

  const preferences = userPreferencesData;

  if (!preferences) {
    throw new Error('User preferences not found');
  }

  return preferences;
}