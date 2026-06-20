import { leaderboardData } from '@/test-utils/leaderboard.dummy';
import { simulateNetworkDelay } from '@/services/activities.service';

export async function getLeaderboard(limit) {
    await simulateNetworkDelay();

    if (!leaderboardData || leaderboardData.length === 0) {
        throw new Error('Leaderboard data is empty or not available.');
    }

    return Promise.resolve(leaderboardData.slice(0, limit));
};