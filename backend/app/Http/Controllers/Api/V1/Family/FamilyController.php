<?php

namespace App\Http\Controllers\Api\V1\Family;

use App\Http\Controllers\Controller;
use App\Http\Requests\Family\CreateFamilyRequest;
use App\Http\Requests\Family\AddMemberToFamilyRequest;
use App\Http\Resources\FamilyResource;
use App\Http\Resources\FamilyMemberResource;
use App\Models\Family;
use App\Models\FamilyMember;
use App\Services\FamilyService;
use Illuminate\Http\JsonResponse;
use Exception;

class FamilyController extends Controller
{
    protected FamilyService $familyService;

    // I-inject ang ating FamilyService
    public function __construct(FamilyService $familyService)
    {
        $this->familyService = $familyService;
    }

    /**
     * Listahan ng mga Pamilya (Opsyonal)
     */
    public function index()
    {
        // Kuhanin ang lahat ng pamilya, i-eager load ang Head para mabilis
        $families = Family::with('head')->paginate(10);
        return FamilyResource::collection($families);
    }

    /**
     * Lumikha ng Pamilya (POST /api/families)
     */
    public function store(CreateFamilyRequest $request): JsonResponse
    {
        try {
            $family = $this->familyService->createFamily($request->validated());

            // I-load ang relationships para sa response
            $family->load(['head', 'familyMembers.member']);

            return response()->json([
                'message' => 'Pamilya ay matagumpay na nilikha.',
                'data' => new FamilyResource($family),
            ], 201);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Tingnan ang detalye ng isang Pamilya (GET /api/families/{id})
     */
    public function show(Family $family)
    {
        // I-eager load ang Head at lahat ng Members (FamilyMember -> Member)
        $family->load(['head', 'familyMembers.member']);
        return new FamilyResource($family);
    }

    /**
     * Mag-add ng Member sa Pamilya (POST /api/families/{family}/members)
     */
    public function addMember(AddMemberToFamilyRequest $request, Family $family): JsonResponse
    {
        try {
            $familyMember = $this->familyService->addMemberToFamily($family, $request->validated());

            // I-load ang member details para sa response
            $familyMember->load('member');

            return response()->json([
                'message' => 'Miyembro ay matagumpay na idinagdag sa pamilya.',
                'data' => new FamilyMemberResource($familyMember),
            ], 200);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Alisin ang Member sa Pamilya (DELETE /api/families/{family}/members/{memberId})
     */
    public function removeMember(Family $family, $memberId): JsonResponse
    {
        // Hanapin ang record sa junction table
        $familyMemberRecord = FamilyMember::where('family_id', $family->id)
            ->where('member_id', $memberId)
            ->first();

        if (!$familyMemberRecord) {
            return response()->json(['message' => 'Ang miyembro ay hindi kabilang sa pamilyang ito.'], 404);
        }

        try {
            $this->familyService->removeMemberFromFamily($familyMemberRecord);
            return response()->json(['message' => 'Miyembro ay matagumpay na inalis sa pamilya.'], 200);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
