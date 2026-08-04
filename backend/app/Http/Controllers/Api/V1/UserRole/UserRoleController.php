<?php

namespace App\Http\Controllers\Api\V1\UserRole;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRole\UserRoleRequest;
use App\Models\User;

class UserRoleController extends Controller
{
    public function assignRole(UserRoleRequest $request, User $user)
    {
        $user->assignRole($request->role);

        return response()->json([
            'success' => true,
            'message' => "Role '{$request->role}' assigned successfully to user",
            'roles' => $user->getRoleNames()
        ]);
    }

    public function removeRole(UserRoleRequest $request, User $user)
    {
        $user->removeRole($request->role);

        return response()->json([
            'success' => true,
            'message' => "Role '{$request->role}' removed successfully from user",
            'roles' => $user->getRoleNames()
        ]);
    }
}
