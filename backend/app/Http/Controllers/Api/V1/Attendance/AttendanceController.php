<?php

namespace App\Http\Controllers\Api\V1\Attendance;

use App\Http\Controllers\Controller;
use App\Models\AttendanceSession;
use App\Models\AttendanceRecord; // Siguraduhing na-import mo ito kung mayroon kang model na ganito
use App\Services\AttendanceRosterService;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    protected $rosterService;

    public function __construct(AttendanceRosterService $rosterService)
    {
        $this->rosterService = $rosterService;
    }

    // 1. Kunin ang listahan ng mga attendance sessions (para sa GET /api/v1/attendance/sessions)
    public function index(Request $request)
    {
        $search = $request->input('search');

        // I-eager load ang activity relationship para makuha ang details nito kung meron man
        $query = AttendanceSession::with('activity');

        if ($search) {
            $query->where('title', 'like', "%{$search}%");
        }

        // Gamitin ang 'starts_at' sa halip na 'date'
        $sessions = $query->orderBy('starts_at', 'desc')->paginate(10);

        return response()->json($sessions);
    }

    // 2. Kunin ang attendance records / roster ng isang specific na session
    public function getRecords($sessionId)
    {
        $session = AttendanceSession::findOrFail($sessionId);

        // Pwede mong gamitin ang service mo para i-fetch o i-generate ang roster
        // Halimbawa: $records = $this->rosterService->getSessionRoster($session);

        // O kung may Eloquent relationship ka na gawa:
        $records = $session->records()->with('member')->get();

        return response()->json($records);
    }

    // 3. I-update ang status (Present / Absent) ng isang record
    public function updateStatus(Request $request, $recordId)
    {
        $validated = $request->validate([
            'status' => 'required|in:unmarked,present,late,absent,excused',
        ]);

        $record = AttendanceRecord::findOrFail($recordId);
        $record->status = $validated['status'];
        $record->save();

        return response()->json([
            'message' => 'Attendance status updated successfully!',
            'data' => $record
        ]);
    }

    // 4. Smart Visitor / Walk-in Registration na may anti-duplicate check (Meron ka na nito)
    public function storeVisitor(Request $request, $sessionId)
    {
        // 1. I-validate ang input galing sa request
        $validated = $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'mobile_number' => 'nullable|string|max:50',
        ]);

        $session = AttendanceSession::findOrFail($sessionId);

        // 2. I-pasa ang data sa service, i-map sa tamang database keys
        $formattedData = [
            'firstname' => $validated['firstname'],
            'lastname' => $validated['lastname'],
            'mobile_number' => $validated['mobile_number'] ?? null,
        ];

        $record = $this->rosterService->registerVisitor($session, $formattedData);

        return response()->json([
            'message' => 'Visitor successfully checked in!',
            'data' => $record
        ], 201);
    }
}
