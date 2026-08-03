<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Member;
use App\Http\Resources\MemberResource;

use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Members\MemberController;
use App\Http\Controllers\Api\V1\Visitors\VisitorController;
use App\Http\Controllers\Api\V1\Churches\ChurchController;
use App\Http\Controllers\Api\V1\Clusters\ClusterController;
use App\Http\Controllers\Api\V1\GrowthGroups\GrowthGroupController;
use App\Http\Controllers\Api\V1\SpiritualGifts\SpiritualGiftController;
use App\Http\Controllers\Api\V1\Family\FamilyController;
use App\Http\Controllers\Api\V1\GrowthGroupMember\GrowthGroupMemberController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    // Dito mo ilalagay ang iba pang protected routes sa hinaharap

    Route::middleware('auth:sanctum')->group(function () {
        // AUTH ROUTES
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);

        // PROFILE ROUTES
        Route::middleware('auth:sanctum')->group(function () {

            // 1. GET /profile/me
            Route::get('/profile/me', function (Request $request) {
                $user = $request->user();

                $member = Member::with([
                    'Church',
                    'Cluster',
                    'spiritualGifts',
                    'familyMembership.family.familyMembers.member' // <--- IDINAGDAG DITO
                ])
                    ->where('user_id', $user->id)
                    ->first();

                if (!$member) {
                    return response()->json(['message' => 'Member profile not found'], 404);
                }

                return response()->json([
                    'success' => true,
                    'data' => new MemberResource($member)
                ]);
            });

            // 2. GET /profile/{id}
            Route::get('/profile/{id}', function ($id) {
                $member = Member::with([
                    'Church',
                    'Cluster',
                    'spiritualGifts',
                    'familyMembership.family.familyMembers.member' // <--- IDINAGDAG DITO
                ])
                    ->find($id);

                if (!$member) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Member not found'
                    ], 404);
                }

                return response()->json([
                    'success' => true,
                    'data' => new MemberResource($member)
                ]);
            });
        });

        // MEMBERS ROUTES
        Route::get('/members', [MemberController::class, 'index']);
        Route::put('/members/{id}', [MemberController::class, 'update']);

        // VISITORS ROUTES
        Route::get('/visitors', [VisitorController::class, 'index']);
        Route::post('/visitors', [VisitorController::class, 'store']);

        // CHURCHES ROUTES
        Route::get('/churches', [ChurchController::class, 'index']);
        Route::post('/churches', [ChurchController::class, 'store']);
        Route::put('/churches/{church}', [ChurchController::class, 'update']);

        // CLUSTERS ROUTES
        Route::get('/clusters', [ClusterController::class, 'index']);
        Route::get('/clusters/grouped', [ClusterController::class, 'indexGrouped']);
        Route::post('/clusters', [ClusterController::class, 'store']);
        Route::put('/clusters/{cluster}', [ClusterController::class, 'update']);

        // GOWTH GROUPS ROUTES
        Route::get('/growth-groups', [GrowthGroupController::class, 'index']);
        Route::post('/growth-groups', [GrowthGroupController::class, 'store']);
        Route::put('/growth-groups/{growth_group}', [GrowthGroupController::class, 'update']);

        // GROWTH GROUP MEMBERS
        Route::get('/growth-groups-members', [GrowthGroupMemberController::class, 'index']);
        Route::get('/growth-groups-members/{id}/members', [GrowthGroupMemberController::class, 'showMembers']);
        Route::post('/growth-groups-members/{id}/members', [GrowthGroupMemberController::class, 'addMember']);
        Route::put('/growth-groups-members/{growthGroupId}/members/{memberId}', [GrowthGroupMemberController::class, 'updateMember']);
        Route::delete('/growth-groups-members/{growthGroupId}/members/{memberId}', [GrowthGroupMemberController::class, 'removeMember']);

        // SPIRITUAL GIFTS ROUTES
        Route::prefix('spiritual-gifts')->group(function () {
            Route::get('/', [SpiritualGiftController::class, 'index']);
            Route::get('/{spiritualGift}', [SpiritualGiftController::class, 'show']);
        });

        // Custom Enterprise Endpoints para sa Family Grouping
        Route::apiResource('families', FamilyController::class)->only(['index', 'store', 'show']);
        Route::prefix('families/{family}')->group(function () {
            // Mag-add ng member sa pamilya
            Route::post('members', [FamilyController::class, 'addMember']);
            // Alisin ang member sa pamilya
            Route::delete('members/{memberId}', [FamilyController::class, 'removeMember']);
        });
    });
});
