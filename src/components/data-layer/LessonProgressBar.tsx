import { cn } from '@devfellowship/components';
import type { LessonProgress } from '@/components/data-layer/types';

export interface LessonProgressBarProps {
  progress: LessonProgress;
  className?: string;
}

export function LessonProgressBar({ progress, className }: LessonProgressBarProps) {
  return (
    <div className={cn('space-y-1.5', className)} data-testid="lesson-progress-bar">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Progresso</span>
        <span>
          {progress.completedActivities} de {progress.totalActivities} atividades
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={progress.percent ?? 0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${progress.percent ?? 0}% concluído`}
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progress.percent ?? 0}%` }}
        />
      </div>
      <p className="text-xs font-medium text-foreground">{progress.percent ?? 0}% concluído</p>
    </div>
  );
}
