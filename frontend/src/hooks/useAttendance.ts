// src/hooks/useAttendance.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceService, type AttendanceSessionFilters } from '../services/attendanceService';
import type { UpdateStatusPayload, CreateVisitorPayload } from '../types/typeAttendance';

export function useAttendanceSessions(filters: AttendanceSessionFilters) {
    return useQuery({
        queryKey: ['attendance_sessions', filters],
        queryFn: () => attendanceService.getSessions(filters),
    });
}

export function useSessionRecords(sessionId: any) {
    return useQuery({
        queryKey: ['attendance_records', sessionId],
        queryFn: () => attendanceService.getSessionRecords(sessionId),
        enabled: !!sessionId,
    });
}

export function useCreateAttendanceSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (sessionData: any) => attendanceService.createSession(sessionData),
        onSuccess: () => {
            // I-refresh ang listahan ng sessions pagka-save
            queryClient.invalidateQueries({ queryKey: ['attendance_sessions'] });
        },
    });
}

export function useUpdateAttendance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ recordId, payload }: { recordId: any; payload: UpdateStatusPayload }) =>
            attendanceService.updateAttendanceStatus(recordId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attendance_records'] });
        },
    });
}

export function useAddWalkInVisitor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ sessionId, visitorData }: { sessionId: any; visitorData: CreateVisitorPayload }) =>
            attendanceService.addWalkInVisitor(sessionId, visitorData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attendance_records'] });
            queryClient.invalidateQueries({ queryKey: ['attendance_sessions'] });
        },
    });
}