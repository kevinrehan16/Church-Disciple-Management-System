<?php

namespace App\Http\Controllers\Api\V1\Members;

use App\Http\Controllers\Controller;
use App\Services\MemberService;
use App\Http\Resources\MemberResource;
use App\Http\Requests\Member\UpdateMemberRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    protected $memberService;

    // Dependency Injection
    public function __construct(MemberService $memberService)
    {
        $this->memberService = $memberService;
    }

    public function index(Request $request)
    {
        // 1. Validations (Optional but recommended)
        $request->validate([
            'position' => 'nullable|string',
            'search'   => 'nullable|string',
        ]);

        // 2. Kunin ang request params
        $position = $request->query('position');
        $rank = $request->query('rank');

        // 3. Tawagin ang Service
        $members = $this->memberService->getPaginatedMembers($request, $position, $rank);

        // 4. Return via Resource
        return MemberResource::collection($members);
    }

    public function update(UpdateMemberRequest $request, $id): JsonResponse
    {
        try {
            $updatedMember = $this->memberService->updateMember($id, $request->validated());

            return response()->json([
                'status' => 'success',
                'message' => 'Member profile updated successfully.',
                'data' => $updatedMember
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
