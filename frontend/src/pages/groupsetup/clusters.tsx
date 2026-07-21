import { useState } from 'react';
import { FaMapMarkedAlt } from "react-icons/fa";
import { Plus, Star, Filter, ArrowUpDown, FingerprintPattern, Database, ChevronDown, ShieldUser, Church, Pencil, Trash2, MapPinHouse, MapPin } from 'lucide-react';
import { useClusters } from '../../hooks/useClusters';
import ModuleHeader from '../../components/ui/ModuleHeader';
import SearchInput from '../../components/inputs/SearchInput';
import { TableLoading, TableError, TableEmpty } from '../../components/ui/TableStates';

export default function Clusters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: apiResponse, isLoading, isError, refetch } = useClusters({
    search: searchTerm,
    page: currentPage,
  });
  
  const currentClusters = apiResponse?.data || [];
  const meta = apiResponse?.meta;

  console.log(currentClusters);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (meta?.last_page || 1)) {
      setCurrentPage(newPage);
    }
  };
  
  // Awtomatikong kunin ang ID ng Main Campus para i-open agad
  const mainCampusIds = currentClusters
    .filter(church => church.is_main_campus)
    .map(church => church.id);

  const [openChurchIds, setOpenChurchIds] = useState<number[]>(mainCampusIds);

  // Toggle Function
  const toggleAccordion = (id: number) => {
    setOpenChurchIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Filter Logic (Frontend mockup for the search bar)
  const filteredData = currentClusters.filter(church => {
    const matchChurch = church.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCluster = church.clusters.some(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchChurch || matchCluster;
  });
  
  return (
    /* 1. ROOT CONTAINER: Nilagyan ng h-full, flex-col, at overflow-hidden para hindi mag-scroll ang body */
    <div className="flex flex-col h-full w-full bg-slate-50 text-slate-800 overflow-hidden">
      
      {/* 2. HEADER & SEARCH SECTION: Naka-shrink-0 para hindi lumiit at laging nasa taas */}
      <div className="shrink-0 space-y-6 px-6 pt-4 pb-2">
        <ModuleHeader
          title="Clusters"
          description="Centralized management of visitor profiles, visit history, follow-up activities, and church engagement."
          icon={<FaMapMarkedAlt size={24} />}
          actions={
            <button 
              className="group flex items-center gap-2 px-5 py-2.5 bg-[#0284c7] hover:bg-[#026ca1] active:scale-95 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-rose-500/10"
              // onClick={() => handleViewVisitor('')}
            >
              <Plus size={16} className="transition-transform group-hover:rotate-90" />
              Add New Visitor
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
      </div>

      {/* 3. SCROLLABLE AREA: Dito lang iikot ang scroll bar (flex-1 overflow-y-auto min-h-0) */}
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
                <button
                  onClick={() => toggleAccordion(church.id)}
                  className={`w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left group ${isOpen ? '!bg-slate-200' : 'bg-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-colors bg-slate-100 text-slate-500 group-hover:bg-[var(--active-parent,rgb(99,102,241))]/10 group-hover:text-[var(--active-parent,rgb(99,102,241))] group-hover:border-[var(--active-parent,rgb(99,102,241))] transition-colors`}>
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
                        <span className="flex items-center gap-1"><FingerprintPattern size={13}/> {church.code}</span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1"><MapPin size={13}/> {church.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                      <Database size={14} className="text-slate-400" />
                      {church.clusters.length} {church.clusters.length > 1 ? "Clusters" : "Cluster"}
                    </div>
                    <div className={`p-2 rounded-full transition-transform duration-300 border border-slate-200 ${isOpen ? 'rotate-180 bg-slate-100 text-slate-600' : 'bg-white text-slate-400 hover:bg-slate-50'}`}>
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </button>

                {/* Accordion Body */}
                <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <div className="p-6 pt-0 border-t border-slate-100 bg-slate-50/30">
                      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                        
                        {church.clusters.map((cluster) => (
                          <div 
                            key={cluster.id} 
                            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[var(--active-parent,rgb(99,102,241))] hover:shadow-lg hover:shadow-sky-500/5 transition-all group relative overflow-hidden flex flex-col justify-between"
                          >
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${cluster.is_active ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                            <div>
                              <div className="flex items-start justify-between mb-3 pl-2">
                                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                                  {cluster.code}
                                </span>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold ${cluster.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${cluster.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                  {cluster.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </div>

                              {/* INAYOS NA DESIGN NG ICON AT HEADER */}
                              <div className="pl-2 space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="p-1.5 bg-sky-50 text-rose-700 rounded-lg">
                                    <MapPinHouse size={16} />
                                  </div>
                                  <h4 className="text-base font-bold text-slate-900 group-hover:text-[var(--active-parent,rgb(99,102,241))] transition-colors">
                                    {cluster.name} Cluster
                                  </h4>
                                </div>

                                {/* BAGONG FIELD PARA SA HEAD / FULLNAME NG TAO */}
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 pt-1">
                                  <div className="p-1.5 bg-slate-100 text-slate-500 rounded-md">
                                    <ShieldUser size={16} />
                                  </div>
                                  <span>{cluster.head_name || 'No Head Assigned'}</span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2 pl-2">
                              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-blue-600 text-xs font-semibold text-white hover:bg-blue-800 hover:border-blue-900 transition-all duration-200 active:scale-95">
                                <Pencil size={14} /> Edit
                              </button>
                              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50/80 hover:border-rose-200 transition-all duration-200 active:scale-95">
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            );
          })}
        </div>
      </div>
      
      {/* {isVisitorModalOpen && (
        <VisitorModal 
          isOpen={isVisitorModalOpen}
          onClose={() => setIsVisitorModalOpen(false)} 
          visitorId={selectedVisitorId}
        />
      )} */}
    </div>
  );
}