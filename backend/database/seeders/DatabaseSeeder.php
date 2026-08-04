<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            VisitorSeeder::class,
            MemberSeeder::class,
            SpiritualGiftSeeder::class,
            ChurchSeeder::class,
            ClusterSeeder::class,
            GrowthGroupSeeder::class,
            RoleAndPermissionSeeder::class,
        ]);
    }
}
