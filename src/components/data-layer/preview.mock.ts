/**
 * Mock de preview para a aula do batch Camada de Dados.
 *
 * REMOVER quando fellows integrarem hooks reais — substituir por useGet* + dummy/service.
 * Fellows: não importem este arquivo nas tasks finais.
 */
import type {
  ActivityEvent,
  Announcement,
  DailyChallenge,
  LeaderboardEntry,
  LearningResume,
  LessonProgress,
  NotificationsSummary,
  UserAchievement,
  UserPreferences,
  UserProfile,
  UserStats,
} from './types';

export const previewUserProfile: UserProfile = {
  id: 'user-1',
  name: 'Ana Fellow',
  email: 'ana.fellow@devfellowship.dev',
  age: 24,
  avatarUrl: 'https://i.pravatar.cc/64?u=user-1',
};

export const previewUserPreferences: UserPreferences = {
  userId: 'user-1',
  theme: 'dark',
  soundEffectsEnabled: true,
  language: 'pt-BR',
};

export const previewUserStats: UserStats = {
  userId: 'user-1',
  totalXp: 1240,
  level: 5,
  currentStreak: 3,
  livesRemaining: 4,
};

export const previewAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Manutenção programada',
    body: 'No domingo, 02h–04h, o iterate ficará indisponível para atualizações.',
    severity: 'warning',
    publishedAt: '2026-05-20T10:00:00.000Z',
    expiresAt: '2026-06-30T23:59:59.000Z',
  },
  {
    id: 'ann-2',
    title: 'Novas activities disponíveis',
    body: 'A lição E-commerce Frontend agora tem 17 activities para praticar.',
    severity: 'success',
    publishedAt: '2026-05-15T08:00:00.000Z',
    expiresAt: null,
  },
  {
    id: 'ann-3',
    title: 'Dica da semana',
    body: 'Use o histórico de IA para revisar feedbacks das activities anteriores.',
    severity: 'info',
    publishedAt: '2026-05-10T12:00:00.000Z',
    expiresAt: null,
  },
];

export const previewLessonProgress: LessonProgress = {
  lessonId: 'lesson-1',
  completedActivities: 5,
  totalActivities: 17,
  percent: 29,
};

export const previewAchievements: UserAchievement[] = [
  {
    id: 'ach-1',
    title: 'Primeira lição',
    description: 'Complete sua primeira activity com sucesso.',
    iconEmoji: '🎯',
    unlockedAt: '2026-05-10T14:22:00.000Z',
  },
  {
    id: 'ach-2',
    title: 'Sequência de fogo',
    description: 'Mantenha um streak de 3 dias.',
    iconEmoji: '🔥',
    unlockedAt: '2026-05-25T09:00:00.000Z',
  },
  {
    id: 'ach-3',
    title: 'Mestre do debug',
    description: 'Acerte 5 activities FixTheCode seguidas.',
    iconEmoji: '🐛',
    unlockedAt: null,
  },
];

export const previewDailyChallenge: DailyChallenge = {
  id: 'dc-2026-05-28',
  title: 'Desafio do dia: Corrija o bug',
  description: 'Complete a próxima activity FixTheCode da lição E-commerce Frontend.',
  bonusXp: 50,
  expiresAt: '2026-05-28T23:59:59.000Z',
  targetLessonId: 'lesson-1',
};

export const previewLearningResume: LearningResume = {
  lessonId: 'lesson-1',
  lessonTitle: 'E-commerce Frontend com AI',
  completedActivities: 5,
  totalActivities: 17,
  lastVisitedAt: '2026-05-27T18:30:00.000Z',
  percent: 29,
};

export const previewNotifications: NotificationsSummary = {
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

export const previewActivityEvents: ActivityEvent[] = [
  {
    id: 'evt-1',
    type: 'lesson_completed',
    label: 'Você completou a activity act-05',
    occurredAt: '2026-05-27T18:30:00.000Z',
  },
  {
    id: 'evt-2',
    type: 'achievement_unlocked',
    label: 'Conquista desbloqueada: Sequência de fogo',
    occurredAt: '2026-05-25T09:00:00.000Z',
  },
  {
    id: 'evt-3',
    type: 'streak_milestone',
    label: 'Streak de 3 dias alcançado',
    occurredAt: '2026-05-25T09:00:00.000Z',
  },
];

export const previewLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'user-42',
    displayName: 'Carlos Dev',
    avatarUrl: 'https://i.pravatar.cc/64?u=user-42',
    totalXp: 3200,
    isCurrentUser: false,
  },
  {
    rank: 2,
    userId: 'user-17',
    displayName: 'Beatriz Code',
    avatarUrl: 'https://i.pravatar.cc/64?u=user-17',
    totalXp: 2850,
    isCurrentUser: false,
  },
  {
    rank: 3,
    userId: 'user-1',
    displayName: 'Ana Fellow',
    avatarUrl: 'https://i.pravatar.cc/64?u=user-1',
    totalXp: 1240,
    isCurrentUser: true,
  },
  {
    rank: 4,
    userId: 'user-88',
    displayName: 'Diego React',
    avatarUrl: 'https://i.pravatar.cc/64?u=user-88',
    totalXp: 980,
    isCurrentUser: false,
  },
];
