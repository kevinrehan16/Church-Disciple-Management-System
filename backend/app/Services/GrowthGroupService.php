<?php

namespace App\Services;

use App\Models\GrowthGroup;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GrowthGroupService
{
    public function getPaginatedGrowthGroups(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = GrowthGroup::query()
            ->with(['church', 'cluster', 'leader']);

        // Search Filter (Name, Code, Venue Address)
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('venue_address', 'like', "%{$search}%");
            });
        }

        // Filter by Church
        if (!empty($filters['church_id'])) {
            $query->where('church_id', $filters['church_id']);
        }

        // Filter by Cluster
        if (!empty($filters['cluster_id'])) {
            $query->where('cluster_id', $filters['cluster_id']);
        }

        // Filter by Target Demographic
        if (!empty($filters['demographic'])) {
            $query->where('target_demographic', $filters['demographic']);
        }

        // Filter by Location Type (onsite, online, hybrid)
        if (!empty($filters['location_type'])) {
            $query->where('location_type', $filters['location_type']);
        }

        // Filter by Active Status
        if (isset($filters['is_active'])) {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        return $query->latest()
            ->paginate($perPage);
    }

    public function createGrowthGroup(array $data): GrowthGroup
    {
        return GrowthGroup::create($data);
    }

    public function updateGrowthGroup(GrowthGroup $growthGroup, array $data): GrowthGroup
    {
        $growthGroup->update($data);
        return $growthGroup->fresh(['church', 'cluster', 'leader']);
    }

    public function deleteGrowthGroup(GrowthGroup $growthGroup): bool
    {
        return $growthGroup->delete();
    }
}
