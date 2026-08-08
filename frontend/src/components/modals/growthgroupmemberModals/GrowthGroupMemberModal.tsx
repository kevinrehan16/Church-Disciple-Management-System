import { useState, useEffect, useRef } from 'react';
import { X, Users, UserCheck, ShieldCheck, Save, Calendar, FileText } from 'lucide-react';
import { modalAnimation } from '../../../utils/ModalAnimation';
import { useMembers } from '../../../hooks/useMembers';
import { useAddGrowthGroupMember } from '../../../hooks/useGGMembers';
import SectionHeader from '../../ui/SectionHeader';
import { InputField } from '../../inputs/InputField';
import { SearchableSelect } from '../../inputs/SearchableSelect';
import { SelectField } from '../../inputs/SelectField';

interface GrowthGroupMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberRecordId?: string | number | null; // Kung edit mode ng membership record
  defaultGrowthGroupId?: number;
  initialData?: {
    growth_group_id: number;
    member_id: number;
    role: string;
    status: string;
    joined_at: string;
    inactive_reason?: string;
  };
}

export default function GrowthGroupMemberModal({ 
  isOpen, 
  onClose, 
  memberRecordId, 
  defaultGrowthGroupId, 
  initialData 
}: GrowthGroupMemberModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { isClosing, startClose, handleAnimationEnd } = modalAnimation(onClose);
  
  // Mock mutations (Palitan ng totoong hooks mo mamaya)
  const { mutate: addMember, isPending: isCreating } = useAddGrowthGroupMember();
  // const { mutate: updateMember, isPending: isUpdating } = useUpdateGrowthGroupMember();
  const isUpdating = false;

  // Form State
  const [formData, setFormData] = useState({
    growth_group_id: initialData?.growth_group_id || defaultGrowthGroupId || 1,
    member_id: initialData?.member_id || 0,
    role: initialData?.role || 'member',
    status: initialData?.status || 'active',
    joined_at: initialData?.joined_at || new Date().toISOString().split('T')[0],
    inactive_reason: initialData?.inactive_reason || '',
  });

  const loadedRecordIdRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      loadedRecordIdRef.current = null;
      return;
    }

    if (loadedRecordIdRef.current === memberRecordId) return;

    if (initialData) {
      setFormData({
        growth_group_id: initialData.growth_group_id || defaultGrowthGroupId || 1,
        member_id: initialData.member_id || 0,
        role: initialData.role || 'member',
        status: initialData.status || 'active',
        joined_at: initialData.joined_at || new Date().toISOString().split('T')[0],
        inactive_reason: initialData.inactive_reason || '',
      });
      loadedRecordIdRef.current = memberRecordId;
      return;
    }

    if (!memberRecordId) {
      setFormData({
        growth_group_id: defaultGrowthGroupId || 1,
        member_id: 0,
        role: 'member',
        status: 'active',
        joined_at: new Date().toISOString().split('T')[0],
        inactive_reason: '',
      });
      loadedRecordIdRef.current = memberRecordId;
    }
  }, [isOpen, memberRecordId, defaultGrowthGroupId, initialData]);

  // Fetch Members para sa SearchableSelect
  const { data: apiMembers } = useMembers({
    search: searchTerm,
    page: 1,
  });

  const currentMembers = Array.isArray(apiMembers) 
    ? apiMembers 
    : (apiMembers?.data || []);
  
  const memberOptions = currentMembers.map((member: any) => ({
    value: member.id,
    label: member.full_name || `${member.first_name} ${member.last_name}`,
    id: member.id,
    name: member.full_name || `${member.first_name} ${member.last_name}`,
  }));

  // Role options
  const roleOptions = [
    { value: 'member', label: 'Member' },
    { value: 'co-leader', label: 'Co-Leader' },
  ];

  if (!isOpen) return null;

  const handleMemberChange = (val: any) => {
    const selectedValue = val?.target ? val.target.value : val;
    setFormData((prev) => ({ ...prev, member_id: Number(selectedValue) }));
  };

  const handleRoleChange = (val: any) => {
    const selectedValue = val?.target ? val.target.value : val;
    setFormData((prev) => ({ ...prev, role: selectedValue }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!defaultGrowthGroupId) {
        console.error("Walang napiling Growth Group ID!");
        return;
    }

    // I-trigger ang mutation
    addMember(
        { 
            growthGroupId: defaultGrowthGroupId, 
            formData 
        }, 
        { 
        onSuccess: () => {
                startClose(); // Isara ang modal kapag success
            } 
        }
    );
  };

  const isActive = formData.status === 'active';

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 ${isClosing ? 'modal-overlay closing' : 'modal-overlay'}`}
      onAnimationEnd={handleAnimationEnd}
    >
      {/* Modal Container */}
      <div className={`bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200/80 flex flex-col max-h-[92vh] ${isClosing ? 'modal-content closing' : 'modal-content'}`}>
        
        {/* Header (Gumamit ng parehong accent color theme tulad ng ClusterModal) */}
        <div className="px-8 py-6 bg-[var(--active-parent,rgb(99,102,241))] flex items-center justify-between text-white flex-shrink-0">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">
              {memberRecordId ? 'Edit Growth Group Member' : 'Add Member to Growth Group'}
            </h2>
            <p className="text-white/80 text-xs mt-0.5 font-medium">
              Assign a member and configure their role and status within the group.
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
          <form id="group-member-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Select Member */}
            <div>
              <SectionHeader title="Member Information" icon={Users} />
              <div className="mt-2">
                <SearchableSelect
                  label="Select Member"
                  name="member_id"
                  value={formData.member_id || ''}
                  options={memberOptions}
                  placeholder="Search and select member..."
                  icon={<UserCheck size={15} />}
                  onChange={handleMemberChange}
                  onSearchChange={(text: string) => setSearchTerm(text)}
                />
              </div>
            </div>

            {/* Section 2: Role & Joined Date */}
            <div>
              <SectionHeader title="Membership Assignment" icon={ShieldCheck} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                
                {/* Role Selection */}
                <div>
                  <SelectField label="Group Role" name="role" value={formData.role} onChange={handleRoleChange} options={roleOptions} />
                </div>

                {/* Joined Date */}
                <div>
                  <InputField
                    type="date"
                    label="Joined Date"
                    name="joined_at"
                    value={formData.joined_at}
                    onChange={(e) => setFormData({ ...formData, joined_at: e.target.value })}
                    icon={<Calendar size={15} />}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Active Status & Inactive Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Membership Status</h4>
                    <p className="text-xs text-slate-500">Toggle whether this member is currently active.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setFormData({ 
                    ...formData, 
                    status: isActive ? 'inactive' : 'active' 
                  })}
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

              {/* Kung Inactive, magpapakita ang dahilan (inactive_reason) */}
              {!isActive && (
                <div className="animate-fadeIn">
                  <InputField
                    label="Reason for Inactivity"
                    name="inactive_reason"
                    placeholder="e.g. Moved to another location, schedule conflict..."
                    value={formData.inactive_reason}
                    onChange={(e) => setFormData({ ...formData, inactive_reason: e.target.value })}
                    icon={<FileText size={15} />}
                  />
                </div>
              )}
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
            form="group-member-form" 
            disabled={isCreating || isUpdating}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-lg shadow-emerald-600/10 transition-all flex items-center gap-2"
          >
            <Save size={15} /> {memberRecordId ? 'Update Member' : 'Save Member'}
          </button>
        </div>

      </div>
    </div>
  );
}