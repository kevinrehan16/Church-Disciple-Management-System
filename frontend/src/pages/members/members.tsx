import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaUser } from "react-icons/fa";
import { Plus, Filter, ChevronDown, Eye, ShieldCheck, UserPen, Church, MapPinned, Sprout, CircleX, CalendarCheck2, Droplets } from 'lucide-react';
import ModuleHeader from '../../components/ui/ModuleHeader';
import SearchInput from '../../components/inputs/SearchInput';
import { TableLoading, TableError, TableEmpty } from '../../components/ui/TableStates';
import { useMembers } from '../../hooks/useMembers';
import RegisterMemberModal from '../../components/modals/memberModals/RegisterMemberModal';

export default function Members() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]); 
  const [selectedBaptismStatuses, setSelectedBaptismStatuses] = useState<string[]>([]); 
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBaptismDropdownOpen, setIsBaptismDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const baptismDropdownRef = useRef<HTMLDivElement>(null);

  const positionOptions = [
    'Senior Pastor',
    'Pastor',
    'Pastoral Staff',
    'Deacon',
    'Elder',
    'Member' // Katumbas ng No Growth Group, Growth Group Member, Growth Group Leader
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (baptismDropdownRef.current && !baptismDropdownRef.current.contains(event.target as Node)) {
        setIsBaptismDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handler para sa pag-check / uncheck
  const handleCheckboxChange = (position: string) => {
    setSelectedPositions(prev => {
      const updated = prev.includes(position)
        ? prev.filter(p => p !== position)
        : [...prev, position];
      
      return updated;
    });
    setCurrentPage(1); // Balik sa page 1 kapag nagbago ang filter
  };

  const handleBaptismCheckboxChange = (forBaptism: string) => {
    setSelectedBaptismStatuses(prev => {
      const updated = prev.includes(forBaptism)
        ? prev.filter(p => p !== forBaptism)
        : [...prev, forBaptism];
      
      return updated;
    });
    setCurrentPage(1); // Balik sa page 1 kapag nagbago ang filter
  };
  
  // 1. [UPDATED HERE] Ginawa na nating object ang pinapasa sa hook base sa bagong setup.
  // Pwede mong idagdag yung `rank` o `position` sa loob ng object na 'to pag kailangan mo na sa UI!
  // Ipasa ito sa iyong hook
  const { data: apiResponse, isLoading, isError, refetch } = useMembers({
    search: searchTerm,
    page: currentPage,
    member_position: selectedPositions,
    baptism_statuses: selectedBaptismStatuses,
  });
  
  // 2. Extracted Data & Meta
  const currentMembers = apiResponse?.data || [];
  const meta = apiResponse?.meta; // Laman nito ang total, current_page, last_page, etc.

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleViewProfile = (id: string) => {
    setSelectedMemberId(id);
    setIsRegisterModalOpen(true);
  };

  return (
    <div className="w-full bg-slate-50 text-slate-800 px-6 py-4 space-y-6">
      
      <ModuleHeader
        title="All Members"
        description="Centralized database for managing congregant profiles, leadership assignments, and real-time membership status."
        icon={<FaUsers size={24} />}
        actions={
          <button 
            className="group relative overflow-hidden flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95"
            onClick={() => handleViewProfile('')}
          >
            {/* Subtly nagliligid ang background opacity/highlight kapag hinOVER */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />

            <Plus size={16} className="transition-transform duration-300 group-hover:rotate-90 relative z-10" />
            <span className="relative z-10">Register New Member</span>
          </button>
        }
      />

      <div className="flex flex-col md:flex-row items-center gap-4 justify-between w-full bg-transparent">
        <SearchInput 
          value={searchTerm}
          onChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1); // I-reset sa Page 1 tuwing nag-a-update ang search
          }}
          placeholder="Search visitor by information..."
        />
        
        <div className='flex items-center justify-center gap-1'>
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-2 px-4 py-3 bg-white text-slate-600 rounded-xl text-sm font-semibold shadow-sm transition-all outline-none border
                ${isDropdownOpen
                  ? 'border-[var(--active-parent,rgb(249,115,22))] ring-4 ring-[var(--active-parent,rgb(249,115,22))]/15' 
                  : 'border-slate-200/80 hover:bg-slate-50'}`}
            >
              {/* Lalabas ang orange color kung bukas ang dropdown o kung may napiling filter */}
              <Filter 
                size={14} 
                className={isDropdownOpen ? 'text-[var(--active-parent,rgb(249,115,22))]' : 'text-slate-500'} 
              />
              
              <span>Position Filter {selectedPositions.length > 0 && `(${selectedPositions.length})`}</span>
              
              <ChevronDown 
                size={14} 
                className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[var(--active-parent,rgb(249,115,22))]' : 'text-slate-400'}`} 
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200/80 rounded-xl shadow-lg py-2 z-50">
                <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Filter by Position
                </div>
                <div className="max-h-60 overflow-y-auto px-1">
                  {positionOptions.map((pos) => {
                    const isChecked = selectedPositions.includes(pos);
                    return (
                      <label
                        key={pos}
                        className={`flex items-center gap-3 px-3 py-2 mt-0.5 rounded-lg cursor-pointer text-sm font-medium transition-colors ${
                          isChecked ? 'bg-[var(--active-parent,rgb(16,185,129))]/10 text-[var(--active-parent,rgb(16,185,129))]-700' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCheckboxChange(pos)}
                          style={{
                            accentColor: 'var(--active-parent, rgb(16, 185, 129))'
                          }}
                          className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                        />
                        <span className={isChecked ? 'text-[var(--active-parent,rgb(16,185,129))] font-semibold' : ''}>
                          {pos}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {selectedPositions.length > 0 && (
                  <div className="border-t border-slate-100 mt-1 pt-1 px-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPositions([]);
                        setCurrentPage(1);
                      }}
                      className="w-full text-center py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end relative" ref={baptismDropdownRef}>
            <button
              type="button"
              onClick={() => setIsBaptismDropdownOpen(!isBaptismDropdownOpen)}
              className={`flex items-center gap-2 px-4 py-3 bg-white text-slate-600 rounded-xl text-sm font-semibold shadow-sm transition-all outline-none border
                ${isBaptismDropdownOpen
                  ? 'border-[var(--active-parent,rgb(16,185,129))] ring-4 ring-[var(--active-parent,rgb(16,185,129))]/15' 
                  : 'border-slate-200/80 hover:bg-slate-50'}`}
            >
              <Filter 
                size={14} 
                className={isBaptismDropdownOpen ? 'text-[var(--active-parent,rgb(16,185,129))]' : 'text-slate-500'} 
              />
              
              <span>Baptism Status {selectedBaptismStatuses.length > 0 && `(${selectedBaptismStatuses.length})`}</span>
              
              <ChevronDown 
                size={14} 
                className={`transition-transform duration-200 ${isBaptismDropdownOpen ? 'rotate-180 text-[var(--active-parent,rgb(16,185,129))]' : 'text-slate-400'}`} 
              />
            </button>

            {/* Dropdown Menu */}
            {isBaptismDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200/80 rounded-xl shadow-lg py-2 z-50">
                <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Filter by Baptism
                </div>
                <div className="max-h-60 overflow-y-auto px-1">
                  {[
                    { label: 'Not yet baptized', value: 'not_yet' },
                    { label: 'Scheduled', value: 'scheduled' },
                    { label: 'Baptized', value: 'baptized' }
                  ].map((item) => {
                    const isChecked = selectedBaptismStatuses.includes(item.value);
                    return (
                      <label
                        key={item.value}
                        className={`flex items-center gap-3 px-3 py-2 mt-0.5 rounded-lg cursor-pointer text-sm font-medium transition-colors ${
                          isChecked ? 'bg-[var(--active-parent,rgb(16,185,129))]/10 text-[var(--active-parent,rgb(16,185,129))]-700' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleBaptismCheckboxChange(item.value)}
                          style={{
                            accentColor: 'var(--active-parent, rgb(16, 185, 129))'
                          }}
                          className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                        />
                        <span className={isChecked ? 'text-[var(--active-parent,rgb(16,185,129))] font-semibold' : ''}>
                          {item.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {selectedBaptismStatuses.length > 0 && (
                  <div className="border-t border-slate-100 mt-1 pt-1 px-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBaptismStatuses([]);
                        setCurrentPage(1);
                      }}
                      className="w-full text-center py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-y-auto overflow-x-auto h-[calc(100vh-325px)] border border-slate-200/60 rounded-lg">
            <table className="w-full text-left text-sm border-separate border-spacing-0">
                <thead className="sticky top-0 z-10 bg-[var(--active-parent)]">
                  <tr className="text-white uppercase tracking-wider text-[10px] font-extrabold border-b border-slate-200/60">
                    <th className="px-6 py-4">Patient Details</th>
                    <th className="px-6 py-4 text-center">Member Position</th>
                    <th className="px-6 py-4">Church Details</th>
                    <th className="px-6 py-4">GrowthGroup Status</th>
                    <th className="px-6 py-4 text-center">Baptism Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                    <TableLoading rows={5} columns={6} />
                ) : isError ? (
                    <TableError colSpan={6} onRetry={() => refetch()} />
                ) : currentMembers.length > 0 ? (
                    currentMembers.map((member: any) => (
                    <tr key={member.id} className="group odd:bg-slate-50 hover:bg-[var(--active-parent,rgb(99,102,241))]/5 transition-all duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs border border-slate-200 group-hover:bg-[var(--active-parent,rgb(99,102,241))]/10 group-hover:text-[var(--active-parent,rgb(99,102,241))] group-hover:border-[var(--active-parent,rgb(99,102,241))] transition-colors">
                              {member.first_name?.[0]}{member.last_name?.[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 group-hover:text-[var(--active-parent,rgb(99,102,241))] transition-colors">{member.first_name} {member.last_name}</p>
                              <p className={`text-[12px] font-medium font-mono transition-all duration-300 ${
                                  member.member_status === "Active" 
                                    ? "text-emerald-600" 
                                    : "line-through decoration-slate-400 decoration-1 text-slate-400"
                              }`}>
                                {String(member.mem_id)}
                              </p>
                              {member.nickname && <p className="text-[10px] font-normal text-slate-400">-{String(member.nickname)}-</p>}
                            </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className={`flex items-center justify-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide uppercase ${
                            ['Senior Pastor', 'Elder'].includes(member.member_position)
                              ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                              : ['Pastor', 'Pastoral Staff', 'Deacon'].includes(member.member_position)
                              ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                              : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                          }`}>
                            <FaUser size={10} className="shrink-0"/>
                            {['Growth Group Member', 'No Growth Group', 'Growth Group Leader'].includes(member.member_position)
                              ? 'MEMBER'
                              : member.member_position}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Church size={12} className="text-indigo-400 shrink-0" />
                            <span className="text-[13px] font-medium truncate max-w-[150px]">
                              {member.church_name || <span className="text-slate-300 italic">Unassigned</span>}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <MapPinned size={12} className="text-rose-400 shrink-0" />
                            <span className="text-xs font-mono">
                              {member.cluster_name ? `${member.cluster_name} Cluster` : <span className="text-slate-300 italic">No Cluster</span>}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1.5 items-start">
                          {/* 1. TOP: Lalabas lang kapag GG Leader siya */}
                          {member.is_growth_group_leader && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/60 shadow-xs">
                              <ShieldCheck size={12} className="shrink-0 text-purple-600" />
                              GrowthGroup Leader
                            </span>
                          )}

                          {/* 2. BOTTOM: Membership Status (GG Member o No Growth Group) */}
                          {member.has_growth_group ? (
                            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 px-0.5">
                              <Sprout size={13} className="shrink-0 text-emerald-500" />
                              <span>GrowthGroup Member</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 italic px-0.5">
                              <CircleX size={13} className="shrink-0 text-slate-400" />
                              <span>No GrowthGroup</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          {member.baptized_immersion === "1" || member.baptized_immersion === 1 ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border tracking-wider uppercase bg-blue-50 text-blue-700 border-blue-300">
                              <Droplets size={13} className="text-blue-600" />
                              Baptized
                            </span>
                          ) : member.rec_for_baptism ? (
                            <span 
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border tracking-wider uppercase bg-amber-50 text-amber-500 border-amber-300"
                              title={`Baptism Schedule: ${member.baptized_date}`}
                            >
                              <CalendarCheck2 size={13} className="text-amber-500" />
                              {member.baptized_date || 'Scheduled'}
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold border tracking-wider uppercase bg-slate-50 text-slate-400 border-slate-200/60">
                              Not Yet
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className='flex items-center gap-1'>
                          <button 
                            className="inline-flex items-center justify-center p-2 rounded-xl text-cyan-600 bg-cyan-50/80 border border-cyan-200/60 hover:bg-cyan-500 hover:text-white hover:border-cyan-500 transition-all duration-200 active:scale-95"
                            title="Edit Profile"
                            onClick={() => handleViewProfile(member.id)}
                          >
                            <UserPen size={15} />
                          </button>
                          <Link 
                            to={`/member/${member.id}`}
                            className="inline-flex items-center justify-center p-2 rounded-xl text-green-600 bg-green-50/80 border border-green-200/60 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200 active:scale-95"
                            title="View Profile"
                          >
                            <Eye size={15} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                    ))
                ) : (
                    <TableEmpty colSpan={6} />
                )}
                </tbody>
            </table>
        </div>

        {/* 3. DYNAMIC PAGINATION FOOTER (Optimized) */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-100/50">
          <p className="text-xs text-slate-500 font-medium">
            Showing <span className="text-slate-800 font-bold">{meta?.from || 0}</span> to <span className="text-slate-800 font-bold">{meta?.to || 0}</span> of <span className="text-slate-800 font-bold">{meta?.total || 0}</span> entries
          </p>

          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={!meta || meta.current_page === 1} 
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-30"
            >
              Prev
            </button>
            
            {/* Dynamic Page Numbers with Ellipsis (...) para hindi sumabog ang UI */}
            {meta && (() => {
              const current = meta.current_page;
              const last = meta.last_page;
              const delta = 2; // Ilang pahina ang gusto mong makita sa tabi ng current page
              const range = [];

              for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
                range.push(i);
              }

              if (current - delta > 2) {
                range.unshift("...");
              }
              if (current + delta < last - 1) {
                range.push("...");
              }

              range.unshift(1);
              if (last > 1) {
                range.push(last);
              }

              return range.map((page, index) => {
                if (page === "...") {
                  return <span key={`ellipsis-${index}`} className="px-2 text-xs text-slate-400">...</span>;
                }

                return (
                  <button 
                    key={page} 
                    onClick={() => setCurrentPage(Number(page))} 
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${current === page ? 'bg-[var(--active-parent,rgb(99,102,241))] text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                  >
                    {page}
                  </button>
                );
              });
            })()}

            <button 
              onClick={() => setCurrentPage(prev => (!meta ? prev : Math.min(prev + 1, meta.last_page)))} 
              disabled={!meta || meta.current_page === meta.last_page || meta.last_page === 0} 
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isRegisterModalOpen && (
        <RegisterMemberModal 
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)} 
          memberId={selectedMemberId}
        />
      )}
    </div>
  );
}