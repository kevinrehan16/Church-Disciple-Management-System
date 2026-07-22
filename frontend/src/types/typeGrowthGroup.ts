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