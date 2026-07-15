import { useQuery } from '@tanstack/react-query';
import { visitorService } from '../services/visitorService';

export interface VisitorFilters {
  search?: string;
  page?: number;
}

export const useVisitors = (filters: VisitorFilters) => {
  return useQuery({
    queryKey: ['visitors', filters], 
    queryFn: () => visitorService.getVisitors(filters),
    placeholderData: (previousData) => previousData,    
    staleTime: 1000 * 60 * 5, 
  });
};