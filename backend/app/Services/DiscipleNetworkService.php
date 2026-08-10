<?php

namespace App\Services;

use App\Models\Member;
use App\Models\Cluster;
use App\Models\GrowthGroup;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class DiscipleNetworkService
{
    public function getHierarchyTree(): Collection
    {
        $seniorPastor = Member::where('member_position', 'Senior Pastor')->first();
        $seniorPastorId = $seniorPastor?->id;

        // 1. Cluster Heads (Cluster ID => Leader Member ID)
        $clusterLeadersMap = Cluster::whereNotNull('member_id')
            ->pluck('member_id', 'id')
            ->toArray();

        // 2. Growth Group Leaders (GG ID => Leader Member ID)
        $groupToLeaderMap = GrowthGroup::whereNotNull('leader_id')
            ->pluck('leader_id', 'id')
            ->toArray();

        // 3. Growth Group Members Pivot (Member ID => GG ID)
        $memberGroupMap = DB::table('growth_group_member')
            ->pluck('growth_group_id', 'member_id')
            ->toArray();

        // Listahan ng lahat ng Member IDs na aktwal na nagmamanage ng Growth Group
        $activeGroupLeaderIds = array_values($groupToLeaderMap);

        $members = Member::with(['cluster', 'user'])->get();

        return $members->map(function ($member) use (
            $seniorPastorId,
            $clusterLeadersMap,
            $groupToLeaderMap,
            $memberGroupMap,
            $activeGroupLeaderIds
        ) {
            $position = $member->member_position ?? 'No Growth Group';

            // Check dynamic relations
            $isActivelyLeadingGroup = in_array($member->id, $activeGroupLeaderIds);
            $userGroupId = $memberGroupMap[$member->id] ?? null;
            $hasGroupLeader = $userGroupId && isset($groupToLeaderMap[$userGroupId]);

            // Default level: 5 (Unassigned)
            $rank = 5;
            $parentId = null;

            // =========================================================
            // DYNAMIC LEVEL EVALUATION LOGIC
            // =========================================================

            // LEVEL 1: Senior Pastor
            if ($position === 'Senior Pastor') {
                $rank = 1;
                $parentId = null;
            }
            // LEVEL 2: Executives / Church Leaders (Elder, Deacon, Pastor, Pastoral Staff)
            elseif (in_array($position, ['Pastor', 'Pastoral Staff', 'Elder', 'Deacon'])) {
                $rank = 2;
                $parentId = $seniorPastorId;
            }
            // LEVEL 3: Active Growth Group Leaders (Kahit 'Growth Group Leader' o 'Member' ang position)
            elseif ($isActivelyLeadingGroup) {
                $rank = 3;
                // Nakakabit sa Cluster Head (Elder/Deacon) sa kanyang Cluster
                $parentId = $clusterLeadersMap[$member->cluster_id] ?? $seniorPastorId;
            }
            // LEVEL 4: Active Growth Group Members
            elseif ($hasGroupLeader) {
                $rank = 4;
                // Nakakabit sa ID ng kanyang Growth Group Leader
                $parentId = $groupToLeaderMap[$userGroupId];
            }
            // LEVEL 5: Unassigned / No GG (Kahit 'Growth Group Leader' pa ang position basta walang active group)
            else {
                $rank = 5;
                $parentId = null;
            }

            return [
                'id'        => $member->id,
                'parentId'  => $parentId,
                'name'      => trim("{$member->first_name} {$member->last_name}"),
                'email'     => $member->user->email ?? null,
                'position'  => $position, // As-is value mula sa database (e.g. 'Elder', 'Growth Group Leader', etc.)
                'rank'      => $rank,
                'cluster'   => $member->cluster->name ?? 'No Cluster',
                'avatarBg'  => $this->getAvatarBg($rank),
            ];
        });
    }

    private function getAvatarBg(int $rank): string
    {
        return match ($rank) {
            1 => 'bg-amber-500 text-white',
            2 => 'bg-indigo-600 text-white',
            3 => 'bg-blue-600 text-white',
            4 => 'bg-emerald-600 text-white',
            default => 'bg-slate-400 text-white',
        };
    }
}
