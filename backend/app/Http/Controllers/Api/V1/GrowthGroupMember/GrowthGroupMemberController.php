<?php

namespace App\Http\Controllers\Api\V1\GrowthGroupMember;

use App\Http\Requests\GrowthGroupMember\AddGrowthGroupMemberRequest;
use App\Http\Requests\GrowthGroupMember\UpdateGrowthGroupMemberRequest;
use App\Http\Resources\GrowthGroupMemberResource;
use App\Http\Resources\GrowthGroupsMembersResource;
use App\Services\GrowthGroupMemberService;
use App\Http\Controllers\Controller;

class GrowthGroupMemberController extends Controller
{
    protected GrowthGroupMemberService $memberService;

    public function __construct(GrowthGroupMemberService $memberService)
    {
        $this->memberService = $memberService;
    }

    public function index()
    {
        $growthGroups = $this->memberService->getAllGroupsWithMembers();

        return response()->json([
            'success' => true,
            'data' => GrowthGroupsMembersResource::collection($growthGroups),
        ]);
    }

    // VIEW: Listahan ng members
    public function showMembers($id)
    {
        $growthGroup = $this->memberService->getGroupWithMembers($id);

        return response()->json([
            'success' => true,
            'data' => new GrowthGroupsMembersResource($growthGroup),
        ]);
    }

    // INSERT: Magdagdag ng member gamit ang Form Request
    public function addMember(AddGrowthGroupMemberRequest $request, $id)
    {
        $this->memberService->addMember($id, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'The member has been successfully added to the Growth Group.',
        ], 201);
    }

    // UPDATE: Baguhin ang role/detalye gamit ang Form Request
    public function updateMember(UpdateGrowthGroupMemberRequest $request, $growthGroupId, $memberId)
    {
        $this->memberService->updateMemberRole($growthGroupId, $memberId, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Na-update na ang detalye ng miyembro sa Growth Group.',
        ]);
    }

    // DELETE: Tanggalin ang member sa GG
    public function removeMember($growthGroupId, $memberId)
    {
        $this->memberService->removeMember($growthGroupId, $memberId);

        return response()->json([
            'success' => true,
            'message' => 'Naalis na ang miyembro sa Growth Group.',
        ]);
    }
}
