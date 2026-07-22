<?php

namespace App\Services;

use App\Models\Cluster;
use App\Models\Church;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ClusterService
{
    public function getAllClusters(int $perPage = 15): LengthAwarePaginator
    {
        return Cluster::with('church')
            ->latest()
            ->paginate($perPage);
    }

    public function getPaginatedClusters(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Cluster::query()
            ->with('church')
            ->withCount('growthGroups'); // Sinama na rin ang count ng Growth Groups

        // Search Filter (Cluster Name o Leader Name)
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                    ->orWhere('name', 'ILIKE', "%{$search}%")
                    ->orWhere('code', 'ILIKE', "%{$search}%");
            });
        }

        // Filter by Specific Church
        if (!empty($filters['church_id'])) {
            $query->where('church_id', $filters['church_id']);
        }

        // Filter by Active Status
        if (isset($filters['is_active'])) {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        return $query->orderBy('name', 'asc')
            ->paginate($perPage);
    }

    public function getGroupedClusters(array $filters = [], int $perPage = 5): LengthAwarePaginator
    {
        // Kukunin ang Church at ire-relate ang Clusters
        $query = Church::query()
            ->with(['clusters' => function ($q) use ($filters) {
                // Pag may search filter, i-fifilter din ang clusters
                if (!empty($filters['search'])) {
                    $search = $filters['search'];
                    $q->where(function ($sub) use ($search) {
                        $sub->where('name', 'ILIKE', "%{$search}%")
                            ->orWhere('code', 'ILIKE', "%{$search}%");
                    });
                }

                if (isset($filters['is_active'])) {
                    $q->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
                }
            }]);

        // Search filter: puwedeng pangalan ng Church O pangalan ng Cluster
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                    ->orWhere('code', 'ILIKE', "%{$search}%")
                    ->orWhereHas('clusters', function ($clusterQuery) use ($search) {
                        $clusterQuery->where('name', 'ILIKE', "%{$search}%")
                            ->orWhere('code', 'ILIKE', "%{$search}%");
                    });
            });
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        return $query->orderBy('is_main_campus', 'desc')
            ->orderBy('name', 'asc')
            ->paginate($perPage);
    }

    public function createCluster(array $data): Cluster
    {
        return Cluster::create($data);
    }

    public function updateCluster(Cluster $cluster, array $data): Cluster
    {
        $cluster->update($data);
        return $cluster->fresh();
    }

    public function deleteCluster(Cluster $cluster): bool
    {
        return $cluster->delete();
    }
}
