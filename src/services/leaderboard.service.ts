import { leaderboardData } from '@/test-utils/leaderboard.dummy';
import { simulateNetworkDelay } from '@/services/activities.service';
import type { LeaderboardEntry } from '@/types/LeaderboardEntry';

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
    await simulateNetworkDelay();

    if (!leaderboardData) {
        throw new Error('Leaderboard data is not available.');
    }

    return [...leaderboardData].sort((a, b) => a.rank - b.rank);
}