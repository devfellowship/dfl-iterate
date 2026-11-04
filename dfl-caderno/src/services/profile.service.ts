import { getSupabase } from '@/lib/supabase';
import type { Profile, Theme } from '@/types';

type ProfileRow = {
  id: string;
  name: string;
  theme: string;
};

export function toProfile(row: ProfileRow): Profile {
  if (row.theme !== 'light' && row.theme !== 'dark') {
    throw new Error(`Tema inválido: ${row.theme}`);
  }
  return {
    id: row.id,
    name: row.name,
    theme: row.theme,
  };
}

async function currentUserId(): Promise<string> {
  const { data, error } = await getSupabase().auth.getUser();
  if (error) {
    throw new Error(error.message);
  }
  if (!data.user) {
    throw new Error('Sessão ausente.');
  }
  return data.user.id;
}

export async function getProfile(): Promise<Profile> {
  const userId = await currentUserId();
  const { data, error } = await getSupabase()
    .from('profiles')
    .select('id, name, theme')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error('Perfil não encontrado. Confira se o SQL do schema já rodou.');
  }
  return toProfile(data);
}

export async function updateProfile(input: { name: string; theme: Theme }): Promise<Profile> {
  const userId = await currentUserId();
  const { data, error } = await getSupabase()
    .from('profiles')
    .update({ name: input.name, theme: input.theme })
    .eq('id', userId)
    .select('id, name, theme')
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return toProfile(data);
}
