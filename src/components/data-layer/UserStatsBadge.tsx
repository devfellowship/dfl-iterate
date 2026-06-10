import { cn } from '@devfellowship/components';
import { Flame, Heart, Zap } from 'lucide-react';
import type { UserStats } from './types';

/**
 * Integração: T4 — header da `HomePage` (`HomePageHeaderDataSlots`).
 * Fellow: `useGetUserStats` no container; passe `stats` via props.
 */

export interface UserStatsBadgeProps {
  stats: UserStats;
  className?: string;
}

export function UserStatsBadge({ stats, className }: UserStatsBadgeProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-semibold',
        className,
      )}
      data-testid="user-stats-badge"
    >
      <span className="inline-flex items-center gap-1 rounded-full border border-xp/20 bg-xp/10 px-2.5 py-1 text-xp">
        <Zap className="h-3.5 w-3.5" />
        Lv. {stats.level}
      </span>
      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-foreground">
        {stats.totalXp.toLocaleString('pt-BR')} XP
      </span>
      <span className="inline-flex items-center gap-1 rounded-full border border-streak/20 bg-streak/10 px-2.5 py-1 text-streak">
        <Flame className="h-3.5 w-3.5" />
        {stats.currentStreak}
      </span>
      <span
        className="inline-flex items-center gap-1 rounded-full border border-life/20 bg-life/10 px-2.5 py-1 text-life"
        title="Vidas restantes"
      >
        <Heart className="h-3.5 w-3.5 fill-life" />
        {stats.livesRemaining}
      </span>
    </div>
  );
}
