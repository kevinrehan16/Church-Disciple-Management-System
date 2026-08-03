import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ChangePasswordPayload } from '../types/typePass';
import { passService } from '../services/passService';

export const useChangePassword = () => {
  const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ChangePasswordPayload) => passService.changePassword(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (error: any) => {
            console.error("Change password failed:", error.response?.data || error.message);
        }
    });
};