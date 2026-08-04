import apiClient from '../api/axiosInstance';
import type { ChangePasswordPayload } from '../types/typePass';

export const passService = {
    changePassword: async (payload: ChangePasswordPayload): Promise<void> => {
        await apiClient.post('/change-password', payload);
    }
}