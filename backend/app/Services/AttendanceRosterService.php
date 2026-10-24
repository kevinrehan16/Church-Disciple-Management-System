<?php

namespace App\Services;

use App\Models\AttendanceSession;
use App\Models\AttendanceRecord;
use App\Models\Member;
use Illuminate\Support\Facades\DB;

class AttendanceRosterService
{
    /**
     * Generate or load the expected member roster for a session.
     */
    public function generateRoster(AttendanceSession $session)
    {
        return DB::transaction(function () use ($session) {
            // 1. Kunin ang mga grupo na nakatali sa session na ito
            $groupIds = $session->groups()->pluck('group_id');

            if ($groupIds->isNotEmpty()) {
                // Kung may mga piling grupo (Joint session: hal. Youth + Young Adults)
                $members = Member::whereIn('church_group_id', $groupIds)->get();
            } else {
                // Kung walang piniling grupo (Open to all / Sunday Service)
                $members = Member::all();
            }

            // 2. Gawan sila ng 'unmarked' attendance record kung wala pa
            foreach ($members as $member) {
                AttendanceRecord::firstOrCreate(
                    [
                        'session_id' => $session->id,
                        'member_id' => $member->id,
                    ],
                    [
                        'status' => 'unmarked',
                    ]
                );
            }

            return $session->load('records.member', 'groups');
        });
    }

    /**
     * Smart Visitor Management (Anti-Duplicate Walk-in Handler)
     * Sinusuri muna kung existing na ang bisita gamit ang mobile_number o pangalan.
     */
    public function registerVisitor(AttendanceSession $session, array $data)
    {
        return DB::transaction(function () use ($session, $data) {
            $member = null;

            // 1. Hanapin muna kung may existing na gamit ang mobile_number (kung provided)
            if (!empty($data['mobile_number'])) {
                $member = Member::where('mobile_number', $data['mobile_number'])->first();
            }

            // 2. Kung wala sa mobile, hanapin naman sa first_name at last_name para iwas duplicate
            if (!$member) {
                $member = Member::where('first_name', 'ILIKE', $data['firstname'])
                    ->where('last_name', 'ILIKE', $data['lastname'])
                    ->first();
            }

            // 3. Kung WALA PA TALAGA, saka lang gagawa ng bagong visitor record
            if (!$member) {
                $systemUserId = auth()->id() ?? \App\Models\User::value('id');

                $member = Member::create([
                    'user_id' => $systemUserId,
                    'first_name' => $data['firstname'],       // Nakatugma sa database column
                    'last_name' => $data['lastname'],         // Nakatugma sa database column
                    'mobile_number' => $data['mobile_number'] ?? null,
                    'is_visitor' => true,
                    'church_group_id' => null,
                    'gender' => 'Other', // O kung anong default string/enum ang tinatanggap ng database mo
                    'position_rank' => 0, // Batay sa error log mo na may position_rank
                    'mem_id' => 'VISITOR-' . uniqid(),
                ]);
            } else {
                // Kung MERON NA, i-update lang ang is_visitor status
                $member->update(['is_visitor' => true]);
            }

            // 4. I-attach agad ang visitor na ito sa active attendance session
            $record = AttendanceRecord::firstOrCreate(
                [
                    'session_id' => $session->id,
                    'member_id' => $member->id,
                ],
                [
                    'status' => 'present',
                    'checked_in_at' => now(),
                ]
            );

            return $record->load('member');
        });
    }
}
