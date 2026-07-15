import apiClient from '../api/axiosInstance';
import type { Visitor } from '../types/typeVisitor';
import type { Pagination } from '../types/typePagination';

// 1. Definisyon para sa filters
export interface VisitorFilters {
  search?: string;
  page?: number;
}

// 2. Service Methods
export const visitorService = {
  getVisitors: async (filters: VisitorFilters = {}): Promise<Pagination<Visitor>> => {
    // Tandaan: gamitin natin ang '/visitors' (may slash sa unahan)
    const response = await apiClient.get('/visitors', { params: filters });
    
    return response.data;
  },

};