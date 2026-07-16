import React from 'react';
import { FaFacebookSquare, FaEnvelopeSquare, FaMobile } from "react-icons/fa";
import { X, User, MapPin, Phone, HeartHandshake, Users, Save, Church } from 'lucide-react';
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
          
          {/* Section 1: Basic Info */}
          <div>
            <SectionHeader title="Basic Information" icon={User} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField label="First Name" name='first_name' placeholder="Juan" />
              <InputField label="Last Name" name='last_name' placeholder="Dela Cruz" />
              <InputField label="Date Visited" name='date_visited' type="date" />
              <SelectField label="Service Time" name='service_time' options={serviceOptions} />
              <SelectField label="Age Group" name='age_group' options={ageOptions} />
              <SelectField label="Gender" name='gender' options={genderOptions} />
            </div>
          </div>

          {/* Section 2: Address & Life Stage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <SectionHeader title="Address" icon={MapPin} />
              <div className="space-y-4">
                <InputField label="Barangay" />
                <InputField label="City" />
                <InputField label="Province" />
              </div>
            </div>
            <div>
              <SectionHeader title="Discipleship Profile" icon={Users} />
              <div className="space-y-4">
                <SelectField label="Life Stage" options={lifeStageOptions} />
                <InputField label="Current Church" placeholder="Optional" icon={<Church  size={15}/>} />
              </div>
            </div>
          </div>

          {/* Section 3: Contact & Referral */}
          <div>
            <SectionHeader title="Contacts & Referral" icon={Phone} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <InputField label="Mobile Number" placeholder="09*********" icon={<FaMobile size={15}/>} />
              <InputField label="Email Address" placeholder='johndoe@gmail.com' icon={<FaEnvelopeSquare size={15}/>} />
              <InputField label="Facebook Name" placeholder='Kevin Godnacam' icon={<FaFacebookSquare size={15}/>} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField label="How they heard about us" options={heardOptions} />
              <InputField label="Invitee (Name)" placeholder='John Doe' />
            </div>
          </div>

          {/* Section 4: Notes */}
          <div>
            <SectionHeader title="Prayer Request and Remarks" icon={HeartHandshake} />
            <div className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-sm font-medium text-slate-700">Prayer Requests</label>
                   <textarea className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none h-20" />
                 </div>
                 <div className="space-y-1">
                   <label className="text-sm font-medium text-slate-700">Remarks</label>
                   <textarea className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none h-20" />
                 </div>
               </div>
               <InputField label="Welcomed by" />
            </div>
          </div>
        </div>

        {/* Footer Actions - Sticky */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-200/60 flex gap-3 justify-end flex-shrink-0">
            <button type="button" onClick={startClose} className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider border border-slate-200 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all flex items-center gap-2">
                <X size={15} /> Cancel
            </button>
            <button type="submit" form="member-form" className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/10 transition-all flex items-center gap-2">
                <Save size={15} /> Save Visitor
            </button>
        </div>
      </div>
    </div>
  );
}