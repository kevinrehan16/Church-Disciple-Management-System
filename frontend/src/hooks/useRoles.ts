import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roleService } from '../services/roleService';
import type { 
  RoleQueryParams, 
  CreateRolePayload, 
  UpdateRolePayload,
  RoleListResponse, 
  SingleRoleResponse 
} from '../types/typeRole';

// 1. Hook para sa PAGKUHA ng Roles List (useQuery)
export const useRoles = (params?: RoleQueryParams) => {
  return useQuery<RoleListResponse, Error>({
    // Kasama ang params sa queryKey para mag-refetch dynamic tuwing nagbabago ang page o search
    queryKey: ['roles', params], 
    queryFn: () => roleService.getAllRoles(params),
  });
};

// 2. Hook para sa PAGKUHA ng Isang Specific Role via ID (useQuery)
export const useRole = (id: number) => {
  return useQuery<SingleRoleResponse, Error>({
    queryKey: ['roles', id],
    queryFn: () => roleService.getRoleById(id),
    enabled: !!id, // Patatakbuhin lang kung may valid na ID
  });
};

// 3. Hook para sa PAGLIKHA ng Role (useMutation)
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation<SingleRoleResponse, Error, CreateRolePayload>({
    mutationFn: (payload: CreateRolePayload) => roleService.createRole(payload),
    onSuccess: () => {
      // Awtomatikong ire-refresh ang table pagka-add ng bagong role
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error: any) => {
      console.error("Create role failed:", error.response?.data || error.message);
    },
  });
};

// 4. Hook para sa PAG-UPDATE ng Role at pag-sync ng Permissions (useMutation)
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleRoleResponse,
    Error,
    { id: number; payload: UpdateRolePayload }
  >({
    mutationFn: ({ id, payload }) => roleService.updateRole(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error: any) => {
      console.error("Update role failed:", error.response?.data || error.message);
    },
  });
};

// 5. Hook para sa PAG-DELETE ng Role (useMutation)
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, number>({
    mutationFn: (id: number) => roleService.deleteRole(id),
    onSuccess: () => {
      // Awtomatikong ire-refresh ang table pagka-delete ng role
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error: any) => {
      console.error("Delete role failed:", error.response?.data || error.message);
    },
  });
};