import apiClient from '../api/axiosInstance';
import type { Church } from '../types/typeChurch';
import type { Pagination } from '../types/typePagination';

export interface ChurchFilters {
  search?: string;
  page?: number;
}

export const churchService = {

    getChurches: async (filters: ChurchFilters): Promise<Pagination<Church>> => {
        const response = await apiClient.get('churches/', {
        params: {
                search: filters.search,
                page: filters.page || 1,
            }
        });
        return response.data;
    },
    
}