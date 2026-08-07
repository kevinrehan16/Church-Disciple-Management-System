import React, { useState, useEffect } from 'react';
import { 
  X, Mail, Calendar, Phone, MapPin, Save, ShieldCheck, UserStar, IdCardLanyard, Users, House,
  Briefcase, Church, MapPinned, Building, Cross, NotepadText, ThumbsUp
} from 'lucide-react';
import { useMembers, useRegisterMember, useUpdateMember } from '../../../hooks/useMembers';
import { useSpiritualGift } from '../../../hooks/useSpiritualGift';
import { useMemberProfile } from '../../../hooks/useProfiles';
import { useChurches } from '../../../hooks/useChurches';
import { useClustersByChurchId } from '../../../hooks/useClusters';
import { modalAnimation } from '../../../utils/ModalAnimation';
import { InputField } from '../../inputs/InputField';
import { SelectField as SelectFieldBase } from '../../inputs/SelectField';
import { MultiSelect } from '../../inputs/MultiSelect';
import { SearchableSelect } from '../../inputs/SearchableSelect';
import { calculateAge, sanitizeNumber, getTodayDate } from '../../../utils/formatters';
import SectionHeader from '../../ui/SectionHeader';

const SelectField = SelectFieldBase as unknown as React.ComponentType<any>;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId?: string | null; 
}

