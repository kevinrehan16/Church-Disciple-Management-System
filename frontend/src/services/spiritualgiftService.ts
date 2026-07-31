import apiClient from '../api/axiosInstance';
import type { SpiritualGift } from '../types/typeSpiritualGift';

export const spiritualGiftService = {
    getSpiritualGift: async (): Promise<SpiritualGift> => {
        const response = await apiClient.get('spiritual-gifts/');
        return response.data.data;
    },
}