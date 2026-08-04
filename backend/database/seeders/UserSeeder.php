<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'id'       => Str::uuid(),
            'email'    => 'superadmin@gcfsouthmetro.org',
            'password' => Hash::make('kevin123'), // palitan mo ito ng secure password
            'role'     => 'super_admin',
        ]);
    }
}
