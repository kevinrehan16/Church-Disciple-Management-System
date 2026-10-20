<?php

namespace App\Services;

use App\Models\Member;
use Illuminate\Support\Facades\DB;
use Exception;

class MemberService
{

    public function getPaginatedMembers($request, $position = null, ?int $rank = null)
    {
        return Member::with(['user', 'church', 'cluster', 'spiritualGifts', 'growthGroups.leader'])
            // 1. FILTER BY POSITION
            ->byPosition($position)
            ->byRank($rank)

            // 1.5 BAPTISM STATUS FILTER
            ->when($request->filled('baptism_statuses'), function ($query) use ($request) {
                $rawStatuses = $request->input('baptism_statuses');

                if (is_string($rawStatuses)) {
                    $decoded = json_decode($rawStatuses, true);
                    $statuses = is_array($decoded) ? $decoded : [$rawStatuses];
                } else {
                    $statuses = is_array($rawStatuses) ? $rawStatuses : [];
                }

                if (!empty($statuses)) {
                    $query->where(function ($q) use ($statuses) {
                        if (in_array('baptized', $statuses)) {
                            $q->orWhere('baptized_immersion', '1');
                        }
                        if (in_array('scheduled', $statuses)) {
                            $q->orWhere(function ($subQ) {
                                $subQ->where('baptized_immersion', '0')
                                    ->where('rec_for_baptism', true);
                            });
                        }
                        if (in_array('not_yet', $statuses)) {
                            $q->orWhere(function ($subQ) {
                                $subQ->where('baptized_immersion', '0')
                                    ->where('rec_for_baptism', false);
                            });
                        }
                    });
                }
            })

            // 1.6 GROWTH GROUP STATUS FILTER (ITAMA NATIN DITO)
            // 1.6 GROWTH GROUP STATUS FILTER (AND Logic kapag marami ang pinili)
            ->when($request->filled('growth_group_statuses'), function ($query) use ($request) {
                $rawGG = $request->input('growth_group_statuses');

                if (is_string($rawGG)) {
                    $decoded = json_decode($rawGG, true);
                    $ggStatuses = is_array($decoded) ? $decoded : [$rawGG];
                } else {
                    $ggStatuses = is_array($rawGG) ? $rawGG : [];
                }

                if (!empty($ggStatuses)) {
                    $query->where(function ($q) use ($ggStatuses) {
                        // I-loop ang bawat napiling checkbox at i-chain gamit ang `where` (AND)
                        foreach ($ggStatuses as $status) {
                            if ($status === 'GrowthGroup Leader') {
                                $q->whereHas('ledGrowthGroups');
                            } elseif ($status === 'GrowthGroup Member') {
                                $q->whereHas('growthGroups');
                            } elseif ($status === 'No Growth Group') {
                                $q->whereDoesntHave('growthGroups');
                            }
                        }
                    });
                }
            })

            // 2. CUSTOM SORT
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
