import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import type { PaginatedUsersResponse } from '../types/typeUser';

export interface UserFilters {
  search?: string;
  is_active?: boolean;
  page?: number;
}

export interface UpdateRolePayload {
  role: string; // O kaya ay 'super_admin' | 'admin' | 'manager' | 'member'
  is_active?: boolean;
}

export const useUsers = (filters: UserFilters) => {
  return useQuery<PaginatedUsersResponse, Error>({
    queryKey: ['users', filters], 
    queryFn: () => userService.getAllUsers(filters),
    placeholderData: (previousData) => previousData,    
    staleTime: 1000 * 60 * 5, 
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    // Dito ay sinasabi natin na kukunin niya ang 'id' at ang 'formData' object
    mutationFn: ({ id, payload }: { id: string | number; payload: UpdateRolePayload }) => 
      userService.updateUserRole(String(id), payload),
      
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      console.error("Update Cluster failed:", error.response?.data || error.message);
    }
  });
};