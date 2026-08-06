export interface Cluster {
  id: number;
  church_id: number;
  name: string;
  code: string;
  member_id: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GroupedChurch {
  id: number;
  name: string;
  code: string;
  address: string;
  is_main_campus: boolean;
  is_active: boolean;
  clusters: Cluster[];
}

export interface CreateUpdateCluster {
  church_id: number;
  name: string;
  code: string;
  member_id: number;
  is_active?: boolean;
}

export interface ChurchDetail {
  id: number;
  name: string;
  code: string;
  address: string;
  contact_number: string;
  email: string;
  is_main_campus: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClusterWithChurch {
  id: number;
  church_id: number;
  name: string;
  code: string;
  is_active: boolean;
  church: ChurchDetail;
  created_at: string;
  updated_at: string;
}

export interface PaginatedClustersResponse {
  data: ClusterWithChurch[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
}