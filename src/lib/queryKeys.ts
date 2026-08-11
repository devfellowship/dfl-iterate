export const queryKeys = {
  lessons: {
    all: ["lessons"] as const,
    byId: (id: string) => ["lessons", id] as const,
  },
  activities: {
    byLesson: (lessonId: string) => ["activities", { lessonId }] as const,
  },
  activityEvents: {
    recent: () => ['activityEvents', "recent"] as const,
  },
  userPreferences: {
    current: ['user-preferences', 'current'] as const,
  },
  lessonProgress: {
    byLesson: (lessonId: string) => ['lessonProgress', lessonId] as const,
  },
  userStats: {
    current: ['userStats', 'current'] as const,
    byUserId: (userId: string) => ['userStats', { userId }] as const,
  },
  leaderboard: {
    all: ['leaderboard'] as const,
    list: () => ['leaderboard', 'list'] as const,
  },
  notifications: {
    all: ['notifications'] as const,
  },
} as const;