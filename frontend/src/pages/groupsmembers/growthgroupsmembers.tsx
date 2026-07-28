import { useState } from 'react';
import { FaLaptopHouse, FaLaptop, FaMobileAlt, FaUserShield, FaUsers, FaUserPlus } from "react-icons/fa";
import { Plus, Sprout, CalendarClock, MapPinHouse } from 'lucide-react';
import GrowthGroupModal from '../../components/modals/growthgroupModals/GrowthGroupModal';
import ModuleHeader from '../../components/ui/ModuleHeader';
import SearchInput from '../../components/inputs/SearchInput';
import { useGrowthGroupMembers } from '../../hooks/useGGMembers';
import { formatTime } from '../../utils/formatters';

// Helper function para sa 2-letter initials
const getInitials = (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0) : '';
    const last = lastName ? lastName.charAt(0) : '';
    return `${first}${last}`.toUpperCase();
};

// Kulay generator para sa avatars
const avatarColors = [
    'bg-sky-500', 'bg-indigo-500', 'bg-emerald-500', 
    'bg-amber-500', 'bg-purple-500', 'bg-rose-500', 'bg-teal-500'
];

const getColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return avatarColors[Math.abs(hash) % avatarColors.length];
};

export default function GrowthGroupsMembers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChurch, setSelectedChurch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data: apiResponse, isLoading, isError, refetch } = useGrowthGroupMembers();
  const currentGGMembers = apiResponse?.data || [];

  const [isGrowthGroupModalOpen, setIsGrowthGroupModalOpen] = useState(false);
  const [selectedGrowthGroupId, setSelectedGrowthGroupId] = useState('');

  const handleViewGrowthGroup = (id) => {
    setSelectedGrowthGroupId(id);
    setIsGrowthGroupModalOpen(true);
  };

  // Filtering
  const filteredGroups = currentGGMembers.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          group.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          `${group.leader.first_name} ${group.leader.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' 
      ? true 
      : selectedStatus === 'active' ? group.is_active : !group.is_active;

    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentGrowthGroups = filteredGroups.slice(startIndex, startIndex + itemsPerPage);
  const endIndex = Math.min(startIndex + itemsPerPage, filteredGroups.length);

  return (
    <div className="flex flex-col h-full overflow-hidden w-full bg-slate-50 text-slate-800">
      
      {/* -- FIXED HEADER AREA -- */}
      <div className="px-6 py-4 space-y-4 shrink-0">
        <ModuleHeader
          title="Growth Group Members"
          description="Monitor and organize small groups, leadership structures, and schedules."
          icon={<Sprout size={24} />}
          actions={
            <button 
              className="group flex items-center gap-2 px-4 py-2.5 bg-[#0284c7] hover:bg-[#026ca1] active:scale-95 text-white rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
              onClick={() => handleViewGrowthGroup('')}
            >
              <Plus size={15} className="transition-transform group-hover:rotate-90" />
              Add New Growth Group
            </button>
          }
        />

        <div className="flex flex-col md:flex-row items-center gap-4 justify-between w-full bg-transparent">
          <SearchInput 
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
            placeholder="Search group name, code, or leader..."
          />
          
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <select
              value={selectedChurch}
              onChange={(e) => setSelectedChurch(e.target.value)}
              className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-sky-500 cursor-pointer shadow-sm"
            >
              <option value="">All Churches</option>
              <option value="1">GCF SouthMetro</option>
              <option value="2">GCF Bacoor</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-sky-500 cursor-pointer shadow-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* -- SCROLLABLE CARD AREA -- */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
        {currentGrowthGroups.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <p className="text-slate-400 font-medium text-sm">No growth groups found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-1">
            {currentGrowthGroups.map((gg) => {
              const maxVisible = 6;
              const members = gg.members || [];
              const visibleMembers = members.slice(0, maxVisible);
              const hiddenCount = members.length - maxVisible;

              return (
                <div 
                    key={gg.id} 
                    className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[var(--active-parent,rgb(99,102,241))]/70 transition-all duration-300 p-5 flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--active-parent,rgb(99,102,241))] opacity-80" />

                  <div>
                    {/* Header ng Card */}
                    <div className="flex justify-between items-start mb-3 pt-1">
                      <div className="flex items-center gap-2.5">
                        {/* Icon Box Effect */}
                        <div className="w-10 h-10 rounded-xl bg-[var(--active-parent,rgb(99,102,241))]/60 text-white flex items-center justify-center font-bold text-xs border border-[var(--active-parent,rgb(99,102,241))] shadow-inner group-hover:bg-[var(--active-parent,rgb(99,102,241))] group-hover:text-white group-hover:scale-105 group-hover:border-[var(--active-parent,rgb(99,102,241))] transition-all duration-300">
                            <Sprout size={18} />
                        </div>

                        <div>
                            {/* Badge Effect */}
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-white bg-slate-400 px-2 py-0.5 rounded-md border border-slate-100">
                            {gg.code}
                            </span>

                            {/* Title Effect */}
                            <h3 className="text-base font-bold text-slate-900 mt-1 group-hover:text-[var(--active-parent,rgb(99,102,241))] transition-colors">
                            {gg.name}
                            </h3>
                        </div>
                    </div>
                      
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide ${gg.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-slate-100 text-slate-500'}`}>
                        {gg.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {/* Schedule Details */}
                    <div className="text-xs text-slate-600 space-y-2 mb-4 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-2 font-semibold text-slate-800">
                        <CalendarClock size={14} className="text-amber-500 flex-shrink-0" />
                        <span>{gg.meeting_day} @ {formatTime(gg.meeting_time)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-slate-600">
                        {gg.location_type === 'onsite' ? (
                          <MapPinHouse size={14} className="text-rose-500 flex-shrink-0" />
                        ) : gg.location_type === 'hybrid' ? (
                          <FaLaptopHouse size={14} className="text-emerald-500 flex-shrink-0" />
                        ) : (
                          <FaLaptop size={14} className="text-sky-500 flex-shrink-0" />
                        )}
                        <span className="truncate font-medium" title={gg.venue_address}>{gg.venue_address}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                        <span className="text-[11px] text-slate-400 font-medium">Type: <strong className="text-slate-700 capitalize">{gg.location_type}</strong></span>
                        <span className="capitalize px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded-md text-[10px] border border-indigo-100">
                          {gg.target_demographic.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Leader Information */}
                    <div className="pt-1 mb-3">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex-1 mb-3">
                        <FaUserShield size={15} className="text-slate-400" />
                        <span>Group Leader</span>
                        <div className="flex-1 h-px bg-slate-200 ml-0.5 mr-1" />
                      </div>
                      <div className="flex items-center justify-between bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                        {/* Kanan: Avatar at Pangalan */}
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-sm shrink-0 group-hover:bg-[var(--active-parent,rgb(99,102,241))]">
                            {getInitials(gg.leader.first_name, gg.leader.last_name)}
                            </div>
                            <p className="text-xs font-bold text-slate-800">
                            {gg.leader.first_name} {gg.leader.last_name}
                            </p>
                        </div>

                        {/* Kaliwa: Mobile Number */}
                        <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1 shrink-0 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-2xs">
                            <FaMobileAlt size={10} className="text-slate-400" /> {gg.leader.mobile_number}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Members Section */}
                  <div className="pt-1">
                    <div className="flex justify-between items-center mb-2.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex-1">
                        <FaUsers size={15} className="text-slate-400" />
                        <span>Members</span>
                        <div className="flex-1 h-px bg-slate-200 ml-0.5 mr-1" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{members.length} total</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex -space-x-2.5 overflow-visible py-1.5">
                          {visibleMembers.map((member, idx) => (
                            <div
                              key={member.member_id || idx}
                              className={`relative group/avatar inline-flex h-8 w-8 rounded-full ring-2 ring-white items-center justify-center text-xs font-extrabold text-white transition-transform duration-200 hover:-translate-y-1.5 hover:scale-110 hover:z-30 cursor-pointer shadow-md ${getColor(member.full_name)}`}
                            >
                              <span className="leading-none">{getInitials(member.full_name.split(' ')[0], member.full_name.split(' ').slice(1).join(' '))}</span>
                              
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/avatar:flex flex-col items-center z-40 pointer-events-none">
                                <span className="bg-slate-900 text-white text-[11px] font-medium px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap">
                                  {member.full_name}
                                </span>
                                <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
                              </div>
                            </div>
                          ))}
                        </div>

                        {hiddenCount > 0 && (
                          <div className="ml-2.5 flex items-center justify-center h-8 px-2.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 shadow-sm">
                            +{hiddenCount}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => handleViewGrowthGroup(gg.id)}
                          className="flex items-center gap-1.5 p-2 rounded-full border border-slate-200 bg-blue-600 text-xs font-semibold text-white hover:bg-blue-800 hover:border-blue-900 transition-all duration-200 active:scale-95"
                          title="Add New Member"
                        >
                          <FaUserPlus size={15} />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* -- PAGINATION FOOTER (ZERO MARGIN & FULL EDGE-TO-EDGE) -- */}
      <div className="shrink-0 w-full m-0 px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between rounded-none shadow-sm">
        <p className="text-xs text-slate-500 font-medium">
          Showing <span className="text-slate-800 font-bold">{filteredGroups.length > 0 ? startIndex + 1 : 0}</span> to <span className="text-slate-800 font-bold">{endIndex}</span> of <span className="text-slate-800 font-bold">{filteredGroups.length}</span> entries
        </p>

        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1} 
            className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            Prev
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button 
              key={page} 
              onClick={() => setCurrentPage(page)} 
              className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm ${currentPage === page ? 'bg-[#0284c7] text-white shadow-sky-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {page}
            </button>
          ))}

          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages || totalPages === 0} 
            className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      {isGrowthGroupModalOpen && (
        <GrowthGroupModal 
          isOpen={isGrowthGroupModalOpen}
          onClose={() => setIsGrowthGroupModalOpen(false)} 
          GrowthGroupId={selectedGrowthGroupId}
        />
      )}
    </div>
  );
}