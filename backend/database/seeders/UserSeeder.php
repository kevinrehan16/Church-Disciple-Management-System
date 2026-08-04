<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Siguraduhing umiiral ang super_admin role sa database
        $superAdminRole = Role::firstOrCreate([
            'name'       => 'super_admin',
            'guard_name' => 'sanctum',
        ]);

        // 2. Isabay na rin ang pag-assign ng lahat ng permissions sa Super Admin role
        $allPermissions = Permission::all();
        if ($allPermissions->isNotEmpty()) {
            $superAdminRole->syncPermissions($allPermissions);
        }

        // 3. Gumawa ng User gamit ang iyong structure & UUID
        $user = User::firstOrCreate(
            ['email' => 'superadmin@gcfsouthmetro.org'],
            [
                'id'       => Str::uuid(),
                'password' => Hash::make('kevin123'),
                'role'     => 'super_admin',
                'must_change_password' => false,
            ]
        );

        // 4. ITO ANG MAGPAPALABAS AT MAG-IINSERT SA `model_has_roles` TABLE:
        $user->assignRole($superAdminRole);
    }
}
