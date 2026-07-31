import { CircleAlert } from 'lucide-react';

// components/inputs/InputField.tsx
interface InputFieldProps {
  label: string;
  name: string;
  error?: string[];
  type?: string;
  step?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string;
  readOnly?: boolean;
  required?: boolean;
}

export const InputField = ({ label, name, error, type = "text", icon, placeholder, value, onChange, defaultValue, readOnly = false, required }: InputFieldProps) => {

  return (
    <div className="space-y-1.5 w-full">
      <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-3 text-slate-400 group-focus-within:text-[var(--active-parent,rgb(99,102,241))] transition-colors">
            {icon}
          </div>
        )}
        <input
          name={name}
          type={type}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[var(--active-parent,rgb(99,102,241))] focus:ring-4 focus:ring-[var(--active-parent,rgb(99,102,241))]/10 outline-none transition-all text-sm ${error && '!border-red-500 focus:!border-red-500'}`}
        />
      </div>
      {error && <p className="flex align-items-center gap-0.5 text-[10px] text-red-500 font-medium ml-1"><CircleAlert size={12} /> {error[0]}</p>}
    </div>
  );
};