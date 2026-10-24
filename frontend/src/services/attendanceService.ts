// src/services/attendanceService.ts
import apiClient from '../api/axiosInstance';
import type { 
    AttendanceSession, 
    AttendanceRecord, 
    UpdateStatusPayload, 
    CreateVisitorPayload 
} from '../types/typeAttendance';
import type { Pagination } from '../types/typePagination';

export interface AttendanceSessionFilters {
    search?: string;
    page?: number;
    status?: string;
}

export const attendanceService = {

    // 1. Kunin ang listahan ng mga sessions (may pagination at search)
    getSessions: async (filters: AttendanceSessionFilters): Promise<Pagination<AttendanceSession>> => {
        const response = await apiClient.get('attendance/sessions/', {
            params: {
                search: filters.search,
                page: filters.page || 1,
                status: filters.status,
            }
        });
        return response.data;
    },

    // 2. Kunin ang attendance records / roster ng isang specific na session
    getSessionRecords: async (sessionId: any): Promise<AttendanceRecord[]> => {
        const response = await apiClient.get(`attendance/sessions/${sessionId}/records/`);
        return response.data;
    },

    createSession: async (sessionData: {
        title: string;
        activity_id: any;
        group_id?: any;
        starts_at: string;
        ends_at?: string;
        status?: string;
    }): Promise<any> => {
        const { data } = await apiClient.post('attendance/sessions/', sessionData);
        return data;
    },

    // 3. I-update ang status ng miyembro (Present/Absent/etc.)
    updateAttendanceStatus: async (recordId: any, payload: UpdateStatusPayload): Promise<AttendanceRecord> => {
        const { data } = await apiClient.patch(`attendance/records/${recordId}/`, payload);
        return data;
    },

    // 4. Mag-rehistro ng Walk-in Visitor sa isang session
    addWalkInVisitor: async (sessionId: any, visitorData: CreateVisitorPayload): Promise<AttendanceRecord> => {
        const { data } = await apiClient.post(`attendance/sessions/${sessionId}/visitors/`, visitorData);
        return data;
    }

};