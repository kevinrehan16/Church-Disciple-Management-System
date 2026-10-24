import React, { useState } from 'react';
import { useSessionRecords, useUpdateAttendance, useAddWalkInVisitor } from '../../hooks/useAttendance';

interface AttendanceCheckInProps {
    sessionId: number | string;
    sessionTitle?: string;
    sessionStatus?: string;
}

export default function AttendanceCheckIn({ sessionId, sessionTitle, sessionStatus }: AttendanceCheckInProps) {
    const [search, setSearch] = useState('');
    const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
    
    // Naayos ang property names to match CreateVisitorPayload
    const [visitorForm, setVisitorForm] = useState({
        first_name: '',
        last_name: '',
        mobile_number: ''
    });

    const { data: records = [], isLoading, isError } = useSessionRecords(sessionId);
    const { mutate: updateStatus } = useUpdateAttendance();
    const { mutate: addVisitor, isPending: isSubmittingVisitor } = useAddWalkInVisitor();

    // Ligtas na pag-cast para maiwasan ang 'never' type error
    const safeRecords = Array.isArray(records) ? records : ((records as any)?.data || []);
    
    const filteredRecords = safeRecords.filter((record: any) => {
        if (!record || !record.member) return false;
        const fullName = `${record.member.first_name || ''} ${record.member.last_name || ''}`.toLowerCase();
        const mobile = record.member.mobile_number || '';
        return fullName.includes(search.toLowerCase()) || mobile.includes(search);
    });

    // Nilagyan ng explicit union type ang newStatus para maalis ang TS2322 error
    const handleUpdateStatus = (recordId: any, newStatus: 'present' | 'absent' | 'late' | 'excused' | 'unmarked') => {
        updateStatus({ recordId, payload: { status: newStatus } });
    };

    const handleVisitorSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!visitorForm.first_name || !visitorForm.last_name) return;

        addVisitor({ sessionId, visitorData: visitorForm }, {
            onSuccess: () => {
                setIsVisitorModalOpen(false);
                setVisitorForm({ first_name: '', last_name: '', mobile_number: '' });
            }
        });
    };

    if (isLoading) return <div className="p-12 text-center text-gray-500 font-medium">Kinukuha ang attendance roster mula sa database...</div>;
    if (isError) return <div className="p-12 text-center text-rose-500 font-medium">May error sa pagkuha ng mga rekord.</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900">{sessionTitle || 'Live Attendance'}</h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                            sessionStatus === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                            {sessionStatus || 'open'}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Directly reads and writes database records.</p>
                </div>
                
                <button
                    onClick={() => setIsVisitorModalOpen(true)}
                    className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-sm transition"
                >
                    + Add Walk-in / Visitor
                </button>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <input
                    type="text"
                    placeholder="Search for a member or mobile number..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-96 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                />
                <div className="text-sm text-gray-600 font-medium">
                    Total Roster: <strong className="text-gray-900">{safeRecords.length}</strong>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/75 text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-100">
                                <th className="p-5">Member</th>
                                <th className="p-5">Mobile Number</th>
                                <th className="p-5">Uri</th>
                                <th className="p-5">Status</th>
                                <th className="p-5 text-center">Aksyon</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {filteredRecords.length > 0 ? (
                                filteredRecords.map((record: any) => (
                                    <tr key={record.id} className="hover:bg-gray-50/50 transition">
                                        <td className="p-5 font-semibold text-gray-800">
                                            {record.member?.first_name} {record.member?.last_name}
                                        </td>
                                        <td className="p-5 text-gray-500">{record.member?.mobile_number || '—'}</td>
                                        <td className="p-5">
                                            {record.member?.is_visitor ? (
                                                <span className="bg-amber-50 text-amber-700 border border-amber-200/60 text-xs px-2.5 py-1 rounded-md font-medium">Visitor</span>
                                            ) : (
                                                <span className="bg-blue-50 text-blue-700 border border-blue-200/60 text-xs px-2.5 py-1 rounded-md font-medium">Member</span>
                                            )}
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide ${
                                                record.status === 'present' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' :
                                                record.status === 'absent' ? 'bg-rose-50 text-rose-700 border border-rose-200/60' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="p-5 text-center space-x-2">
                                            <button
                                                onClick={() => handleUpdateStatus(record.id, 'present')}
                                                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                                                    record.status === 'present' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                            >
                                                Present
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(record.id, 'absent')}
                                                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                                                    record.status === 'absent' ? 'bg-rose-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                            >
                                                Absent
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-400">Walang nahanap na miyembro sa database records.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Walk-in Modal */}
            {isVisitorModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Register Walk-in Visitor</h2>
                        <form onSubmit={handleVisitorSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">First Name</label>
                                <input
                                    type="text"
                                    required
                                    value={visitorForm.first_name}
                                    onChange={(e) => setVisitorForm({...visitorForm, first_name: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Last Name</label>
                                <input
                                    type="text"
                                    required
                                    value={visitorForm.last_name}
                                    onChange={(e) => setVisitorForm({...visitorForm, last_name: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Mobile Number</label>
                                <input
                                    type="text"
                                    value={visitorForm.mobile_number}
                                    onChange={(e) => setVisitorForm({...visitorForm, mobile_number: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none text-sm"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsVisitorModalOpen(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm"
                                >
                                    Kanselahin
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmittingVisitor}
                                    className="px-5 py-2 bg-pink-600 text-white rounded-xl font-medium text-sm shadow-sm"
                                >
                                    {isSubmittingVisitor ? 'Sine-save...' : 'I-check In'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}