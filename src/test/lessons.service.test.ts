import { afterEach, describe, expect, it } from 'vitest';
import {
  advanceLessonProgress,
  getLessonProgress,
} from '@/services/lessons.service';
import {
  getLessonsProgressData,
  setLessonsProgressData,
} from '@/test-utils/lesson-progress.dummy';

const originalProgress = getLessonsProgressData();

afterEach(() => {
  setLessonsProgressData(originalProgress);
});

describe('lesson progress service', () => {
  it('advances progress and recalculates the percent', async () => {
    await expect(advanceLessonProgress('lesson-1')).resolves.toMatchObject({
      completedActivities: 6,
      totalActivities: 17,
      percent: 35,
    });
  });

  it('does not mutate the stored progress during a GET', async () => {
    const progress = await getLessonProgress('lesson-1');

    expect(progress.percent).toBe(29);
    expect(getLessonsProgressData().find((item) => item.lessonId === 'lesson-1')?.percent).toBeNull();
  });

  it('fails clearly when progress is already complete', async () => {
    setLessonsProgressData([
      {
        lessonId: 'lesson-1',
        completedActivities: 17,
        totalActivities: 17,
        percent: 100,
      },
    ]);

    await expect(advanceLessonProgress('lesson-1')).rejects.toThrow(
      'Lesson progress is already complete',
    );
  });
});