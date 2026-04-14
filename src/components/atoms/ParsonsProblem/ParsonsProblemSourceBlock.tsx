import { GripVertical } from 'lucide-react';
import { CodeBlock } from '@/types';

interface ParsonsProblemSourceBlockProps {
  block: CodeBlock;
}

export function ParsonsProblemSourceBlock({ block }: ParsonsProblemSourceBlockProps) {
  return (
    <div
      key={`source-${block.id}`}
      data-swapy-slot={`source-${block.id}`}
      className="min-h-[56px] bg-background/50 border-2 border-dashed border-border rounded-lg"
    >
      <div
        data-swapy-item={block.id}
        className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-all"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground transition-colors" />
        <code className="font-mono text-sm text-foreground">{block.code}</code>
      </div>
    </div>
  );
}
