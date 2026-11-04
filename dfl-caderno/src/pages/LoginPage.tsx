import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { routes } from '@/consts/routes';
import { useAuth, useSession } from '@/hooks';
import { Spinner } from '@/components/ui/Spinner';

export function LoginPage() {
  const { session, isReady } = useSession();
  const { signIn, signUp, error, isPending, isSupabaseConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isReady) {
    return (
      <main className="mx-auto max-w-md px-4 py-16">
        <Spinner />
      </main>
    );
  }
  if (session) {
    return <Navigate to={routes.home} replace />;
  }

  function submit(mode: 'in' | 'up') {
    if (mode === 'in') {
      void signIn(email, password);
      return;
    }
    void signUp(email, password);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <h1 className="text-2xl font-semibold">Caderno</h1>
      <p className="mt-2 text-sm text-stone-500">Entre para anotar o que você estudou.</p>
      {!isSupabaseConfigured && (
        <p className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Copie <code>.env.example</code> para <code>.env</code> e preencha a URL e a anon key do seu
          projeto. Reinicie o <code>npm run dev</code>.
        </p>
      )}
      <form
        className="mt-6 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          submit('in');
        }}
      >
        <label className="block text-sm">
          E-mail
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Senha
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2"
          />
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-stone-900 px-3 py-2 text-sm text-white disabled:opacity-60"
          >
            Entrar
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => submit('up')}
            className="rounded-md border border-stone-300 px-3 py-2 text-sm disabled:opacity-60"
          >
            Criar conta
          </button>
        </div>
      </form>
    </main>
  );
}
