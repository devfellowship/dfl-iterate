import { FormEvent, useEffect, useState } from 'react';
import { useGetProfile, useUpdateProfile } from '@/hooks';
import type { Theme } from '@/types';
import { ErrorState } from '@/components/ui/ErrorState';
import { Spinner } from '@/components/ui/Spinner';

export function SettingsPage() {
  const profile = useGetProfile();
  const update = useUpdateProfile();
  const [name, setName] = useState('');
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    if (!profile.data) return;
    setName(profile.data.name);
    setTheme(profile.data.theme);
  }, [profile.data]);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    update.mutate({ name, theme });
  }

  if (profile.isPending) return <Spinner label="Carregando perfil…" />;
  if (profile.isError) {
    return <ErrorState message={profile.error.message} onRetry={() => profile.refetch()} />;
  }

  return (
    <section className="max-w-md">
      <h1 className="text-xl font-semibold">Ajustes</h1>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <label className="block text-sm">
          Nome
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-900"
          />
        </label>
        <label className="block text-sm">
          Tema
          <select
            value={theme}
            onChange={(event) => setTheme(event.target.value as Theme)}
            className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-900"
          >
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
          </select>
        </label>
        {update.isError && <p className="text-sm text-red-700">{update.error.message}</p>}
        {update.isSuccess && <p className="text-sm text-emerald-700">Salvo.</p>}
        <button
          type="submit"
          disabled={update.isPending}
          className="rounded-md bg-stone-900 px-3 py-2 text-sm text-white disabled:opacity-60 dark:bg-stone-100 dark:text-stone-900"
        >
          Salvar
        </button>
      </form>
    </section>
  );
}
