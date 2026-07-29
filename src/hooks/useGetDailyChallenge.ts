import { useQuery } from '@tanstack/react-query';
import { getDailyChallenge } from '@/services';
import { queryKeys } from '@/lib/queryKeys';

export function useGetDailyChallenge() {
  return useQuery({
    queryKey: queryKeys.dailyChallenge.current,
    queryFn: getDailyChallenge,
  });
}
