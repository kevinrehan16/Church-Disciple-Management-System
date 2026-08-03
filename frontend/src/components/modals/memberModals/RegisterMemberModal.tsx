import React, { useState, useEffect } from 'react';
import { 
  X, Mail, Calendar, Phone, MapPin, Save, ShieldCheck, 
  Briefcase, Church,
} from 'lucide-react';
import { useRegisterMember } from '../../../hooks/useMembers';
import { useSpiritualGift } from '../../../hooks/useSpiritualGift';
import { useMemberProfile } from '../../../hooks/useProfiles';
import { useChurches } from '../../../hooks/useChurches';
import { modalAnimation } from '../../../utils/ModalAnimation';
import { InputField } from '../../inputs/InputField';
import { SelectField as SelectFieldBase } from '../../inputs/SelectField';
import { MultiSelect } from '../../inputs/MultiSelect';
import { SearchableSelect } from '../../inputs/SearchableSelect';
import { calculateAge, sanitizeNumber, getTodayDate } from '../../../utils/formatters';

const SelectField = SelectFieldBase as unknown as React.ComponentType<any>;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId?: string | null; 
}

export default function RegisterMemberModal({ isOpen, onClose, memberId }: ModalProps) {
  const { isClosing, startClose, handleAnimationEnd } = modalAnimation(onClose);
  const { mutate: addMember, isPending: pendingAddMember } = useRegisterMember();
  const { data: apiResponse, isLoading } = useSpiritualGift();
  const [isActive, setIsActive] = useState(true);
  
  const { data: apiChurch } = useChurches(
    { 
      search: '', 
      page: 1 
    }
  );

  const churchList = Array.isArray(apiChurch) 
  ? apiChurch.map((church: any) => ({ id: church.id, name: church.name }))
  : Array.isArray(apiChurch?.data) 
    ? apiChurch.data.map((church: any) => ({ id: church.id, name: church.name }))
    : [];

  // Kunin ang profile data kapag may memberId
  const numericMemberId = memberId ? Number(memberId) : 0;
  const { data: profileMemberData, isLoading: profileLoading } = useMemberProfile(numericMemberId);

  const giftsList = Array.isArray(apiResponse) ? apiResponse : [];
  const [selectedGiftIds, setSelectedGiftIds] = useState<number[]>([]);

  // 1. Gumawa tayo ng state para sa form fields para madali nating ma-populate at ma-control
  const [formDataState, setFormDataState] = useState<Record<string, any>>({});

  // 2. Kapag pumasok ang profileMemberData (Edit Mode), i-set natin sa state
  useEffect(() => {
    if (profileMemberData) {
      // Depende sa itsura ng API response mo (kung nakabalot sa .data o direkta na), 
      // i-adjust natin dito. Halimbawa: profileMemberData.data o profileMemberData
      const data = ((profileMemberData as { data?: Record<string, any> } | undefined)?.data ?? profileMemberData) as Record<string, any>;

      setFormDataState(data);
      setIsActive(data.member_status === 'Active');

      // Kung may spiritual gifts ang member, kunin ang IDs nila para sa MultiSelect
      if (data.spiritual_gifts && Array.isArray(data.spiritual_gifts)) {
        setSelectedGiftIds(data.spiritual_gifts.map((g: any) => g.id));
      }
    } else {
      // Reset kung New Registration
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

  // Handle input changes para maging controlled inputs sila
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | { target: { name: string; value: string } }
  ) => {
    const target = e.target as { name: string; value: string };
    const { name, value } = target;
    
    let finalValue = value;

    // Kung mobile number ang binabago, dadaan sa sanitize utility
    if (name === 'mobile_number') {
      finalValue = sanitizeNumber(value);
    }

    setFormDataState(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = new FormData(e.currentTarget);
    const data = Object.fromEntries(formElement.entries());

    const formattedData = {
        ...data,
        church_id: formDataState.church_id,
        baptized_immersion: data.baptized_immersion === '1',
        rec_for_baptism: data.rec_for_baptism === '1',
        rec_for_membership: data.rec_for_membership === '1',
        member_status: isActive ? 'Active' : 'Inactive',
        age: parseInt(data.age as string) || 0,
        spiritual_gifts: selectedGiftIds, 
    };

    addMember(formattedData, { onSuccess: () => startClose() });
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
                  <div className="flex items-center gap-4">
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Account</h3>
                    <div className="flex-grow h-[1.5px] bg-[var(--active-parent)] transform-gpu scale-y-50" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
                    {/* <InputField label="Member ID" name="mem_id" value={formDataState.mem_id || ''} onChange={handleChange} icon={<FileText size={15}/>} /> */}
                    <InputField label="Email Address" name="email" type="email" value={formDataState.email || ''} onChange={handleChange} icon={<Mail size={15}/>} />
                    {/* <InputField label="Password" name="password" type="password" value={formDataState.password || ''} onChange={handleChange} icon={<Lock size={15}/>} /> */}
                  </div>
                </div>

                {/* SECTION: PERSONAL */}
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Personal Identity</h3>
                    <div className="flex-grow h-[1.5px] bg-[var(--active-parent)] transform-gpu scale-y-50" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <InputField label="First Name" name="first_name" value={formDataState.first_name || ''} onChange={handleChange} />
                    <InputField label="Middle Name" name="middle_name" value={formDataState.middle_name || ''} onChange={handleChange} />
                    <InputField label="Last Name" name="last_name" value={formDataState.last_name || ''} onChange={handleChange} />
                    <InputField label="Nickname" name="nickname" value={formDataState.nickname || ''} onChange={handleChange} />
                    
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
                            value={formDataState.birthday || ''} 
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
                  <div className="flex items-center gap-4">
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Family & Social</h3>
                    <div className="flex-grow h-[1.5px] bg-[var(--active-parent)] transform-gpu scale-y-50" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="Father's Name" name="father_name" value={formDataState.father_name || ''} onChange={handleChange} />
                    <InputField label="Mother's Name" name="mother_name" value={formDataState.mother_name || ''} onChange={handleChange} />
                    <InputField label="Spouse Name" name="spouse_name" value={formDataState.spouse_name || ''} onChange={handleChange} />
                  </div>
                </div>

                {/* SECTION: CONTACT & ADDRESS */}
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Residence</h3>
                    <div className="flex-grow h-[1.5px] bg-[var(--active-parent)] transform-gpu scale-y-50" />
                  </div>
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
                  <div className="flex items-center gap-4">
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Professional & Education</h3>
                    <div className="flex-grow h-[1.5px] bg-[var(--active-parent)] transform-gpu scale-y-50" />
                  </div>
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
                  <div className="flex items-center gap-4">
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Christian Experience</h3>
                    <div className="flex-grow h-[1.5px] bg-[var(--active-parent)] transform-gpu scale-y-50" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="Date Received Jesus" name="received_jesus" type="date" value={formDataState.received_jesus || ''} onChange={handleChange} />
                    <SelectField label="Baptized (Immersion)?" name="baptized_immersion" value={String(formDataState.baptized_immersion ? '1' : '0')} onChange={handleChange} options={[{label: 'Yes', value: '1'}, {label: 'Not yet', value: '0'}]} />
                    <SelectField label="Recommendation for Baptism" name="rec_for_baptism" value={String(formDataState.rec_for_baptism ? '1' : '0')} onChange={handleChange} options={[{label: 'Yes', value: '1'}, {label: 'No', value: '0'}]} />
                    <InputField label="Baptism Date" name="baptized_date" type="date" value={formDataState.baptized_date || ''} onChange={handleChange} />
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
                  <div className="flex items-center gap-4">
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Other Information</h3>
                    <div className="flex-grow h-[1.5px] bg-[var(--active-parent)] transform-gpu scale-y-50" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <InputField label="Purpose of Registration" name="purpose_reg" value={formDataState.purpose_reg || ''} onChange={handleChange} />
                    </div>
                    <InputField label="Previous Church" name="prev_church" value={formDataState.prev_church || ''} onChange={handleChange} />
                    <InputField label="Church Affiliation" name="church_affiliation" value={formDataState.church_affiliation || ''} onChange={handleChange} />
                    {/* <InputField label="Satellite ID" name="church_id" value={formDataState.church_id || ''} onChange={handleChange} icon={<Church size={15}/>} /> */}
                    <SearchableSelect
                      label="Church"
                      name="church_id"
                      value={formDataState.church_id || ''}
                      options={churchList}
                      placeholder="Select Church"
                      icon={<Church size={15} />}
                      onChange={handleChange}
                    />
                    <InputField label="Picture Path" name="picture" value={formDataState.picture || ''} onChange={handleChange} />
                  </div>
                </div>

                {/* SECTION: ELDER'S RECOMMENDATION */}
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Elder's Recommendation</h3>
                    <div className="flex-grow h-[1.5px] bg-[var(--active-parent)] transform-gpu scale-y-50" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    Interview Conducted By Here...
                    <SelectField 
                      label="Member Position" 
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
                    <div className='hidden'>
                      <SelectField label="Recommendation for Membership" name="rec_for_membership" value={String(formDataState.rec_for_membership ? '1' : '0')} onChange={handleChange} options={[{label: 'Yes', value: '1'}, {label: 'No', value: '0'}]} />
                    </div>
                    <div className="md:col-span-3">
                      <InputField label="Comment" name="comment" value={formDataState.comment || ''} onChange={handleChange} />
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