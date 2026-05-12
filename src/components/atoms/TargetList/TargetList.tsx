import { ListOrdered } from 'lucide-react';
import { TargetPlaceholder } from '../TargetPlaceholder/TargetPlaceholder';

interface TargetListProps {
  count: number;
}

export function TargetList({ count }: TargetListProps) {
  return (
    <div className="space-y-3 p-4 bg-muted/20 rounded-xl border border-dashed border-border">
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
        <ListOrdered className="w-3 h-3" />
        Sua Solução
      </h3>

      <div className="space-y-2">
        {Array.from({ length: count }, (_, index) => (
          <TargetPlaceholder key={index} index={index} />
        ))}
      </div>
    </div>
  );
}
