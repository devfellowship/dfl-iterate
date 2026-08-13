import type { NotificationsSummary } from '@/types';

export const notificationsData: NotificationsSummary = {
  unreadCount: 2,
  items: [
    {
      id: 'notif-1',
      title: 'Nova conquista desbloqueada',
      read: false,
      createdAt: '2026-05-28T08:00:00.000Z',
    },
    {
      id: 'notif-2',
      title: 'Seu streak está em risco!',
      read: false,
      createdAt: '2026-05-27T20:15:00.000Z',
    },
    {
      id: 'notif-3',
      title: 'Bem-vindo ao iterate',
      read: true,
      createdAt: '2026-05-01T10:00:00.000Z',
    },
  ],
};