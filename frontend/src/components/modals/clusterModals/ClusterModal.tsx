import { useState, useEffect } from 'react';
import { X, Church, UserCheck, ShieldCheck, Layers, Save, UserStar } from 'lucide-react';
import { useRegisterCluster } from '../../../hooks/useClusters';
import { useMembers } from '../../../hooks/useMembers';
import { modalAnimation } from '../../../utils/ModalAnimation';
import { useChurches } from '../../../hooks/useChurches';
import SectionHeader from '../../ui/SectionHeader';
import { InputField } from '../../inputs/InputField';
import { SearchableSelect } from '../../inputs/SearchableSelect';

interface ClusterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    church_id: number;
    name: string;
    code: string;
    member_id: number;
    is_active: boolean;
  };
}

export default function ClusterModal({ isOpen, onClose, initialData }: ClusterModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { isClosing, startClose, handleAnimationEnd } = modalAnimation(onClose);
  const { mutate: addCluster } = useRegisterCluster();

  // Fetch Churches data
  const { data: apiChurch } = useChurches({ 
    search: '', 
    page: 1 
  });

  const churchList = Array.isArray(apiChurch) 
    ? apiChurch.map((church: any) => ({ value: church.id, label: church.name, id: church.id, name: church.name }))
    : Array.isArray(apiChurch?.data) 
      ? apiChurch.data.map((church: any) => ({ value: church.id, label: church.name, id: church.id, name: church.name }))
      : [];
  
  // Form State
  const [formData, setFormData] = useState({
    church_id: initialData?.church_id || 1,
    name: initialData?.name || '',
    code: initialData?.code || '',
    member_id: initialData?.member_id || 0,
    is_active: initialData?.is_active ?? true,
  });

  // Fetch Members/Leaders data
  const { data: apiInterviewer } = useMembers({
    search: searchTerm,
    page: 1,
    position: 'Elder,Deacon,Pastoral Staff,Senior Pastor,Pastor',
  });

  const currentInterviewers = Array.isArray(apiInterviewer) 
    ? apiInterviewer 
    : (apiInterviewer?.data || []);
  
  const headOptions = currentInterviewers.map((member: any) => ({
    value: member.id,
    label: member.full_name,
    id: member.id,
    name: member.full_name,
  }));

  if (!isOpen) return null;

  // Handler para sa pagbabago ng Church selection
  const handleChurchChange = (val: any) => {
    const selectedValue = val?.target ? val.target.value : val;
    setFormData((prev) => ({ ...prev, church_id: Number(selectedValue) }));
  };

  // Handler para sa pagbabago ng Cluster Head selection
  const handleHeadChange = (val: any) => {
    const selectedValue = val?.target ? val.target.value : val;
    setFormData((prev) => ({ ...prev, member_id: Number(selectedValue) }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addCluster(formData, { onSuccess: () => startClose() });
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 ${isClosing ? 'modal-overlay closing' : 'modal-overlay'}`}
      onAnimationEnd={handleAnimationEnd}
    >
      {/* Modal Container */}
      <div className={`bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200/80 flex flex-col max-h-[92vh] ${isClosing ? 'modal-content closing' : 'modal-content'}`}>
        
        {/* Header */}
        <div className="px-8 py-6 bg-[var(--active-parent)] flex items-center justify-between text-white flex-shrink-0">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">
              {initialData ? 'Edit Cluster' : 'Create New Cluster'}
            </h2>
            <p className="text-white/80 text-xs mt-0.5 font-medium">
              Fill in the details to configure church cluster structure.
            </p>
          </div>
          <button 
            onClick={startClose} 
            className="p-2 hover:bg-white/10 active:scale-95 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <form id="cluster-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Associated Church */}
            <div>
              <SectionHeader title="Associated Church" icon={Church} />
              <div className="mt-2">
                <SearchableSelect
                  label="Church"
                  name="church_id"
                  value={formData.church_id || ''}
                  options={churchList}
                  placeholder="Select Church"
                  icon={<Church size={15} />}
                  onChange={handleChurchChange}
                />
              </div>
            </div>

            {/* Section 2: Cluster Information */}
            <div>
              <SectionHeader title="Cluster Information" icon={Layers} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {/* Cluster Name */}
                <div className="md:col-span-2">
                  <InputField
                    label="Cluster Name"
                    name="name"
                    placeholder="e.g. Dasma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                {/* Cluster Code */}
                <div>
                  <InputField
                    label="Code"
                    name="code"
                    placeholder="DSM"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Cluster Leadership */}
            <div>
              <SectionHeader title="Cluster Leadership" icon={UserCheck} />
              <div className="mt-2">
                <SearchableSelect
                  label="Cluster Head (Leader)"
                  name="member_id"
                  value={formData.member_id || ''}
                  options={headOptions}
                  placeholder="Select Cluster Head"
                  icon={<UserStar size={15} />}
                  onChange={handleHeadChange}
                  onSearchChange={(text: string) => setSearchTerm(text)}
                />
              </div>
            </div>

            {/* Section 4: Active Status Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${formData.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Cluster Status</h4>
                  <p className="text-xs text-slate-500">Enable this cluster for operational use.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  formData.is_active ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.is_active ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
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
            form="cluster-form" 
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/10 transition-all flex items-center gap-2"
          >
            <Save size={15} /> Save Cluster
          </button>
        </div>

      </div>
    </div>
  );
}