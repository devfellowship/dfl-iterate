import { useQuery } from '@tanstack/react-query';
import { getLeaderboard } from '@/services/leaderboard.service';
import { queryKeys } from '@/lib/queryKeys';


export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avatarUrl: string;
  totalXp: number;
  rank: number;
  isCurrentUser: boolean;
}

export function useGetLeaderboard(limit = 10) {
  return useQuery({
    queryKey: queryKeys.leaderboard.list(limit),
    queryFn: () => getLeaderboard(limit),
  });
}
