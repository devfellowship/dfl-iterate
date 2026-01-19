import { motion } from 'framer-motion';
import { GitLogEntry } from '@/types';
import { GitCommit, GitBranch, Wrench, ChevronDown, ChevronUp, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GitLogProps {
  entries: GitLogEntry[];
  isCollapsed: boolean;
  onToggle: () => void;
}

const typeIcons = {
  activity_complete: GitCommit,
  decision: GitBranch,
  fix: Wrench,
};

const typeColors = {
  activity_complete: 'text-success',
  decision: 'text-primary',
  fix: 'text-warning',
};

export function GitLog({ entries, isCollapsed, onToggle }: GitLogProps) {
  return (
    <motion.div 
      className="shrink-0 border-t border-border bg-card/80 backdrop-blur flex flex-col"
      animate={{ 
        height: isCollapsed ? 'auto' : 44,
        maxHeight: isCollapsed ? 240 : 44 
      }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      <Button
        variant="ghost"
        onClick={onToggle}
        className="shrink-0 w-full flex items-center justify-between px-4 py-3 h-11 rounded-none"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">Git Log</span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{entries.length}</span>
        </div>
        {isCollapsed ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        )}
      </Button>

      {isCollapsed && (
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar">
          {entries.map((entry, index) => {
            const Icon = typeIcons[entry.type];
            const colorClass = typeColors[entry.type];

            return (
              <motion.div
                key={entry.id}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", colorClass)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-foreground truncate">
                      {entry.message}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(entry.timestamp, { addSuffix: true, locale: ptBR })}
                    </span>
                    {entry.filesChanged.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        • {entry.filesChanged.length} arquivo(s)
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
