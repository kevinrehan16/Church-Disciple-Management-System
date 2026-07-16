import React from 'react';
import { FaFacebookSquare, FaEnvelopeSquare, FaMobile } from "react-icons/fa";
import { X, User, MapPin, Phone, HeartHandshake, Users, Save, Church } from 'lucide-react';
import { useRegisterVisitor } from '../../../hooks/useVisitors';
// I-adjust ang import path base sa kung nasaan ang components mo
import { modalAnimation } from '../../../utils/ModalAnimation';
import SectionHeader from '../../ui/SectionHeader';
import { InputField } from '../../inputs/InputField';
import { SelectField } from '../../inputs/SelectField';

interface VisitorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VisitorModal({ isOpen, onClose }: VisitorModalProps) {
  const { isClosing, startClose, handleAnimationEnd } = modalAnimation(onClose);
  const { mutate: addVisitor, isPending: pendingAddVisitor } = useRegisterVisitor();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // IMPORTANT: Convert string values to correct types (Boolean/Number)
    const formattedData = {
        ...data,
        age: parseInt(data.age as string) || 0,
    };

    addVisitor(formattedData, { onSuccess: () => startClose() });
  };

  if (!isOpen) return null;

  // Options para sa mga select fields
  const serviceOptions = [{ value: '8 am', label: '8 AM' }, { value: '10:30 am', label: '10:30 AM' }, { value: '4 pm', label: '4 PM' }];
  const ageOptions = [
    { value: '12 & below', label: '12 & below' },
    { value: '13-17', label: '13-17' },
    { value: '18-27', label: '18-27' },
    { value: '28-43', label: '28-43' },
    { value: '44-55', label: '44-55' },
    { value: '60 & above', label: '60 & above' }
  ];
  const genderOptions = [{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }];
  const lifeStageOptions = [
    { value: 'Single', label: 'Single' },
    { value: 'Married', label: 'Married' },
    { value: 'Widowed', label: 'Widowed' },
    { value: 'Divorced', label: 'Divorced' },
    { value: 'Separated', label: 'Separated' }
  ];
  const heardOptions = [
    { value: 'Walk-In', label: 'Walk-In' },
    { value: 'Social Media', label: 'Social Media' },
    { value: 'Website', label: 'Website' },
    { value: 'Friend', label: 'Friend' }
  ];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 ${isClosing ? 'modal-overlay closing' : 'modal-overlay'}`}
      onAnimationEnd={handleAnimationEnd}>

      <div className={`bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200/80 flex flex-col max-h-[92vh] ${isClosing ? 'modal-content closing' : 'modal-content'}`}>
        
        {/* Header - Dynamic bg consistent sa theme */}
        <div className="px-8 py-6 bg-[var(--active-parent)] flex items-center justify-between text-white flex-shrink-0">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">
                Visitor Registration
            </h2>
            <p className="text-white/80 text-xs mt-0.5 font-medium">Complete the visitor registration form.</p>
          </div>
          <button onClick={startClose} className="p-2 hover:bg-white/10 active:scale-95 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-8">
          <form id="visitor-form" onSubmit={handleSubmit} className="space-y-10">
            {/* Section 1: Basic Info */}
            <div>
                <SectionHeader title="Basic Information" icon={User} />
                <div className="grid grid-cols-3 gap-6">
                    {/* Row 1: Date, Empty Space, Service Time */}
                    <div className="col-span-1">
                    <InputField label="Date Visited" name='date_visited' type="date" />
                    </div>
                    <div className="col-span-1"></div>
                    <div className="col-span-1">
                    <SelectField label="Service Time" name='service_time' options={serviceOptions} />
                    </div>

                    {/* Row 2: Firstname & Lastname (Nested Grid for perfect 50/50) */}
                    <div className="col-span-3 grid grid-cols-2 gap-6">
                    <InputField label="First Name" name='first_name' placeholder="Juan" />
                    <InputField label="Last Name" name='last_name' placeholder="Dela Cruz" />
                    </div>

                    {/* The Rest: Birthday, Age, Gender */}
                    <InputField label="Birthday" name='birthday' type="date" />
                    <SelectField label="Age Group" name='age_group' options={ageOptions} />
                    <SelectField label="Gender" name='gender' options={genderOptions} />
                </div>
            </div>

            {/* Section 2: Address & Life Stage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                <SectionHeader title="Address" icon={MapPin} />
                <div className="space-y-4">
                    <InputField label="Barangay" name='barangay' />
                    <InputField label="City" name='city' />
                    <InputField label="Province" name='province' />
                </div>
                </div>
                <div>
                <SectionHeader title="Discipleship Profile" icon={Users} />
                <div className="space-y-4">
                    <SelectField label="Life Stage" name='life_stage' options={lifeStageOptions} />
                    <InputField label="Current Church" name='current_church' placeholder="Optional" icon={<Church  size={15}/>} />
                </div>
                </div>
            </div>

            {/* Section 3: Contact & Referral */}
            <div>
                <SectionHeader title="Contacts & Referral" icon={Phone} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <InputField label="Mobile Number" name='mobile_number' placeholder="09*********" icon={<FaMobile size={15}/>} />
                <InputField label="Email Address" name='email' placeholder='johndoe@gmail.com' icon={<FaEnvelopeSquare size={15}/>} />
                <InputField label="Facebook Name" name='facebook_name' placeholder='Kevin Godnacam' icon={<FaFacebookSquare size={15}/>} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField label="How they heard about us" name='heard_from_details' options={heardOptions} />
                <InputField label="Invitee (Name)" name='heard_from_invitee' placeholder='John Doe' />
                </div>
            </div>

            {/* Section 4: Notes */}
            <div>
                <SectionHeader title="Prayer Request and Remarks" icon={HeartHandshake} />
                <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Prayer Requests</label>
                    <textarea className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none h-20" name='prayer_requests'/>
                    </div>
                    <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Remarks</label>
                    <textarea className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none h-20" name='remarks'/>
                    </div>
                </div>
                <InputField label="Welcomed by" name='welcome_by'/>
                </div>
            </div>
          </form>
        </div>

        {/* Footer Actions - Sticky */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-200/60 flex gap-3 justify-end flex-shrink-0">
            <button type="button" onClick={startClose} className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider border border-slate-200 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all flex items-center gap-2">
                <X size={15} /> Cancel
            </button>
            <button type="submit" form="visitor-form" className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/10 transition-all flex items-center gap-2">
                <Save size={15} /> Save Visitor
            </button>
        </div>
      </div>
    </div>
  );
}