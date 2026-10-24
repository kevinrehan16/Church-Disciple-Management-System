import { useState } from 'react';
import AttendanceSessions, { type SelectedSessionData } from './AttendanceSessions';
import AttendanceCheckIn from './AttendanceCheckIn';

export default function AttendancePage() {
    const [currentView, setCurrentView] = useState<'sessions' | 'checker'>('sessions');
    const [selectedSession, setSelectedSession] = useState<SelectedSessionData>({
        id: '',
        title: '',
        status: 'open'
    });

    const handleOpenChecker = (sessionData: SelectedSessionData) => {
        setSelectedSession(sessionData);
        setCurrentView('checker');
    };

    return (
        <div>
            {currentView === 'sessions' ? (
                <AttendanceSessions onSelectSession={handleOpenChecker} />
            ) : (
                <div>
                    <div className="bg-white px-8 py-4 border-b border-gray-100 flex items-center shadow-sm">
                        <button
                            onClick={() => setCurrentView('sessions')}
                            className="text-sm font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-2 transition"
                        >
                            <span>← Bumalik sa Sessions List</span>
                        </button>
                    </div>

                    <AttendanceCheckIn 
                        sessionId={selectedSession.id}
                        sessionTitle={selectedSession.title} 
                        sessionStatus={selectedSession.status} 
                    />
                </div>
            )}
        </div>
    );
}