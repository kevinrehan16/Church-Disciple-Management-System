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
use App\Http\Controllers\Api\V1\Permission\PermissionController;
use App\Http\Controllers\Api\V1\Role\RoleController;
use App\Http\Controllers\Api\V1\UserRole\UserRoleController;
use App\Http\Controllers\Api\V1\DiscipleNetwork\DiscipleNetworkController;

Route::prefix('v1')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    // Dito mo ilalagay ang iba pang protected routes sa hinaharap
    Route::middleware('auth:sanctum', 'password.changed')->group(function () {
        // AUTH ROUTES
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::middleware(['role:super_admin|senior_pastor|pastor|admin|staff'])->group(function () {
            Route::get('/user', [AuthController::class, 'user']);
            Route::post('/register', [AuthController::class, 'register']);
            Route::get('/users', [AuthController::class, 'getAllUsers']);
        });

        // PROFILE ROUTES
        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/profile/me', [AuthController::class, 'myProfile']);
            Route::get('/profile/{id}', [AuthController::class, 'memberProfile']);
        });

        // MEMBERS ROUTES
        Route::middleware(['role:super_admin|senior_pastor|pastor|admin|staff'])->group(function () {
            Route::get('/members', [MemberController::class, 'index']);
            Route::put('/members/{member}', [MemberController::class, 'update']);
        });

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

        // USER ROLE PERMISSION MANAGEMENT ROUTES
        Route::middleware(['auth:sanctum', 'role:super_admin'])->group(function () {
            // Permissions Management
            Route::apiResource('permissions', PermissionController::class)->only(['index', 'update', 'store', 'destroy']);

            // Roles Management & Syncing Permissions
            Route::apiResource('roles', RoleController::class);
            Route::post('/roles/{role}/permissions', [RoleController::class, 'syncPermissions']);

            // User Role Assignment
            Route::post('/users/{user}/roles', [UserRoleController::class, 'assignRole']);
            Route::delete('/users/{user}/roles', [UserRoleController::class, 'removeRole']);
        });

        Route::middleware(['auth:sanctum'])->group(function () {
            Route::get('/disciple-network', [DiscipleNetworkController::class, 'index']);
        });
    });
});
