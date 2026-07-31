import { useState } from 'react';
import { FaFacebookSquare, FaMobile, FaEnvelope, FaUserFriends } from "react-icons/fa";
import { Plus, Search, Filter, ArrowUpDown, Mars, Venus, Eye, Calendar, Clock } from 'lucide-react';
import ModuleHeader from '../../components/ui/ModuleHeader';
import SearchInput from '../../components/inputs/SearchInput';
import { TableLoading, TableError, TableEmpty } from '../../components/ui/TableStates';
import { useVisitors } from '../../hooks/useVisitors';
import { getLifestageStyles } from '../../utils/formatters';
import VisitorModal from '../../components/modals/visitorModals/VisitorModal';

export default function Visitors() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [selectedVisitorId, setSelectedVisitorId] = useState<number>(0);

  // BUG FIX: Tanggalin ang useState dito. Gawin na lang normal object.
  // Tuwing magbabago ang searchTerm o currentPage, magre-re-render ang component 
  // at kusa itong mag-u-update at ipapasa sa useVisitors.
  const filters = {
    page: currentPage,
    search: searchTerm,
  };
  
  const { data: visitorData, isLoading, isError, refetch } = useVisitors(filters);
  
  const currentVisitors = visitorData?.data || [];
  const meta = visitorData?.meta;


  const handleViewVisitor = (id?: number) => {
    setSelectedVisitorId(id ?? 0);
    setIsVisitorModalOpen(true);
  };
  
  return (
    <div className="w-full bg-slate-50 text-slate-800 px-6 py-4 space-y-6">
      
      <ModuleHeader
        title="Visitors"
        description="Centralized management of visitor profiles, visit history, follow-up activities, and church engagement."
        icon={<FaUserFriends size={24} />}
        actions={
          <button 
            className="group flex items-center gap-2 px-5 py-2.5 bg-[#0284c7] hover:bg-[#026ca1] active:scale-95 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-rose-500/10"
            onClick={() => handleViewVisitor('')}
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

      <div className="w-full bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-y-auto overflow-x-auto h-[calc(100vh-325px)] border border-slate-200/60 rounded-lg">
            <table className="w-full text-left text-sm border-separate border-spacing-0">
                <thead className="sticky top-0 z-10 bg-[var(--active-parent,rgb(99,102,241))]">
                  <tr className="text-white uppercase tracking-wider text-[10px] font-extrabold border-b border-slate-200/60">
                    <th className="w-[25%] px-6 py-4">Visitor Details</th>
                    <th className="w-[14%] px-6 py-4 text-center">Age Group</th>
                    <th className="w-[8%] px-6 py-4">Gender</th>
                    <th className="w-[8%] px-6 py-4 text-center">Life-Stage</th>
                    <th className="w-[15%] px-6 py-4">Contacts</th>
                    <th className="w-[15%] px-6 py-4">Visited Schedule</th>
                    <th className="w-[10%] px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                {isLoading ? (
                  <TableLoading rows={5} columns={8} />
                ) : isError ? (
                  <TableError colSpan={8} onRetry={() => refetch()} />
                ) : currentVisitors.length > 0 ? (
                  currentVisitors.map((visitor: any) => (
                    <tr 
                      key={visitor.id} 
                      className="group hover:bg-indigo-50/50 transition-all duration-200 ease-in-out border-b border-slate-50 last:border-0"
                    >
                      {/* 1. Visitor Details */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs border border-slate-200 group-hover:bg-[var(--active-parent,rgb(99,102,241))]/10 group-hover:text-[var(--active-parent,rgb(99,102,241))] group-hover:border-[var(--active-parent,rgb(99,102,241))] transition-colors">
                            {visitor.firstName?.[0]}{visitor.lastName?.[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 group-hover:text-[var(--active-parent,rgb(99,102,241))] transition-colors">
                              {visitor.fullName}
                            </p>
                            <p className="text-[11px] font-mono text-slate-400">
                              {visitor.visitorId}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 2. Age Group */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-600 w-full">
                          {visitor.ageGroup}
                        </span>
                      </td>

                      {/* 3. Gender */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                          {visitor.gender === 'Male' ? (
                            <Mars size={14} className="text-blue-400" />
                          ) : (
                            <Venus size={14} className="text-pink-400" />
                          )}
                          {visitor.gender}
                        </div>
                      </td>

                      {/* 4. Life-Stage */}
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border tracking-wider uppercase ${getLifestageStyles(visitor.lifeStage)}`}>
                          {visitor.lifeStage}
                        </span>
                      </td>

                      {/* 5. Contacts */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-slate-500">
                            <FaEnvelope size={11} className="text-rose-400" />
                            <span className="text-xs truncate max-w-[200px]">{visitor.email || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-500">
                            <FaMobile size={11} className="text-cyan-500" />
                            <span className="text-xs font-mono">{visitor.mobileNumber || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-500">
                            <FaFacebookSquare size={11} className="text-blue-500" />
                            <span className="text-xs font-mono">{visitor.facebookName || 'N/A'}</span>
                          </div>
                        </div>
                      </td>

                      {/* 6. Visited Schedule */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <p className="flex items-center gap-1 text-sm font-mono text-slate-800"><Calendar size={10}/> {visitor.dateVisited}</p>
                          <p className="flex items-center gap-1 text-[10px] text-slate-400 font-medium tracking-wider"><Clock size={10}/> ({visitor.serviceTime}) <span className='capitalize'>Service</span></p>
                        </div>
                      </td>

                      {/* 8. Actions */}
                      <td className="px-6 py-4 text-center">
                        <button 
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-indigo-500 hover:text-white transition-all duration-200 active:scale-95 shadow-sm"
                          onClick={()=>handleViewVisitor(visitor.id)}
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <TableEmpty colSpan={8} />
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
      
      {isVisitorModalOpen && (
        <VisitorModal 
          isOpen={isVisitorModalOpen}
          onClose={() => setIsVisitorModalOpen(false)} 
          visitorId={selectedVisitorId}
        />
      )}
    </div>
  );
}