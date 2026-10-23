import React, { useState } from 'react';
import { useAttendanceSessions, useCreateAttendanceSession } from '../../hooks/useAttendance';

export interface SelectedSessionData {
    id: number | string;
    title: string;
    status: 'draft' | 'open' | 'finalized' | 'cancelled';
}

export default function AttendanceSessions({ onSelectSession }: { onSelectSession: (session: SelectedSessionData) => void }) {
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state para sa paggawa ng sesyon (tugma sa iyong database schema)
    const [form, setForm] = useState({
        title: '',
        activity_id: '',
        starts_at: '',
        ends_at: '',
        status: 'draft'
    });

    const { data: sessionsResponse, isLoading, isError } = useAttendanceSessions({ search });
    const { mutate: createSession, isPending: isCreating } = useCreateAttendanceSession();

    const sessions = sessionsResponse?.data 
        || sessionsResponse?.results 
        || (Array.isArray(sessionsResponse) ? sessionsResponse : []);

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.activity_id || !form.starts_at) return;

        createSession(form, {
            onSuccess: () => {
                setIsModalOpen(false);
                setForm({ title: '', activity_id: '', starts_at: '', ends_at: '', status: 'draft' });
            }
        });
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Naglo-load ng mga sesyon...</div>;
    }

    if (isError) {
        return <div className="p-8 text-center text-rose-500">May error sa pagkuha ng mga sesyon.</div>;
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Attendance Sessions</h1>
                    <p className="text-sm text-gray-500 mt-1">Pumili o lumikha ng sesyon para mag-check ng live attendance.</p>
                </div>
                
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2"
                >
                    <span>+ Create Session</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
                <input
                    type="text"
                    placeholder="Maghanap ng sesyon..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-96 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                />
            </div>

            {/* Sessions Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.length > 0 ? (
                    sessions.map((session: any) => (
                        <div key={session.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
                            <div>
                                <div className="flex justify-between items-start gap-2 mb-3">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-pink-600 bg-pink-50 px-2.5 py-1 rounded-md">
                                        Activity ID: {session.activity_id}
                                    </span>
                                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide ${
                                        session.status === 'open' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' :
                                        session.status === 'draft' ? 'bg-amber-50 text-amber-700 border border-amber-200/60' : 
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                        {session.status}
                                    </span>
                                </div>

                                <h2 className="text-lg font-bold text-gray-900 mb-2">{session.title}</h2>
                                <p className="text-xs text-gray-500 mb-4">
                                    📅 {new Date(session.starts_at).toLocaleString()}
                                </p>
                            </div>

                            <button
                                onClick={() => onSelectSession({ id: session.id, title: session.title, status: session.status })}
                                className="w-full py-2.5 bg-gray-900 hover:bg-pink-600 text-white rounded-xl text-sm font-semibold transition shadow-sm"
                            >
                                Buksan ang Checker ➔
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full p-8 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
                        Walang nakitang attendance sessions.
                    </div>
                )}
            </div>

            {/* Create Session Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Lumikha ng Bagong Sesyon</h2>
                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Session Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Hal. Sunday Worship - Jan 15, 2026"
                                    value={form.title}
                                    onChange={(e) => setForm({...form, title: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Activity ID</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="ID mula sa attendance_activities"
                                    value={form.activity_id}
                                    onChange={(e) => setForm({...form, activity_id: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Starts At</label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={form.starts_at}
                                    onChange={(e) => setForm({...form, starts_at: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Status</label>
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm({...form, status: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none text-sm"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="open">Open</option>
                                    <option value="finalized">Finalized</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 text-sm transition"
                                >
                                    Kanselahin
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="px-5 py-2 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 text-sm shadow-sm transition"
                                >
                                    {isCreating ? 'Sine-save...' : 'I-save ang Sesyon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}