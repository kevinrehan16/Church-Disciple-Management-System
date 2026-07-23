// 1. Spiritual Gift Interface
export interface SpiritualGiftPivot {
  level: string;
  score: number | null;
  notes: string | null;
}

export interface SpiritualGift {
  id: number;
  name: string;
  code: string;
  category: string;
  description: string;
  scripture_references: string;
  is_active: boolean;
  pivot?: SpiritualGiftPivot;
}

// 2. Growth Group Item & Member Interface (para sa Group View)
export interface GroupMemberItem {
  id: number;
  full_name: string;
  nickname: string | null;
  picture: string | null;
  role: 'Leader' | 'Co-Leader' | 'Member';
  joined_at: string;
}

export interface GrowthGroup {
  id: number;
  name: string;
  description?: string | null;
  my_role: 'Leader' | 'Co-Leader' | 'Member';
  members_count: number;
  members: GroupMemberItem[];
}

// 3. Main Member Profile Interface (Exact Backend Payload)
export interface MemberProfile {
  id: number;
  mem_id: string;
  email: string;
  role: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  full_name: string;
  nickname: string | null;
  gender: 'Male' | 'Female' | string;
  birthday: string;
  age: number;
  lifestage: string;
  spouse_name: string | null;
  father_name: string | null;
  mother_name: string | null;
  facebook_name: string | null;
  mobile_number: string;
  contact_details: string | null;
  home_address: string;
  country: string;
  region: string;
  city: string;
  barangay: string;
  occupation: string;
  industry: string;
  college_school: string;
  college_degree: string;
  high_school: string;
  received_jesus: string;
  baptized_immersion: string | boolean; // "1" o true
  baptized_date: string;
  picture: string | null;
  purpose_reg: string | null;
  prev_church: string | null;
  church_affiliation: string | null;
  church_id: number;
  member_position: string;
  member_status: 'Active' | 'Inactive' | string;
  membership_date: string;
  rec_for_baptism: boolean;
  rec_for_membership: boolean;
  comment: string | null;
  created_at: string;
  church_name: string;
  cluster_id: number | null;
  cluster_name: string | null;
  spiritual_gifts: SpiritualGift[];
}

// 4. Generic Backend API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}