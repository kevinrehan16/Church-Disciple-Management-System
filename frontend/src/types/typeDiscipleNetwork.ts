export interface MemberNode {
  nodeKey: string;
  memberId: number | string;
  parentId: number | string | null;
  name: string;
  email: string | null;
  churchPosition: string | null;
  ggRole: 'GG Leader' | 'GG Member' | 'Growth Group' | 'Group' | 'None';
  rank: number;
  primaryRank: number;
  hasGrowthGroup: boolean;
  growthGroupName: string;
  isDuplicate: boolean;
  isGroupFolder?: boolean;
  avatarBg: string;
}

export interface DiscipleNetworkResponse {
  data: MemberNode[];
}