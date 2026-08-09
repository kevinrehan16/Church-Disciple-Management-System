import React from 'react';

interface SectionHeaderProps {
  title: string;
  icon?: React.ElementType;
  className?: string;
}

export default function SectionHeader({ title, icon: Icon, className = "" }: SectionHeaderProps) {
  return (
    <div className={`flex items-center mb-8 mt-8 gap-2 ${className}`}>
      {/* Icon with circular background */}
      {Icon && (
        <div className="p-1.5 rounded-full bg-[var(--active-parent)]/10 shrink-0">
          <Icon size={14} className="text-[var(--active-parent)]" />
        </div>
      )}
      
      <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider whitespace-nowrap">
        {title}
      </h3>
      
      {/* Divider line */}
      <div className="flex-grow h-[1.5px] bg-[var(--active-parent)] transform-gpu scale-y-50" />
    </div>
  );
}