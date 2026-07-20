import { useState } from 'react';
import { FaFacebookSquare, FaMobile, FaEnvelope, FaUserFriends, FaBible } from "react-icons/fa";
import { Plus, Search, Filter, ArrowUpDown, Mars, Venus, Eye, Calendar, Clock } from 'lucide-react';
import ModuleHeader from '../../components/ui/ModuleHeader';
import SearchInput from '../../components/inputs/SearchInput';
import { TableLoading, TableError, TableEmpty } from '../../components/ui/TableStates';
import { getLifestageStyles } from '../../utils/formatters';

export default function GrowthGroups() {
  
  return (
    <div className="w-full bg-slate-50 text-slate-800 px-6 py-4 space-y-6">
      
      <ModuleHeader
        title="Growth Groups"
        description="Centralized management of visitor profiles, visit history, follow-up activities, and church engagement."
        icon={<FaBible size={24} />}
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
        //   value={searchTerm}
        //   onChange={(val) => {
            // setSearchTerm(val);
            // setCurrentPage(1); // I-reset sa Page 1 tuwing nag-a-update ang search
        //   }}
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
                
              </tbody>
            </table>
        </div>
        
        {/* 3. DYNAMIC PAGINATION FOOTER */}
        {/* <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-100/50">
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
        </div> */}
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