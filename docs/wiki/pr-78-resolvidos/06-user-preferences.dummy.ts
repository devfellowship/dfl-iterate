import type { UserPreferences } from '@/types/UserPreferences';

const initialUserPreferencesData: UserPreferences = {
  userId: 'user-1',
  theme: 'dark',
  soundEffectsEnabled: true,
  language: 'pt-BR',
};

let userPreferencesData: UserPreferences = { ...initialUserPreferencesData };

export function getUserPreferencesData(): UserPreferences {
  return { ...userPreferencesData };
}

export function setUserPreferencesData(next: UserPreferences): UserPreferences {
  userPreferencesData = { ...next };
  return { ...userPreferencesData };
}

export function resetUserPreferencesData(): void {
  userPreferencesData = { ...initialUserPreferencesData };
}
