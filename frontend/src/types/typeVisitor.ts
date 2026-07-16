export interface Address {
  barangay: string;
  city: string;
  province: string;
}

export interface Visitor {
  id: number;
  visitorId: string;
  fullName: string;
  firstName: string;
  lastName: string;
  birthday: string;
  ageGroup: string;
  gender: string;
  dateVisited: string;
  serviceTime: string;
  welcomeBy?: string;
  address: Address;
  lifeStage: string;
  lifeStageOther?: string;
  currentChurch?: string;
  mobileNumber?: string;
  email?: string;
  facebookName?: string;
  heardFromInvitee?: string;
  heardFromDetails?: string;
  prayerRequests?: string;
  remarks?: string;
  createdAt: string;
  welcome_by?: string;
}

export interface VisitorPayload {
  // Metadata
  id?: number; 
  visitor_id?: string;

  // Personal Details
  first_name: string;
  last_name: string;
  full_name?: string; // Optional kung computed sa backend
  birthday: string;
  age_group: string;
  gender: string;
  life_stage: string;
  life_stage_other?: string;

  // Visit Details
  date_visited: string;
  service_time: string;
  welcome_by?: string;

  // Address (Flat na ito ngayon)
  barangay: string;
  city: string;
  province: string;

  // Contact & Social
  current_church?: string;
  mobile_number?: string;
  email?: string;
  facebook_name?: string;

  // Referral & Remarks
  heard_from_invitee?: string;
  heard_from_details?: string;
  prayer_requests?: string;
  remarks?: string;
  
  created_at?: string;
}