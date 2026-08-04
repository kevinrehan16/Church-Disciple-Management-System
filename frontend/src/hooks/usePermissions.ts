import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { permissionService } from '../services/permissionService';
import type { 
  PermissionQueryParams, 
  CreatePermissionPayload, 
  PermissionListResponse, 
  SinglePermissionResponse 
} from '../types/typePermission';

// 1. Hook para sa PAGKUHA ng Permissions (useQuery)
export const usePermissions = (params?: PermissionQueryParams) => {
  return useQuery<PermissionListResponse, Error>({
    // Kasama ang params sa queryKey para mag-refetch dynamic tuwing nagbabago ang page o search
    queryKey: ['permissions', params], 
    queryFn: () => permissionService.getAllPermissions(params),
  });
};

// 2. Hook para sa PAGLIKHA ng Permission (useMutation)
export const useCreatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation<SinglePermissionResponse, Error, CreatePermissionPayload>({
    mutationFn: (payload: CreatePermissionPayload) => permissionService.createPermission(payload),
    onSuccess: () => {
      // Awtomatikong ire-refresh ang table pagka-add ng bagong permission
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
    onError: (error: any) => {
      console.error("Create permission failed:", error.response?.data || error.message);
    },
  });
};

export const useUpdatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SinglePermissionResponse,
    Error,
    { id: number; payload: CreatePermissionPayload }
  >({
    mutationFn: ({ id, payload }) => permissionService.updatePermission(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
    onError: (error: any) => {
      console.error("Update permission failed:", error.response?.data || error.message);
    },
  });
};

// 3. Hook para sa PAG-DELETE ng Permission (useMutation)
export const useDeletePermission = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, number>({
    mutationFn: (id: number) => permissionService.deletePermission(id),
    onSuccess: () => {
      // Awtomatikong ire-refresh ang table pagka-delete ng permission
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
    onError: (error: any) => {
      console.error("Delete permission failed:", error.response?.data || error.message);
    },
  });
};