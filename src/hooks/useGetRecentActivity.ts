import { queryKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { getRecentActivity } from "@/services/activity-events.service";

export function useGetRecentActivity(limit = 10) {
    return useQuery({
      queryKey: queryKeys.activityEvents.recent(limit),
      queryFn: () => getRecentActivity(limit),
    });
}