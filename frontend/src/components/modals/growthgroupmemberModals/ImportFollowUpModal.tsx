import { useState } from 'react';
import { FaFileExcel, FaUpload, FaSpinner, FaCheckCircle, FaTimes } from 'react-icons/fa';
import  {useImportMembers } from '../../../hooks/useMembers';

export default function ImportFollowUpModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { mutate: importMembers, isPending, error } = useImportMembers();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setSuccessMessage('');

    importMembers(file, {
      onSuccess: (response: any) => {
        setSuccessMessage(response?.message || 'Members imported successfully!');
        setFile(null);
        if (onSuccess) onSuccess();
        
        setTimeout(() => {
          onClose();
          setSuccessMessage('');
        }, 1500);
      },
    });
  };

  // Kunin ang error message mula sa API kung mayroon man
  const errorMessage = error ? (error as any)?.response?.data?.message || 'May naganap na error sa pag-upload ng file.' : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-slate-200 relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <FaTimes size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <FaFileExcel size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Import Members</h3>
            <p className="text-xs text-slate-500">Upload .xlsx or .csv file for a bulk import.</p>
          </div>
        </div>

        {/* Form Upload */}
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-indigo-500 transition-colors bg-slate-50/50">
            <input 
              type="file" 
              accept=".xlsx, .xls, .csv" 
              onChange={handleFileChange}
              id="excel-file-input"
              className="hidden" 
            />
            <label htmlFor="excel-file-input" className="cursor-pointer flex flex-col items-center justify-center gap-2">
              <FaUpload size={24} className="text-indigo-500 mb-1" />
              <span className="text-xs font-semibold text-slate-700">
                {file ? file.name : 'Click to select a file'}
              </span>
              <span className="text-[10px] text-slate-400">Supported formats: .xlsx, .csv</span>
            </label>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
              <FaCheckCircle /> {successMessage}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isPending || !file}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {isPending && <FaSpinner className="animate-spin" />}
              {isPending ? 'Nag-a-upload...' : 'I-upload ang File'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}