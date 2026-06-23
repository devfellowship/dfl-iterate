import { userStatsData } from '@/test-utils/user-stats.dummy';
import type { UserStats } from '@/types/UserStats';

const SIMULATED_LATENCY_MS = 300;

const simulateNetworkDelay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

export async function getUserStats(): Promise<UserStats> {
  await simulateNetworkDelay();
  return userStatsData;
}
