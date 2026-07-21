export interface Church {
  id: number;
  name: string;
  code: string;
  address: string;
  contact_number: string | null;
  email: string | null;
  is_main_campus: boolean;
  is_active: boolean;
  clusters_count?: number;
  growth_groups_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateChurchPayload {
  name: string;
  code: string;
  address: string;
  contact_number?: string | null;
  email?: string | null;
  is_main_campus?: boolean;
  is_active?: boolean;
}

export type UpdateChurchPayload = Partial<CreateChurchPayload>;