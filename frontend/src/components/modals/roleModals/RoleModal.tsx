import { useState, useEffect } from 'react';
import { X, Shield, Key, Loader2, Check, ShieldAlert, Save } from 'lucide-react';
import { useCreateRole, useUpdateRole } from '../../../hooks/useRoles';
import { usePermissions } from '../../../hooks/usePermissions';
import { modalAnimation } from '../../../utils/ModalAnimation';
import SectionHeader from '../../ui/SectionHeader';
import { InputField } from '../../inputs/InputField';
import type { Role } from '../../../types/typeRole';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Role | null;
}

export default function RoleModal({ isOpen, onClose, initialData }: RoleModalProps) {
  const { isClosing, startClose, handleAnimationEnd } = modalAnimation(onClose);
  
  const [name, setName] = useState('');
  // Binago mula number[] patungong string[] dahil pangalan (string) ang hinahanap ng backend
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

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
      // Kunin ang mga NAMES ng permissions sa halip na IDs
      const permNames = initialData.permissions?.map((p) => p.name) || [];
      setSelectedPermissions(permNames);
    } else {
      setName('');
      setSelectedPermissions([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const isLoading = isCreating || isUpdating;
  const isAllSelected = permissions.length > 0 && selectedPermissions.length === permissions.length;

  // Trapping para sa role name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, '_').toLowerCase();
    setName(sanitizedValue);
  };

  // Toggle Checkbox gamit ang permission name (string)
  const togglePermission = (permName: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permName) ? prev.filter((name) => name !== permName) : [...prev, permName]
    );
  };

  // Select All / Deselect All Handler gamit ang permission names
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(permissions.map((p) => p.name));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      guard_name: 'web',
      permissions: selectedPermissions, // Array na ito ng mga strings (permission names)
    };

    if (initialData?.id) {
      updateRole(
        { id: initialData.id, payload },
        {
          onSuccess: () => {
            startClose();
          },
        }
      );
    } else {
      createRole(payload, {
        onSuccess: () => {
          startClose();
        },
      });
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 ${isClosing ? 'modal-overlay closing' : 'modal-overlay'}`}
      onAnimationEnd={handleAnimationEnd}
    >
      {/* Modal Container */}
      <div className={`bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200/80 flex flex-col max-h-[92vh] ${isClosing ? 'modal-content closing' : 'modal-content'}`}>
        
        {/* Header */}
        <div className="px-8 py-6 bg-[var(--active-parent)] flex items-center justify-between text-white flex-shrink-0">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">
              {initialData ? 'Edit Role & Permissions' : 'Create New Role'}
            </h2>
            <p className="text-white/80 text-xs mt-0.5 font-medium">
              {initialData 
                ? `Updating configuration for "${initialData.name}"` 
                : 'Define a new security role and assign its access scope.'}
            </p>
          </div>
          <button 
            type="button"
            onClick={startClose} 
            className="p-2 hover:bg-white/10 active:scale-95 rounded-full transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <form id="role-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Role Information */}
            <div>
              <SectionHeader title="Role Detail" icon={Shield} />
              <div className="space-y-4 mt-3">
                <InputField
                  label="Role Name"
                  name="name"
                  placeholder="e.g. branch_pastor, finance_staff"
                  value={name}
                  onChange={handleNameChange}
                  required
                  icon={<Shield size={15}/>}
                />
              </div>
            </div>

            {/* Section 2: Permissions Mapping */}
            <div>
              <div className="flex items-center justify-between">
                <SectionHeader title={`Assign Permissions (${selectedPermissions.length} selected)`} icon={Key} />
                
                {permissions.length > 0 && (
                  <div 
                    onClick={handleSelectAll}
                    className="flex items-center gap-2 text-xs font-semibold text-[var(--active-parent)] hover:opacity-80 cursor-pointer select-none"
                  >
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                      isAllSelected 
                        ? 'bg-[var(--active-parent)] border-[var(--active-parent)] text-white' 
                        : 'border-slate-300 bg-white'
                    }`}>
                      {isAllSelected && <Check size={11} strokeWidth={3} />}
                    </div>
                    <span>{isAllSelected ? 'Deselect All' : 'Select All'}</span>
                  </div>
                )}
              </div>

              <div className="mt-3 border border-slate-200 rounded-2xl p-3.5 bg-slate-50/50 max-h-56 overflow-y-auto space-y-1.5">
                {isLoadingPerms ? (
                  <div className="flex items-center justify-center py-6 text-slate-400 gap-2">
                    <Loader2 size={16} className="animate-spin text-[var(--active-parent)]" />
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
                      const isChecked = selectedPermissions.includes(perm.name);
                      return (
                        <div
                          key={perm.id}
                          onClick={() => togglePermission(perm.name)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-indigo-50/80 border-indigo-200 text-indigo-900 shadow-sm'
                              : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-100/60'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Key size={13} className={isChecked ? 'text-[var(--active-parent)]' : 'text-slate-400'} />
                            <span className="truncate">{perm.name}</span>
                          </div>
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                            isChecked ? 'bg-[var(--active-parent)] border-[var(--active-parent)] text-white' : 'border-slate-300 bg-white'
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

          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-200/60 flex gap-3 justify-end flex-shrink-0">
          <button 
            type="button" 
            onClick={startClose} 
            disabled={isLoading}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider border border-slate-200 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <X size={15} /> Cancel
          </button>
          <button 
            type="submit" 
            form="role-form" 
            disabled={isLoading}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[var(--active-parent)] hover:opacity-90 rounded-xl shadow-lg shadow-indigo-500/10 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {initialData ? 'Update Role' : 'Save Role'}
          </button>
        </div>

      </div>
    </div>
  );
}