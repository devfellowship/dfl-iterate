import {
  getNotificationsData,
  setNotificationsData,
} from '@/test-utils/notifications.dummy';
import type { Notification, NotificationsSummary } from '@/types';

const SIMULATED_LATENCY_MS = 300;

const simulateNetworkDelay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

export async function getNotifications(): Promise<NotificationsSummary> {
  await simulateNetworkDelay();

  const { items } = getNotificationsData();
  const unreadCount = items.filter((n) => !n.read).length;

  return { unreadCount, items };
}

export async function markNotificationAsRead(
  id: string,
): Promise<NotificationsSummary> {
  await simulateNetworkDelay();

  const { items } = getNotificationsData();
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error(`Notification not found: ${id}`);
  }

  const updated: Notification = { ...items[index], read: true };
  const nextItems = [...items];
  nextItems[index] = updated;

  const unreadCount = nextItems.filter((n) => !n.read).length;
  const next: NotificationsSummary = { unreadCount, items: nextItems };

  setNotificationsData(next);
  return next;
}
