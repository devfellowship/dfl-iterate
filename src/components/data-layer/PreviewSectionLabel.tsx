import { cn } from '@devfellowship/components';

/** Rótulo discreto para blocos de preview do batch (remover após integração real). */
export function PreviewSectionLabel({
  taskId,
  className,
}: {
  taskId: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium mb-2',
        className,
      )}
    >
      Preview {taskId} · mock
    </p>
  );
}
