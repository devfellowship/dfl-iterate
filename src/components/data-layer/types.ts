/**
 * Tipos dos componentes do batch Camada de Dados.
 *
 * Fellow: mova estas interfaces para `src/types/index.ts` na sua task
 * e atualize os imports nos componentes abaixo.
 */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  avatarUrl: string;
}

export type ThemePreference = 'light' | 'dark' | 'system';

export interface UserPreferences {
  userId: string;
  theme: ThemePreference;
  soundEffectsEnabled: boolean;
  language: 'pt-BR' | 'en-US';
}

export type AnnouncementSeverity = 'info' | 'warning' | 'success';

export interface Announcement {
  id: string;
  title: string;
  body: string;
  severity: AnnouncementSeverity;
  publishedAt: string;
  expiresAt: string | null;
}

export interface UserStats {
  userId: string;
  totalXp: number;
  level: number;
  currentStreak: number;
  livesRemaining: number;
}

export interface LessonProgress {
  lessonId: string;
  completedActivities: number;
  totalActivities: number;
  percent: number;
}

export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  iconEmoji: string;
  unlockedAt: string | null;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  bonusXp: number;
  expiresAt: string;
  targetLessonId: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl: string;
  totalXp: number;
  isCurrentUser: boolean;
}

export interface LearningResume {
  lessonId: string;
  lessonTitle: string;
  completedActivities: number;
  totalActivities: number;
  lastVisitedAt: string;
  percent: number;
}

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

export type ActivityEventType =
  | 'lesson_completed'
  | 'achievement_unlocked'
  | 'streak_milestone';

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  label: string;
  occurredAt: string;
}
