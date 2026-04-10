import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

interface TerminalCommand {
  command: string;
  description: string;
}

type StepStatus = 'idle' | 'success' | 'error';

interface CommandStepProps {
  commands: TerminalCommand[];
  currentStep: number;
  stepStatus: StepStatus[];
}

function StepIcon({ status, index, currentStep }: { status: StepStatus; index: number; currentStep: number }) {
  if (status === 'success') return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
  if (status === 'error') return <XCircle className="w-4 h-4 text-red-400 shrink-0" />;
  if (index === currentStep) return <ChevronRight className="w-4 h-4 text-green-400 shrink-0 animate-pulse" />;
  return <span className="w-4 h-4 rounded-full border border-gray-600 shrink-0 inline-block" />;
}

export function CommandStep({ commands, currentStep, stepStatus }: CommandStepProps) {
  return (
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
            <div className="mt-0.5">
              <StepIcon status={stepStatus[i]} index={i} currentStep={currentStep} />
            </div>
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
  );
}