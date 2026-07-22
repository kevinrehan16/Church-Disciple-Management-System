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
                'name' => 'GCF South Metro',
                'code' => 'GCFSM',
                'address' => 'Daang-hari, Las Pinas City',
                'contact_number' => '09171234567',
                'email' => 'gcfsouthmetro@gcfchristian.org',
                'is_main_campus' => true,
                'is_active' => true,
            ],
            [
                'name' => 'GCF Bacoor',
                'code' => 'GCFBCR',
                'address' => '45 Hope Ave., Bacoor Cavite',
                'contact_number' => '09187654321',
                'email' => 'gcfbacoor@gcfchristian.org',
                'is_main_campus' => false,
                'is_active' => true,
            ],
            [
                'name' => 'GCF Nuvali',
                'code' => 'GCFNVL',
                'address' => '78 Grace Rd., Nuvali',
                'contact_number' => '09191122334',
                'email' => 'gcfnuvali@gcfchristian.org',
                'is_main_campus' => false,
                'is_active' => true,
            ],
        ];

        foreach ($churches as $church) {
            Church::updateOrCreate(['code' => $church['code']], $church);
        }
    }
}
