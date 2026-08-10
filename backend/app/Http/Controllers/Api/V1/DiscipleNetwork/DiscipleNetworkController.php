<?php

namespace App\Http\Controllers\Api\V1\DiscipleNetwork;

use App\Http\Controllers\Controller;
use App\Http\Resources\DiscipleNetworkResource;
use App\Models\Member;
use App\Services\DiscipleNetworkService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class DiscipleNetworkController extends Controller
{
    public function __construct(
        protected DiscipleNetworkService $discipleNetworkService
    ) {}

    /**
     * Display the full disciple network hierarchy tree.
     */
    public function index(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Member::class);

        $treeData = $this->discipleNetworkService->getHierarchyTree();

        return DiscipleNetworkResource::collection($treeData);
    }
}
