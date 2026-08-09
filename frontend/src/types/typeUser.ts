export interface Member {
  firstName: string;
  lastName: string;
  mobile: string;
  church_id: number;
  cluster_id: number;
}

export interface User {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'staff' | string;
  createdAt: string;
  mustChangePassword: boolean;
  is_active: boolean;
  member: Member | null;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface MetaLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  links: MetaLink[];
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginatedUsersResponse {
  data: User[];
  links: PaginationLinks;
  meta: PaginationMeta;
}