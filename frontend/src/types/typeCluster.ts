export interface Cluster {
  id: number;
  church_id: number;
  name: string;
  code: string;
  head_id: number;
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
  head_id: number;
  is_active?: boolean;
}