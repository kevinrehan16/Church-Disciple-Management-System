import { useState } from 'react';
import { FaChurch, FaCross } from "react-icons/fa";
import { 
  Pencil, Trash2, MapPin, Phone, Mail, Users, Layers, FingerprintPattern, 
  Plus, Star, Filter, ArrowUpDown, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { useChurches } from '../../hooks/useChurches';
import ModuleHeader from '../../components/ui/ModuleHeader';
import SearchInput from '../../components/inputs/SearchInput';

export default function Churches() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: apiResponse } = useChurches({
    search: searchTerm,
    page: currentPage,
  });

  const currentChurches = apiResponse?.data || [];
  const meta = apiResponse?.meta;
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (meta?.last_page || 1)) {
      setCurrentPage(newPage);
    }
  };

  // const [selectedChurchId, setSelectedChurchId] = useState<string | null>(null);
  // const [isChurchModalOpen, setIsChurchModalOpen] = useState(false);

  const handleViewChurch = (churchId?: string) => {
    // Open church modal (selected church id handled elsewhere)
    // setIsChurchModalOpen(true);
  };

  return (
    // PINALITAN: h-screen to h-full para di sumobra sa main app layout mo
    <div className="flex flex-col h-full overflow-hidden w-full bg-slate-50 text-slate-800">
      
      {/* -- FIXED HEADER AREA (Does not scroll) -- */}
      <div className="px-6 py-4 space-y-6 shrink-0">
        <ModuleHeader
          title="Churches"
          description="Manage all church locations and their active networks."
          icon={<FaChurch size={24} />}
          actions={
            <button 
              className="group flex items-center gap-2 px-5 py-2.5 bg-[#0284c7] hover:bg-[#026ca1] active:scale-95 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-rose-500/10"
              onClick={()=>handleViewChurch('')}
            >
              <Plus size={16} className="transition-transform group-hover:rotate-90" />
              Add New Church
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
            placeholder="Search church by information..."
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
      </div>

      {/* -- SCROLLABLE CARD AREA -- */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        
        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentChurches.map((church) => (
          <div 
              key={church.id} 
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between relative overflow-hidden group"
          >
              {/* Top Border Indicator */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${church.is_active ? 'bg-[var(--active-parent)]' : 'bg-slate-300'}`} />

              <div>
              {/* Card Header: Code, Main Campus Badge, & Animated Status Indicator */}
              <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200">
                          <FingerprintPattern size={12} className="fill-slate-500 text-slate-500" />
                          {church.code}
                        </span>
                        {church.is_main_campus && (
                        <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                            <Star size={12} className="fill-amber-500 text-amber-500" />
                            Main
                        </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[var(--active-parent)]/50 text-white rounded-full group-hover:bg-[var(--active-parent)]/80 group-hover:text-white transition-all shadow-sm">
                        <FaCross size={16} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-[var(--active-parent)] transition-colors">
                        {church.name}
                      </h3>
                    </div>
                  </div>

                  {/* 2. ANIMATED STATUS DOT (PULSING EFFECT) */}
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-full shrink-0">
                  <span className="relative flex h-2.5 w-2.5">
                      {church.is_active && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      )}
                      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${church.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600">
                      {church.is_active ? 'Active' : 'Inactive'}
                  </span>
                  </div>
              </div>

              {/* Stats Metrics Bar */}
              <div className="grid grid-cols-2 gap-3 my-4 p-3 bg-slate-50/80 rounded-lg border border-slate-100 group-hover:bg-[var(--active-parent)]/80 group-hover:border-[var(--active-parent)]/90">
                  <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-md">
                          <Layers size={18} />
                      </div>
                      <div>
                          <p className="text-xs text-slate-500 font-medium group-hover:text-white">Clusters</p>
                          <p className="text-sm font-bold text-slate-800">{church.clusters_count}</p>
                      </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-md">
                          <Users size={18} />
                      </div>
                      <div>
                          <p className="text-xs text-slate-500 font-medium group-hover:text-white">Growth Groups</p>
                          <p className="text-sm font-bold text-slate-800">{church.growth_groups_count}</p>
                      </div>
                  </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2 text-sm text-slate-600 mb-6">
                  <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
                  <span className="line-clamp-2">{church.address}</span>
                  </div>
                  {church.contact_number && (
                  <div className="flex items-center gap-2.5">
                      <Phone size={16} className="text-slate-400 shrink-0" />
                      <span>{church.contact_number}</span>
                  </div>
                  )}
                  {church.email && (
                  <div className="flex items-center gap-2.5">
                      <Mail size={16} className="text-slate-400 shrink-0" />
                      <span className="truncate">{church.email}</span>
                  </div>
                  )}
              </div>
              </div>

              {/* 3. EDIT & DELETE BUTTONS WITH HOVER BORDER & BACKGROUND */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-blue-600 text-xs font-semibold text-white hover:bg-blue-800 hover:border-blue-900 transition-all duration-200 active:scale-95"
                  onClick={()=> handleViewChurch(church.id)}
              >
                  <Pencil size={14} />
                  Edit
              </button>
              
              <button 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50/80 hover:border-rose-200 transition-all duration-200 active:scale-95"
              >
                  <Trash2 size={14} />
                  Delete
              </button>
              </div>

          </div>
          ))}
        </div>
      </div>
      
      {/* -- PAGINATION (FIXED BOTTOM) -- */}
      {meta && meta.last_page > 1 && (
        <div className="shrink-0 px-6 py-4 border-t border-slate-200 bg-white flex flex-col md:flex-row items-center justify-between gap-4 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="text-sm text-slate-600">
            Showing <span className="font-semibold text-slate-800">{meta.from || 0}</span> to <span className="font-semibold text-slate-800">{meta.to || 0}</span> of <span className="font-semibold text-slate-800">{meta.total}</span> entries
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            
            <span className="text-sm font-semibold text-slate-700 px-3">
              Page {currentPage} of {meta.last_page}
            </span>

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === meta.last_page}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}


      {/* {isChurchModalOpen && (
        <ChurchModal 
        isOpen={isChurchModalOpen}
        onClose={() => setIsChurchModalOpen(false)} 
        // churchId={selectedChurchId}
        />
      )} */}
    </div>
  );
}