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
    queryKey: ['growth-groups', filters],
    queryFn: () => growthGroupService.getGrowthGroup(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};

export const useGrowthGroupById = (id: any) => {
  return useQuery<GrowthGroup, Error>({
    queryKey: ['growth-group', id],
    queryFn: () => growthGroupService.getGrowthGroupById(id),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
    enabled: !!id
  });
};

export const useUpdateGrowthGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    // Dito ay sinasabi natin na kukunin niya ang 'id' at ang 'formData' object
    mutationFn: ({ id, formData }: { id: string | number; formData: any }) => 
      growthGroupService.updateGrowthGroup(String(id), formData),
      
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['growth-groups'] });
    },
    onError: (error: any) => {
      console.error("Update GrowthGroup failed:", error.response?.data || error.message);
    }
  });
};

export const useRegisterGrowthGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (GrowthGroupData: SaveGrowthGroupPayload) => growthGroupService.createGrowthGroup(GrowthGroupData), // Gagamitin ang method mula sa object
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['growth-groups'] });
      queryClient.invalidateQueries({ queryKey: ['growth-groups-members'] });
    },
    onError: (error: any) => {
      console.error("Growth Group Registration failed:", error.response?.data || error.message);
    }
  });
};