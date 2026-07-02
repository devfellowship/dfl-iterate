import { notificationsData } from '@/test-utils/notifications.dummy';
import type { NotificationsSummary } from '@/types';

const SIMULATED_LATENCY_MS = 300;

const simulateNetworkDelay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

export async function getNotifications(): Promise<NotificationsSummary> {
  await simulateNetworkDelay();
  const items = notificationsData.items;
  const unreadCount = items.filter((n) => !n.read).length;
  return { unreadCount, items };
}