<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cluster;
use App\Models\Church;
use App\Models\Member;

class ClusterSeeder extends Seeder
{
    public function run(): void
    {
        $mainChurch = Church::where('code', 'DN-MAIN')->first();
        $southChurch = Church::where('code', 'DN-SOUTH')->first();

        // Kukuha ng unang member bilang Cluster Head kung may existing member na
        $firstMember = Member::first();

        if ($mainChurch) {
            Cluster::updateOrCreate(
                ['code' => 'CL-NORTH-MAIN'],
                [
                    'church_id' => $mainChurch->id,
                    'name' => 'North Cluster',
                    'head_id' => $firstMember?->id,
                    'is_active' => true,
                ]
            );

            Cluster::updateOrCreate(
                ['code' => 'CL-YOUTH-MAIN'],
                [
                    'church_id' => $mainChurch->id,
                    'name' => 'Youth Ministry Cluster',
                    'head_id' => $firstMember?->id,
                    'is_active' => true,
                ]
            );
        }

        if ($southChurch) {
            Cluster::updateOrCreate(
                ['code' => 'CL-SOUTH-DIST1'],
                [
                    'church_id' => $southChurch->id,
                    'name' => 'Alabang District Cluster',
                    'head_id' => $firstMember?->id,
                    'is_active' => true,
                ]
            );
        }
    }
}
