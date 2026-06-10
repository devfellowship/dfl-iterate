import { cn } from '@devfellowship/components';
import { Lock } from 'lucide-react';
import type { UserAchievement } from './types';

/**
 * Integração: T6 — drawer 🏆 no header da `HomePage` (`HomePageHeaderDataSlots`).
 * Fellow: `useGetUserAchievements` no container; passe `achievements` via props.
 */

export interface AchievementsListProps {
  achievements: UserAchievement[];
  className?: string;
}

function formatUnlockedDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function AchievementsList({ achievements, className }: AchievementsListProps) {
  if (achievements.length === 0) {
    return (
      <p className={cn('text-sm text-muted-foreground text-center py-6', className)}>
        Nenhuma conquista cadastrada.
      </p>
    );
  }

  return (
    <ul className={cn('space-y-3', className)} data-testid="achievements-list">
      {achievements.map((item) => {
        const unlocked = item.unlockedAt !== null;

        return (
          <li
            key={item.id}
            className={cn(
              'flex gap-3 rounded-lg border p-3',
              unlocked
                ? 'border-primary/20 bg-primary/5'
                : 'border-border bg-muted/30 opacity-75',
            )}
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background text-xl"
              aria-hidden
            >
              {unlocked ? item.iconEmoji : <Lock className="h-4 w-4 text-muted-foreground" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
              {unlocked && item.unlockedAt && (
                <p className="text-xs text-primary mt-1.5">
                  Desbloqueada em {formatUnlockedDate(item.unlockedAt)}
                </p>
              )}
              {!unlocked && (
                <p className="text-xs text-muted-foreground mt-1.5">Bloqueada</p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
