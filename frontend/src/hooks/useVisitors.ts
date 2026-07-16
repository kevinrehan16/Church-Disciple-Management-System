import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

export const useRegisterVisitor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: visitorService.registerVisitor, // Gagamitin ang method mula sa object
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] });
    },
    onError: (error: any) => {
      console.error("Registration failed:", error.response?.data || error.message);
    }
  });
};