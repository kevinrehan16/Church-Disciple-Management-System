import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { GrowthGroupApiResponse } from '../types/typeGGMembers';
import { ggMembersService } from '../services/ggmembersService';

export const useAllGrowthGroupsMembers = () => {
  return useQuery<GrowthGroupApiResponse, Error>({
    queryKey: ['growth-groups-members'],
    queryFn: () => ggMembersService.getAllGrowthGroupsMembers(),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};

export const useGrowthGroupMembers = (id: string | number) => {
  return useQuery<GrowthGroupApiResponse, Error>({
    queryKey: ['growth-group-member', id],
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
      queryClient.invalidateQueries({ queryKey: ['growth-groups-members'] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: (error: any) => {
      console.error("Add for Follow-Up Members failed:", error.response?.data || error.message);
    }
  });
};