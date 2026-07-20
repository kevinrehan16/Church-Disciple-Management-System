<?php

namespace App\Http\Controllers\Api\V1\GrowthGroups;

use App\Http\Controllers\Controller;
use App\Http\Requests\GrowthGroup\StoreGrowthGroupRequest;
use App\Http\Requests\GrowthGroup\UpdateGrowthGroupRequest;
use App\Http\Resources\GrowthGroupResource;
use App\Models\GrowthGroup;
use App\Services\GrowthGroupService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class GrowthGroupController extends Controller
{
    protected GrowthGroupService $growthGroupService;

    public function __construct(GrowthGroupService $growthGroupService)
    {
        $this->growthGroupService = $growthGroupService;
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = $request->only([
            'search',
            'church_id',
            'cluster_id',
            'demographic',
            'location_type',
            'is_active'
        ]);

        $perPage = (int) $request->input('per_page', 15);

        $growthGroups = $this->growthGroupService->getPaginatedGrowthGroups($filters, $perPage);

        return GrowthGroupResource::collection($growthGroups);
    }

    public function store(StoreGrowthGroupRequest $request): JsonResponse
    {
        $growthGroup = $this->growthGroupService->createGrowthGroup($request->validated());

        return response()->json([
            'message' => 'Growth Group created successfully.',
            'data'    => new GrowthGroupResource($growthGroup->load(['church', 'cluster', 'leader']))
        ], 201);
    }

    public function show(GrowthGroup $growthGroup): JsonResponse
    {
        return response()->json([
            'data' => new GrowthGroupResource($growthGroup->load(['church', 'cluster', 'leader']))
        ]);
    }

    public function update(UpdateGrowthGroupRequest $request, GrowthGroup $growthGroup): JsonResponse
    {
        $updatedGroup = $this->growthGroupService->updateGrowthGroup($growthGroup, $request->validated());

        return response()->json([
            'message' => 'Growth Group updated successfully.',
            'data'    => new GrowthGroupResource($updatedGroup)
        ]);
    }

    public function destroy(GrowthGroup $growthGroup): JsonResponse
    {
        $this->growthGroupService->deleteGrowthGroup($growthGroup);

        return response()->json([
            'message' => 'Growth Group deleted successfully.'
        ]);
    }
}
