import { supabase } from '@/lib/supabase';
import type { UserPreferences } from '@/types/UserPreferences';

export async function getUserPreferences(): Promise<UserPreferences> {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('user_id, theme, sound_effects_enabled, language')
    .eq('user_id', 'user-1')
    .single();

  if (error) {
    throw new Error(`Failed to load preferences: ${error.message}`);
  }

  return {
    userId: data.user_id,
    theme: data.theme,
    soundEffectsEnabled: data.sound_effects_enabled,
    language: data.language,
  };
}

export async function updateUserPreferences(
  next: UserPreferences,
): Promise<UserPreferences> {
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

  return {
    userId: data.user_id,
    theme: data.theme,
    soundEffectsEnabled: data.sound_effects_enabled,
    language: data.language,
  };
}