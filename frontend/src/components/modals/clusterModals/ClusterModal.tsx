import { useState, useRef, useEffect } from 'react';
import { X, Church, UserCheck, ShieldCheck, Layers, Search, Check, ChevronDown, Save } from 'lucide-react';
import { useRegisterCluster } from '../../../hooks/useClusters';
// I-adjust ang import path base sa kung nasaan ang components mo
import { modalAnimation } from '../../../utils/ModalAnimation';
import SectionHeader from '../../ui/SectionHeader';
import { InputField } from '../../inputs/InputField';
import { SelectField } from '../../inputs/SelectField';

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

// Mock data para sa mga pwedeng maging Cluster Head
const MOCK_HEADS = [
  { id: 1, name: "Ptr. Juan Dela Cruz" },
  { id: 2, name: "Ptr. Mark Santos" },
  { id: 3, name: "Ptr. David Reyes" },
  { id: 4, name: "Ptr. Michael Tan" },
  { id: 5, name: "Ptra. Sarah Jenkins" },
  { id: 6, name: "Ptr. Alexander Lim" },
];

const CHURCH_OPTIONS = [
  { value: '1', label: 'GCF SouthMetro (Main Campus)' },
  { value: '2', label: 'GCF Bacoor' },
  { value: '3', label: 'GCF Alfonso' },
];

export default function ClusterModal({ isOpen, onClose, initialData }: ClusterModalProps) {
  const { isClosing, startClose, handleAnimationEnd } = modalAnimation(onClose);
  const { mutate: addCluster } = useRegisterCluster();
  
  const [formData, setFormData] = useState({
    church_id: initialData?.church_id || 1,
    name: initialData?.name || '',
    code: initialData?.code || '',
    member_id: initialData?.member_id || 2,
    is_active: initialData?.is_active ?? true,
  });

  // States para sa Searchable Dropdown ng Cluster Head
  const [isHeadOpen, setIsHeadOpen] = useState(false);
  const [headSearchQuery, setHeadSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hanapin ang pangkasalukuyang napiling head para ma-display sa trigger button
  const selectedHeadName = MOCK_HEADS.find(h => h.id === formData.member_id)?.name || "Select cluster head...";

  // Filtered heads base sa tina-type sa search box
  const filteredHeads = MOCK_HEADS.filter(head => 
    head.name.toLowerCase().includes(headSearchQuery.toLowerCase())
  );

  // Close dropdown kapag nag-click sa labas
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsHeadOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

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
        
        {/* Header - Dynamic background consistent sa theme */}
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
                <SelectField 
                  label="Church" 
                  name="church_id" 
                  defaultValue={formData.church_id}
                  options={CHURCH_OPTIONS}
                  required
                  onChange={(e) => setFormData({ ...formData, church_id: Number(e.target.value) })}
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

            {/* Section 3: Cluster Leadership (Searchable Dropdown) */}
            <div>
              <SectionHeader title="Cluster Leadership" icon={UserCheck} />
              <div className="space-y-2 relative mt-2" ref={dropdownRef}>
                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider ml-1">Cluster Head (Leader) <span className="text-red-500">*</span></label>

                {/* Trigger Button */}
                <div
                  onClick={() => setIsHeadOpen(!isHeadOpen)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all shadow-sm"
                >
                  <span className="font-medium">{selectedHeadName}</span>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isHeadOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Dropdown Menu na may Search Feature */}
                {isHeadOpen && (
                  <div className="absolute left-0 right-0 mt-0 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-fadeIn">
                    
                    {/* Search Input sa loob ng dropdown */}
                    <div className="relative group p-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                      <Search size={15} className="text-slate-400 group-focus-within:text-[var(--active-parent,rgb(99,102,241))] transition-colors" />
                      <input
                        type="text"
                        placeholder="Search leader name..."
                        value={headSearchQuery}
                        onChange={(e) => setHeadSearchQuery(e.target.value)}
                        className="w-full bg-transparent text-sm text-slate-800 focus:outline-none placeholder:text-slate-400"
                        autoFocus
                      />
                      <input type="hidden" name="member_id" value={formData.member_id} />
                    </div>

                    {/* List ng Results */}
                    <div className="max-h-52 overflow-y-auto p-1.5 space-y-1">
                      {filteredHeads.length === 0 ? (
                        <div className="text-center py-4 text-xs text-slate-400 font-medium">
                          No leader found.
                        </div>
                      ) : (
                        filteredHeads.map((head) => {
                          const isSelected = formData.member_id === head.id;
                          return (
                            <div
                              key={head.id}
                              onClick={() => {
                                setFormData({ ...formData, member_id: head.id });
                                setIsHeadOpen(false);
                                setHeadSearchQuery('');
                              }}
                              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer transition-all ${
                                isSelected 
                                  ? 'bg-[var(--active-parent,rgb(99,102,241))]/70 text-white font-medium' 
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span>{head.name}</span>
                              {isSelected && (
                                <div className="w-4 h-4 rounded-full bg-emerald-600 border-emerald-300 flex items-center justify-center">
                                  <Check size={14} className="text-white" />
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
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

              {/* Custom Toggle Switch */}
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

        {/* Footer Actions - Sticky (Consistent with VisitorModal) */}
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