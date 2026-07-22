import apiClient from '../api/axiosInstance';
import type { GrowthGroup } from '../types/typeGrowthGroup';
import type { Pagination } from '../types/typePagination';

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

}