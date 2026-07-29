import {
  getUserStatsData,
  setUserStatsData,
} from '@/test-utils/user-stats.dummy';
import type { UserStats } from '@/types';

const SIMULATED_LATENCY_MS = 300;
const DEFAULT_PRACTICE_XP = 25;
const XP_PER_LEVEL = 250;
const MOCK_USER_ID = 'user-1';

const simulateNetworkDelay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

function computeLevel(totalXp: number): number {
  return Math.floor(totalXp / XP_PER_LEVEL) + 1;
}

export async function getUserStats(): Promise<UserStats> {
  await simulateNetworkDelay();
  const stats = getUserStatsData();
  if (stats.userId !== MOCK_USER_ID) {
    throw new Error(`User stats not found: ${stats.userId}`);
  }
  return stats;
}

export async function claimPracticeXp(
  amount: number = DEFAULT_PRACTICE_XP,
): Promise<UserStats> {
  await simulateNetworkDelay();

  const current = getUserStatsData();
  if (current.userId !== MOCK_USER_ID) {
    throw new Error(`User stats not found: ${current.userId}`);
  }

  if (amount <= 0) {
    throw new Error(`Invalid practice XP amount: ${amount}`);
  }

  const totalXp = current.totalXp + amount;
  const next: UserStats = {
    ...current,
    totalXp,
    level: computeLevel(totalXp),
  };
  setUserStatsData(next);
  return getUserStatsData();
}
