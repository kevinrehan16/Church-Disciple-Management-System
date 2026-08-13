import React from 'react';
import { X, MapPin, Phone, Save, Building2, Church, Mail } from 'lucide-react';
// I-adjust ang import path base sa structure ng folders mo
import { modalAnimation } from '../../../utils/ModalAnimation';
import SectionHeader from '../../ui/SectionHeader';
import { InputField } from '../../inputs/InputField';
import { SelectField } from '../../inputs/SelectField';
import { useRegisterChurch, useChurchById, useUpdateChurch } from '../../../hooks/useChurches'; // Idagdag ang update hook mo kung meron

interface ChurchModalProps {
  isOpen: boolean;
  onClose: () => void;
  churchId: string | null;
}

export default function ChurchModal({ isOpen, onClose, churchId }: ChurchModalProps) {
  const { isClosing, startClose, handleAnimationEnd } = modalAnimation(onClose);
  const { mutate: addChurch } = useRegisterChurch();
  const { mutate: updateChurch } = useUpdateChurch();
  
  // 1. Kunin ang data ng church kapag may churchId (Edit mode)
  // I-adjust depende kung paano ibinabalik ng hook mo ang data (e.g. data?.data o data)
  const { data: churchResponse, isLoading: isFetchingChurch } = useChurchById(churchId as string);

  const churchData = (churchResponse as any)?.data || churchResponse;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const formattedData = {
        name: formData.get('name') as string,
        code: formData.get('code') as string,
        address: formData.get('address') as string,
        contact_number: (formData.get('contact_number') as string) || null,
        email: (formData.get('email') as string) || null,
        is_main_campus: formData.get('is_main_campus') === 'true',
        is_active: formData.get('is_active') === 'true',
    };

    if (churchId) {
      updateChurch({id: churchId, formattedData}, { 
          onSuccess: () => {
              startClose();
          }
      });
    } else {
      // Create new church
      addChurch(formattedData, { 
          onSuccess: () => {
              startClose();
          }
      });
    }
  };

  if (!isOpen) return null;

  // Options para sa mga select fields ng Church
  const statusOptions = [
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' }
  ];
  
  const mainCampusOptions = [
    { value: 'false', label: 'No' },
    { value: 'true', label: 'Yes' }
  ];

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 ${isClosing ? 'modal-overlay closing' : 'modal-overlay'}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={`bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200/80 flex flex-col max-h-[92vh] ${isClosing ? 'modal-content closing' : 'modal-content'}`}>
        
        {/* Header - Dynamic bg consistent sa theme */}
        <div className="px-8 py-6 bg-[var(--active-parent,rgb(99,102,241))] flex items-center justify-between text-white flex-shrink-0">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">
              {churchId ? 'Edit Church Information' : 'Church Registration'}
            </h2>
            <p className="text-white/80 text-xs mt-0.5 font-medium">
              {churchId ? 'Update church location details.' : 'Add a new church location to the network.'}
            </p>
          </div>
          <button onClick={startClose} className="p-2 hover:bg-white/10 active:scale-95 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-8">
          {isFetchingChurch && churchId ? (
            <div className="flex justify-center items-center py-20 text-slate-500 font-medium">
              Loading church data...
            </div>
          ) : (
            <form id="church-form" onSubmit={handleSubmit} className="space-y-10">
              
              {/* Section 1: Basic Info */}
              <div>
                <SectionHeader title="Basic Information" icon={Building2} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField 
                      label="Church Name" 
                      name='name' 
                      placeholder="e.g. GCF SouthMetro" 
                      icon={<Church size={15}/>} 
                      defaultValue={churchData?.name || ''}
                      required 
                    />
                    <InputField 
                      label="Church Code" 
                      name='code' 
                      placeholder="e.g. GCFSM" 
                      defaultValue={churchData?.code || ''}
                      required 
                    />
                    
                    <SelectField 
                      label="Main Campus?" 
                      name='is_main_campus' 
                      options={mainCampusOptions} 
                      defaultValue={String(churchData?.is_main_campus ?? 'false')}
                    />
                    <SelectField 
                      label="Status" 
                      name='is_active' 
                      options={statusOptions} 
                      defaultValue={String(churchData?.is_active ?? 'true')}
                    />
                </div>
              </div>

              {/* Section 2: Contact Details */}
              <div>
                <SectionHeader title="Contact Information" icon={Phone} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField 
                      label="Contact Number" 
                      name='contact_number' 
                      placeholder="e.g. 09187654321" 
                      icon={<Phone size={15}/>} 
                      defaultValue={churchData?.contact_number || ''}
                    />
                    <InputField 
                      label="Email Address" 
                      name='email' 
                      type="email"
                      placeholder="e.g. south@disciplenetwork.org" 
                      icon={<Mail size={15}/>} 
                      defaultValue={churchData?.email || ''}
                    />
                </div>
              </div>

              {/* Section 3: Location */}
              <div>
                <SectionHeader title="Location Details" icon={MapPin} />
                <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">Complete Address</label>
                      <textarea 
                        name='address'
                        placeholder="House/Unit No., Street, Barangay, City, Province"
                        defaultValue={churchData?.address || ''}
                        className="w-full p-2.5 rounded-lg border border-slate-200 focus:border-[var(--active-parent,rgb(99,102,241))] focus:ring-4 focus:ring-[var(--active-parent,rgb(99,102,241))]/10 outline-none transition-all h-24 resize-none text-sm text-slate-700"
                        required
                      />
                    </div>
                </div>
              </div>

            </form>
          )}
        </div>

        {/* Footer Actions - Sticky */}
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
              form="church-form" 
              disabled={isFetchingChurch && !!churchId}
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-lg shadow-emerald-600/10 transition-all flex items-center gap-2"
            >
                <Save size={15} /> {churchId ? 'Update Church' : 'Save Church'}
            </button>
        </div>
      </div>
    </div>
  );
}