import apiClient from '../api/axiosInstance';
import type { GrowthGroupApiResponse } from '../types/typeGGMembers';

export const ggMembersService = {
    getGrowthGroupMembers: async (): Promise<GrowthGroupApiResponse> => {
        const response = await apiClient.get('growth-groups-members/');
        return response.data;
    },
}