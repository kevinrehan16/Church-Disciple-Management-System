import { useState } from 'react';
import { FaUserShield } from 'react-icons/fa';
import { ShieldUser, Plus, Filter, ArrowUpDown, Key, Users, Edit3, Trash2 } from 'lucide-react';
import ModuleHeader from '../../components/ui/ModuleHeader';
import SearchInput from '../../components/inputs/SearchInput';

// HARDCODED DATA PARA SA DESIGN
const dummyRoles = [
  { id: 1, name: 'superadmin', usersCount: 2, permissions: [{ id: 1, name: 'all_access' }] },
  { id: 2, name: 'senior_pastor', usersCount: 1, permissions: [{ id: 2, name: 'view_dashboard' }, { id: 3, name: 'manage_staff' }] },
  { id: 3, name: 'pastor', usersCount: 4, permissions: [{ id: 4, name: 'view_members' }, { id: 5, name: 'edit_members' }] },
  { id: 4, name: 'staff', usersCount: 12, permissions: [{ id: 4, name: 'view_members' }, { id: 6, name: 'add_visitors' }] },
];

export default function Roles() {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="w-full bg-slate-50 text-slate-800 px-6 py-4 space-y-6 min-h-screen">
      
      {/* MODULE HEADER */}
      <ModuleHeader
        title="Roles Management"
        description="Create and manage user roles, define access levels, and assign dynamic permissions."
        icon={<FaUserShield size={24} />}
        actions={
          <button 
            className="group flex items-center gap-2 px-5 py-2.5 bg-[#0284c7] hover:bg-[#026ca1] active:scale-95 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-sky-500/10"
            onClick={() => alert("Open Add Role Modal")}
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
            onChange={(val) => setSearchTerm(val)}
            placeholder="Search role name..."
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
        <div className="overflow-y-auto overflow-x-auto h-[calc(100vh-325px)] border border-slate-200/60 rounded-lg">
          <table className="w-full text-left text-sm border-separate border-spacing-0">
            <thead className="sticky top-0 z-10 bg-[var(--active-parent,rgb(99,102,241))]">
              <tr className="text-white uppercase tracking-wider text-[10px] font-extrabold border-b border-slate-200/60">
                <th className="w-[20%] px-6 py-4">Role Name</th>
                <th className="w-[45%] px-6 py-4">Assigned Permissions</th>
                <th className="w-[15%] px-6 py-4 text-center">Assigned Users</th>
                <th className="w-[20%] px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {dummyRoles.map((role) => (
                <tr 
                  key={role.id} 
                  className="group hover:bg-indigo-50/50 transition-all duration-200 ease-in-out border-b border-slate-50 last:border-0"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs border border-slate-200 group-hover:bg-[var(--active-parent,rgb(99,102,241))]/10 group-hover:text-[var(--active-parent,rgb(99,102,241))] group-hover:border-[var(--active-parent,rgb(99,102,241))] transition-colors">
                        <ShieldUser size={16} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 group-hover:text-[var(--active-parent,rgb(99,102,241))] transition-colors capitalize">
                          {role.name.replace('_', ' ')}
                        </p>
                        <p className="text-[11px] font-mono text-slate-400">ID: {role.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5 max-w-xl">
                      {role.permissions.map((perm) => (
                        <span 
                          key={perm.id} 
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/60"
                        >
                          <Key size={10} className="text-indigo-400" />
                          {perm.name}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                      <Users size={12} className="text-slate-400" />
                      {role.usersCount} Users
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-indigo-500 hover:text-white transition-all duration-200 active:scale-95 shadow-sm"
                        onClick={() => alert(`Edit Role: ${role.name}`)}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      {role.name !== 'superadmin' && (
                        <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white transition-all duration-200 active:scale-95 shadow-sm">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* HARDCODED PAGINATION */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-100/50">
          <p className="text-xs text-slate-500 font-medium">
            Showing <span className="text-slate-800 font-bold">1</span> to <span className="text-slate-800 font-bold">4</span> of <span className="text-slate-800 font-bold">4</span> entries
          </p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-30 cursor-not-allowed" disabled>Prev</button>
            <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--active-parent,rgb(99,102,241))] text-white shadow-sm">1</button>
            <button className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-30 cursor-not-allowed" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}