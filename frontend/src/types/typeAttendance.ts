// src/types/typeAttendance.ts

export interface Member {
    id: number | string;
    first_name: string;
    last_name: string;
    mobile_number?: string;
    is_visitor: boolean;
}

export interface AttendanceSession {
    id: number | string;
    title: string;
    activity_type: string;
    date: string;
    time: string;
    status: 'draft' | 'open' | 'finalized';
    total_roster: number;
    total_present: number;
}

export interface AttendanceRecord {
    id: number | string;
    member: Member;
    status: 'unmarked' | 'present' | 'late' | 'absent' | 'excused';
}

export interface UpdateStatusPayload {
    status: 'unmarked' | 'present' | 'late' | 'absent' | 'excused';
}

export interface CreateVisitorPayload {
    first_name: string;
    last_name: string;
    mobile_number?: string;
}