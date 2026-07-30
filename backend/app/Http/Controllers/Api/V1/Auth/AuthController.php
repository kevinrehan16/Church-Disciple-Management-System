<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\User\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function login(LoginRequest $request)
    {
        // 1. I-authenticate ang user gamit ang iyong AuthService
        $user = $this->authService->authenticate($request->validated());
        $user->load('member');

        // 2. Burahin ang mga lumang tokens (psy/security clean up)
        $user->tokens()->delete();

        // 3. Gumawa ng bagong Sanctum Bearer Token
        $token = $user->createToken('auth_token')->plainTextToken;

        // 4. Ibalik ang user details KASAMA ANG TOKEN
        return response()->json([
            'user'  => new UserResource($user),
            'token' => $token,
        ]);
    }

    public function user(Request $request)
    {
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
}
