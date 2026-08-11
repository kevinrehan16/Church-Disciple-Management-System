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
        // 1. Hanapin si Senior Pastor (Root)
        $seniorPastor = Member::where('member_position', 'Senior Pastor')
            ->orWhere('position_rank', 1)
            ->first() ?? Member::first();

        $seniorPastorId = $seniorPastor?->id;

        // 2. Growth Groups Map
        $allGroups = GrowthGroup::all();
        $groupToLeaderMap = [];
        $groupNamesMap = [];

        foreach ($allGroups as $group) {
            if ($group->leader_id) {
                $groupToLeaderMap[$group->id] = $group->leader_id;
            }
            $groupNamesMap[$group->id] = $group->name;
        }

        // 3. Pivot Map
        $pivotRows = DB::table('growth_group_member')->get();
        $memberGroupIdsMap = [];
        foreach ($pivotRows as $row) {
            $memberGroupIdsMap[$row->member_id][] = $row->growth_group_id;
        }

        $activeLeaderMemberIds = array_values($groupToLeaderMap);
        $leaderToGroupMap = array_flip($groupToLeaderMap);

        $officialPositions = ['Senior Pastor', 'Pastor', 'Pastoral Staff', 'Elder', 'Deacon'];

        $allMembers = Member::with(['user'])->get();
        $nodes = collect();

        // --- A. MAIN CATEGORY FOLDERS (Nasa ilalim ni Senior Pastor) ---
        $nodes->push([
            'nodeKey'         => 'group-elders',
            'memberId'        => 'group-elders',
            'parentId'        => $seniorPastorId,
            'name'            => 'Elders Group',
            'email'           => null,
            'churchPosition'  => null,
            'ggRole'          => 'Group',
            'rank'            => 2,
            'primaryRank'     => 2,
            'hasGrowthGroup'  => false,
            'growthGroupName' => 'Elders Group',
            'isDuplicate'     => false,
            'isGroupFolder'   => true,
            'avatarBg'        => 'bg-indigo-100 text-indigo-700',
        ]);

        $nodes->push([
            'nodeKey'         => 'group-deacons',
            'memberId'        => 'group-deacons',
            'parentId'        => $seniorPastorId,
            'name'            => 'Deacons Group',
            'email'           => null,
            'churchPosition'  => null,
            'ggRole'          => 'Group',
            'rank'            => 2,
            'primaryRank'     => 2,
            'hasGrowthGroup'  => false,
            'growthGroupName' => 'Deacons Group',
            'isDuplicate'     => false,
            'isGroupFolder'   => true,
            'avatarBg'        => 'bg-emerald-100 text-emerald-700',
        ]);

        $nodes->push([
            'nodeKey'         => 'group-pastors',
            'memberId'        => 'group-pastors',
            'parentId'        => $seniorPastorId,
            'name'            => 'Pastors & Staff Group',
            'email'           => null,
            'churchPosition'  => null,
            'ggRole'          => 'Group',
            'rank'            => 2,
            'primaryRank'     => 2,
            'hasGrowthGroup'  => false,
            'growthGroupName' => 'Pastors & Staff Group',
            'isDuplicate'     => false,
            'isGroupFolder'   => true,
            'avatarBg'        => 'bg-blue-100 text-blue-700',
        ]);

        // BAGONG GROUP CARD FOR GG LEADERS
        $nodes->push([
            'nodeKey'         => 'group-gg-leaders',
            'memberId'        => 'group-gg-leaders',
            'parentId'        => $seniorPastorId,
            'name'            => 'Growth Group Leaders Group',
            'email'           => null,
            'churchPosition'  => null,
            'ggRole'          => 'Group',
            'rank'            => 3,
            'primaryRank'     => 3,
            'hasGrowthGroup'  => false,
            'growthGroupName' => 'Growth Group Leaders Group',
            'isDuplicate'     => false,
            'isGroupFolder'   => true,
            'avatarBg'        => 'bg-sky-100 text-sky-700',
        ]);

        // --- B. MEMBER NODES ---
        foreach ($allMembers as $member) {
            $rawPosition = $member->member_position ?? '';

            $isSeniorPastor = ($member->id === $seniorPastorId) || ($rawPosition === 'Senior Pastor') || ($member->position_rank == 1);
            $isActivelyLeading = in_array($member->id, $activeLeaderMemberIds);
            $memberGgIds = $memberGroupIdsMap[$member->id] ?? [];
            $hasGgMembership = !empty($memberGgIds);

            if ($isSeniorPastor) {
                $churchPosition = 'Senior Pastor';
                $primaryRank = 1;
            } else {
                $churchPosition = in_array($rawPosition, $officialPositions) ? $rawPosition : null;

                if ($churchPosition) {
                    $primaryRank = 2;
                } elseif ($isActivelyLeading) {
                    $primaryRank = 3;
                } elseif ($hasGgMembership) {
                    $primaryRank = 4;
                } else {
                    $primaryRank = 5;
                }
            }

            // PARENT ASSIGNMENT
            $primaryParentId = match ($primaryRank) {
                1 => null, // Senior Pastor (Root)
                2 => match ($churchPosition) {
                    'Elder' => 'group-elders',
                    'Deacon' => 'group-deacons',
                    'Pastor', 'Pastoral Staff' => 'group-pastors',
                    default => $seniorPastorId,
                },
                3 => 'group-gg-leaders', // ILAGAY ANG LAHAT NG GG LEADERS SA BAGONG CARD!
                4 => isset($memberGgIds[0]) ? "gg-folder-{$memberGgIds[0]}" : $seniorPastorId,
                default => $seniorPastorId,
            };

            $assignedGgId = $isActivelyLeading
                ? ($leaderToGroupMap[$member->id] ?? null)
                : ($memberGgIds[0] ?? null);

            $ggName = $assignedGgId ? ($groupNamesMap[$assignedGgId] ?? 'Walang GG') : 'Walang GG';

            $ggRole = 'None';
            if ($isActivelyLeading) {
                $ggRole = 'GG Leader';
            } elseif ($hasGgMembership) {
                $ggRole = 'GG Member';
            }

            $nodes->push([
                'nodeKey'         => "m-{$member->id}-primary",
                'memberId'        => $member->id,
                'parentId'        => $primaryParentId,
                'name'            => trim("{$member->first_name} {$member->last_name}"),
                'email'           => $member->user->email ?? null,
                'churchPosition'  => $churchPosition,
                'ggRole'          => $ggRole,
                'rank'            => $primaryRank,
                'primaryRank'     => $primaryRank,
                'hasGrowthGroup'  => $isActivelyLeading || $hasGgMembership,
                'growthGroupName' => $ggName,
                'isDuplicate'     => false,
                'isGroupFolder'   => false,
                'avatarBg'        => $this->getAvatarBg($primaryRank),
            ]);

            // SECONDARY / DUPLICATE NODES (Para sa attendance sa ibang GG)
            $ggsToAttach = ($primaryRank === 4) ? array_slice($memberGgIds, 1) : $memberGgIds;

            foreach ($ggsToAttach as $ggId) {
                $ggLeaderId = $groupToLeaderMap[$ggId] ?? null;

                if ($ggLeaderId && $ggLeaderId !== $member->id) {
                    $nodes->push([
                        'nodeKey'         => "m-{$member->id}-gg-{$ggId}",
                        'memberId'        => $member->id,
                        'parentId'        => "gg-folder-{$ggId}",
                        'name'            => trim("{$member->first_name} {$member->last_name}"),
                        'email'           => $member->user->email ?? null,
                        'churchPosition'  => $churchPosition,
                        'ggRole'          => 'GG Member',
                        'rank'            => 4,
                        'primaryRank'     => $primaryRank,
                        'hasGrowthGroup'  => true,
                        'growthGroupName' => $groupNamesMap[$ggId] ?? 'Growth Group',
                        'isDuplicate'     => true,
                        'isGroupFolder'   => false,
                        'avatarBg'        => $this->getAvatarBg(4),
                    ]);
                }
            }
        }

        // --- C. INDIVIDUAL GROWTH GROUP FOLDER NODES ---
        foreach ($allGroups as $group) {
            if ($group->leader_id) {
                $nodes->push([
                    'nodeKey'         => "gg-folder-{$group->id}",
                    'memberId'        => "gg-folder-{$group->id}",
                    'parentId'        => $group->leader_id,
                    'name'            => $group->name,
                    'email'           => null,
                    'churchPosition'  => null,
                    'ggRole'          => 'Growth Group',
                    'rank'            => 99,
                    'primaryRank'     => 99,
                    'hasGrowthGroup'  => true,
                    'growthGroupName' => $group->name,
                    'isDuplicate'     => false,
                    'isGroupFolder'   => true,
                    'avatarBg'        => 'bg-indigo-100 text-indigo-700',
                ]);
            }
        }

        return $nodes;
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
