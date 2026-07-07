export type AnnouncementSeverity = 'info' | 'warning' | 'success';

export interface Announcement {
  id: string;
  title: string;
  body: string;
  severity: AnnouncementSeverity;
  publishedAt: string;
  expiresAt: string | null;
}
