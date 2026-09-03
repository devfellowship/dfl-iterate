import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markNotificationAsRead } from '@/services/notifications.service';
import { queryKeys } from '@/lib/queryKeys';

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