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
}