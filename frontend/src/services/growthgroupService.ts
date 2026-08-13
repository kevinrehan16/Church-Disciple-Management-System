import apiClient from '../api/axiosInstance';
import type { GrowthGroup, SaveGrowthGroupPayload } from '../types/typeGrowthGroup';

export interface growthgroupFilters {
  search?: string;
  page?: number;
  church_id?: string;
  cluster_id?: string;
}

export const growthGroupService = {
    getGrowthGroup: async (filters: growthgroupFilters): Promise<GrowthGroup> => {
        const response = await apiClient.get('growth-groups/', {
            params: {
                search: filters.search,
                page: filters.page || 1,
                church_id: filters.church_id,
                cluster_id: filters.cluster_id
            }
        });
        return response.data;
    },

    getGrowthGroupById: async (id: any): Promise<GrowthGroup> => {
        const response = await apiClient.get(`growth-groups/${id}`);
        return response.data;
    },

    createGrowthGroup: async (payload: SaveGrowthGroupPayload): Promise<GrowthGroup> => {
        const response = await apiClient.post('growth-groups/', payload);
        return response.data.data;
    },

    updateGrowthGroup: async (id: string, payload: SaveGrowthGroupPayload): Promise<GrowthGroup> => {
        const response = await apiClient.put(`/growth-groups/${id}`, payload);
        return response.data.data || response.data;
    },

}