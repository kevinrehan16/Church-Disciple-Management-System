import { useState } from 'react';
import { FaUserShield } from 'react-icons/fa';
import { 
  ShieldUser, 
  Plus, 
  Key, 
  Edit3, 
  Trash2, 
  Loader2, 
  ShieldAlert,
  LockKeyhole
} from 'lucide-react';
import { getPageNumbers } from '../../utils/pagination';
import ModuleHeader from '../../components/ui/ModuleHeader';
import SearchInput from '../../components/inputs/SearchInput';
import RoleModal from '../../components/modals/roleModals/RoleModal';
import { useRoles, useDeleteRole } from '../../hooks/useRoles';
import type { Role } from '../../types/typeRole';

export default function Roles() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State para sa pag-expand/show ng natatagong permissions kada role
  const [expandedRoleIds, setExpandedRoleIds] = useState<number[]>([]);

  // API Hooks
  const { data: rolesResponse, isLoading, isError, isFetching } = useRoles({
    page: currentPage,
    search: searchTerm,
    per_page: 10,
  });

  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole();

  // Pagkuha ng data at pagination properties mula sa root level o meta man yan
  const roles = rolesResponse?.data || [];
  
  // Sinusuportahan pareho ang standard Laravel pagination (root level) at Resource Collection (meta)
  const lastPage = rolesResponse?.last_page || rolesResponse?.meta?.last_page || 1;
  const totalEntries = rolesResponse?.total ?? rolesResponse?.meta?.total ?? roles.length;
  const fromEntry = rolesResponse?.from ?? rolesResponse?.meta?.from ?? (roles.length > 0 ? 1 : 0);
  const toEntry = rolesResponse?.to ?? rolesResponse?.meta?.to ?? roles.length;

  // Toggle Function para sa +X Permission Badges
  const toggleExpandRole = (roleId: number) => {
    setExpandedRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1); // Ibalik sa page 1 kapag naghahanap
  };

  const handleDelete = (role: Role) => {
    if (role.name === 'superadmin' || role.name === 'super_admin') {
      alert('System Protection: You cannot delete the Super Admin role.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete the "${role.name}" role?`)) {
      deleteRole(role.id);
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (role: Role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full bg-slate-50 text-slate-800 px-6 py-4 space-y-6">
      
      {/* MODULE HEADER */}
      <ModuleHeader
        title="Roles Management"
        description="Create and manage user roles, define access levels, and assign dynamic permissions."
        icon={<FaUserShield size={24} />}
        actions={
          <button 
            type="button"
            className="group flex items-center gap-2 px-5 py-2.5 bg-[#0284c7] hover:bg-[#026ca1] active:scale-95 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-sky-500/10"
            onClick={handleOpenCreateModal}
          >
            <Plus size={16} className="transition-transform group-hover:rotate-90" />
            Add New Role
          </button>
        }
      />

      {/* SEARCH & FILTER CONTROLS */}
      <div className="flex flex-col md:flex-row items-center gap-4 justify-between w-full bg-transparent">
        <div className="w-full md:w-96">
          <SearchInput 
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search role name..."
          />
        </div>
      </div>

      {/* TABLE DATA CONTAINER */}
      <div className="w-full bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-y-auto overflow-x-auto h-[calc(100vh-325px)] border border-slate-200/60 rounded-lg">
          <table className="w-full text-left text-sm border-separate border-spacing-0">
            
            {/* THEME BASED HEADER */}
            <thead className="sticky top-0 z-10 bg-[var(--active-parent,rgb(99,102,241))]">
              <tr className="text-white uppercase tracking-wider text-[10px] font-extrabold border-b border-slate-200/60">
                <th className="w-[20%] px-6 py-4">Role Name</th>
                <th className="w-[55%] px-6 py-4">Assigned Permissions</th>
                <th className="w-[15%] px-6 py-4 text-center">Guard Name</th>
                <th className="w-[10%] px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {/* LOADING SKELETON */}
              {isLoading && (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200" />
                        <div className="space-y-1.5">
                          <div className="w-24 h-3.5 bg-slate-200 rounded" />
                          <div className="w-12 h-2.5 bg-slate-100 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5">
                        <div className="w-20 h-6 bg-slate-200 rounded-md" />
                        <div className="w-24 h-6 bg-slate-200 rounded-md" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="w-16 h-5 bg-slate-200 rounded-full mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="w-16 h-8 bg-slate-200 rounded-lg mx-auto" />
                    </td>
                  </tr>
                ))
              )}

              {/* ERROR STATE */}
              {isError && !isLoading && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-rose-500">
                    <div className="flex flex-col items-center gap-2">
                      <ShieldAlert size={28} />
                      <p className="font-semibold text-xs">Failed to load roles. Please try again.</p>
                    </div>
                  </td>
                </tr>
              )}

              {/* EMPTY STATE */}
              {!isLoading && !isError && roles.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-sm text-slate-600">No Roles Found</p>
                    <p className="text-xs text-slate-400 mt-1">Try searching for another term or create a new role.</p>
                  </td>
                </tr>
              )}

              {/* DATA ROWS */}
              {!isLoading && !isError && roles.map((role) => {
                const isSystemRole = role.name === 'superadmin' || role.name === 'super_admin';
                const isExpanded = expandedRoleIds.includes(role.id);
                
                const displayedPermissions = isExpanded 
                  ? (role.permissions || []) 
                  : (role.permissions?.slice(0, 4) || []);
                
                const hiddenCount = (role.permissions?.length || 0) - 4;

                return (
                  <tr 
                    key={role.id} 
                    className="group hover:bg-indigo-50/50 transition-all duration-200 ease-in-out border-b border-slate-50 last:border-0"
                  >
                    {/* ROLE NAME */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs border border-slate-200 group-hover:bg-[var(--active-parent,rgb(99,102,241))]/10 group-hover:text-[var(--active-parent,rgb(99,102,241))] group-hover:border-[var(--active-parent,rgb(99,102,241))] transition-colors">
                          <ShieldUser size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 group-hover:text-[var(--active-parent,rgb(99,102,241))] transition-colors capitalize">
                            {role.name.replace(/_/g, ' ')}
                          </p>
                          <p className="text-[11px] font-mono text-slate-400">ID: {role.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* ASSIGNED PERMISSIONS */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5 max-w-xl">
                        {role.permissions && role.permissions.length > 0 ? (
                          <>
                            {displayedPermissions.map((perm) => (
                              <span 
                                key={perm.id} 
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
                              >
                                <Key size={10} className="text-indigo-500 flex-shrink-0" />
                                {perm.name}
                              </span>
                            ))}

                            {!isExpanded && hiddenCount > 0 && (
                              <button
                                type="button"
                                onClick={() => toggleExpandRole(role.id)}
                                className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-slate-400 text-white border border-slate-300 hover:bg-indigo-600 hover:border-indigo-600 transition-colors shadow-sm cursor-pointer active:scale-95"
                                title="Click to show all permissions"
                              >
                                +{hiddenCount} more
                              </button>
                            )}

                            {isExpanded && hiddenCount > 0 && (
                              <button
                                type="button"
                                onClick={() => toggleExpandRole(role.id)}
                                className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-slate-800 text-white border border-slate-700 hover:bg-indigo-600 hover:border-indigo-600 transition-colors shadow-sm cursor-pointer active:scale-95"
                              >
                                Show less
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No permissions assigned</span>
                        )}
                      </div>
                    </td>

                    {/* GUARD NAME */}
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-mono bg-slate-100 text-slate-600 border border-slate-200/80 lowercase">
                        <LockKeyhole size={12} className="text-slate-400 flex-shrink-0" />
                        {role.guard_name || 'web'}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          type="button"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-cyan-200/80 text-cyan-600 bg-cyan-50 hover:bg-cyan-600 hover:text-white transition-all duration-200 active:scale-95 shadow-sm disabled:opacity-50"
                          onClick={() => handleOpenEditModal(role)}
                        >
                          <Edit3 size={14} />
                        </button>

                        {!isSystemRole && (
                          <button 
                            type="button"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-rose-200/80 text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white transition-all duration-200 active:scale-95 shadow-sm disabled:opacity-50"
                            onClick={() => handleDelete(role)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* DYNAMIC PAGINATION CONTROLS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 bg-slate-100/50">
        
          <p className="text-xs text-slate-500 font-medium">
            Showing <span className="text-slate-800 font-bold">{fromEntry}</span> to{' '}
            <span className="text-slate-800 font-bold">{toEntry}</span> of{' '}
            <span className="text-slate-800 font-bold">{totalEntries}</span> entries
          </p>

          <div className="flex items-center gap-1">
            {/* PREV BUTTON */}
            <button 
              type="button"
              disabled={currentPage === 1 || isLoading || isFetching}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Prev
            </button>
            
            {/* PAGE NUMBERS */}
            {getPageNumbers(currentPage, lastPage).map((page, index) => {
              if (typeof page === 'string') {
                return (
                  <span key={index} className="px-2 py-1.5 text-xs text-slate-400 font-bold select-none">
                    {page}
                  </span>
                );
              }

              return (
                <button
                  key={index}
                  type="button"
                  disabled={isLoading || isFetching}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    currentPage === page
                      ? 'bg-[var(--active-parent,rgb(99,102,241))] text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200/60'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {/* NEXT BUTTON */}
            <button 
              type="button"
              disabled={currentPage >= lastPage || isLoading || isFetching}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>

      </div>

      <RoleModal 
        key={selectedRole ? `edit-${selectedRole.id}` : 'create'}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={selectedRole} 
      />
    </div>
  );
}