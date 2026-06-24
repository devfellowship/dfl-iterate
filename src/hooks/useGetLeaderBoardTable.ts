import { useQuery } from '@tanstack/react-query';
import { getLeaderboard } from '@/services/leaderboard.service';
import { queryKeys } from '@/lib/queryKeys';

export function useGetLeaderboard(limit = 10) {
  return useQuery({
    queryKey: queryKeys.leaderboard.list(limit),
    queryFn: () => getLeaderboard(limit),
  });
}
