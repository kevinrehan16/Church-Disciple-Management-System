import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { GroupedChurch } from '../types/typeCluster';
import { clusterService } from '../services/clusterService';

export interface ChurchFilters {
  search?: string;
  page?: number;
}

export const useClusters = (filters: ChurchFilters) => {
  return useQuery<GroupedChurch[], Error>({
    queryKey: ['grouped-clusters', filters],
    queryFn: () => clusterService.getGroupedClusters(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};