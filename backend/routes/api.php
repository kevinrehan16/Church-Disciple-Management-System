<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Members\MemberController;
use App\Http\Controllers\Api\V1\Visitors\VisitorController;
use App\Http\Controllers\Api\V1\Churches\ChurchController;
use App\Http\Controllers\Api\V1\Clusters\ClusterController;
use App\Http\Controllers\Api\V1\GrowthGroups\GrowthGroupController;

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
    });
});
