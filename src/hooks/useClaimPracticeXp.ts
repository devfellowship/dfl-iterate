import { useMutation, useQueryClient } from '@tanstack/react-query';
import { claimPracticeXp } from '@/services';
import { queryKeys } from '@/lib/queryKeys';

export function useClaimPracticeXp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount?: number) => claimPracticeXp(amount ?? 25),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.userStats.current,
      });
    },
  });
}
