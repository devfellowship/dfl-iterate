import { useQuery } from '@tanstack/react-query';
import { getAnnouncements } from '@/services';
import { queryKeys } from '@/lib/queryKeys';

export function useAnnouncements() {
  return useQuery({
    queryKey: queryKeys.announcements.all,
    queryFn: getAnnouncements,
  });
}
