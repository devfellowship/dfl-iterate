import { queryKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { getRecentActivity } from "@/services/activity-events.service";

export function useGetRecentActivity() {
    return useQuery({
      queryKey: queryKeys.activityEvents.recent(),
      queryFn: () => getRecentActivity(),
    });
}