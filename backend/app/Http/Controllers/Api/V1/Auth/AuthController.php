<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\User\RegisterRequest;
use App\Http\Requests\Password\ChangePasswordRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function login(LoginRequest $request)
    {
        // Ipasa ang validated data at ang IP address ng client
        $user = $this->authService->authenticate($request->validated(), $request->ip());
        $user->load('member');

        // Gumawa ng Sanctum API Token para sa user
        $token = $user->createToken('auth_token')->plainTextToken;

        // Ibalik ang user details kasama ang token
        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        // 1. I-revoke ang lahat ng tokens ng authenticated user
        $request->user()->currentAccessToken()->delete();

        // 2. Ibalik ang response
        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    public function user(Request $request)
    {
        $this->authorize('viewAny', User::class);

        return new UserResource($request->user()->load('member'));
    }

    public function register(RegisterRequest $request)
    {
        // Tawagin lang ang service method
        $user = $this->authService->registerUser($request->validated());

        // Load relationship for the resource
        $user->load('member');

        return response()->json([
            'message' => 'User registered successfully',
            'user'    => new UserResource($user)
        ], 201);
    }

    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        // I-pasa ang validated data (kasama ang email) sa service
        $this->authService->changePassword($request->validated());

        return response()->json([
            'message' => 'Password successfully updated. You can now login.',
        ], 200);
    }
}
