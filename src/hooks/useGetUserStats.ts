import { useQuery } from '@tanstack/react-query';
import { getUserStats } from '@/services';
import { queryKeys } from '@/lib/queryKeys';

export function useGetUserStats() {
  return useQuery({
    queryKey: queryKeys.userStats.current,
    queryFn: getUserStats,
  });
}
