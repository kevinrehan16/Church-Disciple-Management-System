import apiClient from '../api/axiosInstance';
import type { 
  PermissionListResponse, 
  PermissionQueryParams, 
  CreatePermissionPayload, 
  SinglePermissionResponse 
} from '../types/permission'; // Palitan ang path kung kinakailangan

export const permissionService = {
  // 1. GET ALL PERMISSIONS (May pagination at search filter)
  getAllPermissions: async (params?: PermissionQueryParams): Promise<PermissionListResponse> => {
    const response = await apiClient.get<PermissionListResponse>('/permissions', 
        { params }
    );
    return response.data; // Nagbabalik ng { data: [...], meta: {...}, links: {...} }
  },

  // 2. CREATE PERMISSION (Magdagdag ng bagong permission)
  createPermission: async (payload: CreatePermissionPayload): Promise<SinglePermissionResponse> => {
    const response = await apiClient.post<SinglePermissionResponse>('/permissions', payload);
    return response.data;
  },

  updatePermission: async (id: number, payload: CreatePermissionPayload): Promise<SinglePermissionResponse> => {
    const response = await apiClient.put<SinglePermissionResponse>(`/permissions/${id}`, payload);
    return response.data;
  },

  // 3. DELETE PERMISSION (Mag-delete ng permission via ID)
  deletePermission: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/permissions/${id}`);
    return response.data;
  }
};