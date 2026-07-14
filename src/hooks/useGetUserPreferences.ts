import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryKeys';
import { getUserPreferences } from '@/services';

export function useGetUserPreferences() {
  return useQuery({
    queryKey: queryKeys.userPreferences.current,
    queryFn: getUserPreferences,
  });
}