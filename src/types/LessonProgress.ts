export interface LessonProgress {
  lessonId: string;
  completedActivities: number;
  totalActivities: number;
  percent: number | null;
}