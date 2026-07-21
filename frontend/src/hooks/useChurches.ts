import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { churchService } from '../services/churchService';
import type { Church, CreateChurchPayload } from '../types/typeChurch';
import { type Pagination } from '../types/typePagination';

export interface ChurchFilters {
  search?: string;
  page?: number;
}

export const useChurches = (filters: ChurchFilters) => {
  return useQuery<Pagination<Church>, Error>({
    queryKey: ['churches', filters], 
    
    // Ipapasa natin ang buong object sa service
    queryFn: () => churchService.getChurches(filters), 
    
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};

export const useRegisterChurch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (churchData: CreateChurchPayload) =>churchService.registerChurch(churchData), // Gagamitin ang method mula sa object
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['churches'] });
    },
    onError: (error: any) => {
      console.error("Registration failed:", error.response?.data || error.message);
    }
  });
};