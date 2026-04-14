import { GripVertical } from 'lucide-react';

interface ParsonsProblemTargetPlaceholderProps {
  index: number;
}

export function ParsonsProblemTargetPlaceholder({ index }: ParsonsProblemTargetPlaceholderProps) {
  return (
    <div
      key={`target-placeholder-${index}`}
      data-swapy-slot={`target-${index}`}
      className="min-h-[56px] bg-background/50 border-2 border-dashed border-border rounded-lg"
    >
      <div
        data-swapy-item={`placeholder-${index}`}
        className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-all"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground transition-colors" />
        <span className="text-xs text-muted-foreground">Solte aqui</span>
      </div>
    </div>
  );
}
