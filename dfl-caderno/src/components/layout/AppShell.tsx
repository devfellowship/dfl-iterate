import { Link, Outlet } from 'react-router-dom';
import { routes } from '@/consts/routes';
import { useAuth } from '@/hooks/useAuth';
import { ThemeSync } from './ThemeSync';

export function AppShell() {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <ThemeSync />
      <header className="border-b border-stone-200 dark:border-stone-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link to={routes.home} className="font-semibold tracking-tight">
            Caderno
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to={routes.home}>Entradas</Link>
            <Link to={routes.settings}>Ajustes</Link>
            <button type="button" onClick={() => signOut()} className="text-stone-500 dark:text-stone-400">
              Sair
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
