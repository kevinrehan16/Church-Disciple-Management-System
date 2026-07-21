<?php

namespace App\Services;

use App\Models\Church;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class ChurchService
{
    /**
     * Kukunin ang lahat ng churches (para sa dropdowns / select fields).
     */
    public function getAllActiveChurches(): Collection
    {
        return Church::where('is_active', true)
            ->orderBy('name', 'asc')
            ->get();
    }

    /**
     * Paginated list na may search at filtering capabilities.
     */
    public function getPaginatedChurches(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Church::query()->withCount(['clusters', 'growthGroups']);

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                    ->orWhere('code', 'ILIKE', "%{$search}%")
                    ->orWhere('address', 'ILIKE', "%{$search}%");
            });
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        return $query->orderBy('is_main_campus', 'desc')
            ->orderBy('id', 'desc')
            ->paginate($perPage);
    }

    /**
     * Lilikha ng bagong Church record.
     */
    public function createChurch(array $data): Church
    {
        return DB::transaction(function () use ($data) {
            // Pag ginawang main campus ito, siguraduhing ma-unset ang dating main campus kung kinakailangan
            if (!empty($data['is_main_campus']) && $data['is_main_campus']) {
                Church::where('is_main_campus', true)->update(['is_main_campus' => false]);
            }

            return Church::create($data);
        });
    }

    /**
     * Mag-a-update ng umiiral na Church record.
     */
    public function updateChurch(Church $church, array $data): Church
    {
        return DB::transaction(function () use ($church, $data) {
            if (!empty($data['is_main_campus']) && $data['is_main_campus']) {
                Church::where('id', '!=', $church->id)
                    ->where('is_main_campus', true)
                    ->update(['is_main_campus' => false]);
            }

            $church->update($data);
            return $church->refresh();
        });
    }

    /**
     * Soft delete sa Church record.
     */
    public function deleteChurch(Church $church): bool
    {
        return $church->delete();
    }
}
