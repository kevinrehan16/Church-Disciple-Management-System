import { useState } from 'react';
import {FaMapMarkedAlt, FaLaptopHouse, FaLaptop, FaUserShield, FaUsers, FaMobileAlt, FaUserPlus, FaEye} from 'react-icons/fa';
import ModuleHeader from '../../components/ui/ModuleHeader';
import SearchInput from '../../components/inputs/SearchInput';

export default function ClusterGroupMembers() {

  return (
    <div className="flex flex-col h-full overflow-hidden w-full bg-slate-50 text-slate-800">
      
      {/* -- FIXED HEADER AREA -- */}
      <div className="px-6 py-4 space-y-4 shrink-0">
        <ModuleHeader
          title="Cluster Group Members"
          description="Monitor and organize cluster groups, leadership structures, and schedules."
          icon={<FaMapMarkedAlt size={24} />}
          
        />

        <div className="flex flex-col md:flex-row items-center gap-4 justify-between w-full bg-transparent">
          <SearchInput 
            // value={searchTerm}
            onChange={(val) => {
            //   setSearchTerm(val);
            //   setCurrentPage(1);
            }}
            placeholder="Search group name, code, or leader..."
          />
          
        </div>
      </div>

      {/* -- SCROLLABLE CARD AREA -- */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-1">
          
        </div>
      </div>
      
      {/* -- PAGINATION FOOTER -- */}
      {/* <div className="shrink-0 w-full m-0 px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between rounded-none shadow-sm">
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
              className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm ${currentPage === page ? 'bg-[var(--active-parent,rgb(99,102,241))] text-white shadow-sky-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
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
      </div> */}

    </div>
  );
}