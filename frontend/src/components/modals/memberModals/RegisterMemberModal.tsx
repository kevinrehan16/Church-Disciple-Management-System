import React, { useState } from 'react';
import { 
  X, Mail, Calendar, Phone, MapPin, Lock, Save, ShieldCheck, 
  Briefcase, FileText, Church,
} from 'lucide-react';
import { useRegisterMember } from '../../../hooks/useMembers';
import { useSpiritualGift } from '../../../hooks/useSpiritualGift';
import { modalAnimation } from '../../../utils/ModalAnimation';
import { InputField } from '../../inputs/InputField';
import { SelectField } from '../../inputs/SelectField';
import { MultiSelect } from '../../inputs/MultiSelect';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId?: string | null; 
}

export default function RegisterMemberModal({ isOpen, onClose, memberId }: ModalProps) {
  const { isClosing, startClose, handleAnimationEnd } = modalAnimation(onClose);
  const { mutate: addMember, isPending: pendingAddMember } = useRegisterMember();
  const { data: apiResponse, isLoading } = useSpiritualGift();
  const [isActive, setIsActive] = useState( true);

  // FIX 1: Mas maayos na pag-extract ng array from API
  const giftsList = Array.isArray(apiResponse) 
    ? apiResponse 
    : [];

  const [selectedGiftIds, setSelectedGiftIds] = useState<number[]>([]);
  
  const giftOptions = giftsList.map((gift: any) => ({
    value: gift.id,                
    label: gift.name,              
    description: gift.description, 
  }));

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // IMPORTANT: Convert string values to correct types (Boolean/Number)
    const formattedData = {
        ...data,
        baptized_immersion: data.baptized_immersion === '1',
        rec_for_baptism: data.rec_for_baptism === '1',
        rec_for_membership: data.rec_for_membership === '1',
        member_status: isActive ? 'Active' : 'Inactive',
        age: parseInt(data.age as string) || 0,
        
        // FIX 2: Isinama na ang selected gifts papuntang backend!
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
            <form id="member-form" onSubmit={handleSubmit} className="space-y-10">
              
              {/* SECTION: ID & AUTH */}
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Account & ID</h3>
                  <div className="flex-grow h-[1.5px] bg-[var(--active-parent)] transform-gpu scale-y-50" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <InputField label="Member ID" name="mem_id" icon={<FileText size={15}/>} />
                  <InputField label="Email Address" name="email" type="email" icon={<Mail size={15}/>} />
                  <InputField label="Password" name="password" type="password" icon={<Lock size={15}/>} />
                </div>
              </div>

              {/* SECTION: PERSONAL */}
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Personal Identity</h3>
                  <div className="flex-grow h-[1.5px] bg-[var(--active-parent)] transform-gpu scale-y-50" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <InputField label="First Name" name="first_name" />
                  <InputField label="Middle Name" name="middle_name" />
                  <InputField label="Last Name" name="last_name" />
                  <InputField label="Nickname" name="nickname" />
                  <div className="flex flex-col gap-1.5 w-full">
                    {/* LABELS SA LABAS */}
                    <div className="flex">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-4">Birthday</label>
                    </div>

                    {/* FUSED CONTAINER */}
                    <div className={`flex w-full rounded-xl border border-slate-200 focus-within:border-[var(--active-parent,rgb(99,102,241))] focus-within:ring-4 focus-within:ring-[var(--active-parent,rgb(99,102,241))]/10 transition-all overflow-hidden`}>
                      
                      {/* BIRTHDAY INPUT */}
                      <div className="relative flex-grow border-r border-slate-200">
                        <div className="absolute left-3 top-3 text-slate-400">
                          <Calendar size={15} />
                        </div>
                        <input 
                          type="date" 
                          name="birthday" // Added name prop so it's captured in FormData
                          className="w-full pl-10 pr-4 py-2.5 outline-none bg-transparent text-sm" 
                        />
                      </div>

                      {/* AGE INPUT */}
                      <div className="w-24">
                        <input 
                          type="number"
                          name="age" // Added name prop just in case
                          placeholder="Age"
                          className="w-full px-4 py-2.5 outline-none bg-transparent text-sm text-center" 
                        />
                      </div>
                    </div>
                  </div>
                  <SelectField label="Gender" name="gender" options={[{label: 'Male', value: 'Male'}, {label: 'Female', value: 'Female'}]} />
                  <SelectField 
                    label="Life Stage" 
                    name="lifestage" 
                    options={[
                      {label: 'Single', value: 'Single'}, 
                      {label: 'Married', value: 'Married'},
                      {label: 'Divorced', value: 'Divorced'},
                      {label: 'Widowed', value: 'Widowed'},
                      {label: 'Separated', value: 'Separated'}
                    ]} />
                  <InputField label="Mobile Number" name="mobile_number" placeholder='0915*******' icon={<Phone size={15}/>} />
                  <InputField label="Facebook Name" name="facebook_name" placeholder='John Doe'/>
                </div>
              </div>

              {/* SECTION: FAMILY */}
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Family & Social</h3>
                  <div className="flex-grow h-[1.5px] bg-[var(--active-parent)] transform-gpu scale-y-50" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField label="Father's Name" name="father_name" />
                  <InputField label="Mother's Name" name="mother_name" />
                  <InputField label="Spouse Name" name="spouse_name" />
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
                    <InputField label="Home Address" name="home_address" icon={<MapPin size={15}/>} />
                  </div>
                  <InputField label="Barangay" name="barangay" />
                  <InputField label="City" name="city" />
                  <InputField label="Region" name="region" />
                  <InputField label="Country" name="country" />
                </div>
              </div>

              {/* SECTION: PROFESSIONAL */}
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Professional & Education</h3>
                  <div className="flex-grow h-[1.5px] bg-[var(--active-parent)] transform-gpu scale-y-50" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField label="Occupation" name="occupation" icon={<Briefcase size={15}/>} />
                  <InputField label="Industry" name="industry" />
                  <InputField label="High School" name="high_school" />
                  <InputField label="College School" name="college_school" />
                  <InputField label="College Degree" name="college_degree" />
                </div>
              </div>

              {/* SECTION: CHRISTIAN EXPERIENCE */}
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Christian Experience</h3>
                  <div className="flex-grow h-[1.5px] bg-[var(--active-parent)] transform-gpu scale-y-50" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField label="Date Received Jesus" name="received_jesus" type="date" />
                  <SelectField label="Baptized (Immersion)?" name="baptized_immersion" options={[{label: 'Yes', value: '1'}, {label: 'Not yet', value: '0'}]} />
                  <SelectField label="Recommendation for Baptism" name="rec_for_baptism" options={[{label: 'Yes', value: '1'}, {label: 'No', value: '0'}]} />
                  <InputField label="Baptism Date" name="baptized_date" type="date" />
                  <div className="md:col-span-2">
                    
                    {/* MULTISELECT PARA SA GIFTS */}
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
                    <InputField label="Purpose of Registration" name="purpose_reg" />
                  </div>
                  <InputField label="Previous Church" name="prev_church" />
                  <InputField label="Church Affiliation" name="church_affiliation" />
                  <InputField label="Satellite ID" name="church_id" icon={<Church size={15}/>} />
                  <InputField label="Picture Path" name="picture" />
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
                  {/* <InputField label="Interview Conducted By" type='text' placeholder='Not yet working...' />
                  <InputField label="Membership Date" name="membership_date" type="date" /> */}
                  <SelectField 
                    label="Member Position" 
                    name="member_position" 
                    options={[ 
                      {label: 'Member', value: 'Growth Group Member'}, 
                      {label: 'Pastoral Staff', value: 'Pastoral Staff'}, 
                      {label: 'Deacon', value: 'Deacon'}, 
                      {label: 'Elder', value: 'Elder'}, 
                      {label: 'Pastor', value: 'Pastor'}, 
                      {label: 'Senior Pastor', value: 'Senior Pastor'}, 
                    ]} />
                  <div className='hidden'>
                    <SelectField label="Recommendation for Membership" name="rec_for_membership" options={[{label: 'Yes', value: '1'}, {label: 'No', value: '0'}]} />
                  </div>
                  <div className="md:col-span-3">
                    <InputField label="Comment" name="comment" />
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

                {/* Custom Toggle Switch */}
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
              <div className='hidden'>
                <InputField label="Member Status" name="member_status"/>
              </div>
            </form>
          </div>

          {/* FOOTER */}
          <div className="px-8 py-4 bg-slate-50 border-t border-slate-200/60 flex gap-3 justify-end flex-shrink-0">
            <button type="button" onClick={startClose} className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider border border-slate-200 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all flex items-center gap-2">
             <X size={15} /> Cancel
            </button>
            <button type="submit" disabled={pendingAddMember} form="member-form" className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-lg shadow-emerald-600/10 transition-all flex items-center gap-2">
              <Save size={15} /> {pendingAddMember ? 'Saving...' : 'Save Registration'}
            </button>
          </div>
        </div>
    </div>
  );
}