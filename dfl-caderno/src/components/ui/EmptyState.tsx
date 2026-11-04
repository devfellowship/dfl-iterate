export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 p-6 dark:border-stone-700">
      <h2 className="font-medium">{title}</h2>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{description}</p>
    </div>
  );
}
