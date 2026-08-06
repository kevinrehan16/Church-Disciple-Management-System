import { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Church, 
  UserCheck, 
  ShieldCheck, 
  Search, 
  Check, 
  ChevronDown, 
  Save, 
  Calendar, 
  Users 
} from 'lucide-react';
import { useRegisterGrowthGroup } from '../../../hooks/useGrowthGroup';
// I-adjust ang import path base sa folder structure mo
import { modalAnimation } from '../../../utils/ModalAnimation';
import SectionHeader from '../../ui/SectionHeader';
import { InputField } from '../../inputs/InputField';
import { SelectField } from '../../inputs/SelectField';

interface GrowthGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    church_id: number;
    cluster_id: number;
    leader_id: number;
    name: string;
    code: string;
    meeting_day: string;
    meeting_time: string;
    location_type: string;
    venue_address: string;
    target_demographic: string;
    is_active: boolean;
  };
}

// Mock Data Options
const MOCK_LEADERS = [
  { id: 1, name: "Ptr. Juan Dela Cruz" },
  { id: 2, name: "Ptr. Mark Santos" },
  { id: 3, name: "Ptr. David Reyes" },
  { id: 4, name: "Bro. Christian Lim" },
  { id: 5, name: "Sis. Sarah Jenkins" },
  { id: 6, name: "Bro. Michael Tan" },
  { id: 7, name: "Bro. Peter Chan" },
  { id: 8, name: "Bro. Rimer Regalado" },
];

const CHURCH_OPTIONS = [
  { value: '1', label: 'GCF SouthMetro (Main Campus)' },
  { value: '2', label: 'GCF Bacoor' },
  { value: '3', label: 'GCF Alfonso' },
];

const CLUSTER_OPTIONS = [
  { value: '1', label: 'Cluster 1 - Metro South' },
  { value: '2', label: 'Cluster 2 - Cavite North' },
  { value: '3', label: 'Cluster 3 - Upland Cavite' },
];

const DAY_OPTIONS = [
  { value: 'Sunday', label: 'Sunday' },
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Saturday', label: 'Saturday' },
];

const LOCATION_TYPE_OPTIONS = [
  { value: 'onsite', label: 'Onsite / Physical' },
  { value: 'online', label: 'Online (Zoom / Meet)' },
  { value: 'hybrid', label: 'Hybrid' },
];

const DEMOGRAPHIC_OPTIONS = [
  { value: 'nextgen', label: 'NextGen / Youth' },
  { value: 'singles', label: 'Young Adults / Singles' },
  { value: 'couples', label: 'Married Couples' },
  { value: 'men', label: "Men's Ministry" },
  { value: 'women', label: "Women's Ministry" },
  { value: 'adults', label: 'General Adults' },
];

