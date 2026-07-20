<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GrowthGroup;
use App\Models\Church;
use App\Models\Cluster;
use App\Models\Member;

class GrowthGroupSeeder extends Seeder
{
    public function run(): void
    {
        $mainChurch = Church::where('code', 'DN-MAIN')->first();
        $northCluster = Cluster::where('code', 'CL-NORTH-MAIN')->first();
        $youthCluster = Cluster::where('code', 'CL-YOUTH-MAIN')->first();

        // Sample Leaders & Members (Kukunin ang mga umiiral nang members)
        $members = Member::limit(10)->get();
        $leader1 = $members->first();
        $leader2 = $members->skip(1)->first();

        if ($mainChurch) {
            // 1. Young Professionals GG
            $gg1 = GrowthGroup::updateOrCreate(
                ['code' => 'GG-YPRO-01'],
                [
                    'church_id' => $mainChurch->id,
                    'cluster_id' => $northCluster?->id,
                    'leader_id' => $leader1?->id,
                    'name' => 'Young Professionals - North',
                    'meeting_day' => 'Friday',
                    'meeting_time' => '19:30:00',
                    'location_type' => 'hybrid',
                    'venue_address' => 'Church Rm 201 / Zoom',
                    'target_demographic' => 'single_professionals',
                    'is_active' => true,
                ]
            );

            // 2. Youth GG
            $gg2 = GrowthGroup::updateOrCreate(
                ['code' => 'GG-YTH-01'],
                [
                    'church_id' => $mainChurch->id,
                    'cluster_id' => $youthCluster?->id,
                    'leader_id' => $leader2?->id,
                    'name' => 'Ignite Youth GG',
                    'meeting_day' => 'Saturday',
                    'meeting_time' => '15:00:00',
                    'location_type' => 'onsite',
                    'venue_address' => 'Youth Hub Main Campus',
                    'target_demographic' => 'youth',
                    'is_active' => true,
                ]
            );

            // 3. Couples GG
            GrowthGroup::updateOrCreate(
                ['code' => 'GG-CPL-01'],
                [
                    'church_id' => $mainChurch->id,
                    'cluster_id' => $northCluster?->id,
                    'leader_id' => $leader1?->id,
                    'name' => 'Couples for Christ GG',
                    'meeting_day' => 'Sunday',
                    'meeting_time' => '16:00:00',
                    'location_type' => 'onsite',
                    'venue_address' => 'Fellowship Hall',
                    'target_demographic' => 'couples',
                    'is_active' => true,
                ]
            );

            // Automatic pag-attach ng members sa Pivot Table kung may members sa database
            if ($members->count() > 0 && $gg1) {
                // I-sync ang ilang members papunta sa Young Pro GG
                $gg1->members()->syncWithPivotValues(
                    $members->pluck('id')->toArray(),
                    ['role' => 'member', 'joined_at' => now()]
                );
            }
        }
    }
}
