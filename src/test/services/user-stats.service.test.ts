import { describe, expect, it, vi } from 'vitest';

const mockUserStatsData = vi.hoisted(() => ({ value: undefined as unknown }));

vi.mock('@/test-utils/user-stats.dummy', () => ({
  get userStatsData() {
    return mockUserStatsData.value;
  },
}));

import { getUserStats } from '@/services/user-stats.service';

describe('getUserStats', () => {
  it('throws when user stats data is unavailable', async () => {
    mockUserStatsData.value = undefined;

    await expect(getUserStats()).rejects.toThrow('User stats not found');
  });
});
