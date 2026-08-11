import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { GrowthGroup, SaveGrowthGroupPayload } from '../types/typeGrowthGroup';
import { growthGroupService } from '../services/growthgroupService';

export interface GrowthGroupFilters {
  search?: string;
  page?: number;
  church_id?: string;
  cluster_id?: string;
}

export const useGrowthGroup = (filters: GrowthGroupFilters) => {
  return useQuery<GrowthGroup, Error>({
    queryKey: ['growth-group', filters],
    queryFn: () => growthGroupService.getGrowthGroup(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};

export const useRegisterGrowthGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (GrowthGroupData: SaveGrowthGroupPayload) => growthGroupService.createGrowthGroup(GrowthGroupData), // Gagamitin ang method mula sa object
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['growth-group'] });
      queryClient.invalidateQueries({ queryKey: ['growth-groups'] });
    },
    onError: (error: any) => {
      console.error("Growth Group Registration failed:", error.response?.data || error.message);
    }
  });
};