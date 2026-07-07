import { getUserProfile } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

export function useGetUserProfile() {
    return useQuery({
        queryKey: queryKeys.userProfile.current,
        queryFn: getUserProfile,
    });
}