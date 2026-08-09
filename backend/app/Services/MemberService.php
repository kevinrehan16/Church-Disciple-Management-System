<?php

namespace App\Services;

use App\Models\Member;
use Illuminate\Support\Facades\DB;
use Exception;

class MemberService
{

    public function getPaginatedMembers($request, $position = null, ?int $rank = null)
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

    public function updateMember($id, array $data)
    {
        DB::beginTransaction();

        try {
            $member = Member::findOrFail($id);

            // Kunin ang spiritual_gifts array bago i-update ang pangunahing table
            $spiritualGifts = $data['spiritual_gifts'] ?? null;
            unset($data['spiritual_gifts']); // Alisin muna para hindi mag-error sa member update

            // I-update ang profile details ng member
            $member->update($data);

            // Kung may ipinasa na spiritual gifts, i-sync ito sa pivot table
            if ($spiritualGifts !== null) {
                $member->spiritualGifts()->sync($spiritualGifts);
            }

            DB::commit();

            // I-load pabalik ang relasyon para kasama sa response
            return $member->load('spiritualGifts');
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception('Error updating member: ' . $e->getMessage());
        }
    }
}
