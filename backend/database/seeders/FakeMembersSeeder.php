<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Member;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class FakeMembersSeeder extends Seeder
{
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();

        Member::truncate();
        User::truncate();

        Schema::enableForeignKeyConstraints();

        // 1. Gawan ng dedicated Super Admin account
        $superAdminUser = User::create([
            'email' => 'superadmin@gcfsouthmetro.org',
            'password' => Hash::make('kevin123'),
            'role' => 'super_admin',
            'email_verified_at' => now(),
            'must_change_password' => false,
            'is_active' => true
        ]);

        // IDAGDAG ITO: I-assign ang role gamit ang Spatie permission method
        $superAdminUser->assignRole('super_admin');

        Member::factory()->create([
            'user_id' => $superAdminUser->id,
            'first_name' => 'Kevin',
            'last_name' => 'Macandog',
            'member_position' => 'Member',
        ]);

        // 2. Gawa ng natitirang 999 fake members
        Member::factory()->count(999)->create();
    }
}
