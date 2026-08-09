<?php

namespace App\Http\Controllers\Api\V1\Members;

use App\Http\Controllers\Controller;
use App\Services\MemberService;
use App\Http\Resources\MemberResource;
use App\Http\Requests\Member\UpdateMemberRequest;
use App\Models\Member; // <-- Siguraduhing naka-import ito
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
        $this->authorize('viewAny', Member::class);

        // 1. Validations (Pinayagan na ang string o array)
        $request->validate([
            'member_position' => 'nullable',
            'search'   => 'nullable|string',
        ]);

        // 2. Kunin ang request params
        $position = $request->query('member_position');
        $rank = $request->query('rank');

        // 3. Tawagin ang Service
        $members = $this->memberService->getPaginatedMembers($request, $position, $rank);

        // 4. Return via Resource
        return MemberResource::collection($members);
    }

    public function update(UpdateMemberRequest $request, Member $member): JsonResponse
    {
        // Gagamitin na ngayon ang $member dahil sa Route Model Binding
        $this->authorize('update', $member);

        try {
            // Pwede mong ipasa ang $member->id o ang buong $member object sa service mo
            $updatedMember = $this->memberService->updateMember($member->id, $request->validated());

            return response()->json([
                'status' => 'success',
                'message' => 'Member profile updated successfully.',
                'data' => new MemberResource($updatedMember) // Mas maganda kung i-wrap din sa Resource
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
