import { useState } from 'react';
import { FaKey } from 'react-icons/fa';
import { KeyRound, Plus, Filter, ArrowUpDown, ShieldCheck, Trash2, LockKeyhole, Loader2 } from 'lucide-react';
import ModuleHeader from '../../components/ui/ModuleHeader';
import SearchInput from '../../components/inputs/SearchInput';
import { usePermissions, useDeletePermission } from '../../hooks/usePermissions';

export default function Permissions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // 1. React Query Hook para sa Fetching
  const { data, isLoading, isError, isFetching } = usePermissions({
    page: currentPage,
    search: searchTerm,
    per_page: 10,
  });

  // 2. React Query Hook para sa Delete Action
  const { mutate: deletePermission, isPending: isDeleting } = useDeletePermission();

  const permissions = data?.data || [];
  const meta = data?.meta;

  // Handle Search Input Change (Nire-reset sa Page 1 tuwing nagta-type)
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  // Handle Delete Button Click
  const handleDelete = (id: number, name: string) => {
    if (confirm(`Sigurado ka bang gusto mong i-delete ang permission na "${name}"?`)) {
      deletePermission(id);
    }
  };

  return (
    <div className="w-full bg-slate-50 text-slate-800 px-6 py-4 space-y-6">
      
      {/* MODULE HEADER */}
      <ModuleHeader
        title="Permissions Master List"
        description="Define and manage granular system capabilities and security privileges."
        icon={<FaKey size={24} />}
        actions={
          <button 
            className="group flex items-center gap-2 px-5 py-2.5 bg-[#0284c7] hover:bg-[#026ca1] active:scale-95 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-sky-500/10"
            onClick={() => alert("Open Add Permission Modal")}
          >
            <Plus size={16} className="transition-transform group-hover:rotate-90" />
            Add New Permission
          </button>
        }
      />

      {/* SEARCH & FILTER CONTROLS */}
      <div className="flex flex-col md:flex-row items-center gap-4 justify-between w-full bg-transparent">
        <div className="w-full md:w-96">
          <SearchInput 
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search permission name..."
          />
        </div>
        
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-600 rounded-xl text-sm font-semibold shadow-sm transition-all">
            <Filter size={14} /> Advanced Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-600 rounded-xl text-sm font-semibold shadow-sm transition-all">
            <ArrowUpDown size={14} /> Sort By
          </button>
        </div>
      </div>

      {/* TABLE DATA */}
      <div className="w-full bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-y-auto overflow-x-auto h-[calc(100vh-325px)] border border-slate-200/60 rounded-lg relative">
          <table className="w-full text-left text-sm border-separate border-spacing-0">
            <thead className="sticky top-0 z-10 bg-[var(--active-parent,rgb(99,102,241))]">
              <tr className="text-white uppercase tracking-wider text-[10px] font-extrabold border-b border-slate-200/60">
                <th className="w-[30%] px-6 py-4">Permission Name</th>
                <th className="w-[20%] px-6 py-4 text-center">Guard Name</th>
                <th className="w-[35%] px-6 py-4">Assigned Roles</th>
                <th className="w-[15%] px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2 font-medium">
                      <Loader2 size={18} className="animate-spin text-indigo-500" />
                      Loading permissions from server...
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-rose-500 font-medium">
                    Failed to fetch permissions. Please check your API connection or refresh.
                  </td>
                </tr>
              ) : permissions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">
                    No permissions found {searchTerm ? `matching "${searchTerm}"` : ''}.
                  </td>
                </tr>
              ) : (
                permissions.map((permission) => (
                  <tr 
                    key={permission.id} 
                    className="group hover:bg-indigo-50/50 transition-all duration-200 ease-in-out border-b border-slate-50 last:border-0"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs border border-slate-200 group-hover:bg-[var(--active-parent,rgb(99,102,241))]/10 group-hover:text-[var(--active-parent,rgb(99,102,241))] group-hover:border-[var(--active-parent,rgb(99,102,241))] transition-colors">
                          <KeyRound size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 group-hover:text-[var(--active-parent,rgb(99,102,241))] transition-colors font-mono text-xs">
                            {permission.name}
                          </p>
                          <p className="text-[11px] font-mono text-slate-400">ID: #{permission.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 font-mono">
                        <LockKeyhole size={10} className="text-slate-400" />
                        {permission.guard_name || 'web'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {permission.roles && permission.roles.length > 0 ? (
                          permission.roles.map((role, index) => (
                            <span 
                              key={index} 
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 uppercase"
                            >
                              <ShieldCheck size={10} />
                              {role}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">Unassigned</span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button 
                        disabled={isDeleting}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white transition-all duration-200 active:scale-95 shadow-sm disabled:opacity-50"
                        onClick={() => handleDelete(permission.id, permission.name)}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* DYNAMIC PAGINATION CONTROLS */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-100/50">
          <p className="text-xs text-slate-500 font-medium">
            Showing <span className="text-slate-800 font-bold">{meta?.from ?? 0}</span> to <span className="text-slate-800 font-bold">{meta?.to ?? 0}</span> of <span className="text-slate-800 font-bold">{meta?.total ?? 0}</span> entries
          </p>
          
          <div className="flex items-center gap-1">
            <button 
              disabled={currentPage === 1 || isLoading || isFetching}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Prev
            </button>
            
            <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--active-parent,rgb(99,102,241))] text-white shadow-sm">
              {currentPage}
            </button>

            <button 
              disabled={!meta || currentPage === meta.last_page || isLoading || isFetching}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}