<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Member;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Hanapin ang iyong existing test account
        $user = User::where('email', 'superadmin@gcfbacoor.com')->first();

        if ($user) {
            Member::create([
                'user_id' => $user->id, // Dito papasok ang UUID ng user
                'mem_id' => 'GCF-M-M-0000001',
                'first_name' => 'Kevin',
                'last_name' => 'Godnacam',
                'mobile_number' => '09153169518',
                'gender' => 'Male',
                'member_status' => 'Active',
            ]);

            $this->command->info('Member profile created for: ' . $user->email);
        } else {
            $this->command->error('User not found. Check the email in MemberSeeder.');
        }
    }
}
