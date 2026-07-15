import React from 'react';
import { X, Heart } from 'lucide-react';
import { useAllergyQuery, useAddAllergy, useUpdateAllergy } from '../../../hooks/useMembers';
import { modalAnimation } from '../../../utils/ModalAnimation';
import { InputField } from '../../inputs/InputField';
import { SelectField } from '../../inputs/SelectField';

interface AllergyModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  allergyId: string;
}

export const AllergyModal = ({ isOpen, onClose, patientId ,allergyId }: AllergyModalProps) => {
  const { data: allergy, isLoading, isError } = useAllergyQuery(patientId, allergyId);
  const { isClosing, startClose, handleAnimationEnd } = modalAnimation(onClose);
  const { mutate: addAllergy, isPending: pendingAddAllergy } = useAddAllergy();
  const { mutate: updateAllergy, isPending: pendingUpdateAllergy } = useUpdateAllergy();

  const isSaving = pendingAddAllergy || pendingUpdateAllergy;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const payload = {
        patient: patientId,
        allergen: data.allergen as string,
        severity: data.severity as 'LOW' | 'MEDIUM' | 'HIGH',
        reaction: data.reaction as string,
    };

    // Condition: Kung may allergyId, update; kung wala, add
    if (allergyId) {
        updateAllergy(
        { patientId, allergyId, data: payload },
        { onSuccess: () => startClose() }
        );
    } else {
        addAllergy(payload, { onSuccess: () => startClose() });
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm ${isClosing ? 'modal-overlay closing' : 'modal-overlay'}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={`w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden ${isClosing ? 'modal-content closing' : 'modal-content'}`}>
        <div className="flex bg-[var(--active-parent)] items-center justify-between px-6 py-4 border-b border-slate-100 text-white">
          <div>
            <h2 className="text-lg font-bold">Add New Allergy</h2>
            <p className="text-white/80 text-xs mt-0.5 font-medium">
                Add new patient's allergy.
            </p>
          </div>
          <button onClick={startClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* InputField gamit ang name attribute lang */}
            <InputField 
              label="Allergen" 
              name="allergen" 
              defaultValue={allergy?.allergen}
              required
              icon={<Heart size={15} />} 
              placeholder="e.g. Peanuts, Penicillin" 
            />

            {/* SelectField gamit ang name attribute lang */}
            <SelectField 
              label="Severity" 
              name="severity"
              defaultValue={allergy?.severity}
              options={[
                { label: 'Low Risk', value: 'LOW' },
                { label: 'Moderate', value: 'MEDIUM' },
                { label: 'Severe', value: 'HIGH' }
              ]} 
            />

            {/* Default textarea (o palitan mo ng TextareaField kung meron ka) */}
            <div>
               <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Reaction <span className="text-red-500">*</span></label>
               <textarea
                 name="reaction"
                 required
                 defaultValue={allergy?.reaction}
                 rows={3}
                 className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[var(--active-parent,rgb(99,102,241))] focus:ring-4 focus:ring-[var(--active-parent,rgb(99,102,241))]/10 outline-none transition-all text-sm resize-none"
                 placeholder="Describe the reaction..."
               />
            </div>
          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={startClose}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Allergy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};