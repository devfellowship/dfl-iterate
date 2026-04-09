import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, CheckCircle2, XCircle, ChevronRight, RotateCcw } from 'lucide-react';
import { Activity } from '@/types';
import { ActivityGameCard } from '@/components/game';
import { ActivityType } from '@/enums';
import { LineType, useREPLChallenge } from '@/hooks/useREPLChallenge';

interface REPLChallengeProps {
  activity: Activity;
  onSubmit: (commands: string[]) => void;
}

const lineColor: Record<LineType, string> = {
  prompt: 'text-green-400',
  output: 'text-gray-300',
  error: 'text-red-400',
  success: 'text-emerald-400',
  info: 'text-gray-500',
};

function stepIcon(status: 'idle' | 'success' | 'error', index: number, currentStep: number) {
  if (status === 'success') return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
  if (status === 'error') return <XCircle className="w-4 h-4 text-red-400 shrink-0" />;
  if (index === currentStep) return <ChevronRight className="w-4 h-4 text-green-400 shrink-0 animate-pulse" />;
  return <span className="w-4 h-4 rounded-full border border-gray-600 shrink-0 inline-block" />;
}

export function REPLChallenge({ activity, onSubmit }: REPLChallengeProps) {
  const {
    lines, input, setInput, currentStep, stepStatus, done,
    commands, prompt, inputRef, scrollRef,
    focusInput, handleSubmit, handleKeyDown, handleReset,
  } = useREPLChallenge(activity, onSubmit);

  return (
    <ActivityGameCard
      type={ActivityType.REPL_CHALLENGE}
      title={activity.title}
      question={activity.objective || 'Execute os comandos corretos no terminal.'}
      actions={
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-sm font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          Reiniciar
        </button>
      }
    >
      <div className="flex gap-4 h-full overflow-hidden">
        {/* Left: Instructions panel */}
        <div className="w-64 shrink-0 flex flex-col gap-3 overflow-y-auto pr-1">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Instruções</p>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
              {activity.instructions}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 flex-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
              Progresso ({Math.min(currentStep, commands.length)}/{commands.length})
            </p>
            <div className="flex flex-col gap-3">
              {commands.map((cmd, i) => (
                <motion.div
                  key={i}
                  className={`flex gap-2 items-start transition-opacity ${i > currentStep ? 'opacity-30' : 'opacity-100'}`}
                  animate={stepStatus[i] === 'error' ? { x: [0, -4, 4, -4, 0] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mt-0.5">{stepIcon(stepStatus[i], i, currentStep)}</div>
                  <div className="min-w-0">
                    <code className={`text-xs font-mono block truncate ${
                      stepStatus[i] === 'success' ? 'text-emerald-400' :
                      i === currentStep ? 'text-green-300' : 'text-gray-400'
                    }`}>
                      {cmd.command}
                    </code>
                    <span className="text-xs text-muted-foreground leading-tight block mt-0.5">
                      {cmd.description}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Terminal */}
        <div
          className="flex-1 flex flex-col rounded-xl overflow-hidden border border-gray-700 cursor-text"
          onClick={focusInput}
          style={{ background: '#0d1117' }}
        >
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-700/60" style={{ background: '#161b22' }}>
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Terminal className="w-3 h-3" />
                <span className="font-mono">bash</span>
              </div>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 font-mono text-sm leading-6"
            style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace" }}
          >
            <AnimatePresence initial={false}>
              {lines.map(line => (
                <motion.div
                  key={line.id}
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.12 }}
                  className={`${lineColor[line.type]} whitespace-pre-wrap break-all`}
                >
                  {line.content || '\u00A0'}
                </motion.div>
              ))}
            </AnimatePresence>

            {!done && (
              <div className="flex items-center gap-0 text-green-400">
                <span className="shrink-0">{prompt}</span>
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    className="w-full bg-transparent outline-none text-green-400 caret-green-400 font-mono"
                    style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 'inherit', lineHeight: 'inherit' }}
                  />
                </div>
              </div>
            )}

            {done && (
              <div className="text-green-400 mt-1 animate-pulse">{prompt}▋</div>
            )}
          </div>
        </div>
      </div>
    </ActivityGameCard>
  );
}