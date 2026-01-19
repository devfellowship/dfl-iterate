import { motion } from 'framer-motion';
import { GitLogEntry } from '@/types';
import { GitCommit, GitBranch, Wrench, ChevronDown, ChevronUp } from 'lucide-react';
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
    <div className="border-t border-border bg-card/50">
      <Button
        variant="ghost"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 h-auto"
      >
        <div className="flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Git Log</span>
          <span className="text-xs text-muted-foreground">({entries.length} commits)</span>
        </div>
        {isCollapsed ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </Button>

      <motion.div
        initial={false}
        animate={{ height: isCollapsed ? 'auto' : 0, opacity: isCollapsed ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="px-4 pb-4 space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
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
      </motion.div>
    </div>
  );
}
