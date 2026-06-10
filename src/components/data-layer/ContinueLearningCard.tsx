import { Link } from 'react-router-dom';
import { cn } from '@devfellowship/components';
import { Button } from '@devfellowship/components';
import { BookOpen, Clock } from 'lucide-react';
import type { LearningResume } from './types';

/**
 * Integração: T9 — corpo da `HomePage` (`HomePageTopDataSlots`).
 * Fellow: substitui mock por `useGetLearningResume()` no container.
 */

export interface ContinueLearningCardProps {
  resume: LearningResume;
  className?: string;
}

function formatLastVisited(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ContinueLearningCard({ resume, className }: ContinueLearningCardProps) {
  return (
    <article
      className={cn(
        'rounded-xl border border-border bg-card p-5 md:p-6',
        className,
      )}
      data-testid="continue-learning-card"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3 min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
            <BookOpen className="h-4 w-4" />
            Continue de onde parou
          </div>
          <h2 className="text-lg font-bold text-foreground truncate">{resume.lessonTitle}</h2>
          <div className="space-y-1.5 max-w-md">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progresso</span>
              <span>
                {resume.completedActivities} de {resume.totalActivities} atividades
              </span>
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={resume.percent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${resume.percent}%` }}
              />
            </div>
            <p className="text-xs font-medium text-foreground">{resume.percent}% concluído</p>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            Última visita: {formatLastVisited(resume.lastVisitedAt)}
          </p>
        </div>
        <Button asChild className="shrink-0 w-full md:w-auto">
          <Link to={`/lesson/${resume.lessonId}`}>Continuar lição</Link>
        </Button>
      </div>
    </article>
  );
}
