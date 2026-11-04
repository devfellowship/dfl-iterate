import { Navigate, Outlet } from 'react-router-dom';
import { routes } from '@/consts/routes';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useSession } from '@/hooks';
import { Spinner } from '@/components/ui/Spinner';

export function RequireAuth() {
  const { session, isReady } = useSession();

  if (!isSupabaseConfigured) {
    return <Outlet />;
  }
  if (!isReady) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16">
        <Spinner />
      </main>
    );
  }
  if (!session) {
    return <Navigate to={routes.login} replace />;
  }
  return <Outlet />;
}
