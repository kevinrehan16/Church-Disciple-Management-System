<?php

namespace App\Services;

use App\Models\Member;

class MemberService
{

    public function getPaginatedMembers($request, ?string $position = null, ?int $rank = null)
    {
        return Member::with(['user', 'church', 'cluster', 'spiritualGifts'])
            // 1. FILTER
            ->byPosition($position)
            ->byRank($rank)

            // 2. CUSTOM SORT: Rank 1 muna, tapos pinakabagong ID pababa
            ->orderByRaw("CASE WHEN position_rank = 1 THEN 0 ELSE 1 END")
            ->orderBy('id', 'desc')

            // 3. SEARCH
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
