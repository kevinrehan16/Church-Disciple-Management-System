import { useState } from 'react';
import { FaBible, FaLaptopHouse, FaLaptop, FaMobileAlt } from "react-icons/fa";
import { Plus, Sprout, CalendarClock, MapPinHouse, Church, MapPinned, Edit3, Trash2, ShieldUser } from 'lucide-react';
import GrowthGroupModal from '../../components/modals/growthgroupModals/GrowthGroupModal';
import { useGrowthGroup } from '../../hooks/useGrowthGroup';
import ModuleHeader from '../../components/ui/ModuleHeader';
import SearchInput from '../../components/inputs/SearchInput';
import { formatTime } from '../../utils/formatters';
// import { TableLoading, TableError, TableEmpty } from '../../components/ui/TableStates';

export default function GrowthGroups() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedChurch, setSelectedChurch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const { data: apiResponse } = useGrowthGroup({
    search: searchTerm,
    page: currentPage,
    church_id: selectedChurch,
    cluster_id: '',
  });
  
  // apiResponse may be a paginated response with a `data` property or a plain array.
  // Use a safe cast/check to avoid TypeScript error when `data` doesn't exist.
  const currentGrowthGroups = (apiResponse as any)?.data || (Array.isArray(apiResponse) ? apiResponse : []);
  const meta = (apiResponse as any)?.meta;

  const [isGrowthGroupModalOpen, setIsGrowthGroupModalOpen] = useState(false);
  const [selectedGrowthGroupId, setSelectedGrowthGroupId] = useState('');

  const handleViewGrowthGroup = (id: string) => {
    setSelectedGrowthGroupId(id);
    setIsGrowthGroupModalOpen(true);
  };
  
  return (
    <div className="w-full bg-slate-50 text-slate-800 px-6 py-4 space-y-6">
      
      <ModuleHeader
        title="Growth Groups"
        description="Monitor and organize small groups, leadership structures, and schedules."
        icon={<FaBible size={24} />}
        actions={
          <button 
            className="group flex items-center gap-2 px-5 py-2.5 bg-[#0284c7] hover:bg-[#026ca1] active:scale-95 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-rose-500/10"
            onClick={() => handleViewGrowthGroup('')}
          >
            <Plus size={16} className="transition-transform group-hover:rotate-90" />
            Add New Growth Group
          </button>
        }
      />

      <div className="flex flex-col md:flex-row items-center gap-4 justify-between w-full bg-transparent">
        <SearchInput 
          placeholder="Search group name, code, or leader..."
          value={searchTerm}
          onChange={(val) => setSearchTerm(val)}
        />
        
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <div className="relative">
            <select
              value={selectedChurch}
              onChange={(e) => setSelectedChurch(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="">All Churches</option>
              <option value="1">GCF SouthMetro</option>
              <option value="2">GCF Bacoor</option>
            </select>
          </div>

          {/* Filter by Status */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="all">All Status (Active & Inactive)</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      <div className="w-full bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-y-auto overflow-x-auto h-[calc(100vh-325px)] border border-slate-200/60 rounded-lg">
          <table className="w-full text-left text-sm border-separate border-spacing-0">
            
            {/* Sticky Table Header */}
            <thead className="sticky top-0 z-10 bg-[var(--active-parent)]">
              <tr className="text-white uppercase tracking-wider text-[10px] font-extrabold border-b border-slate-200/60">
                <th className="w-[24%] py-4 px-6">Growth Group</th>
                <th className="w-[20%] py-4 px-6">Church & Cluster</th>
                <th className="w-[18%] py-4 px-6">Leader</th>
                <th className="w-[20%] py-4 px-6">Schedule & Venue</th>
                <th className="w-[8%] py-4 px-6 text-center">Demographic</th>
                <th className="w-[10%] py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {currentGrowthGroups.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 font-medium">
                    No growth groups found matching your criteria.
                  </td>
                </tr>
              ) : (
                currentGrowthGroups.map((gg : any) => (
                  <tr key={gg.id} className="hover:bg-slate-50/80 transition-colors group">
                    
                    {/* Name & Code */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs border border-emerald-200 group-hover:bg-[var(--active-parent,rgb(99,102,241))]/10 group-hover:text-[var(--active-parent,rgb(99,102,241))] group-hover:border-[var(--active-parent,rgb(99,102,241))] transition-colors">
                          <Sprout size={16} />
                        </div>
                        <div>
                          <p className={`text-[14px] font-semibold transition-colors ${
                            gg.is_active 
                              ? 'text-slate-800 group-hover:text-[var(--active-parent,rgb(99,102,241))]' 
                              : 'text-slate-400 line-through'
                          }`}>
                            {gg.name}
                          </p>
                          <p className={`text-[11px] font-medium ${gg.is_active ? 'text-slate-600' : 'text-slate-600'}`}>
                            {gg.code}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Hierarchy: Church & Cluster */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <Church size={13} className="text-indigo-500 flex-shrink-0" />
                        <span className='text-[13px]'>{gg.church.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5">
                        <MapPinned size={12} className="text-slate-400 flex-shrink-0" />
                        <span className='text-[11px]'>Cluster: <strong className="text-slate-700">{gg.cluster.name}</strong></span>
                      </div>
                    </td>

                    {/* Leader */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <ShieldUser size={13} className="text-emerald-600 flex-shrink-0" />
                        <span className='text-[13px]'>{gg.leader.first_name} {gg.leader.last_name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5">
                        <FaMobileAlt size={12} className="text-slate-400 flex-shrink-0" />
                        <span className="text-slate-400 text-mono text-[11px]">{gg.leader.mobile_number}</span>
                      </div>
                    </td>

                    {/* Schedule & Venue */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                        <CalendarClock  size={13} className="text-amber-500 flex-shrink-0" />
                        <span className='text-[13px]'>{gg.meeting_day} @ {formatTime(gg.meeting_time)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5">
                        {gg.location_type === 'onsite' ? (
                          <MapPinHouse size={12} className="text-rose-500 flex-shrink-0" />
                        ) : gg.location_type === 'hybrid' ? (
                          <FaLaptopHouse size={14} className="text-emerald-500 flex-shrink-0" />
                        ) : (
                          <FaLaptop size={12} className="text-blue-500 flex-shrink-0" />
                        )}
                        <span className="truncate max-w-[200px] text-[12px]" title={gg.venue_address}>{gg.venue_address}</span>
                      </div>
                    </td>

                    {/* Demographic */}
                    <td className="py-4 px-6 text-center">
                      <span className="capitalize px-2.5 py-1 bg-indigo-50 text-[var(--active-parent)] font-semibold rounded-lg text-[11px]">
                        {gg.target_demographic.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => alert(`Edit GG ID: ${gg.id}`)}
                          className="p-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-lg transition-colors"
                          title="Edit Growth Group"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button 
                          onClick={() => alert(`Delete GG ID: ${gg.id}`)}
                          className="p-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-lg transition-colors"
                          title="Delete Growth Group"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
        
        {/* 3. DYNAMIC PAGINATION FOOTER */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-100/50">
          <p className="text-xs text-slate-500 font-medium">
            Showing <span className="text-slate-800 font-bold">{meta?.from || 0}</span> to <span className="text-slate-800 font-bold">{meta?.to || 0}</span> of <span className="text-slate-800 font-bold">{meta?.total || 0}</span> entries
          </p>

          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={!meta || meta.current_page === 1} 
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              Prev
            </button>
            
            {meta && Array.from({ length: meta.last_page }, (_, i) => i + 1).map((page) => (
              <button 
                key={page} 
                onClick={() => setCurrentPage(page)} 
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${meta.current_page === page ? 'bg-[var(--active-parent,rgb(99,102,241))] text-white' : 'text-slate-600 hover:bg-slate-200'}`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => (!meta ? prev : Math.min(prev + 1, meta.last_page)))} 
              disabled={!meta || meta.current_page === meta.last_page || meta.last_page === 0} 
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      
      {isGrowthGroupModalOpen && (
        <GrowthGroupModal 
          isOpen={isGrowthGroupModalOpen}
          onClose={() => setIsGrowthGroupModalOpen(false)} 
          // GrowthGroupId={selectedGrowthGroupId}
        />
      )}
    </div>
  );
}