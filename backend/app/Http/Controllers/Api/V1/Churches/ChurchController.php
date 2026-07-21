<?php

namespace App\Http\Controllers\Api\V1\Churches;

use App\Http\Controllers\Controller;
use App\Http\Requests\Church\StoreChurchRequest;
use App\Http\Requests\Church\UpdateChurchRequest;
use App\Http\Resources\ChurchResource;
use App\Models\Church;
use App\Services\ChurchService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;

class ChurchController extends Controller
{
    public function __construct(
        protected ChurchService $churchService
    ) {}

    /**
     * Display a listing of the churches.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        // Kung 'all=true' sa params, ibabalik lahat (maganda gamitin sa Dropdowns)
        if ($request->boolean('all')) {
            return ChurchResource::collection($this->churchService->getAllActiveChurches());
        }

        $churches = $this->churchService->getPaginatedChurches(
            $request->only(['search', 'is_active']),
            $request->integer('per_page', 6)
        );

        return ChurchResource::collection($churches);
    }

    /**
     * Store a newly created church in storage.
     */
    public function store(StoreChurchRequest $request): JsonResponse
    {
        $church = $this->churchService->createChurch($request->validated());

        return response()->json([
            'message' => 'Church created successfully.',
            'data' => new ChurchResource($church)
        ], 210); // 201 Created
    }

    /**
     * Display the specified church.
     */
    public function show(Church $church): ChurchResource
    {
        $church->loadCount(['clusters', 'growthGroups']);
        return new ChurchResource($church);
    }

    /**
     * Update the specified church in storage.
     */
    public function update(UpdateChurchRequest $request, Church $church): JsonResponse
    {
        $updatedChurch = $this->churchService->updateChurch($church, $request->validated());

        return response()->json([
            'message' => 'Church updated successfully.',
            'data' => new ChurchResource($updatedChurch)
        ]);
    }

    /**
     * Remove the specified church from storage.
     */
    public function destroy(Church $church): JsonResponse
    {
        $this->churchService->deleteChurch($church);

        return response()->json([
            'message' => 'Church deleted successfully.'
        ]);
    }
}
