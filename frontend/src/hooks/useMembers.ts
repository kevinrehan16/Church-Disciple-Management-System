import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// I-import natin ang 'patientService' imbes na yung individual functions
import { memberService } from '../services/memberService';
import { type Member } from '../types/typeMember';
import { type Pagination } from '../types/typePagination';

export interface MemberFilters {
  search?: string;
  page?: number;
  position?: string;
  rank?: number;
}

export const useMembers = (filters: MemberFilters) => {
  return useQuery<Pagination<Member>, Error>({
    // Ang 'queryKey' ay dapat kasama ang object na 'filters'.
    // Kapag nagbago ang kahit anong property sa filters (rank, search, page),
    // automatic na mag-ti-trigger ng refetch ang react-query!
    queryKey: ['members', filters], 
    
    // Ipapasa natin ang buong object sa service
    queryFn: () => memberService.getMembers(filters), 
    
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};

// // Bagong hook para sa single patient (View Profile)
// export const usePatientDetails = (patientId: string | null) => {
//   return useQuery({
//     queryKey: ['patient', patientId],
//     queryFn: () => patientService.getPatientById(patientId!),
//     enabled: !!patientId, // Tatakbo lang kapag may ID
//   });
// };

export const useRegisterMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: memberService.registerMember, // Gagamitin ang method mula sa object
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: (error: any) => {
      console.error("Registration failed:", error.response?.data || error.message);
    }
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, memberData }: { id: string; memberData: any }) => memberService.updateMember(id, memberData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: (error: any) => {
      console.error("Update failed:", error.response?.data || error.message);
    }
  });
};