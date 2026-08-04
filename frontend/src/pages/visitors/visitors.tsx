import { useState, useEffect } from 'react';
import { X, Shield, Key, Loader2, Check, LockKeyhole, ShieldAlert } from 'lucide-react';
import { useCreateRole, useUpdateRole } from '../../hooks/useRoles';
import { usePermissions } from '../../hooks/usePermissions';
import type { Role } from '../../types/typeRole';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Role | null; // Kung may laman, Edit mode. Kung null/wala, Create mode.
}

export default function RoleModal({ isOpen, onClose, initialData }: RoleModalProps) {
  const [name, setName] = useState('');
  const [guardName, setGuardName] = useState('web');
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  // API Mutations
  const { mutate: createRole, isPending: isCreating } = useCreateRole();
  const { mutate: updateRole, isPending: isUpdating } = useUpdateRole();

  // Kunin ang listahan ng permissions para sa selection grid
  const { data: permissionsResponse, isLoading: isLoadingPerms, isError: isErrorPerms } = usePermissions({ per_page: 100 });
  const permissions = permissionsResponse?.data || [];

  // I-load ang initial data tuwing bubuksan ang modal (para sa Edit o Create)
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setGuardName(initialData.guard_name || 'web');
      const permIds = initialData.permissions?.map((p) => p.id) || [];
      setSelectedPermissions(permIds);
    } else {
      setName('');
      setGuardName('web');
      setSelectedPermissions([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const isPending = isCreating || isUpdating;

  // Toggle Checkbox para sa individual permissions
  const togglePermission = (id: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  // Select All / Deselect All Handler
  const handleSelectAll = () => {
    if (selectedPermissions.length === permissions.length) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(permissions.map((p) => p.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      guard_name: guardName.trim(),
      permissions: selectedPermissions,
    };

    if (initialData) {
      updateRole(
        { id: initialData.id, payload },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createRole(payload, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[var(--active-parent,rgb(99,102,241))] flex items-center justify-center border border-indigo-100 shadow-sm">
              <Shield size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                {initialData ? 'Edit Role & Permissions' : 'Create New Role'}
              </h3>
              <p className="text-xs text-slate-500">
                {initialData 
                  ? `Updating configuration for "${initialData.name}"` 
                  : 'Define a new security role and assign its access scope.'}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* MODAL FORM BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* ROLE NAME INPUT */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Role Name <span className="text-rose-500">*</span>
            </label>
            <input 
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. branch_pastor, finance_staff"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--active-parent,rgb(99,102,241))]/25 focus:border-[var(--active-parent,rgb(99,102,241))] transition-all"
            />
          </div>

          {/* GUARD NAME INPUT */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Guard Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <LockKeyhole size={15} />
              </span>
              <input 
                type="text"
                value={guardName}
                onChange={(e) => setGuardName(e.target.value)}
                placeholder="web"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--active-parent,rgb(99,102,241))]/25 focus:border-[var(--active-parent,rgb(99,102,241))] transition-all font-mono lowercase"
              />
            </div>
          </div>

          {/* PERMISSIONS SELECTION GRID */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Assign Permissions ({selectedPermissions.length} selected)
              </label>
              {permissions.length > 0 && (
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-xs font-semibold text-[var(--active-parent,rgb(99,102,241))] hover:underline cursor-pointer"
                >
                  {selectedPermissions.length === permissions.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>

            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 max-h-56 overflow-y-auto space-y-1.5">
              {isLoadingPerms ? (
                <div className="flex items-center justify-center py-6 text-slate-400 gap-2">
                  <Loader2 size={16} className="animate-spin text-[var(--active-parent,rgb(99,102,241))]" />
                  <span className="text-xs font-medium">Loading permissions...</span>
                </div>
              ) : isErrorPerms ? (
                <div className="flex items-center justify-center py-6 text-rose-500 gap-2">
                  <ShieldAlert size={16} />
                  <span className="text-xs font-medium">Failed to load permissions.</span>
                </div>
              ) : permissions.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-4 font-medium">No permissions found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {permissions.map((perm) => {
                    const isChecked = selectedPermissions.includes(perm.id);
                    return (
                      <div
                        key={perm.id}
                        onClick={() => togglePermission(perm.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-indigo-50/80 border-indigo-200 text-indigo-900 shadow-sm'
                            : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-100/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Key size={13} className={isChecked ? 'text-[var(--active-parent,rgb(99,102,241))]' : 'text-slate-400'} />
                          <span className="truncate">{perm.name}</span>
                        </div>
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                          isChecked ? 'bg-[var(--active-parent,rgb(99,102,241))] border-[var(--active-parent,rgb(99,102,241))] text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <Check size={11} strokeWidth={3} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* MODAL FOOTER ACTIONS */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[var(--active-parent,rgb(99,102,241))] hover:opacity-90 active:scale-95 rounded-xl transition-all shadow-md shadow-indigo-500/10 disabled:opacity-50 cursor-pointer"
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              {initialData ? 'Save Changes' : 'Create Role'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}