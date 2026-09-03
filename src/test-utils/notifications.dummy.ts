import type { NotificationsSummary } from '@/types';

const INITIAL_NOTIFICATIONS: NotificationsSummary = {
  unreadCount: 2,
  items: [
    { id: 'notif-1', title: 'Nova conquista desbloqueada', read: false, createdAt: '2026-05-28T08:00:00.000Z' },
    { id: 'notif-2', title: 'Seu streak está em risco!', read: false, createdAt: '2026-05-27T20:15:00.000Z' },
    { id: 'notif-3', title: 'Bem-vindo ao iterate', read: true, createdAt: '2026-05-01T10:00:00.000Z' },
  ],
};

let notificationsData: NotificationsSummary = {
  ...INITIAL_NOTIFICATIONS,
  items: [...INITIAL_NOTIFICATIONS.items],
};

export function getNotificationsData(): NotificationsSummary {
  return { ...notificationsData, items: [...notificationsData.items] };
}

export function setNotificationsData(next: NotificationsSummary): void {
  notificationsData = { ...next, items: [...next.items] };
}

export function resetNotificationsData(): void {
  notificationsData = {
    ...INITIAL_NOTIFICATIONS,
    items: [...INITIAL_NOTIFICATIONS.items],
  };
}
