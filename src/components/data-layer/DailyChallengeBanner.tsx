import { Link } from 'react-router-dom';
import { cn } from '@devfellowship/components';
import { Button } from '@devfellowship/components';
import { CheckCircle2, Sparkles, Timer } from 'lucide-react';
import type { DailyChallenge } from '@/types';

/**
 * Integração: T7 — topo da `HomePage`, abaixo do header de marketing.
 * Fellow: `useGetDailyChallenge` no container; passe `challenge` via props.
 */

export interface DailyChallengeBannerProps {
  challenge: DailyChallenge;
  className?: string;
  onComplete?: () => void;
  isCompleting?: boolean;
}

function formatExpiry(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) return 'Expira hoje';
  return `Expira em ${date.toLocaleDateString('pt-BR')}`;
}

export function DailyChallengeBanner({
  challenge,
  className,
  onComplete,
  isCompleting = false,
}: DailyChallengeBannerProps) {
  const isCompleted = Boolean(challenge.completedAt);

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-5 md:p-6',
        isCompleted && 'border-success/40 from-success/10',
        className,
      )}
      data-testid="daily-challenge-banner"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Desafio do dia
            </span>
            {isCompleted ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Concluído
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Timer className="h-3.5 w-3.5" />
                {formatExpiry(challenge.expiresAt)}
              </span>
            )}
            <span className="rounded-full bg-xp/15 px-2 py-0.5 text-xs font-bold text-xp">
              +{challenge.bonusXp} XP
            </span>
          </div>
          <h2 className="text-lg font-bold text-foreground">{challenge.title}</h2>
          <p className="text-sm text-muted-foreground max-w-xl">{challenge.description}</p>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-2 md:w-auto">
          {onComplete && !isCompleted ? (
            <Button
              type="button"
              className="w-full md:w-auto"
              disabled={isCompleting}
              onClick={onComplete}
            >
              {isCompleting ? 'Concluindo…' : 'Concluir desafio'}
            </Button>
          ) : null}
          <Button
            asChild
            variant={isCompleted || !onComplete ? 'default' : 'outline'}
            className="w-full md:w-auto"
          >
            <Link to={`/lesson/${challenge.targetLessonId}`}>Ver desafio</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