export default function GrowthGroupModal({ isOpen, onClose, initialData }: GrowthGroupModalProps) {
  const { isClosing, startClose, handleAnimationEnd } = modalAnimation(onClose);
  const { mutate: addGrowthGroup } = useRegisterGrowthGroup();
  
  const [formData, setFormData] = useState({
    church_id: initialData?.church_id || 1,
    cluster_id: initialData?.cluster_id || 1,
    leader_id: initialData?.leader_id || 1,
    name: initialData?.name || '',
    code: initialData?.code || '',
    meeting_day: initialData?.meeting_day || 'Sunday',
    meeting_time: initialData?.meeting_time || '13:00:00',
    location_type: initialData?.location_type || 'onsite',
    venue_address: initialData?.venue_address || '',
    target_demographic: initialData?.target_demographic || 'nextgen',
    is_active: initialData?.is_active ?? true,
  });

  // States para sa Searchable Leader Dropdown
  const [isLeaderOpen, setIsLeaderOpen] = useState(false);
  const [leaderSearchQuery, setLeaderSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLeaderName = MOCK_LEADERS.find(l => l.id === formData.leader_id)?.name || "Select group leader...";

  const filteredLeaders = MOCK_LEADERS.filter(leader => 
    leader.name.toLowerCase().includes(leaderSearchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLeaderOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addGrowthGroup(formData, { onSuccess: () => startClose() });
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
              {initialData ? 'Edit Growth Group' : 'Create New Growth Group'}
            </h2>
            <p className="text-white/80 text-xs mt-0.5 font-medium">
              Fill in the details to set up a new discipleship growth group.
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
          <form id="growth-group-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Hierarchy Association */}
            <div>
              <SectionHeader title="Church & Cluster Assignment" icon={Church} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <SelectField 
                  label="Church" 
                  name="church_id" 
                  value={formData.church_id}
                  options={CHURCH_OPTIONS}
                  required
                  onChange={(e) => setFormData({ ...formData, church_id: Number(e.target.value) })}
                />

                <SelectField 
                  label="Cluster" 
                  name="cluster_id" 
                  value={formData.cluster_id}
                  options={CLUSTER_OPTIONS}
                  required
                  onChange={(e) => setFormData({ ...formData, cluster_id: Number(e.target.value) })}
                />
              </div>
            </div>

            {/* Section 2: Group Information */}
            <div>
              <SectionHeader title="Group Information" icon={Users} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="md:col-span-2">
                  <InputField
                    label="Group Name"
                    name="name"
                    placeholder="e.g. Arise"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <InputField
                    label="Group Code"
                    name="code"
                    placeholder="e.g. ARISE"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <SelectField 
                  label="Target Demographic" 
                  name="target_demographic" 
                  value={formData.target_demographic}
                  options={DEMOGRAPHIC_OPTIONS}
                  required
                  onChange={(e) => setFormData({ ...formData, target_demographic: e.target.value })}
                />
              </div>
            </div>

            {/* Section 3: Leadership */}
            <div>
              <SectionHeader title="Group Leadership" icon={UserCheck} />
              <div className="space-y-2 relative mt-2" ref={dropdownRef}>
                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider ml-1">
                  Group Leader <span className="text-red-500">*</span>
                </label>

                {/* Trigger Button */}
                <div
                  onClick={() => setIsLeaderOpen(!isLeaderOpen)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-300 transition-all shadow-sm"
                >
                  <span className="font-medium">{selectedLeaderName}</span>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isLeaderOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Dropdown Menu na may Search */}
                {isLeaderOpen && (
                  <div className="absolute left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-fadeIn">
                    <div className="relative group p-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                      <Search size={15} className="text-slate-400 group-focus-within:text-[var(--active-parent,rgb(99,102,241))] transition-colors" />
                      <input
                        type="text"
                        placeholder="Search leader name..."
                        value={leaderSearchQuery}
                        onChange={(e) => setLeaderSearchQuery(e.target.value)}
                        className="w-full bg-transparent text-sm text-slate-800 focus:outline-none placeholder:text-slate-400"
                        autoFocus
                      />
                    </div>

                    <div className="max-h-52 overflow-y-auto p-1.5 space-y-1">
                      {filteredLeaders.length === 0 ? (
                        <div className="text-center py-4 text-xs text-slate-400 font-medium">
                          No leader found.
                        </div>
                      ) : (
                        filteredLeaders.map((leader) => {
                          const isSelected = formData.leader_id === leader.id;
                          return (
                            <div
                              key={leader.id}
                              onClick={() => {
                                setFormData({ ...formData, leader_id: leader.id });
                                setIsLeaderOpen(false);
                                setLeaderSearchQuery('');
                              }}
                              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer transition-all ${
                                isSelected 
                                  ? 'bg-[var(--active-parent,rgb(99,102,241))]/70 text-white font-medium' 
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span>{leader.name}</span>
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

            {/* Section 4: Meeting Schedule & Location */}
            <div>
              <SectionHeader title="Meeting Schedule & Venue" icon={Calendar} />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <SelectField 
                  label="Meeting Day" 
                  name="meeting_day" 
                  value={formData.meeting_day}
                  options={DAY_OPTIONS}
                  required
                  onChange={(e) => setFormData({ ...formData, meeting_day: e.target.value })}
                />

                <InputField
                  label="Meeting Time"
                  name="meeting_time"
                  type="time"
                  step="1"
                  value={formData.meeting_time}
                  onChange={(e) => setFormData({ ...formData, meeting_time: e.target.value })}
                  required
                />

                <SelectField 
                  label="Location Type" 
                  name="location_type" 
                  value={formData.location_type}
                  options={LOCATION_TYPE_OPTIONS}
                  required
                  onChange={(e) => setFormData({ ...formData, location_type: e.target.value })}
                />
              </div>

              <div className="mt-4">
                <InputField
                  label="Venue Address / Link"
                  name="venue_address"
                  placeholder="e.g. GCFSouthMetro, 2nd Floor, Room 310 or Zoom Link"
                  value={formData.venue_address}
                  onChange={(e) => setFormData({ ...formData, venue_address: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Section 5: Active Status Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${formData.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Group Status</h4>
                  <p className="text-xs text-slate-500">Enable this growth group for operational & member assignment use.</p>
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
            form="growth-group-form" 
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/10 transition-all flex items-center gap-2"
          >
            <Save size={15} /> Save Growth Group
          </button>
        </div>

      </div>
    </div>
  );
}