import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getNotifications } from '@/services/notifications.service';

export function useGetNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications.mine,
    queryFn: getNotifications,
  });
}