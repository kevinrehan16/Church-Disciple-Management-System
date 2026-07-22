<?php

namespace App\Services;

use App\Models\Member;

class MemberService
{

    public function getPaginatedMembers($request, ?string $position = null, ?int $rank = null)
    {
        return Member::with(['user', 'church', 'cluster'])
            // 1. FILTER: Piliin lang ang specific na group (gamit ang scope)
            ->byPosition($position)
            ->byRank($rank)

            // 2. SORT: I-arrange sila base sa rank (Auto-managed by Model)
            ->orderedByPosition()

            // 3. SEARCH: Hanapin ang name/ID
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'ILIKE', "%{$search}%")
                        ->orWhere('last_name', 'ILIKE', "%{$search}%")
                        ->orWhere('nickname', 'ILIKE', "%{$search}%")
                        ->orWhere('mem_id', 'ILIKE', "%{$search}%");
                });
            })
            ->paginate(10);
    }
}
