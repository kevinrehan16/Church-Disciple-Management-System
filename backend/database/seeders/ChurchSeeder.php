<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Church;

class ChurchSeeder extends Seeder
{
    public function run(): void
    {
        $churches = [
            [
                'name' => 'Disciple Network - Main Campus',
                'code' => 'DN-MAIN',
                'address' => '123 Faith St., Quezon City',
                'contact_number' => '09171234567',
                'email' => 'main@disciplenetwork.org',
                'is_main_campus' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Disciple Network - South Satellite',
                'code' => 'DN-SOUTH',
                'address' => '45 Hope Ave., Alabang, Muntinlupa',
                'contact_number' => '09187654321',
                'email' => 'south@disciplenetwork.org',
                'is_main_campus' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Disciple Network - Cavite Satellite',
                'code' => 'DN-CAVITE',
                'address' => '78 Grace Rd., Dasmariñas, Cavite',
                'contact_number' => '09191122334',
                'email' => 'cavite@disciplenetwork.org',
                'is_main_campus' => false,
                'is_active' => true,
            ],
        ];

        foreach ($churches as $church) {
            Church::updateOrCreate(['code' => $church['code']], $church);
        }
    }
}
