import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { churchService } from '../services/churchService';
import { type Church } from '../types/typeChurch';
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