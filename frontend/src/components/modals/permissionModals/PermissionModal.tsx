import { useState, useEffect } from 'react';
import { X, Key, Save, Loader2, Info } from 'lucide-react';
import { useCreatePermission, useUpdatePermission } from '../../../hooks/usePermissions';
import { modalAnimation } from '../../../utils/ModalAnimation';
import SectionHeader from '../../ui/SectionHeader';
import { InputField } from '../../inputs/InputField';
import type { Permission } from '../../../types/typePermission';

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Permission | null;
}

export default function PermissionModal({ isOpen, onClose, initialData }: PermissionModalProps) {
  const { isClosing, startClose, handleAnimationEnd } = modalAnimation(onClose);
  const { mutate: createPermission, isPending: isCreating } = useCreatePermission();
  const { mutate: updatePermission, isPending: isUpdating } = useUpdatePermission();

  const [formData, setFormData] = useState({
    name: '',
    guard_name: 'sanctum',
  });

  // Kusa nitong ine-populate ang form kapag may initialData (Edit Mode) o nire-reset kapag Create Mode
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        guard_name: 'sanctum',
      });
    } else {
      setFormData({
        name: '',
        guard_name: 'sanctum',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const isLoading = isCreating || isUpdating;

  // TRAPPING: Awtomatikong pinapalitan ang spaces ng underscore (_) at ginagawang lowercase
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, '_').toLowerCase();
    setFormData({ ...formData, name: sanitizedValue });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (initialData?.id) {
      // UPDATE PERMISSION
      updatePermission(
        { id: initialData.id, payload: formData },
        { onSuccess: () => startClose() }
      );
    } else {
      // CREATE NEW PERMISSION
      createPermission(formData, { onSuccess: () => startClose() });
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 ${isClosing ? 'modal-overlay closing' : 'modal-overlay'}`}
      onAnimationEnd={handleAnimationEnd}
    >
      {/* Modal Container */}
      <div className={`bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200/80 flex flex-col max-h-[92vh] ${isClosing ? 'modal-content closing' : 'modal-content'}`}>
        
        {/* Header - Consistent with ClusterModal */}
        <div className="px-8 py-6 bg-[var(--active-parent)] flex items-center justify-between text-white flex-shrink-0">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">
              {initialData ? 'Edit Permission' : 'Create New Permission'}
            </h2>
            <p className="text-white/80 text-xs mt-0.5 font-medium">
              Configure granular access privileges and system keys.
            </p>
          </div>
          <button 
            onClick={startClose} 
            className="p-2 hover:bg-white/10 active:scale-95 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <form id="permission-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Permission Details */}
            <div>
              <SectionHeader title="Permission Detail" icon={Key} />
              <div className="space-y-4 mt-3">
                
                {/* HELPER NOTE */}
                <div className="mt-2 p-2.5 bg-cyan-50 border border-cyan-200/70 rounded-xl flex items-start gap-2 text-cyan-800 text-[11px] font-medium">
                  <Info size={14} className="text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Note:</strong> Use an underscore (<code className="bg-cyan-100 px-1 rounded font-mono font-bold text-cyan-900">_</code>) instead of spaces. Spaces will automatically be converted to underscores as you type.
                  </span>
                </div>
                {/* Permission Name with Trapping & Note */}
                <div>
                  <InputField
                    label="Permission Name / Key"
                    name="name"
                    placeholder="e.g. view_reports, edit_members"
                    value={formData.name}
                    onChange={handleNameChange}
                    required
                    icon={<Key size={15}/>}
                  />
                  
                </div>

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
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider border border-slate-200 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <X size={15} /> Cancel
          </button>
          <button 
            type="submit" 
            form="permission-form" 
            disabled={isLoading}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/10 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {initialData ? 'Update Permission' : 'Save Permission'}
          </button>
        </div>

      </div>
    </div>
  );
}