import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { SpiritualGift } from '../types/typeSpiritualGift';
import { spiritualGiftService } from '../services/spiritualgiftService';

export const useSpiritualGift = () => {
  return useQuery<SpiritualGift, Error>({
    queryKey: ['growth-group'],
    queryFn: () => spiritualGiftService.getSpiritualGift(),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};