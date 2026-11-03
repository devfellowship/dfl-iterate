import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { markNotificationAsRead } from '@/services';

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all,
      });
    },
  });
}
