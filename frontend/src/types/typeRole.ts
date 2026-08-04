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
    current_page: number;
    data: Role[];
    first_page_url: string;
    from: number | null;
    last_page: number;        // <-- Dito mo ilalagay ito para mawala ang error
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}