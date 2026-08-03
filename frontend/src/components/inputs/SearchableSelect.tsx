import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

export interface OptionItem {
  id: string | number;
  name: string;
}

interface SearchableSelectProps {
  label: string;
  name: string;
  value: string | number;
  options: OptionItem[];
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string;
  onChange: (e: { target: { name: string; value: string } }) => void;
}

export function SearchableSelect({
  label,
  name,
  value,
  options,
  placeholder = 'Select...',
  icon,
  error,
  onChange,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => String(opt.id) === String(value));

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (opt: OptionItem) => {
    onChange({
      target: {
        name: name,
        value: String(opt.id),
      },
    });
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative space-y-1.5 w-full" ref={dropdownRef}>
      {/* Label sa labas - naka-align nang direkta sa kaliwa ng box */}
      <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider ml-1">
        {label}
      </label>

      {/* Main Clickable Box na may active ring at error styles */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 rounded-xl border transition-all text-sm cursor-pointer flex items-center justify-between outline-none bg-white ${
          isOpen
            ? 'border-[var(--active-parent,rgb(99,102,241))] ring-4 ring-[var(--active-parent,rgb(99,102,241))]/10'
            : 'border-slate-200 hover:border-slate-300'
        } ${error ? '!border-red-500 ring-4 ring-red-500/10' : ''}`}
      >
        {/* Icon (Kung meron) */}
        {icon && (
          <span
            className={`absolute left-3.5 pointer-events-none transition-colors ${
              error
                ? '!text-red-500'
                : isOpen
                ? 'text-[var(--active-parent,rgb(99,102,241))]'
                : 'text-slate-400'
            }`}
          >
            {icon}
          </span>
        )}

        <span className={`truncate w-full ${selectedOption ? 'text-slate-900' : 'text-slate-400'}`}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>

        <ChevronDown size={15} className="text-slate-400 shrink-0 ml-2" />
      </div>

      {/* Error Message kung mayroon */}
      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}

      {/* Dropdown Menu List */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-[70px] bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-60 flex flex-col overflow-hidden">
          <div className="p-2 border-b border-slate-100 flex items-center gap-2">
            <Search size={14} className="text-slate-400 ml-1" />
            <input
              type="text"
              placeholder={`Search ${label.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full outline-none text-sm bg-transparent"
              autoFocus
            />
          </div>

          <div className="overflow-y-auto flex-grow">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => handleSelect(opt)}
                  className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-slate-50 flex items-center gap-2 ${
                    String(value) === String(opt.id) ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-700'
                  }`}
                >
                  {String(value) === String(opt.id) && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg" className='shrink-0'>
                      <path d="M4 8.6L1.2 5.8L0 7L4 11L12 3L10.8 1.8L4 8.6Z" fill="#2563EB"/>
                    </svg>
                  )}
                  {opt.name}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-slate-400 text-center">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}