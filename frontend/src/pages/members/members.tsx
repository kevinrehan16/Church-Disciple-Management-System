import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaMobile, FaEnvelope, FaUsers } from "react-icons/fa";
import { Plus, Filter, ArrowUpDown, Eye, Mars, Venus, Cake, User, MapPin, UserPen } from 'lucide-react';
import ModuleHeader from '../../components/ui/ModuleHeader';
import SearchInput from '../../components/inputs/SearchInput';
import { TableLoading, TableError, TableEmpty } from '../../components/ui/TableStates';
import { useMembers } from '../../hooks/useMembers';
import { calculateAge } from '../../utils/formatters';
import RegisterMemberModal from '../../components/modals/memberModals/RegisterMemberModal';
import { getLifestageStyles } from '../../utils/formatters';

export default function Members() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // 1. [UPDATED HERE] Ginawa na nating object ang pinapasa sa hook base sa bagong setup.
  // Pwede mong idagdag yung `rank` o `position` sa loob ng object na 'to pag kailangan mo na sa UI!
  const { data: apiResponse, isLoading, isError, refetch } = useMembers({
    search: searchTerm,
    page: currentPage,
    // rank: 2, // Example: pwede mo i-uncomment ito in the future kung gusto mong i-filter agad
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
            className="group flex items-center gap-2 px-5 py-2.5 bg-[#0284c7] hover:bg-[#026ca1] active:scale-95 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-rose-500/10"
            onClick={() => handleViewProfile('')}
          >
            <Plus size={16} className="transition-transform group-hover:rotate-90" />
            Register New Member
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
                    <th className="px-6 py-4">Birthday/ Age / Gender</th>
                    <th className="px-6 py-4">Contacts</th>
                    <th className="px-6 py-4 text-center">Life-Stage</th>
                    <th className="px-6 py-4">Address</th>
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
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-slate-900 text-sm font-medium">
                              <Cake size={14} className="text-slate-400" />
                              {member.birthday}
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 text-xs">
                              <User size={14} className="text-slate-400" />
                              <span>{calculateAge(member.age)} yrs</span>
                              <span>•</span>
                              <div className='flex items-center justify-center gap-1'>
                                {member.gender === 'Male' ? (
                                  <Mars size={14} className="text-slate-400" />
                                ) : (
                                  <Venus size={14} className="text-slate-400" />
                                )}
                                <span className={`rounded-full text-[11px] font-medium`}>
                                  {member.gender}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-slate-600">
                              <FaEnvelope size={12} className="text-rose-400 shrink-0" />
                              <span className="text-xs truncate max-w-[150px]">{member.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                              <FaMobile size={12} className="text-cyan-400 shrink-0" />
                              <span className="text-xs font-mono">
                                {member.mobile_number || <span className="text-slate-300 italic">No number</span>}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                              <FaFacebookF size={12} className="text-blue-400 shrink-0" />
                              <span className="text-xs font-normal">
                                {member.facebook_name || <span className="text-slate-300 italic">No Facebook</span>}
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
                        <td className="px-6 py-4">
                          <div className="flex flex-col max-w-[150px]">
                            {/* Barangay */}
                            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-900 truncate">
                              <MapPin size={13} className="text-slate-400 shrink-0" />
                              {member.barangay || 'N/A'}
                            </div>
                            
                            {/* City */}
                            <div className="pl-[19px] text-xs text-slate-500 truncate">
                              {member.city || 'No City Specified'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center gap-1.5 flex items-center justify-center">
                          <Link 
                            to={`/member/${member.id}`}
                            className="inline-flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium 
                            text-emerald-600 border border-emerald-500 bg-slate-100 hover:bg-emerald-500 hover:text-white 
                            transition-all duration-200 active:scale-95"
                            title="View Profile"
                          >
                            <Eye size={14} />
                          </Link>
                          <button 
                            className="inline-flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium 
                            text-cyan-600 border border-cyan-500 bg-slate-100 hover:bg-cyan-500 hover:text-white 
                            transition-all duration-200 active:scale-95"
                            title="Edit Profile"
                            onClick={() => handleViewProfile(member.id)}
                          >
                            <UserPen size={14} />
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

        {/* 3. DYNAMIC PAGINATION FOOTER (Using Backend Meta) */}
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
            
            {/* Generate Page Numbers dynamically based on meta.last_page */}
            {meta && Array.from({ length: meta.last_page }, (_, i) => i + 1).map((page) => (
              <button 
                key={page} 
                onClick={() => setCurrentPage(page)} 
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${meta.current_page === page ? 'bg-[var(--active-parent,rgb(99,102,241))] text-white' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                {page}
              </button>
            ))}

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