import apiClient from '../api/axiosInstance';
import type { 
  RoleListResponse, 
  RoleQueryParams, 
  CreateRolePayload, 
  UpdateRolePayload,
  SingleRoleResponse 
} from '../types/role'; // Palitan ang path kung kinakailangan

export const roleService = {
  // 1. GET ALL ROLES (May pagination, search filter, at kasamang permissions array)
  getAllRoles: async (params?: RoleQueryParams): Promise<RoleListResponse> => {
    const response = await apiClient.get<RoleListResponse>('/roles', { params });
    return response.data;
  },

  // 2. GET SINGLE ROLE BY ID
  getRoleById: async (id: number): Promise<SingleRoleResponse> => {
    const response = await apiClient.get<SingleRoleResponse>(`/roles/${id}`);
    return response.data;
  },

  // 3. CREATE ROLE (Magdagdag ng bagong role kasama ang array ng permission IDs)
  createRole: async (payload: CreateRolePayload): Promise<SingleRoleResponse> => {
    const response = await apiClient.post<SingleRoleResponse>('/roles', payload);
    return response.data;
  },

  // 4. UPDATE ROLE (Mag-update ng role at i-sync ang permissions nito)
  updateRole: async (id: number, payload: UpdateRolePayload): Promise<SingleRoleResponse> => {
    const response = await apiClient.put<SingleRoleResponse>(`/roles/${id}`, payload);
    return response.data;
  },

  // 5. DELETE ROLE (Mag-delete ng role via ID)
  deleteRole: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/roles/${id}`);
    return response.data;
  }
};