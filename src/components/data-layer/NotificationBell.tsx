import { cn } from '@devfellowship/components';
import { Bell } from 'lucide-react';
import type { NotificationsSummary } from './types';

/**
 * Integração: T10 — header da `HomePage` (drawer no `HomePageHeaderDataSlots`).
 * Fellow: substitui mock por `useGetNotifications()` no container.
 */

export interface NotificationBellIconProps {
  unreadCount: number;
  className?: string;
}

/** Ícone do sino com badge — usar como trigger do drawer no slot. */
export function NotificationBellIcon({ unreadCount, className }: NotificationBellIconProps) {
  return (
    <span className={cn('relative inline-flex', className)}>
      <Bell className="h-4 w-4" />
      {unreadCount > 0 && (
        <span
          className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
          aria-label={`${unreadCount} não lidas`}
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </span>
  );
}

export interface NotificationListProps {
  summary: NotificationsSummary;
  className?: string;
}

function formatCreatedAt(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Lista de notificações — conteúdo do drawer. */
export function NotificationList({ summary, className }: NotificationListProps) {
  if (summary.items.length === 0) {
    return (
      <p className={cn('text-sm text-muted-foreground text-center py-6', className)}>
        Nenhuma notificação.
      </p>
    );
  }

  return (
    <ul className={cn('space-y-2', className)} data-testid="notification-list">
      {summary.items.map((item) => (
        <li
          key={item.id}
          className={cn(
            'rounded-lg border px-3 py-2.5 text-sm',
            item.read
              ? 'border-border bg-muted/20 text-muted-foreground'
              : 'border-primary/25 bg-primary/5 text-foreground font-medium',
          )}
        >
          <p>{item.title}</p>
          <p className="text-xs text-muted-foreground mt-1">{formatCreatedAt(item.createdAt)}</p>
        </li>
      ))}
    </ul>
  );
}
