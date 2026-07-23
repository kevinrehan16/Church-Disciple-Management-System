import apiClient from '../api/axiosInstance';
import type { MemberProfile } from '../types/typeProfile';


export const profileService = {
    getMyProfile: async (): Promise<MemberProfile> => {
        const response = await apiClient.get('profile/me');
        return response.data.data;
    },

    getMemberProfile: async (id : number): Promise<MemberProfile> => {
        const response = await apiClient.get(`profile/${id}`);
        return response.data.data;
    },
}