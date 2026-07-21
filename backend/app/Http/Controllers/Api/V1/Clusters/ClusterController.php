<?php

namespace App\Http\Controllers\Api\V1\Clusters;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cluster\StoreClusterRequest;
use App\Http\Requests\Cluster\UpdateClusterRequest;
use App\Http\Resources\ClusterResource;
use App\Http\Resources\ChurchWithClustersResource;
use App\Models\Cluster;
use App\Services\ClusterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Request;

class ClusterController extends Controller
{
    protected ClusterService $clusterService;

    public function __construct(ClusterService $clusterService)
    {
        $this->clusterService = $clusterService;
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = $request->only(['search', 'church_id', 'is_active']);
        $perPage = (int) $request->input('per_page', 15);

        $clusters = $this->clusterService->getPaginatedClusters($filters, $perPage);

        return ClusterResource::collection($clusters);
    }

    public function indexGrouped(Request $request): AnonymousResourceCollection
    {
        $groupedClusters = $this->clusterService->getGroupedClusters(
            $request->only(['search', 'is_active']),
            $request->integer('per_page', 10)
        );

        return ChurchWithClustersResource::collection($groupedClusters);
    }

    public function store(StoreClusterRequest $request): JsonResponse
    {
        $cluster = $this->clusterService->createCluster($request->validated());

        return response()->json([
            'message' => 'Cluster created successfully.',
            'data'    => new ClusterResource($cluster)
        ], 201);
    }

    public function show(Cluster $cluster): JsonResponse
    {
        return response()->json([
            'data' => new ClusterResource($cluster->load('church'))
        ]);
    }

    public function update(UpdateClusterRequest $request, Cluster $cluster): JsonResponse
    {
        $updatedCluster = $this->clusterService->updateCluster($cluster, $request->validated());

        return response()->json([
            'message' => 'Cluster updated successfully.',
            'data'    => new ClusterResource($updatedCluster)
        ]);
    }

    public function destroy(Cluster $cluster): JsonResponse
    {
        $this->clusterService->deleteCluster($cluster);

        return response()->json([
            'message' => 'Cluster deleted successfully.'
        ]);
    }
}
