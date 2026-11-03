import {
  getUserPreferencesData,
  setUserPreferencesData,
} from '@/test-utils/user-preferences.dummy';
import type { UserPreferences } from '@/types/UserPreferences';

const SIMULATED_LATENCY_MS = 300;

const simulateNetworkDelay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

export async function getUserPreferences(): Promise<UserPreferences> {
  await simulateNetworkDelay();

  const preferences = getUserPreferencesData();

  if (!preferences) {
    throw new Error('User preferences not found');
  }

  return preferences;
}

export async function updateUserPreferences(
  next: UserPreferences,
): Promise<UserPreferences> {
  await simulateNetworkDelay();

  if (!next.userId) {
    throw new Error('User preferences must include a userId');
  }

  const updated = setUserPreferencesData(next);

  return updated;
}
