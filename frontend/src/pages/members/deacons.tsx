import { useState } from 'react';
import { FaUsers } from "react-icons/fa";
import { Filter, ArrowUpDown, Eye, Church, MapPinned, Sprout, CircleX, User, ShieldCheck } from 'lucide-react';
import ModuleHeader from '../../components/ui/ModuleHeader';
import SearchInput from '../../components/inputs/SearchInput';
import { TableLoading, TableError, TableEmpty } from '../../components/ui/TableStates';
import { useMembers } from '../../hooks/useMembers';
import { getLifestageStyles } from '../../utils/formatters';
// import RegisterMemberModal from '../../components/modals/memberModals/RegisterMemberModal';

export default function Deacons() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // 1. [UPDATED HERE] Ginawa na nating object ang pinapasa sa hook base sa bagong setup.
  // Pwede mong idagdag yung `rank` o `position` sa loob ng object na 'to pag kailangan mo na sa UI!
  const { data: apiResponse, isLoading, isError, refetch } = useMembers({
    search: searchTerm,
    page: currentPage,
    member_position: 'Deacon', // Example: pwede mo i-uncomment ito in the future kung gusto mong i-filter agad
    // rank: 1
  });
  
  // 2. Extracted Data & Meta
  const currentDeacons = apiResponse?.data || [];
  const meta = apiResponse?.meta; // Laman nito ang total, current_page, last_page, etc.

  return (
    <div className="w-full bg-slate-50 text-slate-800 px-6 py-4 space-y-6">
      
      <ModuleHeader
        title="Deacons"
        description="Centralized management of deacons profiles, ministry oversight, and leadership assignments."
        icon={<FaUsers size={24} />}
        actions=''
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
        
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-600 rounded-xl text-sm font-semibold shadow-sm transition-all">
            <Filter size={14} /> Advanced Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-600 rounded-xl text-sm font-semibold shadow-sm transition-all">
            <ArrowUpDown size={14} /> Sort By
          </button>
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
                    <th className="px-6 py-4 text-center">Life-Stage</th>
                    <th className="px-6 py-4">GrowthGroup Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                    <TableLoading rows={5} columns={6} />
                ) : isError ? (
                    <TableError colSpan={6} onRetry={() => refetch()} />
                ) : currentDeacons.length > 0 ? (
                    currentDeacons.map((member: any) => (
                    <tr key={member.id} className="group hover:bg-[var(--active-parent,rgb(99,102,241))]/5 transition-all duration-200">
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
                              <User size={10} className="shrink-0"/>
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
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border tracking-wider uppercase ${getLifestageStyles(member.lifestage)}`}>
                              {member.lifestage || 'N/A'}
                            </span>
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
                          <button 
                            className="inline-flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium 
                            text-slate-600 bg-slate-100 hover:bg-cyan-500 hover:text-white 
                            transition-all duration-200 active:scale-95 hover:cursor-pointer"
                          >
                            <Eye size={14} />
                          </button>
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

      {/* {isRegisterModalOpen && (
        <RegisterMemberModal 
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)} 
          memberId={selectedMemberId}
        />
      )} */}
    </div>
  );
}