import { useState, useEffect } from 'react';
import { FaMapMarkedAlt } from "react-icons/fa";
import { Plus, Star, Filter, ArrowUpDown, FingerprintPattern, Database, ChevronDown, ShieldUser, Church, Pencil, Trash2, MapPinHouse, MapPin, ChevronLeft, ChevronRight, Phone, Clover, Users } from 'lucide-react';
import { useClusters } from '../../hooks/useClusters';
import ClusterModal from '../../components/modals/clusterModals/ClusterModal';
import ModuleHeader from '../../components/ui/ModuleHeader';
import SearchInput from '../../components/inputs/SearchInput';
import { useAuth } from '../../contexts/AuthContext';

export default function Clusters() {
  const { user } = useAuth();
  const userChurchId = user?.member?.church_id;

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isClusterModalOpen, setIsClusterModalOpen] = useState(false);
  
  // States para sa pagpasa ng konteksto sa Modal (Church ID at Cluster ID)
  const [selectedChurchId, setSelectedChurchId] = useState<number | null>(null);
  const [selectedClusterId, setSelectedClusterId] = useState<string | number | null>(null);
  
  // State para sa mga naka-open na accordion
  const [openChurchIds, setOpenChurchIds] = useState<number[]>([]);

  const { data: apiResponse } = useClusters({
    search: searchTerm,
    page: currentPage,
  });
  
  const currentClusters = (apiResponse as any)?.data || (Array.isArray(apiResponse) ? apiResponse : []);
  const meta = (apiResponse as any)?.meta;

  // Tinitiyak na bubukas ang church ng user kapag na-load na ang data
  useEffect(() => {
    if (userChurchId && currentClusters.length > 0) {
      setOpenChurchIds((prev) => {
        if (!prev.includes(userChurchId)) {
          return [...prev, userChurchId];
        }
        return prev;
      });
    }
  }, [userChurchId, currentClusters]);

  const handleOpenModal = (churchId?: number | null, clusterId?: string | number | null) => {
    setSelectedChurchId(churchId || null);
    setSelectedClusterId(clusterId || null);
    setIsClusterModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (meta?.last_page || 1)) {
      setCurrentPage(newPage);
    }
  };

  const toggleAccordion = (id: number) => {
    setOpenChurchIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Pag-sort ng churches para laging ang church ng naka-login na user ang nasa pinakataas
  const sortedClusters = [...currentClusters].sort((a: any, b: any) => {
    if (a.id === userChurchId) return -1;
    if (b.id === userChurchId) return 1;
    return 0;
  });

  const filteredData = sortedClusters.filter((church: any) => {
    const matchChurch = church.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCluster = church.clusters.some((c: any) => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchChurch || matchCluster;
  });
  
  return (
    <div className="flex flex-col h-full w-full bg-slate-50 text-slate-800 overflow-hidden">
      
      <div className="shrink-0 space-y-6 px-6 pt-4 pb-2">
        <ModuleHeader
          title="Clusters"
          description="Centralized management of visitor profiles, visit history, follow-up activities, and church engagement."
          icon={<FaMapMarkedAlt size={24} />}
          // actions={
          //   <button 
          //     className="group flex items-center gap-2 px-5 py-2.5 bg-[#0284c7] hover:bg-[#026ca1] active:scale-95 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-rose-500/10"
          //     onClick={() => handleOpenModal()}
          //   >
          //     <Plus size={16} className="transition-transform group-hover:rotate-90" />
          //     Add New Cluster
          //   </button>
          // }
        />

        <div className="flex flex-col md:flex-row items-center gap-4 justify-between w-full bg-transparent">
          <SearchInput 
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
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
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 px-6 pb-6 pt-2 scroll-smooth">
        <div className="w-full space-y-4">
          
          {filteredData.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-500 font-medium">No churches or clusters found.</p>
            </div>
          )}

          {filteredData.map((church : any) => {
            const isOpen = openChurchIds.includes(church.id);

            return (
              <div 
                key={church.id} 
                className={`bg-white rounded-2xl border border-slate-200 shadow-[0_2px_10px_-3px_rgba(2,132,199,0.05)] overflow-hidden transition-all duration-300 ${isOpen ? '!border-[var(--active-parent,rgb(99,102,241))]' : 'bg-slate-200'}`}
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleAccordion(church.id)}
                  role="button"
                  tabIndex={0}
                  className={`w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left cursor-pointer group ${isOpen ? '!bg-slate-200' : 'bg-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-colors border border-slate-200 bg-slate-100 text-slate-500 group-hover:bg-[var(--active-parent,rgb(99,102,241))]/10 group-hover:text-[var(--active-parent,rgb(99,102,241))] group-hover:border-[var(--active-parent,rgb(99,102,241))] transition-colors`}>
                      <Church size={22} />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-[var(--active-parent,rgb(99,102,241))]">{church.name}</h3>
                        {church.is_main_campus && (
                          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                            <Star size={12} className="fill-amber-500 text-amber-500" />
                            Main
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                        <span className="flex items-center gap-1"><FingerprintPattern size={13} className='text-cyan-600'/> {church.code}</span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1"><MapPin size={13} className='text-rose-600'/> {church.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Add Cluster Button (Safe na ito ngayon kasi nasa loob na siya ng div wrapper, hindi na sa button) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Pinipigilan ma-trigger ang accordion toggle ng div
                        handleOpenModal(church.id);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[var(--active-parent,rgb(99,102,241))] hover:opacity-90 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      <Plus size={14} /> Add Cluster
                    </button>

                    <div className="flex items-center gap-2 text-sm font-semibold text-[var(--active-parent,rgb(99,102,241))] bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                      <Database size={14} />
                      {church.clusters.length} {church.clusters.length > 1 ? "Clusters" : "Cluster"}
                    </div>
                    <div className={`p-2 rounded-full transition-transform duration-300 border border-slate-200 ${isOpen ? 'rotate-180 bg-slate-100 text-slate-600' : 'bg-white text-slate-400 hover:bg-slate-50'}`}>
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </div>

                {/* Accordion Body */}
                <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <div className="p-6 pt-0 border-t border-slate-100 bg-slate-50/30">
                      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                        
                        {church.clusters?.length > 0 ? (
                          church.clusters.map((cluster: any) => (
                            <div 
  key={cluster.id} 
  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[var(--active-parent,rgb(99,102,241))] hover:shadow-xl hover:shadow-sky-500/5 transition-all group relative overflow-hidden flex flex-col justify-between"
>
  {/* Active Status Left Indicator Bar */}
  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${cluster.is_active ? 'bg-[var(--active-parent,rgb(99,102,241))]' : 'bg-slate-300'}`} />
  
  <div>
    {/* Top Header: Code & Active Status */}
    <div className="flex items-start justify-between mb-3 pl-2">
      <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
        {cluster.code}
      </span>
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold ${cluster.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${cluster.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
        {cluster.is_active ? 'Active' : 'Inactive'}
      </span>
    </div>

    {/* Cluster Name */}
    <div className="pl-2 space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-[var(--active-parent)]/50 text-white rounded-full group-hover:bg-[var(--active-parent)]/80 group-hover:text-white transition-all shadow-sm">
          <MapPinHouse size={18} />
        </div>
        <h4 className="text-lg font-bold text-slate-900 group-hover:text-[var(--active-parent,rgb(99,102,241))] transition-colors">
          {cluster.name} Cluster
        </h4>
      </div>

      {/* Stats Section: Growth Groups & Members Count */}
      <div className="grid grid-cols-2 gap-3 my-4 p-3 bg-slate-50/80 rounded-lg border border-slate-100 group-hover:bg-[var(--active-parent)]/80 group-hover:border-[var(--active-parent)]/90">
        <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-md">
                <Clover size={18} />
            </div>
            <div>
                <p className="text-xs text-slate-500 font-medium group-hover:text-white">Growth Group</p>
                <p className="text-sm font-bold text-slate-800">{cluster.growth_groups_count ?? 0}</p>
            </div>
        </div>

        <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-md">
                <Users size={18} />
            </div>
            <div>
                <p className="text-xs text-slate-500 font-medium group-hover:text-white">Members</p>
                <p className="text-sm font-bold text-slate-800">{cluster.members_count ?? 0}</p>
            </div>
        </div>
      </div>

      {/* Cluster Head / Mentor Info */}
      <div className="pt-2 space-y-2 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs font-medium text-slate-600">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-100 text-slate-500 rounded-md shrink-0">
              <ShieldUser size={14} className='text-cyan-600' />
            </div>
            <span className="font-semibold text-xs text-slate-700 leading-tight">
              {cluster.cluster_mentor?.full_name || 'No Head Assigned'}
              <br /> 
              <span className="text-[10px] font-medium text-slate-400">Mentor Leader</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-100 text-slate-500 rounded-md shrink-0">
              <Phone size={14} className='text-emerald-600' />
            </div>
            <span className="font-semibold text-slate-700 leading-tight">
              {cluster.cluster_mentor?.mobile || 'No Contact'}
              <br /> 
              <span className="text-[10px] font-medium text-slate-400">Contact</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Card Footer: Action Buttons */}
  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2 pl-2">
    <button 
      onClick={() => handleOpenModal(church.id, cluster.id)}
      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 transition-all duration-200 active:scale-95 shadow-sm"
    >
      <Pencil size={14} /> Edit
    </button>
    <button 
      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50/80 hover:border-rose-200 transition-all duration-200 active:scale-95 shadow-sm"
    >
      <Trash2 size={14} /> Delete
    </button>
  </div>
</div>
                          ))
                        ) : (
                          <div className="col-span-full py-12 px-4 bg-slate-50/70 border border-dashed border-slate-200 rounded-3xl text-center flex flex-col items-center justify-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400">
                              <MapPinHouse size={22} />
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="text-sm font-bold text-slate-800">No clusters found yet</h4>
                              <p className="text-xs text-slate-400 max-w-xs">There are no registered clusters under this church at the moment.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            );
          })}
        </div>
      </div>

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
      
      {isClusterModalOpen && (
        <ClusterModal 
          isOpen={isClusterModalOpen}
          onClose={() => setIsClusterModalOpen(false)} 
          clusterId={selectedClusterId}
          defaultChurchId={selectedChurchId || undefined}
        />
      )}
    </div>
  );
}