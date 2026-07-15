<?php

namespace App\Http\Controllers\Api\V1\Visitors;

use App\Http\Controllers\Controller;
use App\Services\VisitorService;
use App\Http\Resources\VisitorResource;
use Illuminate\Http\Request;

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
}
