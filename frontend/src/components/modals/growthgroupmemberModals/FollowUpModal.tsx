import { useEffect, useRef, useState } from 'react';
import { X, Filter, ArrowUpDown, ChevronDown } from 'lucide-react';
import { FaMars, FaVenus, FaMobileAlt, FaFacebook, FaCalendarAlt, FaMapMarkerAlt, FaUserCheck } from 'react-icons/fa';
import { modalAnimation } from '../../../utils/ModalAnimation';
import SearchInput from '../../inputs/SearchInput';
import { useMembers } from '../../../hooks/useMembers';
import {TableLoading, TableError, TableEmpty} from '../../ui/TableStates';

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FollowUpModal({ 
  isOpen, 
  onClose
}: FollowUpModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { isClosing, startClose, handleAnimationEnd } = modalAnimation(onClose);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPositions, setSelectedPositions] = useState<string[]>(['Follow Up']); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const positionOptions = [
    'Senior Pastor',
    'Pastor',
    'Pastoral Staff',
    'Deacon',
    'Elder',
    'Member',
    'Follow Up' // Katumbas ng No Growth Group, Growth Group Member, Growth Group Leader
  ];

  const { data: apiResponse, isLoading, isError, refetch } = useMembers({
    search: searchTerm,
    page: currentPage,
    member_position: selectedPositions.length > 0 ? selectedPositions : "Follow Up",
  });

  const currentMembers = apiResponse?.data || [];
  const meta = apiResponse?.meta;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCheckboxChange = (position: string) => {
    setSelectedPositions(prev => {
      const updated = prev.includes(position)
        ? prev.filter(p => p !== position)
        : [...prev, position];
      
      return updated;
    });
    setCurrentPage(1); // Balik sa page 1 kapag nagbago ang filter
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }
  }, [isOpen]);

  if (!isOpen) return null;


  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 ${isClosing ? 'modal-overlay closing' : 'modal-overlay'}`}
      onAnimationEnd={handleAnimationEnd}
    >
      {/* Modal Container */}
      <div className={`bg-white rounded-3xl shadow-2xl w-full max-w-7xl overflow-hidden border border-slate-200/80 flex flex-col max-h-[92vh] ${isClosing ? 'modal-content closing' : 'modal-content'}`}>
        
        {/* Header (Gumamit ng parehong accent color theme tulad ng ClusterModal) */}
        <div className="px-8 py-6 bg-[var(--active-parent,rgb(99,102,241))] flex items-center justify-between text-white flex-shrink-0">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">
              Follow-Up Members
            </h2>
            <p className="text-white/80 text-xs mt-0.5 font-medium">
              Monitor and manage follow-up members.
            </p>
          </div>
          <button 
            type="button"
            onClick={startClose} 
            className="p-2 hover:bg-white/10 active:scale-95 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-3 overflow-y-auto space-y-2 flex-1">
            <div className="flex flex-col md:flex-row items-center gap-4 justify-between w-full bg-transparent">
                <SearchInput 
                value={searchTerm}
                onChange={(val) => {
                    setSearchTerm(val);
                    setCurrentPage(1); // I-reset sa Page 1 tuwing nag-a-update ang search
                }}
                placeholder="Search by patient information..."
                />
                
                <div className="flex items-center gap-2.5 w-full md:w-auto justify-end relative" ref={dropdownRef}>
                    <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center gap-2 px-4 py-3 bg-white text-slate-600 rounded-xl text-sm font-semibold shadow-sm transition-all outline-none border
                        ${isDropdownOpen
                        ? 'border-[var(--active-parent,rgb(249,115,22))] ring-4 ring-[var(--active-parent,rgb(249,115,22))]/15' 
                        : 'border-slate-200/80 hover:bg-slate-50'}`}
                    >
                    {/* Lalabas ang orange color kung bukas ang dropdown o kung may napiling filter */}
                    <Filter 
                        size={14} 
                        className={isDropdownOpen ? 'text-[var(--active-parent,rgb(249,115,22))]' : 'text-slate-500'} 
                    />
                    
                    <span>Member Position {selectedPositions.length > 0 && `(${selectedPositions.length})`}</span>
                    
                    <ChevronDown 
                        size={14} 
                        className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[var(--active-parent,rgb(249,115,22))]' : 'text-slate-400'}`} 
                    />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200/80 rounded-xl shadow-lg py-2 z-50">
                        <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Filter by Position
                        </div>
                        <div className="max-h-60 overflow-y-auto px-1">
                        {positionOptions.map((pos) => {
                            const isChecked = selectedPositions.includes(pos);
                            return (
                            <label
                                key={pos}
                                className={`flex items-center gap-3 px-3 py-2 mt-0.5 rounded-lg cursor-pointer text-sm font-medium transition-colors ${
                                isChecked ? 'bg-[var(--active-parent,rgb(16,185,129))]/10 text-[var(--active-parent,rgb(16,185,129))]-700' : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleCheckboxChange(pos)}
                                style={{
                                    accentColor: 'var(--active-parent, rgb(16, 185, 129))'
                                }}
                                className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                                />
                                <span className={isChecked ? 'text-[var(--active-parent,rgb(16,185,129))] font-semibold' : ''}>
                                {pos}
                                </span>
                            </label>
                            );
                        })}
                        </div>
                        {selectedPositions.length > 0 && (
                        <div className="border-t border-slate-100 mt-1 pt-1 px-2">
                            <button
                            type="button"
                            onClick={() => {
                                setSelectedPositions([]);
                                setCurrentPage(1);
                            }}
                            className="w-full text-center py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                            Clear Filters
                            </button>
                        </div>
                        )}
                    </div>
                    )}
                </div>
            </div>

            <div className="w-full bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-y-auto overflow-x-auto h-[calc(75vh-200px)] border border-slate-200/60 rounded-lg">
                    <table className="w-full text-left text-sm border-separate border-spacing-0">
                        <thead className="sticky top-0 z-10 bg-[var(--active-parent)]">
                        <tr className="text-white uppercase tracking-wider text-[10px] font-extrabold border-b border-slate-200/60">
                            <th className="px-6 py-4">Patient Details</th>
                            <th className="px-6 py-4 text-center">Contacts</th>
                            <th className="px-6 py-4">Social Media</th>
                            <th className="px-6 py-4">Availability</th>
                            <th className="px-6 py-4 text-center">Area of Residence</th>
                            <th className="px-6 py-4 text-center">Endorse To</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <TableLoading rows={5} columns={6} />
                        ) : isError ? (
                            <TableError colSpan={6} onRetry={() => refetch()} />
                        ) : currentMembers.length > 0 ? (
                            currentMembers.map((member: any) => (
                            <tr key={member.id} className="group odd:bg-slate-50 hover:bg-[var(--active-parent,rgb(99,102,241))]/5 transition-all duration-200">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {/* Avatar Initials */}
                                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs border border-slate-200 group-hover:bg-[var(--active-parent,rgb(99,102,241))]/10 group-hover:text-[var(--active-parent,rgb(99,102,241))] group-hover:border-[var(--active-parent,rgb(99,102,241))] transition-colors shrink-0">
                                            {member.first_name?.[0]}{member.last_name?.[0]}
                                        </div>
                                        
                                        <div className="flex flex-col">
                                            {/* Full Name */}
                                            <p className="font-bold text-slate-800 text-sm group-hover:text-[var(--active-parent,rgb(99,102,241))] transition-colors">
                                                {member.first_name} {member.middle_name ? `${member.middle_name[0]}. ` : ''}{member.last_name}
                                            </p>

                                            {/* Gender na may Icon at Age */}
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                                {member.gender && (
                                                    <span className="flex items-center gap-1 font-medium text-slate-600 capitalize">
                                                        {member.gender.toLowerCase() === 'male' ? (
                                                            <FaMars className="text-blue-500" size={12} />
                                                        ) : member.gender.toLowerCase() === 'female' ? (
                                                            <FaVenus className="text-pink-500" size={12} />
                                                        ) : null}
                                                        {member.gender}
                                                    </span>
                                                )}

                                                {member.gender && (member.age !== undefined && member.age !== null) && (
                                                    <span className="text-slate-300">•</span>
                                                )}

                                                {(member.age !== undefined && member.age !== null) && (
                                                    <span className="font-medium text-slate-600">
                                                        {member.age} yrs old
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                                        <FaMobileAlt className="text-slate-400 shrink-0" size={13} />
                                        <span>{member.mobile_number || 'No contact'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-xs font-medium text-indigo-600">
                                        <FaFacebook className="text-indigo-500 shrink-0" size={13} />
                                        <span className="truncate">{member.facebook_name || 'N/A'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <FaCalendarAlt className="text-amber-500 shrink-0" size={13} />
                                        <span className="font-medium text-slate-700">{member.available_days_time || 'Not specified'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <FaMapMarkerAlt className="text-rose-500 shrink-0" size={13} />
                                        <span className="truncate">
                                            {[member.barangay, member.city].filter(Boolean).join(', ') || 'No address'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <FaUserCheck className="text-emerald-500 shrink-0" size={13} />
                                        <span className="font-medium text-slate-700">{member.indorsed_to || 'None'}</span>
                                    </div>
                                </td>
                            
                            </tr>
                            ))
                        ) : (
                            <TableEmpty colSpan={6} />
                        )}
                        </tbody>
                    </table>
                </div>
                {/* 3. DYNAMIC PAGINATION FOOTER (Optimized) */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-100/50">
                <p className="text-xs text-slate-500 font-medium">
                    Showing <span className="text-slate-800 font-bold">{meta?.from || 0}</span> to <span className="text-slate-800 font-bold">{meta?.to || 0}</span> of <span className="text-slate-800 font-bold">{meta?.total || 0}</span> entries
                </p>

                <div className="flex items-center gap-1">
                    <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                    disabled={!meta || meta.current_page === 1} 
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-30"
                    >
                    Prev
                    </button>
                    
                    {/* Dynamic Page Numbers with Ellipsis (...) para hindi sumabog ang UI */}
                    {meta && (() => {
                    const current = meta.current_page;
                    const last = meta.last_page;
                    const delta = 2; // Ilang pahina ang gusto mong makita sa tabi ng current page
                    const range = [];

                    for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
                        range.push(i);
                    }

                    if (current - delta > 2) {
                        range.unshift("...");
                    }
                    if (current + delta < last - 1) {
                        range.push("...");
                    }

                    range.unshift(1);
                    if (last > 1) {
                        range.push(last);
                    }

                    return range.map((page, index) => {
                        if (page === "...") {
                        return <span key={`ellipsis-${index}`} className="px-2 text-xs text-slate-400">...</span>;
                        }

                        return (
                        <button 
                            key={page} 
                            onClick={() => setCurrentPage(Number(page))} 
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${current === page ? 'bg-[var(--active-parent,rgb(99,102,241))] text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                        >
                            {page}
                        </button>
                        );
                    });
                    })()}

                    <button 
                    onClick={() => setCurrentPage(prev => (!meta ? prev : Math.min(prev + 1, meta.last_page)))} 
                    disabled={!meta || meta.current_page === meta.last_page || meta.last_page === 0} 
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-30"
                    >
                    Next
                    </button>
                </div>
                </div>
            </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-200/60 flex gap-3 justify-end flex-shrink-0">
          <button 
            type="button" 
            onClick={startClose} 
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider border border-slate-200 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all flex items-center gap-2"
          >
            <X size={15} /> Cancel
          </button>
        </div>

      </div>
    </div>
  );
}