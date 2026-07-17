import { GripVertical } from 'lucide-react';
import { CodeBlock } from '@/types';
import { SourceBlock } from '../SourceBlock/SourceBlock';

interface SourceListProps {
  blocks: CodeBlock[];
}

export function SourceList({ blocks }: SourceListProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
        <GripVertical className="w-3 h-3" />
        Blocos Disponíveis
      </h3>

      <div className="space-y-2">
        {blocks.map((block) => (
          <SourceBlock key={block.id} block={block} />
        ))}
      </div>
    </div>
  );
}
