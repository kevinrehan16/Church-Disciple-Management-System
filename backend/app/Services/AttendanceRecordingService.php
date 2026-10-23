<?php

namespace App\Services;

use App\Models\AttendanceRecord;
use App\Models\AttendanceSession;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AttendanceRecordingService
{
    /**
     * Update an individual member's attendance status.
     */
    public function updateRecord(AttendanceSession $session, AttendanceRecord $record, string $status, ?string $notes = null, $userId = null)
    {
        // Siguraduhing hindi pa finalized ang session
        if ($session->status === 'finalized') {
            throw new \Exception('Hindi na maaaring baguhin ang attendance dahil tapos na (finalized) ang session na ito.');
        }

        $validStatuses = ['unmarked', 'present', 'late', 'absent', 'excused'];
        if (!in_array($status, $validStatuses)) {
            throw new \Exception('Invalid attendance status.');
        }

        return DB::transaction(function () use ($session, $record, $status, $notes, $userId) {
            $record->update([
                'status' => $status,
                'checked_in_at' => in_array($status, ['present', 'late']) ? Carbon::now() : null,
                'recorded_by' => $userId,
                'notes' => $notes,
            ]);

            return $record->load('member');
        });
    }
}
