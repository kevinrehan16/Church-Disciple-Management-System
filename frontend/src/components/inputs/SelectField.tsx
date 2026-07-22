import { ChevronDown, CircleAlert } from 'lucide-react';

interface SelectFieldProps {
  label: string;
  name: string;
  error?: string[];
  options: { label: string; value: string }[];
  icon?: React.ReactNode;
  defaultValue?: string;
  readOnly?: boolean;
  required?: boolean;
}

export const SelectField = ({ label, name, error, options, icon, defaultValue, readOnly = false, required = false }: SelectFieldProps) => {
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider ml-1">{label} {required && <span className="text-red-500">*</span>}</label>
      <div className="relative group">
        {/* Left Icon (optional) */}
        {icon && (
          <div className="absolute left-3 top-3 text-slate-400 group-focus-within:text-[var(--active-parent,rgb(99,102,241))] transition-colors">
            {icon}
          </div>
        )}
        
        {/* Select Input */}
        <select 
          key={defaultValue}
          name={name}
          defaultValue={defaultValue}
          disabled={readOnly}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-10 py-2.5 rounded-xl border border-slate-200 
          focus:border-[var(--active-parent,rgb(99,102,241))] 
          focus:ring-4 focus:ring-[var(--active-parent,rgb(99,102,241))]/10 
          outline-none transition-all text-sm bg-white appearance-none cursor-pointer ${error ? 'border-red-500 focus:border-red-500' : 'border-slate-200'} ${readOnly ? 'bg-slate-50 cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Right Chevron Icon (Fixed) */}
        <div className="absolute right-3 top-3 pointer-events-none text-slate-400 group-focus-within:text-[var(--active-parent,rgb(99,102,241))]">
          <ChevronDown size={16} />
        </div>
      </div>
      {error && <p className="flex align-items-center gap-0.5 text-[10px] text-red-500 font-medium ml-1"><CircleAlert size={12} /> {error[0]}</p>}
    </div>
  );
};