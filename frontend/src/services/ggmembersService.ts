import apiClient from '../api/axiosInstance';
import type { GrowthGroupApiResponse } from '../types/typeGGMembers';

export const ggMembersService = {
    getAllGrowthGroupsMembers: async (): Promise<GrowthGroupApiResponse> => {
        const response = await apiClient.get('growth-groups-members/');
        return response.data;
    },

    getGrowthGroupMembers: async (id: string | number): Promise<GrowthGroupApiResponse> => {
        const response = await apiClient.get(`growth-groups-members/${id}/members`);
        return response.data;
    },

    addMemberToGrowthGroup: async (
        growthGroupId: string | number, 
        formData: {
            member_id: number;
            role: string;
            joined_at: string;
            status?: string;
            inactive_reason?: string;
        }
    ) => {
        const response = await apiClient.post(`growth-groups-members/${growthGroupId}/members`, formData);

        return response.data;
    },
}