import type { LessonProgress } from '@/types/LessonProgress';

const initialLessonsProgressData: LessonProgress[] = [
  {
    lessonId: 'lesson-1',
    completedActivities: 5,
    totalActivities: 17,
    percent: null,
  },
  {
    lessonId: 'lesson-2',
    completedActivities: 3,
    totalActivities: 10,
    percent: null,
  },
  {
    lessonId: 'lesson-3',
    completedActivities: 7,
    totalActivities: 15,
    percent: null,
  },
];

let lessonsProgressStore = initialLessonsProgressData.map((progress) => ({ ...progress }));

export function getLessonsProgressData(): LessonProgress[] {
  return lessonsProgressStore.map((progress) => ({ ...progress }));
}

export function setLessonsProgressData(progressData: LessonProgress[]): void {
  lessonsProgressStore = progressData.map((progress) => ({ ...progress }));
}
