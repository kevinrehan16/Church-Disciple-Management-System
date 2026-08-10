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

        // 1. Dedicated Super Admin account
        $superAdminUser = User::create([
            'email' => 'superadmin@gcfsouthmetro.org',
            'password' => Hash::make('kevin123'),
            'role' => 'super_admin',
            'email_verified_at' => now(),
            'must_change_password' => false,
            'is_active' => true
        ]);

        $superAdminUser->assignRole('super_admin');

        Member::factory()->create([
            'user_id' => $superAdminUser->id,
            'first_name' => 'Kevin',
            'last_name' => 'Macandog',
            'member_position' => 'No Growth Group',
        ]);

        // 2. Paglikha ng specific positions sa `members` table (Total = 45 members)

        // 1 Senior Pastor
        Member::factory()->seniorPastor()->create();

        // 7 Pastors
        Member::factory()->pastor()->count(8)->create();

        // 7 Pastoral Staff
        Member::factory()->pastoralStaff()->count(7)->create();

        // 15 Deacons
        Member::factory()->deacon()->count(15)->create();

        // 15 Elders
        Member::factory()->elder()->count(15)->create();

        // 3. Natitirang 954 members (999 target - 45 = 954)
        // Sila ay magiging random: 'Growth Group Leader', 'Growth Group Member', o 'No Growth Group'
        Member::factory()->count(954)->create();
    }
}
