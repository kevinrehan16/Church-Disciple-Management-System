import { ReactNode } from 'react';

interface ModuleHeaderProps {
  title: string;
  description: string;
  actions?: ReactNode;
  icon?: ReactNode; // Idinagdag natin ito
}

export default function ModuleHeader({ title, description, actions, icon }: ModuleHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full bg-transparent">
      
      <div className="flex items-center gap-4">
        {/* ICON CONTAINER */}
        {icon && (
          <div className="p-3 bg-slate-900 text-[var(--active-parent,rgb(99,102,241))] rounded-full shrink-0">
            {icon}
          </div>
        )}
        
        {/* TEXT LABELS */}
        <div className="space-y-0.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            {description}
          </p>
        </div>
      </div>
      
      {/* ACTIONS SLOT */}
      {actions && (
        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
          {actions}
        </div>
      )}
    </div>
  );
}