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
            Route::get('/profile/me', function (Request $request) {
                // 1. Kukunin ang kasalukuyang logged-in user
                $user = $request->user();

                // 2. Kukunin ang Member record na nakakabit sa user na ito
                // (Isasama rin natin ang spiritual gifts at growth groups)
                $member = Member::with(['Church', 'Cluster', 'spiritualGifts'])
                    ->where('user_id', $user->id) // o kung paano man naka-foreign key sa DB mo
                    ->first();

                if (!$member) {
                    return response()->json(['message' => 'Member profile not found'], 404);
                }

                return response()->json([
                    'success' => true,
                    'data' => new MemberResource($member)
                ]);
            });

            Route::get('/profile/{id}', function ($id) {
                // 1. Kukunin ang kasalukuyang logged-in user
                $member = Member::with(['Church', 'Cluster', 'spiritualGifts'])
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

        // SPIRITUAL GIFTS ROUTES
        Route::prefix('spiritual-gifts')->group(function () {
            Route::get('/', [SpiritualGiftController::class, 'index']);
            Route::get('/{spiritualGift}', [SpiritualGiftController::class, 'show']);
        });
    });
});
