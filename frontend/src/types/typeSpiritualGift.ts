// Union Types para sa strict typing
export type SpiritualGiftCategory = 'Instructional' | 'Serving' | 'Sign' | string;
export type GiftLevel = 'primary' | 'secondary' | 'developing';

// 1. Primary Spiritual Gift Model (tumutugma sa SpiritualGiftResource)
export interface SpiritualGift {
  id: number;
  name: string;
  code: string | null;
  category: SpiritualGiftCategory | null;
  description: string | null;
  scripture_references: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  members_count?: number;
}

// 2. Pivot Table Data (kapag nakakabit sa Member)
export interface MemberSpiritualGiftPivot {
  id: number;
  member_id: number;
  spiritual_gift_id: number;
  level: GiftLevel;
  score: number | null;
  notes: string | null;
  created_at?: string;
  updated_at?: string;
}

// 3. Spiritual Gift na may kasamang Pivot Data (para sa Member Details API response)
export interface MemberSpiritualGift extends SpiritualGift {
  pivot?: MemberSpiritualGiftPivot;
}

// 4. Query / Filter Parameters (para sa GET /api/spiritual-gifts)
export interface SpiritualGiftQueryParams {
  search?: string;
  category?: SpiritualGiftCategory;
  is_active?: boolean;
  per_page?: number;
  direction?: 'asc' | 'desc';
}