import type { UserStats } from '@/types';

const INITIAL_USER_STATS: UserStats = {
  userId: 'user-1',
  totalXp: 1240,
  level: 5,
  currentStreak: 3,
  livesRemaining: 4,
};

let userStatsData: UserStats = { ...INITIAL_USER_STATS };

export function getUserStatsData(): UserStats {
  return { ...userStatsData };
}

export function setUserStatsData(next: UserStats): void {
  userStatsData = { ...next };
}

export function resetUserStatsData(): void {
  userStatsData = { ...INITIAL_USER_STATS };
}
