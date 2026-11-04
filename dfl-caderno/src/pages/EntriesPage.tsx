import { EmptyState } from '@/components/ui/EmptyState';

export function EntriesPage() {
  return (
    <section>
      <h1 className="text-xl font-semibold">Entradas</h1>
      <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
        A lista ainda é uma casca. O plano do caderno troca isto pelas suas sessões de estudo.
      </p>
      <div className="mt-6">
        <EmptyState
          title="Nenhuma entrada ainda"
          description="Quando o plano for aceito, criar, editar e apagar uma entrada acontece nesta página."
        />
      </div>
    </section>
  );
}
