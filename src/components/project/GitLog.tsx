import { motion, AnimatePresence } from 'framer-motion';
import { GitLogEntry } from '@/types';
import { Terminal, X, CheckCircle, GitBranch, Wrench } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GitLogProps {
  entries: GitLogEntry[];
  isOpen: boolean;
  onToggle: () => void;
}

const typeIcons: Record<string, typeof CheckCircle> = {
  'activity_complete': CheckCircle,
  'decision': GitBranch,
  'fix': Wrench,
};

const typeColors: Record<string, string> = {
  'activity_complete': 'text-success',
  'decision': 'text-primary',
  'fix': 'text-warning',
};

export function GitLog({ entries, isOpen, onToggle }: GitLogProps) {
  return (
    <>
      {/* Button rendered externally now via LessonPage */}

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
            />
            <motion.div
              className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-primary" />
                  <h2 className="font-bold text-lg">Git Log</h2>
                </div>
                <button onClick={onToggle} className="p-2 rounded-lg hover:bg-muted">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {entries.map((entry, index) => {
                  const Icon = typeIcons[entry.type] || CheckCircle;
                  const colorClass = typeColors[entry.type] || 'text-muted-foreground';
                  return (
                    <motion.div
                      key={entry.id}
                      className="flex gap-3 p-3 rounded-xl bg-muted/30 border border-border"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Icon className={`w-5 h-5 shrink-0 ${colorClass}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm text-foreground truncate">{entry.message}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>{formatDistanceToNow(entry.timestamp, { addSuffix: true, locale: ptBR })}</span>
                          <span>•</span>
                          <span>{entry.filesChanged.length} arquivo(s)</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
