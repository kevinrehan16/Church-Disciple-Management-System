import React, { useState, useRef, useEffect } from 'react';
import { FaDove } from "react-icons/fa";
import { X, ChevronDown } from 'lucide-react';

// FIX 1: Gumawa tayo ng tamang type para sa options object
export interface SelectOption {
  value: string | number;
  label: string;
  description?: string;
}

interface MultiSelectProps {
  label: string;
  name?: string;
  options: SelectOption[]; // Imbes na string[], object array na siya
  selected: (string | number)[]; // Tumatanggap na ng IDs (numbers)
  onChange: (selected: any[]) => void;
  error?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean; // Idinagdag para sa loading state ng parent
}

export const MultiSelect = ({ 
  label, 
  name, 
  options = [], 
  selected = [], 
  onChange, 
  error = false, 
  icon,
  disabled = false
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

  // Tumatanggap na ngayon ng value (ID) imbes na label lang
  const toggleSelect = (optionValue: string | number) => {
    if (disabled) return;
    
    if (selected.includes(optionValue)) {
      onChange(selected.filter(item => item !== optionValue));
    } else {
      onChange([...selected, optionValue]);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full" ref={containerRef}>
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">
        {label}
      </label>

      {/* Hidden input para sa form submission (optional if handled manually by parent) */}
      {name && <input type="hidden" name={name} value={JSON.stringify(selected)} />}

      {/* Main Container */}
      <div 
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`relative flex items-center flex-wrap gap-2 transition-all min-h-[46px]
          ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 rounded-xl border border-slate-200 
          outline-none text-sm bg-white
          ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : 'cursor-pointer focus-within:border-[var(--active-parent,rgb(99,102,241))] focus-within:ring-4 focus-within:ring-[var(--active-parent,rgb(99,102,241))]/10'}
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
          <span className="text-slate-400 select-none">
            {disabled ? 'Loading...' : 'Select gifts...'}
          </span>
        )}

        {/* Selected Tags */}
        {selected.map((val) => {
          // Hahanapin natin yung label base sa napiling ID
          const selectedOption = options.find(opt => opt.value === val);
          
          return (
            <span 
              key={val} 
              className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-[11px] font-medium px-2 py-0.5 rounded-md border border-indigo-100"
            >
              {selectedOption ? selectedOption.label : val}
              <button 
                type="button" 
                disabled={disabled}
                onClick={(e) => { e.stopPropagation(); toggleSelect(val); }} 
                className="hover:text-indigo-900 disabled:opacity-50"
              >
                <X size={12} />
              </button>
            </span>
          );
        })}

        {/* Dropdown Arrow */}
        <ChevronDown 
          size={16} 
          className={`absolute right-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />

        {/* Dropdown List */}
        {isOpen && !disabled && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-[999] overflow-y-auto max-h-60 py-1">
            {options.length === 0 ? (
              <div className="px-4 py-3 text-sm text-slate-500 text-center">
                No options available
              </div>
            ) : (
              options.map((option) => (
                  <div 
                    key={option.value} // FIX 2: Gumagamit na ng unique ID bilang key
                    className={`flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-slate-50 ${
                      selected.includes(option.value) ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700'
                    }`}
                    onClick={(e) => { e.stopPropagation(); toggleSelect(option.value); }}
                  >
                    <FaDove size={12} className={selected.includes(option.value) ? 'text-indigo-600' : 'text-slate-400'} /> 
                    {option.label} <small className='!text-slate-500 italic'>{option.description}</small>
                  </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};