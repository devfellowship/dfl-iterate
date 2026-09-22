import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { advanceLessonProgress } from '@/services';

export function useAdvanceLessonProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lessonId: string) => advanceLessonProgress(lessonId),
    onSuccess: (_, lessonId) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.lessonProgress.byLesson(lessonId),
      });
    },
  });
}