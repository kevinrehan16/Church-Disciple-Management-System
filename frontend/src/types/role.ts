export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  createdAt?: string;
  created_at?: string;
}

export interface Role {
  id: number;
  name: string;
  guard_name?: string;
  createdAt?: string;
  created_at?: string;
  permissions: Permission[];
}

export interface CreateRolePayload {
  name: string;
  guard_name?: string;
  permissions?: number[]; // Array ng Permission IDs (e.g. [1, 2, 5])
}

export interface UpdateRolePayload {
  name?: string;
  guard_name?: string;
  permissions?: number[];
}

export interface RoleQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export interface SingleRoleResponse {
  message?: string;
  data: Role;
}

export interface RoleListResponse {
  data: Role[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}