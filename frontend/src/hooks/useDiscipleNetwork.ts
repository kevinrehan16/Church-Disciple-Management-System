import { useQuery } from '@tanstack/react-query';
import { discipleNetworkService } from '../services/disciplenetworkService';
import type { MemberNode } from '../types/typeDiscipleNetwork';

export const useDiscipleNetwork = () => {
  return useQuery<MemberNode[], Error>({
    queryKey: ['disciple-network'],
    queryFn: () => discipleNetworkService.getHierarchyTree(),
    staleTime: 1000 * 60 * 5, // I-cache ng 5 minuto
  });
};