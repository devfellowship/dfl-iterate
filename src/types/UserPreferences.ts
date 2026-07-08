export type ThemePreference = 'light' | 'dark' | 'system';

export interface UserPreferences {
  userId: string;
  theme: ThemePreference;
  soundEffectsEnabled: boolean;
  language: 'pt-BR' | 'en-US';
}