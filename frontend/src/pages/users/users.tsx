import { useState } from 'react';
import { FaUsers } from 'react-icons/fa';
import { 
  ShieldUser, 
  Edit3, 
  Trash2, 
  ShieldAlert,
  Mail,
  CheckCircle2,
  XCircle,
  Filter
} from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import { getPageNumbers } from '../../utils/pagination';
import UserModal from '../../components/modals/userModals/UserModal';
import ModuleHeader from '../../components/ui/ModuleHeader';
import SearchInput from '../../components/inputs/SearchInput';
import type { User } from '../../types/typeUser';

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isActiveFilter, setIsActiveFilter] = useState<string>('true'); // Default to Active ('true')
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Kunin ang data mula sa backend gamit ang React Query hook
  const { data: paginatedResponse, isLoading, isError } = useUsers({
    search: searchTerm,
    is_active: isActiveFilter === '' ? undefined : isActiveFilter === 'true',
    page: currentPage,
  });

  const users = paginatedResponse?.data || [];
  const meta = paginatedResponse?.meta;
  
  const lastPage = meta?.last_page || 1;
  const totalEntries = meta?.total || 0;
  const fromEntry = meta?.from || 0;
  const toEntry = meta?.to || 0;

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1); // Balik sa page 1 kapag naghahanap
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsActiveFilter(e.target.value);
    setCurrentPage(1); // Balik sa page 1 kapag nagbago ang filter
  };

  const handleDelete = (user: User) => {
    if (user.email === 'superadmin@gcfsouthmetro.org') {
      alert('System Protection: You cannot delete the primary system administrator.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete user "${user.member?.firstName || user.email}"?`)) {
      console.log('Deleting user ID:', user.id);
    }
  };

  const handleOpenEditModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const getRoleBadgeStyle = (userRole: string) => {
    switch (userRole) {
      case 'super_admin':
      case 'admin':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'manager':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="w-full bg-slate-50 text-slate-800 px-6 py-4 space-y-6">
      
      {/* MODULE HEADER */}
      <ModuleHeader
        title="Users Management"
        description="Create and manage system user accounts, credentials, and enterprise role assignments."
        icon={<FaUsers size={24} />}
        
      />

      {/* SEARCH & FILTER CONTROLS */}
      <div className="flex flex-col md:flex-row items-center gap-4 justify-between w-full bg-transparent">
        <div className="w-full md:w-96">
          <SearchInput 
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search user name or email..."
          />
        </div>

        {/* ACTIVE / INACTIVE SELECTBOX FILTER */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Filter size={14} />
            <span>Status:</span>
          </div>
          <select
            value={isActiveFilter}
            onChange={handleStatusFilterChange}
            className="px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700 shadow-sm"
          >
            <option value="true">Active Users</option>
            <option value="false">Inactive Users</option>
            <option value="">All Status</option>
          </select>
        </div>
      </div>

      {/* TABLE DATA CONTAINER */}
      <div className="w-full bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-y-auto overflow-x-auto h-[calc(100vh-325px)] border border-slate-200/60 rounded-lg">
          <table className="w-full text-left text-sm border-separate border-spacing-0">
            
            {/* THEME BASED HEADER */}
            <thead className="sticky top-0 z-10 bg-[var(--active-parent,rgb(99,102,241))]">
              <tr className="text-white uppercase tracking-wider text-[10px] font-extrabold border-b border-slate-200/60">
                <th className="w-[30%] px-6 py-4">User Profile</th>
                <th className="w-[25%] px-6 py-4">Assigned Role</th>
                <th className="w-[15%] px-6 py-4 text-center">Status</th>
                <th className="w-[15%] px-6 py-4 text-center">Created At</th>
                <th className="w-[15%] px-6 py-4 text-center">Actions</th>
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
                          <div className="w-28 h-3.5 bg-slate-200 rounded" />
                          <div className="w-36 h-2.5 bg-slate-100 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-20 h-6 bg-slate-200 rounded-md" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="w-16 h-5 bg-slate-200 rounded-full mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="w-20 h-3 bg-slate-200 rounded mx-auto" />
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
                  <td colSpan={5} className="py-12 text-center text-rose-500">
                    <div className="flex flex-col items-center gap-2">
                      <ShieldAlert size={28} />
                      <p className="font-semibold text-xs">Failed to load users. Please try again.</p>
                    </div>
                  </td>
                </tr>
              )}

              {/* EMPTY STATE */}
              {!isLoading && !isError && users.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-sm text-slate-600">No Users Found</p>
                    <p className="text-xs text-slate-400 mt-1">Try searching for another keyword or change your filter status.</p>
                  </td>
                </tr>
              )}

              {/* DATA ROWS */}
              {!isLoading && !isError && users.map((user) => {
                const fullName = user.member 
                  ? `${user.member.firstName} ${user.member.lastName}` 
                  : user.email.split('@')[0];
                const initialLetter = user?.member?.firstName?.[0]+''+user?.member?.lastName?.[0];

                return (
                  <tr 
                    key={user.id} 
                    className="group hover:bg-indigo-50/50 transition-all duration-200 ease-in-out border-b border-slate-50 last:border-0"
                  >
                    {/* USER PROFILE */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs border border-slate-200 group-hover:bg-[var(--active-parent,rgb(99,102,241))]/10 group-hover:text-[var(--active-parent,rgb(99,102,241))] group-hover:border-[var(--active-parent,rgb(99,102,241))] transition-colors shadow-sm">
                          {initialLetter}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 group-hover:text-[var(--active-parent,rgb(99,102,241))] transition-colors">
                            {fullName}
                          </p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Mail size={10} className="text-slate-400" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ASSIGNED ROLE */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider border ${getRoleBadgeStyle(user.role)}`}>
                        <ShieldUser size={12} />
                        {user.role}
                      </span>
                    </td>

                    {/* STATUS (✅ Fixed: Nakabase na sa user.is_active ng bawat record) */}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        user.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                      }`}>
                        {user.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* CREATED AT */}
                    <td className="px-6 py-4 text-center text-xs text-slate-500 font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          type="button"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-cyan-200/80 text-cyan-600 bg-cyan-50 hover:bg-cyan-600 hover:text-white transition-all duration-200 active:scale-95 shadow-sm"
                          onClick={() => handleOpenEditModal(user)}
                          title="Edit User"
                        >
                          <Edit3 size={14} />
                        </button>

                        <button 
                          type="button"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-rose-200/80 text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white transition-all duration-200 active:scale-95 shadow-sm"
                          onClick={() => handleDelete(user)}
                          title="Delete User"
                        >
                          <Trash2 size={14} />
                        </button>
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
            <button 
              type="button"
              disabled={currentPage === 1 || isLoading}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Prev
            </button>
            
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
                  disabled={isLoading}
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

            <button 
              type="button"
              disabled={currentPage >= lastPage || isLoading}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>

      </div>

      {/* USER MODAL */}
      {isModalOpen && (
        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedUser={selectedUser}
        />
      )}

    </div>
  );
}