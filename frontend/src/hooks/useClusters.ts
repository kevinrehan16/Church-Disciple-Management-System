import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { GroupedChurch, CreateUpdateCluster } from '../types/typeCluster';
import { clusterService } from '../services/clusterService';

export interface ChurchFilters {
  search?: string;
  page?: number;
}

export const useClusters = (filters: ChurchFilters) => {
  return useQuery<GroupedChurch, Error>({
    queryKey: ['grouped-clusters', filters],
    queryFn: () => clusterService.getGroupedClusters(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
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