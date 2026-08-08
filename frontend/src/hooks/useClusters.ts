import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { GroupedChurch, CreateUpdateCluster, PaginatedClustersResponse } from '../types/typeCluster';
import { clusterService } from '../services/clusterService';

export interface ClusterGroupFilters {
  search?: string;
  page?: number;
}

export interface ClusterFilters {
  church_id?: number;
  search?: string;
}

export const useClusters = (filters: ClusterGroupFilters) => {
  return useQuery<GroupedChurch, Error>({
    queryKey: ['grouped-clusters', filters],
    queryFn: () => clusterService.getGroupedClusters(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};

export const useClustersByChurchId = (filters: ClusterFilters) => {
  return useQuery<PaginatedClustersResponse, Error>({
    queryKey: ['clusters-by-church', filters],
    queryFn: () => clusterService.getClustersByChurchId(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
    enabled: !!filters.church_id, // Optional: Para hindi mag-trigger kung wala pang napiling church_id
  });
};

export const useRegisterCluster = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clusterData: CreateUpdateCluster) => clusterService.createCluster(clusterData), // Gagamitin ang method mula sa object
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grouped-clusters'] });
    },
    onError: (error: any) => {
      console.error("Cluster Registration failed:", error.response?.data || error.message);
    }
  });
};

export const useUpdateCluster = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    // Dito ay sinasabi natin na kukunin niya ang 'id' at ang 'formData' object
    mutationFn: ({ id, formData }: { id: string | number; formData: any }) => 
      clusterService.updateCluster(String(id), formData),
      
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grouped-clusters'] });
    },
    onError: (error: any) => {
      console.error("Update Cluster failed:", error.response?.data || error.message);
    }
  });
};