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
  permissions?: string[]; // Array ng Permission IDs (e.g. [1, 2, 5])
}

export interface UpdateRolePayload {
  name?: string;
  guard_name?: string;
  permissions?: string[];
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
    meta: {
        current_page: number;
        from: number | null;
        last_page: number;        // <-- Nandito na ngayon ang last_page mo
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        path: string;
        per_page: number;
        to: number | null;
        total: number;
    };
    links?: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
}