import { useQuery } from '@tanstack/react-query';
import type { MemberProfile } from '../types/typeProfile';
import { profileService } from '../services/profileService';

export const useMyProfile = () => {
  return useQuery<MemberProfile, Error>({
    queryKey: ['profile'],
    queryFn: () => profileService.getMyProfile(),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};

export const useMemberProfile = (id : number) => {
  return useQuery<MemberProfile, Error>({
    queryKey: ['profile', id],
    queryFn: () => profileService.getMemberProfile(id),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};