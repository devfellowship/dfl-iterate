import { cn } from '@devfellowship/components';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import type { Announcement, AnnouncementSeverity } from './types';

/**
 * Integração: T3 — seção "Avisos" na `HomePage` (acima do grid de lições).
 * Fellow: `useGetAnnouncements` no container; passe `announcements` via props.
 */

const severityStyles: Record<
  AnnouncementSeverity,
  { border: string; bg: string; icon: typeof Info }
> = {
  info: {
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/5',
    icon: Info,
  },
  warning: {
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/10',
    icon: AlertCircle,
  },
  success: {
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    icon: CheckCircle2,
  },
};

export interface AnnouncementListProps {
  announcements: Announcement[];
  className?: string;
}

export function AnnouncementList({ announcements, className }: AnnouncementListProps) {
  if (announcements.length === 0) {
    return (
      <p
        className={cn('text-sm text-muted-foreground text-center py-4', className)}
        data-testid="announcement-list-empty"
      >
        Nenhum aviso no momento.
      </p>
    );
  }

  return (
    <ul className={cn('space-y-3', className)} data-testid="announcement-list">
      {announcements.map((item) => {
        const style = severityStyles[item.severity];
        const Icon = style.icon;

        return (
          <li
            key={item.id}
            className={cn(
              'rounded-lg border px-4 py-3',
              style.border,
              style.bg,
            )}
          >
            <div className="flex gap-3">
              <Icon className="h-5 w-5 shrink-0 mt-0.5 opacity-80" />
              <div className="min-w-0">
                <p className="font-semibold text-foreground text-sm">{item.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{item.body}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
