export const queryKeys = {
  lessons: {
    all: ['lessons'] as const,
    byId: (id: string) => ['lessons', id] as const,
  },
  activities: {
    byLesson: (lessonId: string) => ['activities', { lessonId }] as const,
 },
  userPreferences: {
    current: ['user-preferences', 'current'] as const,
  },
  lessonProgress: {
    byLesson: (lessonId: string) => ['lessonProgress', lessonId] as const,
  },
} as const;
