import apiClient from '../api/axiosInstance';
import type { Church, CreateChurchPayload } from '../types/typeChurch';
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

    getChurchById: async (id: any): Promise<Church> => {
        const response = await apiClient.get(`churches/${id}`);
        return response.data;
    },

    registerChurch: async (churchData: CreateChurchPayload): Promise<Church> => {
        const { data } = await apiClient.post('churches/', churchData);
        return data;
    },

    updateChurch: async (id: any, churchData: CreateChurchPayload): Promise<Church> => {
        const { data } = await apiClient.put(`churches/${id}`, churchData);
        return data;
    },
    
}