export default function RegisterMemberModal({ isOpen, onClose, memberId }: ModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { isClosing, startClose, handleAnimationEnd } = modalAnimation(onClose);
  const { mutate: addMember, isPending: pendingAddMember } = useRegisterMember();
  const { mutate: updateMember } = useUpdateMember();
  const { data: apiResponse, isLoading } = useSpiritualGift();
  const [isActive, setIsActive] = useState(true);
  
  // 1. Ideklara muna ang formDataState sa unahan para magamit sa mga queries sa ibaba
  const [formDataState, setFormDataState] = useState<Record<string, any>>({});
  const [selectedGiftIds, setSelectedGiftIds] = useState<number[]>([]);
  
  // 2. Kunin ang profile data kapag may memberId
  const numericMemberId = memberId ? Number(memberId) : 0;
  const { data: profileMemberData, isLoading: profileLoading } = useMemberProfile(numericMemberId);

  const { data: apiInterviewer } = useMembers({
    search: searchTerm,
    page: 1,
    position: 'Elder,Deacon,Pastoral Staff,Senior Pastor,Pastor',
  });
  const currentInterviewers = Array.isArray(apiInterviewer) 
    ? apiInterviewer 
    : (apiInterviewer?.data || []);
  
  const interviewerOptions = currentInterviewers.map((member: any) => ({
    id: member.id,
    name: member.full_name, // Ginamit natin ang full_name galing sa data mo
  }));

  // 3. Kunin ang listahan ng churches at clusters (nakakonekta na kay formDataState.church_id)
  const { data: apiChurch } = useChurches({ 
    search: '', 
    page: 1 
  });

  const { data: apiClusters } = useClustersByChurchId({ 
    church_id: formDataState.church_id || '', 
    search: '', 
  });

  const churchList = Array.isArray(apiChurch) 
    ? apiChurch.map((church: any) => ({ id: church.id, name: church.name }))
    : Array.isArray(apiChurch?.data) 
      ? apiChurch.data.map((church: any) => ({ id: church.id, name: church.name }))
      : [];

  const clusterList = Array.isArray(apiClusters) 
    ? apiClusters.map((cluster: any) => ({ id: cluster.id, name: cluster.name }))
    : Array.isArray(apiClusters?.data) 
      ? apiClusters.data.map((cluster: any) => ({ id: cluster.id, name: cluster.name }))
      : [];

  const giftsList = Array.isArray(apiResponse) ? apiResponse : [];

  // Effect para sa Edit Mode o New Registration Reset
  useEffect(() => {
    if (profileMemberData) {
      const data = ((profileMemberData as { data?: Record<string, any> } | undefined)?.data ?? profileMemberData) as Record<string, any>;

      setFormDataState(data);
      setIsActive(data.member_status === 'Active');

      if (data.spiritual_gifts && Array.isArray(data.spiritual_gifts)) {
        setSelectedGiftIds(data.spiritual_gifts.map((g: any) => g.id));
      }
    } else {
      setFormDataState({});
      setSelectedGiftIds([]);
      setIsActive(true);
    }
  }, [profileMemberData]);

  const giftOptions = giftsList.map((gift: any) => ({
    value: gift.id,                         
    label: gift.name,                           
    description: gift.description, 
  }));

  // Auto compute age kapag nagbago ang birthday
  useEffect(() => {
    if (formDataState.birthday) {
      const computedAge = calculateAge(formDataState.birthday);
      
      setFormDataState(prev => {
        if (prev.age !== computedAge) {
          return { ...prev, age: computedAge };
        }
        return prev;
      });
    }
  }, [formDataState.birthday]);

  if (!isOpen) return null;

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | { target: { name: string; value: string } }
  ) => {
    const target = e.target as { name: string; value: string };
    const { name, value } = target;
    
    let finalValue = value;

    if (name === 'mobile_number') {
      finalValue = sanitizeNumber(value);
    }

    setFormDataState(prev => {
      // Kung nagbago ang Church, i-reset natin ang Cluster ID para hindi magtira ng lumang selection
      if (name === 'church_id' && prev.church_id !== value) {
        return { ...prev, [name]: finalValue, cluster_id: '' };
      }
      return { ...prev, [name]: finalValue };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = new FormData(e.currentTarget);
    const data = Object.fromEntries(formElement.entries());

    const formattedData = {
        ...data,
        church_id: formDataState.church_id,
        cluster_id: formDataState.cluster_id,
        baptized_immersion: data.baptized_immersion === '1',
        rec_for_baptism: data.rec_for_baptism === '1',
        rec_for_membership: data.rec_for_membership === '1',
        member_status: isActive ? 'Active' : 'Inactive',
        age: parseInt(data.age as string) || 0,
        spiritual_gifts: selectedGiftIds, 
        interviewby_member_id: formDataState.interviewby_member_id,
    };

    if (memberId) {
      updateMember({ id: memberId, memberData: formattedData }, { onSuccess: () => startClose() });
    } else {
      addMember(formattedData, { onSuccess: () => startClose() });
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 ${isClosing ? 'modal-overlay closing' : 'modal-overlay'}`}
      onAnimationEnd={handleAnimationEnd}>
        
        <div className={`bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200/80 flex flex-col max-h-[92vh] ${isClosing ? 'modal-content closing' : 'modal-content'}`}>
          
          {/* HEADER */}
          <div className="px-8 py-6 bg-[var(--active-parent)] flex items-center justify-between text-white flex-shrink-0">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">
                {memberId ? 'Edit Member Profile' : 'New Member Registration'}
              </h2>
              <p className="text-white/80 text-xs mt-0.5 font-medium">
                {memberId ? 'Update record details' : 'Complete the member registration form'}
              </p>
            </div>
            <button onClick={startClose} className="p-2 hover:bg-white/10 active:scale-95 rounded-full transition-all">
              <X size={20} />
            </button>
          </div>

          {/* SCROLLABLE BODY */}
          <div className="p-8 overflow-y-auto flex-grow scrollbar-thin bg-slate-50/30">
            {profileLoading ? (
              <div className="flex justify-center items-center py-20">
                <p className="text-sm font-semibold text-slate-500">Loading profile data...</p>
              </div>
            ) : (
              <form id="member-form" onSubmit={handleSubmit} className="space-y-10">
                
                {/* SECTION: ID & AUTH */}
                <div className="space-y-5">
                  <SectionHeader title="Account" icon={ShieldCheck} />
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
                    <InputField label="Email Address" placeholder='johndoe@gmail.com' name="email" type="email" value={formDataState.email || ''} onChange={handleChange} icon={<Mail size={15}/>} />
                    <div className='hidden'>
                      <InputField label="Picture Path" name="picture" value={formDataState.picture || ''} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                {/* SECTION: PERSONAL */}
                <div className="space-y-5">
                  <SectionHeader title="Personal Identity" icon={IdCardLanyard} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <InputField label="First Name" name="first_name" placeholder='Johnny' value={formDataState.first_name || ''} onChange={handleChange} />
                    <InputField label="Middle Name" name="middle_name" placeholder='Smith' value={formDataState.middle_name || ''} onChange={handleChange} />
                    <InputField label="Last Name" name="last_name" placeholder='Doe' value={formDataState.last_name || ''} onChange={handleChange} />
                    <InputField label="Nickname" name="nickname" placeholder='John' value={formDataState.nickname || ''} onChange={handleChange} />
                    
                    <div className="flex flex-col gap-1.5 w-full">
                      <div className="flex">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Birthday</label>
                      </div>
                      <div className={`flex w-full rounded-xl border border-slate-200 focus-within:border-[var(--active-parent,rgb(99,102,241))] focus-within:ring-4 focus-within:ring-[var(--active-parent,rgb(99,102,241))]/10 transition-all overflow-hidden`}>
                        <div className="relative flex-grow border-r border-slate-200">
                          <div className="absolute left-3 top-3 text-slate-400">
                            <Calendar size={15} />
                          </div>
                          <input 
                            type="date" 
                            name="birthday" 
                            value={formDataState.birthday || getTodayDate()} 
                            onChange={handleChange}
                            max={getTodayDate()}
                            className="w-full pl-10 pr-4 py-2.5 outline-none bg-transparent text-sm" 
                          />
                        </div>
                        <div className="w-24">
                          <input 
                            type="number"
                            name="age" 
                            placeholder="Age"
                            value={formDataState.age || ''} 
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 outline-none bg-transparent text-sm text-center" 
                            readOnly
                            disabled
                          />
                        </div>
                      </div>
                    </div>

                    <SelectField label="Gender" name="gender" value={formDataState.gender || ''} onChange={handleChange} options={[{label: 'Male', value: 'Male'}, {label: 'Female', value: 'Female'}]} />
                    <SelectField 
                      label="Life Stage" 
                      name="lifestage" 
                      value={formDataState.lifestage || ''} 
                      onChange={handleChange}
                      options={[
                        {label: 'Single', value: 'Single'}, 
                        {label: 'Married', value: 'Married'},
                        {label: 'Widowed', value: 'Widowed'},
                        {label: 'Separated', value: 'Separated'},
                        {label: 'Divorced', value: 'Divorced'}
                      ]} />
                    <InputField label="Mobile Number" name="mobile_number" value={formDataState.mobile_number || ''} onChange={handleChange} placeholder='0915*******' icon={<Phone size={15}/>} />
                    <InputField label="Facebook Name" name="facebook_name" value={formDataState.facebook_name || ''} onChange={handleChange} placeholder='John Doe'/>
                  </div>
                </div>

                {/* SECTION: FAMILY */}
                <div className="space-y-5">
                  <SectionHeader title="Family Information" icon={Users} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="Father's Name" name="father_name" value={formDataState.father_name || ''} onChange={handleChange} />
                    <InputField label="Mother's Name" name="mother_name" value={formDataState.mother_name || ''} onChange={handleChange} />
                    <InputField label="Spouse Name" name="spouse_name" value={formDataState.spouse_name || ''} onChange={handleChange} />
                  </div>
                </div>

                {/* SECTION: CONTACT & ADDRESS */}
                <div className="space-y-5">
                  <SectionHeader title="Residence Information" icon={House} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <InputField label="Home Address" name="home_address" value={formDataState.home_address || ''} onChange={handleChange} icon={<MapPin size={15}/>} />
                    </div>
                    <InputField label="Barangay" name="barangay" value={formDataState.barangay || ''} onChange={handleChange} />
                    <InputField label="City" name="city" value={formDataState.city || ''} onChange={handleChange} />
                    <InputField label="Region" name="region" value={formDataState.region || ''} onChange={handleChange} />
                    <InputField label="Country" name="country" value={formDataState.country || ''} onChange={handleChange} />
                  </div>
                </div>

                {/* SECTION: PROFESSIONAL */}
                <div className="space-y-5">
                  <SectionHeader title="Professional & Education" icon={Building} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="Occupation" name="occupation" value={formDataState.occupation || ''} onChange={handleChange} icon={<Briefcase size={15}/>} />
                    <InputField label="Industry" name="industry" value={formDataState.industry || ''} onChange={handleChange} />
                    <InputField label="High School" name="high_school" value={formDataState.high_school || ''} onChange={handleChange} />
                    <InputField label="College School" name="college_school" value={formDataState.college_school || ''} onChange={handleChange} />
                    <InputField label="College Degree" name="college_degree" value={formDataState.college_degree || ''} onChange={handleChange} />
                  </div>
                </div>

                {/* SECTION: CHRISTIAN EXPERIENCE */}
                <div className="space-y-5">
                  <SectionHeader title="Christian Experience" icon={Cross} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="Date Received Jesus" name="received_jesus" type="date" value={formDataState.received_jesus || getTodayDate()} onChange={handleChange} />
                    <SelectField 
                        label="Baptized (Immersion)?" 
                        name="baptized_immersion" 
                        value={formDataState.baptized_immersion == 1 || formDataState.baptized_immersion === true ? '1' : '0'} 
                        onChange={handleChange} 
                        options={[
                            {label: 'Yes', value: '1'}, 
                            {label: 'Not yet', value: '0'}
                        ]} 
                    />
                    <SelectField 
                        label="Recommendation for Baptism" 
                        name="rec_for_baptism" 
                        value={formDataState.rec_for_baptism == 1 || formDataState.rec_for_baptism === true ? '1' : '0'} 
                        onChange={handleChange} 
                        options={[
                            {label: 'Yes', value: '1'}, 
                            {label: 'No', value: '0'}
                        ]} 
                    />
                    <InputField label="Baptism Date" name="baptized_date" type="date" value={formDataState.baptized_date || getTodayDate()} onChange={handleChange} />
                    <div className="md:col-span-2">
                      <MultiSelect 
                        label="Spiritual Gifts" 
                        options={giftOptions} 
                        selected={selectedGiftIds} 
                        onChange={setSelectedGiftIds} 
                        disabled={isLoading} 
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION: OTHER INFORMATION */}
                <div className="space-y-5">
                  <SectionHeader title="Other Information" icon={NotepadText} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="Previous Church Attending" name="prev_church" value={formDataState.prev_church || ''} onChange={handleChange} />
                    <InputField label="Previous Church Affiliation" name="church_affiliation" value={formDataState.church_affiliation || ''} onChange={handleChange} />
                    
                    <SearchableSelect
                      label="GCF Church Attending"
                      name="church_id"
                      value={formDataState.church_id || ''}
                      options={churchList}
                      placeholder="Select Church"
                      icon={<Church size={15} />}
                      onChange={handleChange}
                    />

                    <SearchableSelect
                      label="GCF Cluster Group"
                      name="cluster_id"
                      value={formDataState.cluster_id || ''}
                      options={clusterList}
                      placeholder="Select Cluster"
                      icon={<MapPinned size={15} />}
                      onChange={handleChange}
                    />
                    <InputField label="Purpose of Registration" name="purpose_reg" value={formDataState.purpose_reg || ''} onChange={handleChange} />
                    <SelectField 
                      label="Membership Type" 
                      name="member_position" 
                      value={formDataState.member_position || ''} 
                      onChange={handleChange}
                      options={[ 
                        {label: 'Member', value: 'Growth Group Member'}, 
                        {label: 'Pastoral Staff', value: 'Pastoral Staff'}, 
                        {label: 'Deacon', value: 'Deacon'}, 
                        {label: 'Elder', value: 'Elder'}, 
                        {label: 'Pastor', value: 'Pastor'}, 
                        {label: 'Senior Pastor', value: 'Senior Pastor'}, 
                      ]} />
                  </div>
                </div>

                {/* SECTION: ELDER'S RECOMMENDATION */}
                <div className="space-y-5">
                  <SectionHeader title="Elder's Recommendation" icon={ThumbsUp} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <SearchableSelect
                      label="Interview Conducted By"
                      name="interviewby_member_id"
                      value={formDataState.interviewby_member_id || ''}
                      options={interviewerOptions}
                      placeholder="Select Interviewer"
                      icon={<UserStar size={15} />}
                      onChange={handleChange}
                      onSearchChange={(text: string) => setSearchTerm(text)}
                    />
                    <InputField label="Membership Date" name="membership_date" type="date" value={formDataState.membership_date || getTodayDate()} max={getTodayDate()} onChange={handleChange} />
                    <div className="md:col-span-2">
                      <InputField label="Comment" name="comment" value={formDataState.comment || ''} onChange={handleChange} />
                    </div>
                    <div className='hidden'>
                      <SelectField label="Recommendation for Membership" name="rec_for_membership" value={String(formDataState.rec_for_membership ? '1' : '0')} onChange={handleChange} options={[{label: 'Yes', value: '1'}, {label: 'No', value: '0'}]} />
                    </div>
                  </div>
                </div>

                {/* Section 4: Active Status Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Membership Status</h4>
                      <p className="text-xs text-slate-500">Enable this status for operational use.</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isActive ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isActive ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* FOOTER */}
          <div className="px-8 py-4 bg-slate-50 border-t border-slate-200/60 flex gap-3 justify-end flex-shrink-0">
            <button type="button" onClick={startClose} className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider border border-slate-200 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all flex items-center gap-2">
             <X size={15} /> Cancel
            </button>
            <button type="submit" disabled={pendingAddMember || profileLoading} form="member-form" className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-lg shadow-emerald-600/10 transition-all flex items-center gap-2">
              <Save size={15} /> {pendingAddMember ? 'Saving...' : 'Save Registration'}
            </button>
          </div>
        </div>
    </div>
  );
}