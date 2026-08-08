import { useState } from 'react';
import { X, Users, Calendar, UserX, UserCheck, Phone, ShieldUser, Edit3, Trash2 } from 'lucide-react';
import { modalAnimation } from '../../../utils/ModalAnimation';
import { useGrowthGroupMembers } from '../../../hooks/useGGMembers';
import SectionHeader from '../../ui/SectionHeader';

// Helper para sa 2-letter initials
const getInitials = (name: string) => {
  if (!name) return 'GG';
  const cleanName = name.replace(',', '').trim();
  const parts = cleanName.split(' ');
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  }
  return cleanName.substring(0, 2).toUpperCase();
};

// Color generator para sa avatar circle
const avatarColors = [
  'bg-sky-500', 'bg-indigo-500', 'bg-emerald-500', 
  'bg-amber-500', 'bg-purple-500', 'bg-rose-500', 'bg-teal-500'
];
const getColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

interface ViewGrowthGroupMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  growthGroupId?: string | number | null;
  growthGroupName?: string;
}

export default function ViewGrowthGroupMembersModal({ 
  isOpen, 
  onClose, 
  growthGroupId,
  growthGroupName = "Growth Group Members"
}: ViewGrowthGroupMembersModalProps) {
  const { isClosing, startClose, handleAnimationEnd } = modalAnimation(onClose);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const safeGrowthGroupId: string | number = growthGroupId ?? '';
  const { data: apiResponse } = useGrowthGroupMembers(safeGrowthGroupId);
  
  const responseObj = apiResponse as any;
  const groupData = responseObj?.data || responseObj;
  const leader = groupData?.leader || null;
  const rawMembers = groupData?.members || [];

  if (!isOpen) return null;

  const formattedMembers = rawMembers.map((m: any) => ({
    ...m,
    status: m.status || 'active',
  }));

  const filteredMembers = formattedMembers.filter((member: any) => {
    if (filterStatus === 'active') return member.status === 'active';
    if (filterStatus === 'inactive') return member.status === 'inactive';
    return true;
  });

  const totalMembersCount = formattedMembers.length;

  const handleUpdateRole = (memberId: number) => {
    console.log("Update role for member:", memberId);
  };

  const handleToggleStatus = (memberId: number, currentStatus: string) => {
    console.log(`Toggle status for member ${memberId} from ${currentStatus}`);
  };

  const handleRemoveMember = (memberId: number) => {
    console.log("Remove member:", memberId);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs ${isClosing ? 'modal-overlay closing' : 'modal-overlay'}`}
      onAnimationEnd={handleAnimationEnd}
    >
      {/* Pinalaki ang max-w para magkasya ang 3 columns (max-w-6xl) */}
      <div className={`bg-white rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden border border-slate-200/80 flex flex-col max-h-[90vh] ${isClosing ? 'modal-content closing' : 'modal-content'}`}>
        
        {/* Header */}
        <div className="px-8 py-6 bg-[var(--active-parent,rgb(99,102,241))] flex items-center justify-between text-white flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/25 px-2.5 py-0.5 rounded-md">
                Code: {groupData?.code || 'N/A'}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/25 px-2.5 py-0.5 rounded-md">
                {groupData?.location_type || 'onsite'}
              </span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight mt-1">
              {groupData?.name || growthGroupName} - Growth Group Members
            </h2>
            <p className="text-white/80 text-xs mt-0.5 font-medium">
              Meeting every {groupData?.meeting_day || 'Schedule'} at {groupData?.venue_address || 'Venue'}
            </p>
          </div>
          <button 
            type="button"
            onClick={startClose} 
            className="p-2 hover:bg-white/10 active:scale-95 rounded-full transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter & Summary Bar */}
        <div className="px-8 py-4 bg-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-slate-500" />
            <span className="text-xs font-bold text-slate-700">Total Members:</span>
            <span className="text-xs font-extrabold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100">
              {totalMembersCount} / 12 Capacity
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-200/60 p-1 rounded-xl">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${filterStatus === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All ({totalMembersCount})
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${filterStatus === 'active' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterStatus('inactive')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${filterStatus === 'inactive' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Inactive
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50 space-y-6">
          
          {/* LEADER SECTION (Nasa Taas) */}
          {leader && (
            <div>
              <div className="mb-3">
                <SectionHeader title="Group Leader" icon={ShieldUser} />
              </div>
              
              <div className="bg-gradient-to-r from-amber-500/10 via-white to-white p-4 rounded-2xl border border-amber-200/80 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0 ${getColor(`${leader.first_name} ${leader.last_name}`)}`}>
                    {getInitials(`${leader.first_name} ${leader.last_name}`)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {leader.first_name} {leader.last_name}
                    </h4>
                    <span className="inline-block mt-0.5 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                      Leader
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-sm text-slate-600">
                    <p className="flex items-center gap-1 font-medium justify-end">
                      <Phone size={15} className="text-emerald-500" /> {leader.mobile_number || 'No contact'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OTHER MEMBERS SECTION (Nasa Baba) */}
          <div>
            <div className="mb-3">
              <SectionHeader title="Group Members" icon={Users} />
            </div>

            {filteredMembers.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-slate-200/80">
                <p className="text-slate-400 text-xs font-medium">No members found under this filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMembers.map((member: any) => {
                  const isActive = member.status === 'active';
                  const isTimothy = member.role === 'timothy';
                  const displayName = member.full_name || 'Unknown Name';

                  return (
                    <div 
                      key={member.member_id}
                      className={`bg-white p-4 rounded-2xl border transition-all shadow-2xs hover:shadow-md flex flex-col justify-between relative overflow-hidden ${
                        isActive ? 'border-slate-200/80' : 'border-rose-200/60 bg-rose-50/20'
                      }`}
                    >
                      <div className={`absolute top-0 left-0 right-0 h-1 ${isTimothy ? 'bg-sky-500' : 'bg-slate-300'}`} />

                      <div>
                        {/* Name, Role & 2-Letter Avatar Circle sa KALIWA */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-start gap-3">
                            {/* Avatar Circle */}
                            <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0 ${getColor(displayName)}`}>
                              {getInitials(displayName)}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">
                                {displayName}
                              </h4>
                              <span className={`inline-block mt-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                                isTimothy 
                                  ? 'bg-sky-100 text-sky-800 border border-sky-200' 
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}>
                                {member.role}
                              </span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
                            isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {isActive ? <UserCheck size={10} /> : <UserX size={10} />}
                            {member.status}
                          </span>
                        </div>

                        {/* Contact & Date Info */}
                        <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-2">
                            <Phone size={12} className="text-slate-400 shrink-0" />
                            <span>{member.mobile || 'No mobile number'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={12} className="text-slate-400 shrink-0" />
                            <span>Joined: <strong className="text-slate-700">{member.joined_at}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons: Update Role, Toggle Status, Remove */}
                      <div className="flex items-center justify-end gap-1.5 mt-4 pt-3 border-t border-slate-100">
                        <button
                          onClick={() => handleUpdateRole(member.member_id)}
                          className="px-2.5 py-1 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                          title="Update Role"
                        >
                          <Edit3 size={11} /> Role
                        </button>

                        <button
                          onClick={() => handleToggleStatus(member.member_id, member.status)}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                            isActive 
                              ? 'text-amber-700 bg-amber-50 hover:bg-amber-100' 
                              : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                          }`}
                        >
                          {isActive ? 'Set Inactive' : 'Set Active'}
                        </button>

                        <button
                          onClick={() => handleRemoveMember(member.member_id)}
                          className="p-1 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all cursor-pointer"
                          title="Remove from Group"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-200/60 flex justify-end flex-shrink-0">
          <button 
            type="button" 
            onClick={startClose} 
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-2"
          >
            <X size={15} /> Close
          </button>
        </div>

      </div>
    </div>
  );
}