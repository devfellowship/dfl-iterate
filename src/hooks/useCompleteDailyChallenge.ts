import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeDailyChallenge } from '@/services';
import { queryKeys } from '@/lib/queryKeys';

export function useCompleteDailyChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeDailyChallenge,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.dailyChallenge.current,
      });
    },
  });
}
