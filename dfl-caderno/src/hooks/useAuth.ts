import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/consts/routes';
import { queryClient } from '@/lib/queryClient';
import { queryKeys } from '@/lib/queryKeys';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

export function useAuth() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function run(action: () => Promise<void>) {
    setError(null);
    if (!isSupabaseConfigured) {
      setError('Preencha o .env com a URL e a anon key do seu projeto Supabase.');
      return;
    }
    setIsPending(true);
    try {
      await action();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível autenticar.');
    } finally {
      setIsPending(false);
    }
  }

  return {
    error,
    isPending,
    isSupabaseConfigured,
    signIn(email: string, password: string) {
      return run(async () => {
        const { error: authError } = await getSupabase().auth.signInWithPassword({ email, password });
        if (authError) throw new Error(authError.message);
        navigate(routes.home);
      });
    },
    signUp(email: string, password: string) {
      return run(async () => {
        const { error: authError } = await getSupabase().auth.signUp({ email, password });
        if (authError) throw new Error(authError.message);
        navigate(routes.home);
      });
    },
    signOut() {
      return run(async () => {
        const { error: authError } = await getSupabase().auth.signOut();
        if (authError) throw new Error(authError.message);
        queryClient.removeQueries({ queryKey: queryKeys.profile.current });
        navigate(routes.login);
      });
    },
  };
}
