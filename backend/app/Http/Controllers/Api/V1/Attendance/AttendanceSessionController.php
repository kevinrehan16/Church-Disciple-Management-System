<?php

namespace App\Http\Controllers\Api\V1\Attendance;

use App\Http\Controllers\Controller;
use App\Models\AttendanceSession;
use App\Models\AttendanceRecord;
use App\Services\AttendanceRosterService;
use Illuminate\Http\Request;

class AttendanceSessionController extends Controller
{
    protected $rosterService;

    public function __construct(AttendanceRosterService $rosterService)
    {
        $this->rosterService = $rosterService;
    }

    // 1. Gumawa ng bagong Attendance Session (Draft o Open)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'activity_id' => 'required|exists:attendance_activities,id',
            'title' => 'required|string|max:255',
            'starts_at' => 'required|date',
            'ends_at' => 'nullable|date|after_or_equal:starts_at',
            'group_ids' => 'nullable|array', // Multi-group IDs (Kung blangko, Open to All)
            'group_ids.*' => 'exists:church_groups,id',
        ]);

        $session = AttendanceSession::create([
            'activity_id' => $validated['activity_id'],
            'title' => $validated['title'],
            'starts_at' => $validated['starts_at'],
            'ends_at' => $validated['ends_at'] ?? null,
            'status' => 'draft', // Nagsisimula bilang draft bago buksan
            'created_by' => $request->user()?->id ?? null,
        ]);

        // I-attach ang mga grupo sa pivot table kung mayroon man
        if (!empty($validated['group_ids'])) {
            $session->groups()->sync($validated['group_ids']);
        }

        return response()->json([
            'message' => 'Attendance session created successfully as draft!',
            'data' => $session->load('groups')
        ], 201);
    }

    // 2. Buksan ang Session at i-generate ang Smart Roster
    public function openSession($id)
    {
        $session = AttendanceSession::with('groups')->findOrFail($id);

        if ($session->status === 'finalized') {
            return response()->json(['message' => 'This session is already finalized and cannot be reopened.'], 400);
        }

        // Baguhin ang status sa 'open'
        $session->update(['status' => 'open']);

        // Tawagin ang Service para i-generate ang attendance roster ng mga miyembro
        $rosteredSession = $this->rosterService->generateRoster($session);

        return response()->json([
            'message' => 'Session is now open and roster has been generated!',
            'data' => $rosteredSession
        ], 200);
    }

    // 3. I-update ang status ng isang miyembro (Present, Absent, Late, Excused)
    public function updateRecord(Request $request, $sessionId, $recordId)
    {
        $validated = $request->validate([
            'status' => 'required|in:unmarked,present,late,absent,excused',
            'notes' => 'nullable|string',
        ]);

        $record = AttendanceRecord::where('session_id', $sessionId)
            ->where('id', $recordId)
            ->firstOrFail();

        $record->update([
            'status' => $validated['status'],
            'notes' => $validated['notes'] ?? $record->notes,
            'checked_in_at' => $validated['status'] === 'present' || $validated['status'] === 'late' ? ($record->checked_in_at ?? now()) : null,
            'recorded_by' => $request->user()?->id ?? null,
        ]);

        return response()->json([
            'message' => 'Attendance record updated successfully!',
            'data' => $record->load('member')
        ], 200);
    }

    public function getRecords($sessionId)
    {
        $session = AttendanceSession::with(['records.member'])->findOrFail($sessionId);

        return response()->json($session->records);
    }
}
