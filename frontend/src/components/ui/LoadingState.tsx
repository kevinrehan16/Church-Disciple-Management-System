import { useTheme } from '../../contexts/ThemeContext';
import { Loader2 } from 'lucide-react';

interface loadingStateProps {
  description: string;
}

export default function LoadingState({description}: loadingStateProps){
  useTheme(); // Initialize theme context hook
  const activeColorStyle = { color: 'var(--active-parent, rgb(99,102,241))' };

  return (
    <div className="w-full min-h-[75vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col items-center justify-center gap-4 max-w-sm w-full relative overflow-hidden">
        
        {/* Theme-based soft background glow */}
        <div 
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-15 pointer-events-none"
          style={{ backgroundColor: 'var(--active-parent, rgb(99,102,241))' }}
        />
        <div 
          className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full blur-2xl opacity-15 pointer-events-none"
          style={{ backgroundColor: 'var(--active-parent, rgb(99,102,241))' }}
        />

        {/* Spinner Box */}
        <div 
          className="p-4 rounded-2xl shadow-inner flex items-center justify-center relative z-10"
          style={{ backgroundColor: 'var(--active-parent-light, rgba(99, 102, 241, 0.05))' }}
        >
          <Loader2 className="w-8 h-8 animate-spin" style={activeColorStyle} />
        </div>

        {/* Text Details */}
        <div className="text-center space-y-1 z-10">
          <h3 className="text-sm font-extrabold text-slate-800">{description}</h3>
          <p className="text-xs text-slate-400">Please wait a moment...</p>
        </div>

      </div>
    </div>
  );
};