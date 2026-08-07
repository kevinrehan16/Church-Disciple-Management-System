import { useState } from 'react';
import { 
  X, 
  Church, 
  UserCheck, 
  ShieldCheck, 
  Save, 
  Calendar, 
  Users,
  MapPinned 
} from 'lucide-react';
import { useRegisterGrowthGroup } from '../../../hooks/useGrowthGroup';
import { modalAnimation } from '../../../utils/ModalAnimation';
import SectionHeader from '../../ui/SectionHeader';
import { InputField } from '../../inputs/InputField';
import { SelectField } from '../../inputs/SelectField';
import { SearchableSelect } from '../../inputs/SearchableSelect';
import { useChurches } from '../../../hooks/useChurches';
import { useClustersByChurchId } from '../../../hooks/useClusters';
import { useMembers } from '../../../hooks/useMembers';

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
    church_id: initialData?.church_id || 0,
    cluster_id: initialData?.cluster_id || 0,
    leader_id: initialData?.leader_id || 0,
    name: initialData?.name || '',
    code: initialData?.code || '',
    meeting_day: initialData?.meeting_day || 'Sunday',
    meeting_time: initialData?.meeting_time || '13:00:00',
    location_type: initialData?.location_type || 'onsite',
    venue_address: initialData?.venue_address || '',
    target_demographic: initialData?.target_demographic || 'nextgen',
    is_active: initialData?.is_active ?? true,
  });

  // State para sa Leader search query sa SearchableSelect
  const [leaderSearchTerm, setLeaderSearchTerm] = useState('');

  // Universal Handle Change para sa mga inputs at SearchableSelect
  const handleChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['church_id', 'cluster_id', 'leader_id'].includes(name) ? Number(value) : value,
      // Automatic na i-reset ang cluster_id kapag pinalitan ang church_id
      ...(name === 'church_id' ? { cluster_id: 0 } : {})
    }));
  };

  // Paggamit ng useChurches hook
  const { data: apiChurch } = useChurches({ 
    search: '', 
    page: 1 
  });
  
  // Paggamit ng useClustersByChurchId hook base sa napiling church_id
  const { data: apiClusters } = useClustersByChurchId({ 
    church_id: formData.church_id || 0, 
    search: '', 
  });

  // Paggamit ng useMembers para sa Group Leader selection na may search
  const { data: apiLeader } = useMembers({
    search: leaderSearchTerm,
    page: 1,
  });

  // Pag-map ng Church data papuntang { id, name }
  const churchList = Array.isArray(apiChurch) 
    ? apiChurch.map((church: any) => ({ id: church.id, name: church.name }))
    : Array.isArray(apiChurch?.data) 
      ? apiChurch.data.map((church: any) => ({ id: church.id, name: church.name }))
      : [];

  // Pag-map ng Cluster data papuntang { id, name }
  const clusterList = Array.isArray(apiClusters) 
    ? apiClusters.map((cluster: any) => ({ id: cluster.id, name: cluster.name }))
    : Array.isArray(apiClusters?.data) 
      ? apiClusters.data.map((cluster: any) => ({ id: cluster.id, name: cluster.name }))
      : [];

  // Pag-map ng Leader data papuntang { id, name } galing sa members API
  const currentLeaders = Array.isArray(apiLeader) 
    ? apiLeader 
    : (apiLeader?.data || []);

  const leaderList = currentLeaders.map((member: any) => ({
    id: member.id,
    name: member.full_name,
  }));

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
            type="button"
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
                <SearchableSelect
                  label="GCF Church Attending"
                  name="church_id"
                  value={formData.church_id || ''}
                  options={churchList}
                  placeholder="Select Church"
                  icon={<Church size={15} />}
                  onChange={handleChange}
                />

                <SearchableSelect
                  label="GCF Cluster Group"
                  name="cluster_id"
                  value={formData.cluster_id || ''}
                  options={clusterList}
                  placeholder="Select Cluster"
                  icon={<MapPinned size={15} />}
                  onChange={handleChange}
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
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <InputField
                    label="Group Code"
                    name="code"
                    placeholder="e.g. ARISE"
                    value={formData.code}
                    onChange={handleChange}
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
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Section 3: Leadership */}
            <div>
              <SectionHeader title="Group Leadership" icon={UserCheck} />
              <div className="mt-2">
                <SearchableSelect
                  label="Group Leader"
                  name="leader_id"
                  value={formData.leader_id || ''}
                  options={leaderList}
                  placeholder="Select Group Leader"
                  icon={<UserCheck size={15} />}
                  onChange={handleChange}
                  onSearchChange={(text: string) => setLeaderSearchTerm(text)}
                />
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
                  onChange={handleChange}
                />

                <InputField
                  label="Meeting Time"
                  name="meeting_time"
                  type="time"
                  step="1"
                  value={formData.meeting_time}
                  onChange={handleChange}
                  required
                />

                <SelectField 
                  label="Location Type" 
                  name="location_type" 
                  value={formData.location_type}
                  options={LOCATION_TYPE_OPTIONS}
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="mt-4">
                <InputField
                  label="Venue Address / Link"
                  name="venue_address"
                  placeholder="e.g. GCFSouthMetro, 2nd Floor, Room 310 or Zoom Link"
                  value={formData.venue_address}
                  onChange={handleChange}
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