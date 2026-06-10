import { cn } from '@devfellowship/components';
import { Award, BookCheck, Flame } from 'lucide-react';
import type { ActivityEvent, ActivityEventType } from './types';

/**
 * Integração: T11 — corpo da `HomePage` (`HomePageTopDataSlots`, abaixo dos avisos).
 * Fellow: substitui mock por `useGetRecentActivity()` no container.
 */

const eventConfig: Record<
  ActivityEventType,
  { icon: typeof BookCheck; color: string }
> = {
  lesson_completed: { icon: BookCheck, color: 'text-primary' },
  achievement_unlocked: { icon: Award, color: 'text-xp' },
  streak_milestone: { icon: Flame, color: 'text-streak' },
};

export interface RecentActivityFeedProps {
  events: ActivityEvent[];
  className?: string;
}

function formatOccurredAt(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function RecentActivityFeed({ events, className }: RecentActivityFeedProps) {
  if (events.length === 0) {
    return (
      <p className={cn('text-sm text-muted-foreground text-center py-6', className)}>
        Nenhuma atividade recente.
      </p>
    );
  }

  return (
    <ul className={cn('space-y-0', className)} data-testid="recent-activity-feed">
      {events.map((event, index) => {
        const config = eventConfig[event.type];
        const Icon = config.icon;

        return (
          <li key={event.id} className="relative flex gap-3 pb-6 last:pb-0">
            {index < events.length - 1 && (
              <span
                className="absolute left-[15px] top-8 bottom-0 w-px bg-border"
                aria-hidden
              />
            )}
            <span
              className={cn(
                'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card',
                config.color,
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-sm text-foreground">{event.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatOccurredAt(event.occurredAt)}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
