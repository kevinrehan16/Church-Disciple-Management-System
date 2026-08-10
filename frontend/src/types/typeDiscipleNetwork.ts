export interface MemberNode {
  id: number;
  parentId: number | null;
  name: string;
  email: string | null;
  position: string;
  rank: number;
  cluster: string;
  avatarBg: string;
}

export interface DiscipleNetworkResponse {
  data: MemberNode[];
}