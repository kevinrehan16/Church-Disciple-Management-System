import { useState, useRef, useEffect } from 'react';
import { FaDove } from "react-icons/fa";
import { X, ChevronDown } from 'lucide-react';

interface MultiSelectProps {
  label: string;
  name: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  error?: boolean;
  icon?: React.ReactNode;
}

export const MultiSelect = ({ 
  label, 
  name, 
  options, 
  selected, 
  onChange, 
  error = false, 
  icon 
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown pag click sa labas
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelect = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full" ref={containerRef}>
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">
        {label}
      </label>

      {/* Hidden input para sa form submission */}
      <input type="hidden" name={name} value={JSON.stringify(selected)} />

      {/* Main Container */}
      <div 
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center flex-wrap gap-2 cursor-pointer transition-all min-h-[46px]
          ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 rounded-xl border border-slate-200 
          focus-within:border-[var(--active-parent,rgb(99,102,241))] 
          focus-within:ring-4 focus-within:ring-[var(--active-parent,rgb(99,102,241))]/10 
          outline-none text-sm bg-white
          ${error ? '!border-red-500 focus-within:!border-red-500' : ''}`}
      >
        {/* Icon (Optional) */}
        {icon && (
          <div className="absolute left-3 text-slate-400">
            {icon}
          </div>
        )}

        {/* Placeholder */}
        {selected.length === 0 && (
          <span className="text-slate-400 select-none">Select gifts...</span>
        )}

        {/* Selected Tags */}
        {selected.map((item) => (
          <span 
            key={item} 
            className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-[11px] font-medium px-2 py-0.5 rounded-md border border-indigo-100"
          >
            {item}
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); toggleSelect(item); }} 
              className="hover:text-indigo-900"
            >
              <X size={12} />
            </button>
          </span>
        ))}

        {/* Dropdown Arrow */}
        <ChevronDown 
          size={16} 
          className={`absolute right-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />

        {/* Dropdown List */}
        {isOpen && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-[999] overflow-y-auto max-h-60 py-1">
            {options.map((option) => (
                <div 
                key={option}
                className={`flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-slate-50 ${
                    selected.includes(option) ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700'
                }`}
                onClick={(e) => { e.stopPropagation(); toggleSelect(option); }}
                >
                <FaDove size={12} className={selected.includes(option) ? 'text-indigo-600' : 'text-slate-400'} /> 
                {option}
                </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};