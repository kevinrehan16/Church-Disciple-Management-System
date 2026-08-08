<?php

namespace App\Services;

use App\Models\GrowthGroup;
use Illuminate\Validation\ValidationException;

class GrowthGroupMemberService
{
    public function getAllGroupsWithMembers()
    {
        return GrowthGroup::with(['leader', 'members'])->get();
    }

    public function getGroupWithMembers($growthGroupId)
    {
        return GrowthGroup::with(['leader', 'members'])->findOrFail($growthGroupId);
    }

    public function addMember($growthGroupId, array $data)
    {
        $growthGroup = GrowthGroup::findOrFail($growthGroupId);

        // I-check kung miyembro na para iwas duplicate
        if ($growthGroup->members()->where('member_id', $data['member_id'])->exists()) {
            throw ValidationException::withMessages([
                'member_id' => ['This member is already part of this Growth Group.'],
            ]);
        }

        $growthGroup->members()->attach($data['member_id'], [
            'role'            => $data['role'] ?? 'member',
            'status'          => $data['status'] ?? 'active',
            'joined_at'       => $data['joined_at'] ?? now(),
            'ended_at'        => $data['ended_at'] ?? null,
            'inactive_reason' => $data['inactive_reason'] ?? null,
        ]);

        return true;
    }

    public function deactivateGgMember($growthGroupId, array $data)
    {
        $growthGroup = GrowthGroup::findOrFail($growthGroupId);

        // Check if member exists in this Growth Group
        if (!$growthGroup->members()->where('member_id', $data['member_id'])->exists()) {
            throw ValidationException::withMessages([
                'member_id' => ['This member is not part of this Growth Group.'],
            ]);
        }

        $growthGroup->members()->updateExistingPivot($data['member_id'], [
            'status'          => 'inactive',
            'ended_at'        => now(),
            'inactive_reason' => $data['inactive_reason'],
        ]);

        return true;
    }

    public function updateMemberRole($growthGroupId, $memberId, array $data)
    {
        $growthGroup = GrowthGroup::findOrFail($growthGroupId);

        $growthGroup->members()->updateExistingPivot($memberId, [
            'role' => $data['role'],
            'joined_at' => $data['joined_at'] ?? null,
        ]);

        return true;
    }

    public function removeMember($growthGroupId, $memberId)
    {
        $growthGroup = GrowthGroup::findOrFail($growthGroupId);
        $growthGroup->members()->detach($memberId);

        return true;
    }
}
