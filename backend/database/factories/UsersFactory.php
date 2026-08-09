<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UsersFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            // Random roles
            'role' => fake()->randomElement(['super_admin', 'senior_pastor', 'admin', 'pastor', 'staff', 'gg_leader', 'member']),
            'remember_token' => Str::random(10),
        ];
    }
}
