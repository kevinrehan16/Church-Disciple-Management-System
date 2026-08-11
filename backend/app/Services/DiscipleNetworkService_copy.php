<?php

namespace App\Services;

use App\Models\Member;
use App\Models\GrowthGroup;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class DiscipleNetworkService
{
    public function getHierarchyTree(): Collection
    {
        // Kunin ang Senior Pastor ID (Level 1 Root)
        $seniorPastor = Member::where('member_position', 'Senior Pastor')->first();
        $seniorPastorId = $seniorPastor?->id;

        // 1. Growth Group Leaders Mapping (GG ID => Leader Member ID)
        $groupToLeaderMap = GrowthGroup::whereNotNull('leader_id')
            ->pluck('leader_id', 'id')
            ->toArray();

        // 2. Growth Group Names Mapping (GG ID => Group Name)
        $groupNamesMap = GrowthGroup::pluck('name', 'id')->toArray();

        // 3. Growth Group Members Pivot Mapping (Member ID => GG ID)
        $memberGroupMap = DB::table('growth_group_member')
            ->pluck('growth_group_id', 'member_id')
            ->toArray();

        // Listahan ng lahat ng Member IDs na aktwal na nagmamanage ng Growth Group
        $activeGroupLeaderIds = array_values($groupToLeaderMap);

        // Listahan ng GG IDs na pinamumunuan ng bawat Leader (Leader Member ID => GG ID)
        $leaderToGroupMap = array_flip($groupToLeaderMap);

        $members = Member::with(['user'])->get();

        return $members->map(function ($member) use (
            $seniorPastorId,
            $groupToLeaderMap,
            $groupNamesMap,
            $memberGroupMap,
            $activeGroupLeaderIds,
            $leaderToGroupMap
        ) {
            $position = $member->member_position ?? 'Member';

            // Check Growth Group Status
            $isActivelyLeadingGroup = in_array($member->id, $activeGroupLeaderIds);
            $userGroupId = $memberGroupMap[$member->id] ?? null;
            $hasGroupLeader = $userGroupId && isset($groupToLeaderMap[$userGroupId]);

            // Alamin kung anong GG ang kinabibilangan o pinamumunuan
            $assignedGroupId = $isActivelyLeadingGroup
                ? ($leaderToGroupMap[$member->id] ?? null)
                : $userGroupId;

            $hasGrowthGroup = $isActivelyLeadingGroup || !empty($userGroupId);
            $growthGroupName = $assignedGroupId ? ($groupNamesMap[$assignedGroupId] ?? null) : null;

            // Default level
            $rank = 5;
            $parentId = null;

            // =========================================================
            // DYNAMIC LEVEL EVALUATION LOGIC (WALANG CLUSTER)
            // =========================================================

            // LEVEL 1: Senior Pastor
            if ($position === 'Senior Pastor') {
                $rank = 1;
                $parentId = null;
            }
            // LEVEL 2: Executives / Church Leaders (Pastor, Staff, Elder, Deacon)
            elseif (in_array($position, ['Pastor', 'Pastoral Staff', 'Elder', 'Deacon'])) {
                $rank = 2;
                $parentId = $seniorPastorId;
            }
            // LEVEL 3: Active Growth Group Leaders
            elseif ($isActivelyLeadingGroup || $position === 'Growth Group Leader') {
                $rank = 3;
                // Nakakabit sa kanyang direct mentor (e.g. Elder/Deacon) o kaya sa Senior Pastor
                $parentId = $member->mentor_id ?? $seniorPastorId;
            }
            // LEVEL 4: Active Growth Group Members
            elseif ($hasGroupLeader) {
                $rank = 4;
                // Nakakabit sa Member ID ng kanyang Growth Group Leader
                $parentId = $groupToLeaderMap[$userGroupId];
            }
            // LEVEL 5: Unassigned / Regular Member na Walang GG
            else {
                $rank = 5;
                $parentId = $member->mentor_id ?? null;
            }

            return [
                'id'               => $member->id,
                'parentId'         => $parentId,
                'name'             => trim("{$member->first_name} {$member->last_name}"),
                'email'            => $member->user->email ?? null,
                'position'         => $position,
                'rank'             => $rank,
                'hasGrowthGroup'   => $hasGrowthGroup,
                'growthGroupName'  => $growthGroupName ?? 'Walang GG',
                'avatarBg'         => $this->getAvatarBg($rank),
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
