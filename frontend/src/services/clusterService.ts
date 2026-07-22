import apiClient from '../api/axiosInstance';
import type { GroupedChurch, Cluster, CreateUpdateCluster } from '../types/typeCluster';
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

    createCluster: async (payload: CreateUpdateCluster): Promise<Cluster> => {
        const response = await apiClient.post('clusters/', payload);
        return response.data.data;
    },

    // async updateCluster(id: number, payload: UpdateClusterPayload): Promise<Cluster> {
    //     const response = await api.put(`/clusters/${id}`, payload);
    //     return response.data.data || response.data;
    // },

    // // Mag-delete ng cluster
    // async deleteCluster(id: number): Promise<void> {
    //     await api.delete(`/clusters/${id}`);
    // }
}