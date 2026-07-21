import { useState, useRef, useEffect } from 'react';
import { X, Church, Tag, UserCheck, ShieldCheck, Layers, Search, Check, ChevronDown } from 'lucide-react';

interface ClusterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    church_id: number;
    name: string;
    code: string;
    head_id: number;
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

export default function ClusterModal({ isOpen, onClose, initialData }: ClusterModalProps) {
  const [formData, setFormData] = useState({
    church_id: initialData?.church_id || 1,
    name: initialData?.name || '',
    code: initialData?.code || '',
    head_id: initialData?.head_id || 2,
    is_active: initialData?.is_active ?? true,
  });

  // States para sa Searchable Dropdown ng Cluster Head
  const [isHeadOpen, setIsHeadOpen] = useState(false);
  const [headSearchQuery, setHeadSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hanapin ang pangkasalukuyang napiling head para ma-display sa trigger button
  const selectedHeadName = MOCK_HEADS.find(h => h.id === formData.head_id)?.name || "Select cluster head...";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Payload to POST:", formData);
    alert("Check console for POST payload structure!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container */}
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden transition-all transform scale-100">
        
        {/* Modal Header */}
        <div className="px-8 py-6 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-50 text-[#0284c7] rounded-2xl shadow-sm">
              <Layers size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {initialData ? 'Edit Cluster' : 'Create New Cluster'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Fill in the details to configure church cluster structure.
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-full transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Church Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Church size={14} className="text-[#0284c7]" /> Associated Church
            </label>
            <select
              value={formData.church_id}
              onChange={(e) => setFormData({ ...formData, church_id: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] transition-all"
            >
              <option value={1}>GCF SouthMetro (Main Campus)</option>
              <option value={2}>GCF Bacoor</option>
              <option value={3}>GCF Alfonso</option>
            </select>
          </div>

          {/* Grid for Name & Code */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Cluster Name */}
            <div className="md:col-span-2 space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Tag size={14} className="text-[#0284c7]" /> Cluster Name
              </label>
              <input
                type="text"
                placeholder="e.g. Dasma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] transition-all"
                required
              />
            </div>

            {/* Cluster Code */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                Code
              </label>
              <input
                type="text"
                placeholder="DSM"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-bold uppercase tracking-widest text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] transition-all"
                required
              />
            </div>
          </div>

          {/* SEARCHABLE SELECTBOX PARA SA CLUSTER HEAD (`head_id`) */}
          <div className="space-y-2 relative" ref={dropdownRef}>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <UserCheck size={14} className="text-[#0284c7]" /> Cluster Head (Leader)
            </label>

            {/* Trigger Button */}
            <div
              onClick={() => setIsHeadOpen(!isHeadOpen)}
              className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all shadow-sm"
            >
              <span>{selectedHeadName}</span>
              <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isHeadOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown Menu na may Search Feature */}
            {isHeadOpen && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-fadeIn">
                
                {/* Search Input sa loob ng dropdown */}
                <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                  <Search size={15} className="text-slate-400 ml-1" />
                  <input
                    type="text"
                    placeholder="Search leader name..."
                    value={headSearchQuery}
                    onChange={(e) => setHeadSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-slate-800 focus:outline-none placeholder:text-slate-400"
                    autoFocus
                  />
                </div>

                {/* List ng Results */}
                <div className="max-h-52 overflow-y-auto p-1.5 space-y-1">
                  {filteredHeads.length === 0 ? (
                    <div className="text-center py-4 text-xs text-slate-400 font-medium">
                      No leader found.
                    </div>
                  ) : (
                    filteredHeads.map((head) => {
                      const isSelected = formData.head_id === head.id;
                      return (
                        <div
                          key={head.id}
                          onClick={() => {
                            setFormData({ ...formData, head_id: head.id });
                            setIsHeadOpen(false);
                            setHeadSearchQuery('');
                          }}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-sky-50 text-[#0284c7]' 
                              : 'text-slate-700 hover:bg-slate-100/70'
                          }`}
                        >
                          <span>{head.name}</span>
                          {isSelected && <Check size={16} className="text-[#0284c7]" />}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Active Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${formData.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
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
                formData.is_active ? 'bg-[#0284c7]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.is_active ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0284c7] hover:bg-[#026ca1] text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-sky-500/20 active:scale-95"
            >
              Save Cluster
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}