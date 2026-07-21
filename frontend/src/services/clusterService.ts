import apiClient from '../api/axiosInstance';
import type { GroupedChurch, Cluster, CreateClusterPayload, UpdateClusterPayload } from '../types/typeCluster';
import type { Pagination } from '../types/typePagination';

export interface ChurchFilters {
  search?: string;
  page?: number;
}

export const clusterService = {
    getGroupedClusters: async (filters: ChurchFilters): Promise<GroupedChurch> => {
        const response = await apiClient.get('clusters/grouped', {
            params: {
                search: filters.search,
                page: filters.page || 1,
            }
        });
        return response.data;
    },
}