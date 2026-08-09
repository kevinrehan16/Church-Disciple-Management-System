import apiClient from '../api/axiosInstance';
import type { PaginatedUsersResponse } from '../types/typeUser';

export interface UserFilters {
  search?: string;
  is_active?: boolean;
  page?: number;
}

export interface UpdateRolePayload {
  role: string; // O kaya ay 'super_admin' | 'admin' | 'manager' | 'member'
}

export const userService = {
    getAllUsers: async (filters: UserFilters = {}): Promise<PaginatedUsersResponse> => {
    // Tandaan: gamitin natin ang '/visitors' (may slash sa unahan)
    const response = await apiClient.get('/users', { params: filters });
    
    return response.data;
  },

  updateUserRole: async (id: string, payload: UpdateRolePayload)=> {
    const response = await apiClient.post(`/users/${id}/roles`, payload);
    return response.data;
  },
}