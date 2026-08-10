import apiClient from '../api/axiosInstance';
import type { MemberNode, DiscipleNetworkResponse } from '../types/typeDiscipleNetwork';

export const discipleNetworkService = {
  /**
   * Kukunin ang kumpletong hierarchy tree ng disciple network
   */
  getHierarchyTree: async (): Promise<MemberNode[]> => {
    const response = await apiClient.get<DiscipleNetworkResponse>('disciple-network/');
    return response.data.data;
  },
};