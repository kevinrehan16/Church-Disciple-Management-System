// 1. Core Permission Interface (Eksakto sa PermissionResource payload)
export interface Permission {
  id: number;
  name: string;
  guard_name?: string;
  roles?: string[]; // Array ng role names (e.g., ['pastor', 'staff'])
  createdAt: string; // ISO date string mula sa backend
}

// 2. Payload para sa paglikha ng bagong Permission (POST Request)
export interface CreatePermissionPayload {
  name: string;
  guard_name?: string;
}

// 3. Query Parameters para sa API Request (e.g., /api/v1/permissions?page=1&search=visitor)
export interface PermissionQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
}

// 4. Pagination Metadata galing sa Laravel Paginate
export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

// 5. API Response Structure para sa Listahan (GET /api/v1/permissions)
export interface PermissionListResponse {
  data: Permission[];
  meta: PaginationMeta;
  links: PaginationLinks;
}

// 6. API Response Structure para sa Single Permission / Create Action
export interface SinglePermissionResponse {
  data: Permission;
  success?: boolean;
  message?: string;
}