import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/types/UserProfile';

export async function getUserProfile(): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, age, avatar_url')
    .eq('id', 'user-1')
    .single();

  if (error) {
    throw new Error(`Failed to load profile: ${error.message}`);
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    age: data.age,
    avatarUrl: data.avatar_url,
  };
}

export async function updateUserProfile(
  next: UserProfile,
): Promise<UserProfile> {
  if (!next.id) {
    throw new Error('User profile must include an id');
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      name: next.name,
      email: next.email,
      age: next.age,
      avatar_url: next.avatarUrl,
    })
    .eq('id', next.id)
    .select('id, name, email, age, avatar_url')
    .single();

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    age: data.age,
    avatarUrl: data.avatar_url,
  };
}