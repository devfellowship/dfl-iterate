import {
  getDailyChallengeData,
  setDailyChallengeData,
} from '@/test-utils/daily-challenge.dummy';
import type { DailyChallenge } from '@/types';

const SIMULATED_LATENCY_MS = 300;

const simulateNetworkDelay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

export async function getDailyChallenge(): Promise<DailyChallenge> {
  await simulateNetworkDelay();
  const challenge = getDailyChallengeData();
  if (!challenge.id) {
    throw new Error('Daily challenge not found');
  }
  return challenge;
}

export async function completeDailyChallenge(): Promise<DailyChallenge> {
  await simulateNetworkDelay();

  const current = getDailyChallengeData();
  if (!current.id) {
    throw new Error('Daily challenge not found');
  }

  if (current.completedAt) {
    return { ...current };
  }

  const next: DailyChallenge = {
    ...current,
    completedAt: new Date().toISOString(),
  };
  setDailyChallengeData(next);
  return getDailyChallengeData();
}
