<?php

namespace App\Http\Controllers\Api\V1\UserRole;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRole\UserRoleRequest;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewUserTemporaryPasswordMail;

class UserRoleController extends Controller
{
    public function assignRole(UserRoleRequest $request, User $user)
    {
        // Alamin kung dati siyang inactive/false at ngayon ay ginagawang active/true
        $wasInactive = !$user->is_active;
        $isNowActive = $request->boolean('is_active');

        $tempPassword = null;

        // 1. Ihanda ang data na i-update
        $updateData = [
            'role' => $request->role,
            'is_active' => $isNowActive,
        ];

        // 💡 Kung ang user ay binago patungong ACTIVE (at dati siyang inactive, o gusto mo tuwing gagawing active)
        if ($wasInactive && $isNowActive) {
            $tempPassword = Str::random(10); // Gumawa ng random password na may 10 characters

            $updateData['password'] = Hash::make($tempPassword);

            // Kung meron kang must_change_password flag sa database, pwede mo ring isama:
            if (in_array('must_change_password', $user->getFillable())) {
                $updateData['must_change_password'] = true;
            }
        }

        // 2. I-update ang user sa database
        $user->update($updateData);

        // 3. I-sync ang roles (Spatie Permission)
        $user->syncRoles([$request->role]);

        // 4. Ipadala ang email kung nag-generate tayo ng bagong random password
        if ($tempPassword) {
            Mail::to($user->email)->send(new NewUserTemporaryPasswordMail($tempPassword));
        }

        return response()->json([
            'success' => true,
            'message' => "User updated successfully (Role: {$request->role}, Active: " . ($user->is_active ? 'Yes' : 'No') . ")",
            'user_data' => [
                'role' => $user->role,
                'is_active' => $user->is_active,
                'roles' => $user->getRoleNames()
            ]
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
