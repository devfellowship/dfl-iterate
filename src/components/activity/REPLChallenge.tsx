import { RotateCcw } from 'lucide-react';
import { Activity } from '@/types';
import { ActivityGameCard } from '@/components/game';
import { ActivityType } from '@/enums';
import { useREPLChallenge } from '@/hooks/useREPLChallenge';
import { TerminalTitleBar } from '@/components/molecules/TerminalTitleBar/TerminalTitleBar';
import { TerminalOutput } from '@/components/molecules/TerminalOutput/TerminalOutput';
import { CommandStep } from '@/components/molecules/CommandSteps/CommandSteps';

interface REPLChallengeProps {
  activity: Activity;
  onSubmit: (commands: string[]) => void;
}

export function REPLChallenge({ activity, onSubmit }: REPLChallengeProps) {
  const {
    lines, input, setInput, currentStep, stepStatus, done,
    commands, prompt, inputRef, scrollRef,
    focusInput, handleKeyDown, handleReset,
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

        <div className="w-64 shrink-0 flex flex-col gap-3 overflow-y-auto pr-1">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Instruções</p>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
              {activity.instructions}
            </p>
          </div>
          <CommandStep
            commands={commands}
            currentStep={currentStep}
            stepStatus={stepStatus}
          />
        </div>

        <div
          className="flex-1 flex flex-col rounded-xl overflow-hidden border border-gray-700 cursor-text"
          onClick={focusInput}
          style={{ background: '#0d1117' }}
        >
          <TerminalTitleBar />
          <TerminalOutput
            lines={lines}
            done={done}
            prompt={prompt}
            input={input}
            inputRef={inputRef}
            scrollRef={scrollRef}
            setInput={setInput}
            onKeyDown={handleKeyDown}
          />
        </div>

      </div>
    </ActivityGameCard>
  );
}