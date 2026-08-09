import { useState, useEffect, useRef } from 'react';
import { X, ShieldUser, Mail, ShieldCheck, Save } from 'lucide-react';
import { modalAnimation } from '../../../utils/ModalAnimation';
import { useUpdateUserRole } from '../../../hooks/useUsers';
import { useRoles } from '../../../hooks/useRoles'; // 👈 Import ang useRoles hook
import SectionHeader from '../../ui/SectionHeader';
import { InputField } from '../../inputs/InputField';
import { SelectField } from '../../inputs/SelectField';
import type { User } from '../../../types/typeUser';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser?: User | null;
}

export default function UserModal({ isOpen, onClose, selectedUser }: UserModalProps) {
  const { isClosing, startClose, handleAnimationEnd } = modalAnimation(onClose);
  
  // Mutate hook para sa pag-update ng role at is_active
  const { mutate: updateRole, isPending: isUpdating } = useUpdateUserRole();

  // 👈 Kunin ang roles mula sa backend endpoint gamit ang useRoles hook
  const { data: rolesResponse } = useRoles();

  // I-extract ang array ng roles mula sa paginated response
  const rolesList = rolesResponse?.data || [];

  // I-map ang roles para maging angkop sa options ng SelectField ({ value, label })
  const roleOptions = rolesList.map((r: any) => ({
    value: r.name,
    label: r.name
      .split('_')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '), // Halimbawa: "super_admin" magiging "Super Admin"
  }));

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'member',
    is_active: false, // Default to false (inactive kapag bago)
  });

  const loadedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      loadedUserIdRef.current = null;
      return;
    }

    if (selectedUser) {
      const fullName = selectedUser.member 
        ? `${selectedUser.member.firstName} ${selectedUser.member.lastName}` 
        : selectedUser.email.split('@')[0];

      setFormData({
        name: fullName,
        email: selectedUser.email,
        role: selectedUser.role || 'member',
        is_active: selectedUser.is_active ?? false,
      });
      loadedUserIdRef.current = selectedUser.id;
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'member',
        is_active: false,
      });
      loadedUserIdRef.current = null;
    }
  }, [isOpen, selectedUser]);

  if (!isOpen) return null;

  const handleRoleChange = (val: any) => {
    const selectedValue = val?.target ? val.target.value : val;
    setFormData((prev) => ({ ...prev, role: selectedValue }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedUser) {
      updateRole(
        { 
          id: selectedUser.id, 
          payload: { 
            role: formData.role,
            is_active: formData.is_active 
          } 
        },
        {
          onSuccess: () => {
            startClose();
          },
        }
      );
    } else {
      // Dito ilalagay ang create user mutation mo sa hinaharap kung meron na
      console.log('Creating new user:', formData);
      startClose();
    }
  };

  const isActive = formData.is_active;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 ${isClosing ? 'modal-overlay closing' : 'modal-overlay'}`}
      onAnimationEnd={handleAnimationEnd}
    >
      {/* Modal Container */}
      <div className={`bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200/80 flex flex-col max-h-[92vh] ${isClosing ? 'modal-content closing' : 'modal-content'}`}>
        
        {/* Header */}
        <div className="px-8 py-6 bg-[var(--active-parent,rgb(99,102,241))] flex items-center justify-between text-white flex-shrink-0">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">
              {selectedUser ? 'Edit User Account & Status' : 'Create New User'}
            </h2>
            <p className="text-white/80 text-xs mt-0.5 font-medium">
              {selectedUser ? 'Modify credentials, permissions, and account activation.' : 'Add a system user and configure role access.'}
            </p>
          </div>
          <button 
            type="button"
            onClick={startClose} 
            className="p-2 hover:bg-white/10 active:scale-95 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <form id="user-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: User Profile Info */}
            <div>
              <div className="grid grid-cols-1 gap-4 mt-2">
                <InputField
                  type="text"
                  label="Full Name"
                  name="name"
                  placeholder="e.g. Juan Dela Cruz"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  icon={<ShieldUser size={15} />}
                  readOnly
                />

                <InputField
                  type="email"
                  label="Email Address"
                  name="email"
                  placeholder="e.g. juan@enterprise.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  icon={<Mail size={15} />}
                  readOnly
                />
              </div>
            </div>

            {/* Section 2: Role Assignment (Dynamic galing sa Backend) */}
            <div>
              <SectionHeader title="Security Assignment" icon={ShieldCheck} />
              <div className="mt-2">
                <SelectField 
                  label="Assign System Role" 
                  name="role" 
                  value={formData.role} 
                  onChange={handleRoleChange} 
                  options={roleOptions.length > 0 ? roleOptions : [{ value: 'member', label: 'Member' }]} 
                />
              </div>
            </div>

            {/* Section 3: Active Status Toggle */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/80 mt-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Account Access</h4>
                    <p className="text-xs text-slate-500">
                      {isActive ? 'User is active and allowed to log in.' : 'User is inactive and blocked from accessing the system.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_active: !isActive })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    isActive ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-200/60 flex gap-3 justify-end flex-shrink-0">
          <button 
            type="button" 
            onClick={startClose} 
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider border border-slate-200 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all flex items-center gap-2"
          >
            <X size={15} /> Cancel
          </button>
          <button 
            type="submit" 
            form="user-form" 
            disabled={isUpdating}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-lg shadow-emerald-600/10 transition-all flex items-center gap-2"
          >
            <Save size={15} /> {selectedUser ? 'Update User Details' : 'Save User'}
          </button>
        </div>

      </div>
    </div>
  );
}