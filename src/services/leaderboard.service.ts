import { leaderboardData } from '@/test-utils/leaderboard.dummy';
import { simulateNetworkDelay } from '@/services/activities.service';
import type { LeaderboardEntry } from '@/types/LeaderboardEntry';

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
    await simulateNetworkDelay();

    if (!leaderboardData || leaderboardData.length === 0) {
        throw new Error('Leaderboard data is empty or not available.');
    }

    const leaderBoardDataSorted = [...leaderboardData]
        .sort((a, b) => a.rank - b.rank)
    
    return leaderBoardDataSorted;
};