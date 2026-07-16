<?php

namespace App\Http\Controllers\Api\V1\Visitors;

use App\Http\Controllers\Controller;
use App\Services\VisitorService;
use App\Http\Resources\VisitorResource;
use App\Http\Requests\Visitor\StoreVisitorRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class VisitorController extends Controller
{
    protected $visitorService;

    public function __construct(VisitorService $visitorService)
    {
        $this->visitorService = $visitorService;
    }

    public function index(Request $request)
    {
        // Ipasa ang lahat ng request inputs (kabilang ang 'search' at 'page') bilang array
        $visitors = $this->visitorService->getAllVisitors($request->all());

        return VisitorResource::collection($visitors);
    }

    public function store(StoreVisitorRequest $request): JsonResponse
    {
        try {
            // Kunin ang validated data mula sa Request
            $data = $request->validated();

            // Tawagin ang Service
            $visitor = $this->visitorService->createVisitor($data);

            return response()->json([
                'message' => 'Visitor registered successfully!',
                'data' => $visitor
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to register visitor.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
