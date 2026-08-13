import { useQuery } from '@tanstack/react-query';
import { getLeaderboard } from '@/services/leaderboard.service';
import { queryKeys } from '@/lib/queryKeys';

export function useGetLeaderboard() {
  return useQuery({
    queryKey: queryKeys.leaderboard.list(),
    queryFn: () => getLeaderboard(),
  });
}
