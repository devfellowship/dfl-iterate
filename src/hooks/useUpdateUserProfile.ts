import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "@/services";
import { queryKeys } from "@/lib/queryKeys";

export function useUpdateUserProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateUserProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.userProfile.current,
            });
        },
    });
}