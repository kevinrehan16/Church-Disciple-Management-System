import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string; // Para pwede mo pa ring ma-override ang width o spacing kung kailangan
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "md:max-w-md",
}: SearchInputProps) {
  return (
    <div 
      className={`group/search flex items-center bg-white border border-slate-200/80 
      focus-within:border-[var(--active-parent,rgb(99,102,241))] 
      focus-within:ring-4 focus-within:ring-[var(--active-parent,rgb(99,102,241))]/5 
      rounded-xl px-4 py-2 w-full transition-all shadow-sm ${className}`}
    >
      {/* Search Icon */}
      <Search 
        size={18} 
        className="text-slate-400 group-focus-within/search:text-[var(--active-parent,rgb(99,102,241))] mr-3 transition-colors shrink-0" 
      />
      
      {/* Input Field */}
      <input 
        type="text" 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent w-full border-none outline-none text-sm placeholder-slate-400 text-slate-700 py-1"
      />

      {/* Clear (X) Button - Lalabas lang kapag may laman ang input */}
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 
          active:scale-95 transition-all cursor-pointer shrink-0 ml-1"
          title="Clear search"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}