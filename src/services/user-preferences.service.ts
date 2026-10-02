// Origin: agent
// Exemplo ouro S-M2 — preferências via Supabase (GET + UPDATE).
// Hooks / queryKeys / UI não mudam. Só o miolo do service.
// Fellows: estudem este arquivo e repliquem o padrão nas tasks S-M*.

import { supabase } from '@/lib/supabase';
import type { UserPreferences } from '@/types/UserPreferences';

/** Mesmo id do seed / dummies — sandbox sem auth. */
const DEMO_USER_ID = 'user-1';

/** Formato que o Postgres devolve (snake_case). */
type UserPreferencesRow = {
  user_id: string;
  theme: UserPreferences['theme'];
  sound_effects_enabled: boolean;
  language: UserPreferences['language'];
};

function mapRowToPreferences(row: UserPreferencesRow): UserPreferences {
  return {
    userId: row.user_id,
    theme: row.theme,
    soundEffectsEnabled: row.sound_effects_enabled,
    language: row.language,
  };
}

export async function getUserPreferences(): Promise<UserPreferences> {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('user_id, theme, sound_effects_enabled, language')
    .eq('user_id', DEMO_USER_ID)
    .single();

  if (error) {
    throw new Error(`Failed to load preferences: ${error.message}`);
  }

  if (!data) {
    throw new Error('User preferences not found');
  }

  return mapRowToPreferences(data);
}

export async function updateUserPreferences(
  next: UserPreferences,
): Promise<UserPreferences> {
  if (!next.userId) {
    throw new Error('User preferences must include a userId');
  }

  const { data, error } = await supabase
    .from('user_preferences')
    .update({
      theme: next.theme,
      sound_effects_enabled: next.soundEffectsEnabled,
      language: next.language,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', next.userId)
    .select('user_id, theme, sound_effects_enabled, language')
    .single();

  if (error) {
    throw new Error(`Failed to update preferences: ${error.message}`);
  }

  if (!data) {
    throw new Error('User preferences not found after update');
  }

  return mapRowToPreferences(data);
}
