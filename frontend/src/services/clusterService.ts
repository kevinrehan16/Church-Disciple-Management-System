import apiClient from '../api/axiosInstance';
import type { GroupedChurch, Cluster, CreateUpdateCluster, PaginatedClustersResponse } from '../types/typeCluster';

export interface ClusterGroupFilters {
  search?: string;
  page?: number;
}

export interface ClusterFilters {
  church_id?: number;
  search?: string;
}

export const clusterService = {
    getGroupedClusters: async (filters: ClusterGroupFilters): Promise<GroupedChurch> => {
        const response = await apiClient.get('clusters/grouped', {
            params: {
                search: filters.search,
                page: filters.page || 1,
            }
        });
        return response.data;
    },

    getClustersByChurchId: async (filters: ClusterFilters): Promise<PaginatedClustersResponse> => {
        const response = await apiClient.get<PaginatedClustersResponse>('clusters', {
            params: filters, // Dito na papasok ang church_id, search, page, atbp.
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