// Type unions para sa structured values
export type LocationType = 'onsite' | 'online' | 'hybrid';
export type MemberRole = 'leader' | 'co-leader' | 'member';

// Leader Interface
export interface GrowthGroupLeader {
  id: number;
  first_name: string;
  last_name: string;
  mobile_number?: string; // optional field
}

// Member Interface
export interface members {
  member_id: number;
  full_name: string;
  role: MemberRole | string;
  joined_at: string; // ISO Date String (e.g., "2023-01-15")
}

// Main Growth Group Interface
export interface GrowthGroupMembers {
  id: number;
  name: string;
  code: string;
  target_demographic: string;
  meeting_day: string;
  meeting_time: string; // HH:mm:ss format
  location_type: LocationType | string;
  venue_address: string;
  is_active: boolean;
  leader: GrowthGroupLeader;
  members: members[];
}

// (Optional) API Response Wrapper Interface
export interface GrowthGroupApiResponse {
  success: boolean;
  data: GrowthGroupMembers[];
}