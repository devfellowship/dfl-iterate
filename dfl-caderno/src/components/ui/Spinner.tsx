export function Spinner({ label = 'Carregando…' }: { label?: string }) {
  return (
    <p className="text-sm text-stone-500 dark:text-stone-400" role="status">
      {label}
    </p>
  );
}
