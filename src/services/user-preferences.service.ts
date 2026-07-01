import { userPreferencesData } from '@/test-utils/user-preferences.dummy';
import type { UserPreferences } from '@/types';

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