export interface Notification {
  id: string;
  title: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationsSummary {
  unreadCount: number;
  items: Notification[];
}