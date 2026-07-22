<?php

namespace App\Services;

use App\Models\SpiritualGift;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class SpiritualGiftService
{
    /**
     * Get filtered list of spiritual gifts (paginated or all).
     */
    public function getGifts(array $filters = []): LengthAwarePaginator|Collection
    {
        $query = SpiritualGift::query();

        // Filter by active status
        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        // Filter by category
        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        // Search by name or code
        if (!empty($filters['search'])) {
            $searchTerm = $filters['search'];
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'ilike', "%{$searchTerm}%")
                    ->orWhere('code', 'ilike', "%{$searchTerm}%");
            });
        }

        // Order by name (defaults to 'asc', allows 'desc' if specified)
        $direction = strtolower($filters['direction'] ?? 'asc') === 'desc' ? 'desc' : 'asc';
        $query->orderBy('name', $direction);

        // Paginate if per_page is present, otherwise return full collection
        if (!empty($filters['per_page'])) {
            return $query->paginate((int) $filters['per_page']);
        }

        return $query->get();
    }

    /**
     * Find a single spiritual gift by ID or Code.
     */
    public function findGift(string|int $identifier): SpiritualGift
    {
        return SpiritualGift::query()
            ->where('id', $identifier)
            ->orWhere('code', $identifier)
            ->firstOrFail();

        // Filter by category: GET /api/spiritual-gifts?category=Instructional

        // Search by keyword: GET /api/spiritual-gifts?search=Teaching

        // Paginated results: GET /api/spiritual-gifts?per_page=10

        // Fetch single gift by Code or ID: GET /api/spiritual-gifts/GIFT-TEACHING or GET /api/spiritual-gifts/1
    }
}
