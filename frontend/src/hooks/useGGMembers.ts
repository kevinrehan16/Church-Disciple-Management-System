import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { GrowthGroupApiResponse } from '../types/typeGGMembers';
import { ggMembersService } from '../services/ggmembersService';

export const useAllGrowthGroupsMembers = () => {
  return useQuery<GrowthGroupApiResponse, Error>({
    queryKey: ['growth-groups'],
    queryFn: () => ggMembersService.getAllGrowthGroupsMembers(),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};

export const useGrowthGroupMembers = (id: string | number) => {
  return useQuery<GrowthGroupApiResponse, Error>({
    queryKey: ['growth-group', id],
    queryFn: () => ggMembersService.getGrowthGroupMembers(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};

export const useAddGrowthGroupMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      growthGroupId, 
      formData 
    }: { 
      growthGroupId: string | number; 
      formData: {
        member_id: number;
        role: string;
        joined_at: string;
        status?: string;
        inactive_reason?: string;
      } 
    }) => ggMembersService.addMemberToGrowthGroup(growthGroupId, formData),
      
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['growth-groups'] });
    },
    onError: (error: any) => {
      console.error("Add Growth Group Member failed:", error.response?.data || error.message);
    }
  });
};