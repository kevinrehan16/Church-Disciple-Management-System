export interface Member {
  // Primary & Auth
  id?: string;             // Optional dahil sa create (galing sa DB)
  member_id: string;
  username?: string;
  email: string;
  password?: string;

  // Personal Identity
  first_name: string;
  last_name: string;
  middle_name?: string;
  nickname?: string;
  gender: string;
  birthday?: string;
  age: number;
  lifestage?: string;

  // Family & Social
  spouse_name?: string;
  father_name?: string;
  mother_name?: string;
  facebook_name?: string;

  // Contact & Residence
  mobile_number: string;
  contact_details?: string;
  home_address?: string;
  country?: string;
  region?: string;
  city?: string;
  barangay?: string;

  // Professional & Education
  occupation?: string;
  industry?: string;
  high_school?: string;
  college_school?: string;
  college_degree?: string;

  // Religious & Membership
  received_jesus?: string;
  baptized_immersion: string; // 'Yes' or 'No'
  baptized_date?: string;
  spiritual_gift?: string;
  picture?: string;
  purpose_reg?: string;
  prev_church?: string;
  church_affiliation?: string;
  satellite_id?: string;
  member_position?: string;
  member_status: string;      // Default 'Active'
  membership_date?: string;
  rec_for_baptism: boolean;
  rec_for_membership: boolean;
  comment?: string;
}