export interface GrowthGroup {
  id: number;
  church_id: number;
  cluster_id: number;
  leader_id: number;
  name: string;
  code: string;
  meeting_day: string;
  meeting_time: string;
  location_type: string;
  venue_address: string;
  target_demographic: string;
  is_active: boolean;
  church: {
    id: number;
    name: string;
    code: string;
    address: string;
    is_main_campus: boolean;
  };
  cluster: {
    id: number;
    church_id: number;
    name: string;
    code: string;
  };
  leader: {
    id: number;
    first_name: string;
    last_name: string;
    nickname: string | null;
    mobile_number: string;
    member_position: string;
  };
}

export type MeetingDay = 
  | 'Sunday' 
  | 'Monday' 
  | 'Tuesday' 
  | 'Wednesday' 
  | 'Thursday' 
  | 'Friday' 
  | 'Saturday';

export type LocationType = 'onsite' | 'online' | 'hybrid';

export type TargetDemographic = 
  | 'nextgen' 
  | 'singles' 
  | 'couples' 
  | 'men' 
  | 'women' 
  | 'growkids' 
  | 'professionals' 
  | 'youth';

// ==========================================
// 2. REQUEST PAYLOAD (Para sa Create / Update POST)
// ==========================================
export interface SaveGrowthGroupPayload {
  church_id: number;
  cluster_id: number;
  leader_id: number;
  name: string;
  code: string;
  meeting_day: MeetingDay | string;
  meeting_time: string; // Format: "13:00:00"
  location_type: LocationType | string;
  venue_address: string;
  target_demographic: TargetDemographic | string;
  is_active: boolean;
}