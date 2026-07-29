import type { DailyChallenge } from '@/types';

const INITIAL_DAILY_CHALLENGE: DailyChallenge = {
  id: 'dc-2026-05-28',
  title: 'Desafio do dia: Corrija o bug',
  description:
    'Complete a próxima activity FixTheCode da lição E-commerce Frontend.',
  bonusXp: 50,
  expiresAt: '2026-05-28T23:59:59.000Z',
  targetLessonId: 'lesson-1',
  completedAt: null,
};

let dailyChallengeData: DailyChallenge = { ...INITIAL_DAILY_CHALLENGE };

export function getDailyChallengeData(): DailyChallenge {
  return { ...dailyChallengeData };
}

export function setDailyChallengeData(next: DailyChallenge): void {
  dailyChallengeData = { ...next };
}

export function resetDailyChallengeData(): void {
  dailyChallengeData = { ...INITIAL_DAILY_CHALLENGE };
}
