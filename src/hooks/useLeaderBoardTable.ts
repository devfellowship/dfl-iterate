import { useEffect, useState } from 'react';
import { getLeaderboard } from '@/services/leaderboard.service';

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avatarUrl: string;
  xp: number;
  rank: number;
  isCurrentUser: boolean;
}

export function useLeaderBoardTable(limit: number) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        const data = await getLeaderboard(limit);
        setEntries(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [limit]);

  return { entries, loading, error };
}






