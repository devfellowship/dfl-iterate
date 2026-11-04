import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { getProfile } from '@/services';
import { useSession } from './useSession';

export function useGetProfile() {
  const { session } = useSession();
  return useQuery({
    queryKey: queryKeys.profile.current,
    queryFn: getProfile,
    enabled: Boolean(session),
  });
}
