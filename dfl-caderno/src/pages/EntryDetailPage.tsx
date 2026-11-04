import { Link, useParams } from 'react-router-dom';
import { routes } from '@/consts/routes';
import { EmptyState } from '@/components/ui/EmptyState';

export function EntryDetailPage() {
  const { id } = useParams();

  return (
    <section>
      <Link to={routes.home} className="text-sm text-stone-500 dark:text-stone-400">
        Voltar
      </Link>
      <h1 className="mt-3 text-xl font-semibold">Entrada</h1>
      <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">Identificador: {id}</p>
      <div className="mt-6">
        <EmptyState
          title="Tasks desta entrada"
          description="Criar uma task e marcar como feita entra aqui, depois do aceite do plano."
        />
      </div>
    </section>
  );
}
