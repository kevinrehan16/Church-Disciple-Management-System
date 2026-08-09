import apiClient from '../api/axiosInstance';
import type { Member } from '../types/typeMember';
import type { Pagination } from '../types/typePagination';

export interface MemberFilters {
  search?: string;
  page?: number;
  member_position?: string | string[];
  rank?: number;
}

export const memberService = {
  getMembers: async (filters: MemberFilters): Promise<Pagination<Member>> => {
    const response = await apiClient.get('members/', {
      params: {
        search: filters.search,
        page: filters.page || 1,
        member_position: filters.member_position,
        rank: filters.rank,
      }
    });
    return response.data;
  },

  // getPatientById: async (id: string): Promise<Patient> => {
  //   const { data } = await apiClient.get(`patients/${id}/`);
  //   return data;
  // },

  registerMember: async (memberData: FormData | object): Promise<Member> => {
    const { data } = await apiClient.post('register/', memberData);
    return data;
  },

  updateMember: async (id: string, memberData: any): Promise<Member> => {
    const { data } = await apiClient.put(`/members/${id}/`, memberData);
    return data;
  },
  
};