import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { GrowthGroupApiResponse } from '../types/typeGGMembers';
import { ggMembersService } from '../services/ggmembersService';

export const useGrowthGroupMembers = () => {
  return useQuery<GrowthGroupApiResponse, Error>({
    queryKey: ['growth-group'],
    queryFn: () => ggMembersService.getGrowthGroupMembers(),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};